const http = require("http");
const https = require("https");

function mustGetEnv(name, fallback) {
  const val = process.env[name] ?? fallback;
  if (val === undefined || val === null || val === "") return fallback;
  return val;
}

const OPENKM_CONFIG = {
  baseUrl: mustGetEnv("OPENKM_URL", "http://localhost:8888/OpenKM/services/rest"),
  auth: {
    username: mustGetEnv("OPENKM_USER", "okmAdmin"),
    password: mustGetEnv("OPENKM_PASSWORD", "admin"),
  },
};

const DB_CONFIG = {
  user: mustGetEnv("DB_USER", "openkm"),
  host: mustGetEnv("DB_HOST", "localhost"),
  database: mustGetEnv("DB_NAME", "macf_postgres"),
  password: mustGetEnv("DB_PASSWORD", "openkm"),
  port: Number(mustGetEnv("DB_PORT", "5432")),
  max: Number(mustGetEnv("DB_POOL_MAX", "20")),
  idleTimeoutMillis: Number(mustGetEnv("DB_POOL_IDLE_MS", "30000")),
  connectionTimeoutMillis: Number(mustGetEnv("DB_POOL_CONN_MS", "5000")),
};

const httpAgent = new http.Agent({
  keepAlive: true,
  keepAliveMsecs: 1000,
  maxSockets: Number(mustGetEnv("HTTP_MAX_SOCKETS", "50")),
  maxFreeSockets: Number(mustGetEnv("HTTP_MAX_FREE_SOCKETS", "10")),
});

const httpsAgent = new https.Agent({
  keepAlive: true,
  keepAliveMsecs: 1000,
  maxSockets: Number(mustGetEnv("HTTP_MAX_SOCKETS", "50")),
  maxFreeSockets: Number(mustGetEnv("HTTP_MAX_FREE_SOCKETS", "10")),
});

const IMPORT_OPTIONS_DEFAULTS = {
  concurrentUploads: Number(mustGetEnv("IMPORT_CONCURRENT_UPLOADS", "10")),
  concurrentMetadata: Number(mustGetEnv("IMPORT_CONCURRENT_METADATA", "4")),
  maxAttempts: Number(mustGetEnv("IMPORT_MAX_ATTEMPTS", "8")),
  baseBackoffMs: Number(mustGetEnv("IMPORT_BASE_BACKOFF_MS", "1000")),
  maxBackoffMs: Number(mustGetEnv("IMPORT_MAX_BACKOFF_MS", "60000")),
  uploadTimeoutMs: Number(mustGetEnv("OPENKM_UPLOAD_TIMEOUT_MS", "180000")),
  metadataTimeoutMs: Number(mustGetEnv("OPENKM_METADATA_TIMEOUT_MS", "60000")),
  docContenuMaxChars: Number(mustGetEnv("IMPORT_DOCCONTENU_MAX_CHARS", "0")), // 0 = disabled
};

module.exports = {
  OPENKM_CONFIG,
  DB_CONFIG,
  httpAgent,
  httpsAgent,
  IMPORT_OPTIONS_DEFAULTS,
};

