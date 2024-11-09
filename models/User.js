const bcrypt = require('bcryptjs');
const connection = require('../config/db');

// User registration (create a new user in MySQL)
async function registerUser(email, password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const query = 'INSERT INTO users (email, password) VALUES (?, ?)';
  
  return new Promise((resolve, reject) => {
    connection.query(query, [email, hashedPassword], (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
}

// Find user by email
async function findUserByEmail(email) {
  const query = 'SELECT * FROM users WHERE email = ?';
  
  return new Promise((resolve, reject) => {
    connection.query(query, [email], (err, results) => {
      if (err) reject(err);
      resolve(results[0]); // Assuming email is unique, return the first result
    });
  });
}

module.exports = { registerUser, findUserByEmail };
