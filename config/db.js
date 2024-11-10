const mysql = require('mysql2');
require('dotenv').config();

// The MySQL URL you provided
const mysqlUrl = 'mysql://bpv9vkdc7l1kxgmo:hjh0ugsjzoj6856s@u28rhuskh0x5paau.cbetxkdyhwsb.us-east-1.rds.amazonaws.com:3306/snirktk774fftt78';

// Parse the URL
const url = new URL(mysqlUrl);

// Create a connection pool using the parsed URL
const pool = mysql.createPool({
  host: url.hostname,
  user: url.username,
  password: url.password,
  database: url.pathname.split('/')[1], // Extract database name from the URL
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

module.exports = pool.promise(); // Export a promise-based pool
