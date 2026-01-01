const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const { pool } = require("./db");
const { IMPORT_OPTIONS_DEFAULTS } = require("./config");
const { detectMetadataType } = require("./metadataMapping");

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use(morgan("combined"));

const UPLOAD_DIR = path.join(__dirname, "..", "uploads");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const upload = multer({
  dest: UPLOAD_DIR,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB per file
    files: Number(process.env.IMPORT_MAX_FILES_PER_REQUEST || "200"),
  },
});

function safeJsonParse(val, fallback) {
  if (val === undefined || val === null || val === "") return fallback;
  if (typeof val === "object") return val;
  try {
    return JSON.parse(val);
  } catch {
    return fallback;
  }
}

async function resolveFolderPath({ folderPath, conservation, groupName }) {
  if (folderPath) return folderPath;
  if (!conservation || !groupName) return null;

  const q =
    "SELECT code_dossier FROM macf_postgres.table_concervation WHERE code_conservation_nv = $1 LIMIT 1";
  const r = await pool.query(q, [conservation]);
  if (r.rows.length === 0) return null;
  const codeDossier = r.rows[0].code_dossier;
  const tableName = String(groupName).replace(/^okg:/i, "");
  return `${codeDossier}/${tableName}`;
}

app.get("/health", (req, res) => res.json({ ok: true }));

/**
 * Create an import job.
 *
 * Multipart form fields:
 * - files: multiple files
 * - folderPath OR (conservation + groupName)
 * - groupName (recommended; if missing we infer from folderPath mapping)
 * - requestedBy (optional)
 * - options (optional JSON string): overrides defaults (concurrency, timeouts, etc.)
 * - metadata (optional JSON string): applied to all files
 * - metadataByFile (optional JSON string): { "file.pdf": { ... } }
 */
app.post("/imports", upload.array("files"), async (req, res) => {
  const files = req.files || [];
  if (files.length === 0) return res.status(400).json({ error: "Aucun fichier fourni" });

  const { folderPath, conservation, groupName, requestedBy } = req.body || {};

  let resolvedFolderPath;
  try {
    resolvedFolderPath = await resolveFolderPath({ folderPath, conservation, groupName });
  } catch (e) {
    return res.status(500).json({ error: "Erreur résolution folderPath", details: e.message });
  }

  if (!resolvedFolderPath) {
    return res.status(400).json({ error: "folderPath ou (conservation + groupName) requis" });
  }

  const metadataConfig = detectMetadataType(resolvedFolderPath);
  const effectiveGroupName =
    groupName || metadataConfig?.groupName || null;

  if (!effectiveGroupName) {
    return res.status(400).json({
      error: "groupName manquant et type de métadonnées non reconnu via folderPath",
    });
  }

  const optionsOverride = safeJsonParse(req.body?.options, {});
  const options = { ...IMPORT_OPTIONS_DEFAULTS, ...optionsOverride };

  const metadataAll = safeJsonParse(req.body?.metadata, {});
  const metadataByFile = safeJsonParse(req.body?.metadataByFile, {});

  const importId = uuidv4();
  const now = new Date();

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(
      `INSERT INTO macf_postgres.imports
        (id, created_at, updated_at, status, requested_by, folder_path, group_name, conservation, options)
       VALUES ($1, $2, $2, 'queued', $3, $4, $5, $6, $7::jsonb)`,
      [
        importId,
        now,
        requestedBy || null,
        resolvedFolderPath,
        effectiveGroupName,
        conservation || null,
        JSON.stringify(options),
      ],
    );

    for (const f of files) {
      const itemId = uuidv4();
      const perFile = metadataByFile?.[f.originalname] || {};
      const metadata = { ...metadataAll, ...perFile };

      await client.query(
        `INSERT INTO macf_postgres.import_items
          (id, import_id, created_at, updated_at, status, attempt_count, next_run_at,
           file_name, file_size, file_mtime, tmp_path, metadata)
         VALUES ($1, $2, $3, $3, 'queued', 0, $3, $4, $5, $6, $7, $8::jsonb)
         ON CONFLICT (import_id, file_name) DO NOTHING`,
        [
          itemId,
          importId,
          now,
          f.originalname,
          f.size || null,
          f.mtime ? new Date(f.mtime) : null,
          f.path,
          JSON.stringify(metadata || {}),
        ],
      );
    }

    await client.query("COMMIT");
  } catch (e) {
    await client.query("ROLLBACK");
    // best-effort cleanup tmp files
    for (const f of files) {
      try {
        fs.unlinkSync(f.path);
      } catch {
        // ignore
      }
    }
    return res.status(500).json({ error: "Erreur création import", details: e.message });
  } finally {
    client.release();
  }

  return res.status(201).json({
    success: true,
    importId,
    totalFiles: files.length,
    folderPath: resolvedFolderPath,
    groupName: effectiveGroupName,
    options,
  });
});

app.get("/imports/:id", async (req, res) => {
  const { id } = req.params;
  const imp = await pool.query("SELECT * FROM macf_postgres.imports WHERE id = $1", [id]);
  if (imp.rows.length === 0) return res.status(404).json({ error: "Import introuvable" });

  const counts = await pool.query(
    `SELECT status, COUNT(*)::int as count
     FROM macf_postgres.import_items
     WHERE import_id = $1
     GROUP BY status`,
    [id],
  );

  const byStatus = Object.fromEntries(counts.rows.map((r) => [r.status, r.count]));
  const total = Object.values(byStatus).reduce((a, b) => a + b, 0);
  const done = (byStatus.done || 0) + (byStatus.failed || 0) + (byStatus.cancelled || 0);

  return res.json({
    import: imp.rows[0],
    progress: {
      total,
      done,
      remaining: Math.max(0, total - done),
      byStatus,
    },
  });
});

app.get("/imports/:id/items", async (req, res) => {
  const { id } = req.params;
  const { status, limit } = req.query;

  const lim = Math.min(Number(limit || "200"), 1000);
  const params = [id];
  let where = "import_id = $1";
  if (status) {
    params.push(status);
    where += " AND status = $2";
  }

  const q = `SELECT id, status, attempt_count, next_run_at, last_error, file_name, openkm_document_id, openkm_doc_path, updated_at
             FROM macf_postgres.import_items
             WHERE ${where}
             ORDER BY created_at ASC
             LIMIT ${lim}`;
  const r = await pool.query(q, params);
  return res.json({ items: r.rows });
});

app.post("/imports/:id/cancel", async (req, res) => {
  const { id } = req.params;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const r = await client.query(
      "UPDATE macf_postgres.imports SET status = 'cancelled', updated_at = now() WHERE id = $1 RETURNING id",
      [id],
    );
    if (r.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Import introuvable" });
    }

    await client.query(
      `UPDATE macf_postgres.import_items
       SET status = 'cancelled', updated_at = now()
       WHERE import_id = $1 AND status NOT IN ('done','failed','cancelled')`,
      [id],
    );
    await client.query("COMMIT");
    return res.json({ success: true });
  } catch (e) {
    await client.query("ROLLBACK");
    return res.status(500).json({ error: "Erreur annulation", details: e.message });
  } finally {
    client.release();
  }
});

const port = Number(process.env.PORT || "3000");
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`openkm-importer listening on :${port}`);
});

