const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection(
  process.env.JAWSDB_URL || {  // Use JAWSDB_URL if available, otherwise use local .env variables
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  }
);

connection.connect((err) => {
  if (err) {
    console.log('Failed to connect to MySQL:', err);
  } else {
    console.log('Connected to MySQL');
  }
});

module.exports = connection;
