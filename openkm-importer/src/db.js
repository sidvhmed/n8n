const { Pool } = require("pg");
const { DB_CONFIG } = require("./config");

const pool = new Pool(DB_CONFIG);

async function withClient(fn) {
  const client = await pool.connect();
  try {
    return await fn(client);
  } finally {
    client.release();
  }
}

module.exports = {
  pool,
  withClient,
};

