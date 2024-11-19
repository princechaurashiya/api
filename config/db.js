const mysql = require('mysql2');
require('dotenv').config();  // Load environment variables

// Create a connection pool using the environment variables
const pool = mysql.createPool({
  host: process.env.DB_HOST,       // localhost
  user: process.env.DB_USER,       // root (or your MySQL username)
  password: process.env.DB_PASSWORD, // Your MySQL password
  database: process.env.DB_NAME,   // Your database name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error('Failed to connect to MySQL:', err);
  } else {
    console.log('Connected to MySQL');
    connection.release(); // Release the connection back to the pool
  }
});

module.exports = pool.promise();  // Export the promise-based pool
