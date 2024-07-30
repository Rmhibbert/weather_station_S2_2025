const { Pool } = require('pg');
require('dotenv').config(); // Load environment variables from .env file

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const createTables = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS sensor_data (
        id SERIAL PRIMARY KEY,
        timestamp TIMESTAMPTZ DEFAULT now(),
        device_id VARCHAR(255),
        sensor_data JSONB
      );
    `);
    console.log('Tables created successfully');
    pool.end();
  } catch (err) {
    console.error('Error creating tables:', err);
    pool.end();
  }
};

createTables();
