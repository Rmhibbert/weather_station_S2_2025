const { Pool } = require('pg');

// Create a new pool instance
const pool = new Pool({
  user: 'postgres',      // Replace with your PostgreSQL username
  host: 'localhost',         // Replace with your PostgreSQL host, 'localhost' for local
  database: 'postgres',  // Replace with your PostgreSQL database name
  password: 'P@ssw0rd',  // Replace with your PostgreSQL password
  port: 5432,                // Default PostgreSQL port
});

// Export the pool instance
module.exports = pool;
