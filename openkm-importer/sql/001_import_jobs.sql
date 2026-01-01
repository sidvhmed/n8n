-- Import job tracking tables (PostgreSQL)
-- Schema is fixed to macf_postgres to match existing queries.

CREATE TABLE IF NOT EXISTS macf_postgres.imports (
  id uuid PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'queued', -- queued | running | completed | completed_with_errors | cancelled
  requested_by text NULL,
  folder_path text NULL,
  group_name text NULL,
  conservation text NULL,
  options jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS macf_postgres.import_items (
  id uuid PRIMARY KEY,
  import_id uuid NOT NULL REFERENCES macf_postgres.imports(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'queued', -- queued | uploading | metadata | done | failed | retry | cancelled
  attempt_count int NOT NULL DEFAULT 0,
  next_run_at timestamptz NOT NULL DEFAULT now(),
  last_error text NULL,
  file_name text NOT NULL,
  file_size bigint NULL,
  file_mtime timestamptz NULL,
  tmp_path text NOT NULL,
  openkm_doc_path text NULL,
  openkm_document_id text NULL,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS import_items_import_id_idx ON macf_postgres.import_items(import_id);
CREATE INDEX IF NOT EXISTS import_items_status_next_run_idx ON macf_postgres.import_items(status, next_run_at);

-- Optional: idempotency per import (avoid duplicates inside one import)
CREATE UNIQUE INDEX IF NOT EXISTS import_items_import_file_uniq
  ON macf_postgres.import_items(import_id, file_name);

