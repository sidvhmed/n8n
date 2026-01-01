# openkm-importer

Service d’import OpenKM **sans interruption** : l’API reçoit des fichiers, crée un `importId`, puis un **worker** traite l’upload OpenKM + métadonnées (Property Groups) en arrière‑plan avec **concurrence contrôlée**, **retries/backoff** et **suivi en base**.

## Prérequis

- PostgreSQL (schéma `macf_postgres`)
- OpenKM REST (`.../OpenKM/services/rest`)

## Installation

```bash
cd openkm-importer
npm install
```

## Migration SQL

Exécuter `sql/001_import_jobs.sql` dans PostgreSQL.

## Variables d’environnement

- `PORT` (default `3000`)
- `OPENKM_URL` (default `http://localhost:8888/OpenKM/services/rest`)
- `OPENKM_USER` / `OPENKM_PASSWORD`
- `DB_USER` / `DB_PASSWORD` / `DB_HOST` / `DB_PORT` / `DB_NAME`

Contrôle perf/import :
- `IMPORT_MAX_FILES_PER_REQUEST` (default `200`)
- `IMPORT_CONCURRENT_UPLOADS` (default `10`)
- `IMPORT_CONCURRENT_METADATA` (default `4`)
- `IMPORT_MAX_ATTEMPTS` (default `8`)
- `IMPORT_BASE_BACKOFF_MS` (default `1000`)
- `IMPORT_MAX_BACKOFF_MS` (default `60000`)
- `OPENKM_UPLOAD_TIMEOUT_MS` (default `180000`)
- `OPENKM_METADATA_TIMEOUT_MS` (default `60000`)
- `IMPORT_DOCCONTENU_MAX_CHARS` (default `0` = désactivé; sinon tronque le champ `doccontenu`)

Worker :
- `WORKER_POLL_MS` (default `500`)
- `WORKER_CLAIM_LIMIT` (default `20`)
- `WORKER_PARALLEL` (default `10`)

## Démarrage

API :

```bash
npm start
```

Worker :

```bash
npm run worker
```

## API

- `POST /imports` (multipart)
  - champ `files` (multi fichiers)
  - `folderPath` **ou** (`conservation` + `groupName`)
  - `groupName` (recommandé; sinon inféré par `folderPath`)
  - optionnel : `requestedBy`
  - optionnel : `options` (JSON) pour override la concurrence/timeouts
  - optionnel : `metadata` (JSON) appliqué à tous les fichiers
  - optionnel : `metadataByFile` (JSON) `{ "a.pdf": {...}, "b.pdf": {...} }`

- `GET /imports/:id` (progression + statuts)
- `GET /imports/:id/items?status=failed` (liste items)
- `POST /imports/:id/cancel`

