// database.js
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PGUSER || 'postgres',
  host: process.env.PGHOST || 'localhost',
  database: process.env.PGDATABASE || 'foodrush',
  password: process.env.PGPASSWORD || '',
  port: process.env.PGPORT ? Number(process.env.PGPORT) : 5432,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};

