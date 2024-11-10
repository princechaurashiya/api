const mysql = require('mysql2');
require('dotenv').config();

// Create a connection pool to manage MySQL connections
const pool = mysql.createPool(
  process.env.JAWSDB_URL || { // Use JAWSDB_URL if available, otherwise use local .env variables
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10, // Set the maximum number of connections in the pool
    queueLimit: 0
  }
);

pool.getConnection((err, connection) => {
  if (err) {
    console.error('Failed to connect to MySQL:', err);
  } else {
    console.log('Connected to MySQL');
    connection.release(); // Release the connection back to the pool
  }
});

module.exports = pool.promise(); // Export a promise-based pool
