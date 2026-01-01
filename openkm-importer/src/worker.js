const fs = require("fs");
const pLimit = require("p-limit");

const { withClient, pool } = require("./db");
const { IMPORT_OPTIONS_DEFAULTS } = require("./config");
const { detectMetadataType } = require("./metadataMapping");
const {
  createFolder,
  uploadDocument,
  buildSimplePropertiesXmlFromMapping,
  setPropertiesSimple,
} = require("./openkm");

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function computeBackoffMs({ attempt, baseBackoffMs, maxBackoffMs }) {
  const exp = Math.min(maxBackoffMs, baseBackoffMs * 2 ** Math.max(0, attempt - 1));
  const jitter = Math.floor(Math.random() * Math.min(1000, exp * 0.2));
  return Math.min(maxBackoffMs, exp + jitter);
}

async function refreshImportStatus(importId) {
  const counts = await pool.query(
    `SELECT status, COUNT(*)::int as count
     FROM macf_postgres.import_items
     WHERE import_id = $1
     GROUP BY status`,
    [importId],
  );
  const byStatus = Object.fromEntries(counts.rows.map((r) => [r.status, r.count]));
  const total = Object.values(byStatus).reduce((a, b) => a + b, 0);
  const done = (byStatus.done || 0) + (byStatus.failed || 0) + (byStatus.cancelled || 0);

  if (total > 0 && done === total) {
    const failed = byStatus.failed || 0;
    const status = failed > 0 ? "completed_with_errors" : "completed";
    await pool.query(
      "UPDATE macf_postgres.imports SET status = $2, updated_at = now() WHERE id = $1 AND status <> 'cancelled'",
      [importId, status],
    );
  }
}

async function claimItems({ limit }) {
  return withClient(async (client) => {
    await client.query("BEGIN");

    // mark imports as running when they have queued work
    await client.query(
      `UPDATE macf_postgres.imports i
       SET status = 'running', updated_at = now()
       WHERE status = 'queued'
         AND EXISTS (
           SELECT 1 FROM macf_postgres.import_items it
           WHERE it.import_id = i.id AND it.status IN ('queued','retry') AND it.next_run_at <= now()
         )`,
    );

    const q = `
      SELECT it.*, i.folder_path, i.group_name, i.options
      FROM macf_postgres.import_items it
      JOIN macf_postgres.imports i ON i.id = it.import_id
      WHERE it.status IN ('queued','retry')
        AND it.next_run_at <= now()
        AND i.status NOT IN ('cancelled')
      ORDER BY it.created_at ASC
      FOR UPDATE SKIP LOCKED
      LIMIT $1
    `;
    const r = await client.query(q, [limit]);
    const items = r.rows;

    for (const it of items) {
      await client.query(
        `UPDATE macf_postgres.import_items
         SET status = 'uploading',
             attempt_count = attempt_count + 1,
             updated_at = now(),
             last_error = NULL
         WHERE id = $1`,
        [it.id],
      );
    }

    await client.query("COMMIT");
    return items;
  });
}

async function markRetryOrFailed(itemId, importId, err, attemptCount, options) {
  const maxAttempts = options.maxAttempts ?? IMPORT_OPTIONS_DEFAULTS.maxAttempts;
  const attempt = attemptCount ?? 1;
  if (attempt >= maxAttempts) {
    await pool.query(
      `UPDATE macf_postgres.import_items
       SET status = 'failed',
           last_error = $2,
           updated_at = now()
       WHERE id = $1`,
      [itemId, String(err?.message || err)],
    );
  } else {
    const backoffMs = computeBackoffMs({
      attempt,
      baseBackoffMs: options.baseBackoffMs ?? IMPORT_OPTIONS_DEFAULTS.baseBackoffMs,
      maxBackoffMs: options.maxBackoffMs ?? IMPORT_OPTIONS_DEFAULTS.maxBackoffMs,
    });
    await pool.query(
      `UPDATE macf_postgres.import_items
       SET status = 'retry',
           last_error = $2,
           next_run_at = now() + ($3::int || ' milliseconds')::interval,
           updated_at = now()
       WHERE id = $1`,
      [itemId, String(err?.message || err), backoffMs],
    );
  }

  await refreshImportStatus(importId);
}

async function processOne(item) {
  const options = { ...IMPORT_OPTIONS_DEFAULTS, ...(item.options || {}) };
  const folderPath = item.folder_path;
  const groupName = item.group_name;

  const fullFolderPath = folderPath.startsWith("/okm:root")
    ? folderPath
    : `/okm:root/${folderPath}`;

  const metadataConfig = detectMetadataType(folderPath);
  const propertiesMapping = metadataConfig?.properties || {};

  // Create folder once (best-effort; ignore conflicts)
  try {
    await createFolder(fullFolderPath);
  } catch (e) {
    if (e?.response?.status !== 409) throw e;
  }

  const docPath = `${fullFolderPath}/${item.file_name}`;

  // Upload document
  const { documentId } = await uploadDocument({
    tmpPath: item.tmp_path,
    docPath,
    timeoutMs: options.uploadTimeoutMs,
  });

  await pool.query(
    `UPDATE macf_postgres.import_items
     SET status = 'metadata',
         openkm_document_id = $2,
         openkm_doc_path = $3,
         updated_at = now()
     WHERE id = $1`,
    [item.id, documentId, docPath],
  );

  // Apply metadata (skip if empty)
  const metadata = item.metadata || {};
  const hasMetadata = metadata && Object.keys(metadata).length > 0;
  if (hasMetadata) {
    const propertiesXml = buildSimplePropertiesXmlFromMapping(metadata, propertiesMapping, {
      docContenuMaxChars: options.docContenuMaxChars ?? 0,
    });
    await setPropertiesSimple({
      documentId,
      groupName,
      propertiesXml,
      timeoutMs: options.metadataTimeoutMs,
    });
  }

  // Mark done + cleanup tmp file
  await pool.query(
    `UPDATE macf_postgres.import_items
     SET status = 'done', updated_at = now()
     WHERE id = $1`,
    [item.id],
  );

  try {
    fs.unlinkSync(item.tmp_path);
  } catch {
    // ignore
  }

  await refreshImportStatus(item.import_id);
}

async function main() {
  const pollMs = Number(process.env.WORKER_POLL_MS || "500");
  const claimLimit = Number(process.env.WORKER_CLAIM_LIMIT || "20");
  const parallel = Number(process.env.WORKER_PARALLEL || "10");
  const limit = pLimit(parallel);

  // eslint-disable-next-line no-console
  console.log(
    `worker started (poll=${pollMs}ms, claimLimit=${claimLimit}, parallel=${parallel})`,
  );

  // eslint-disable-next-line no-constant-condition
  while (true) {
    let items = [];
    try {
      items = await claimItems({ limit: claimLimit });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("claimItems failed:", e.message);
      await sleep(Math.min(2000, pollMs * 4));
      continue;
    }

    if (items.length === 0) {
      await sleep(pollMs);
      continue;
    }

    await Promise.all(
      items.map((it) =>
        limit(async () => {
          try {
            await processOne(it);
          } catch (e) {
            await markRetryOrFailed(
              it.id,
              it.import_id,
              e,
              it.attempt_count + 1, // it.attempt_count is pre-increment value from select
              { ...IMPORT_OPTIONS_DEFAULTS, ...(it.options || {}) },
            );
          }
        }),
      ),
    );
  }
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error("worker fatal:", e);
  process.exit(1);
});

