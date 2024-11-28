const bcrypt = require('bcryptjs');
const pool = require('../config/db'); // Import the connection pool

// User registration (create a new user in MySQL)
async function registerUser(email, password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const query = 'INSERT INTO users (email, password) VALUES (?, ?)';


  //
  
  try {
    const [results] = await pool.execute(query, [email, hashedPassword]); // Use `execute` instead of `query`
    return results;
  } catch (err) {
    throw err;
  }
}

// Find user by email
async function findUserByEmail(email) {
  const query = 'SELECT * FROM users WHERE email = ?';
  
  try {
    const [results] = await pool.execute(query, [email]); // Use `execute` here as well
    return results[0]; // Assuming email is unique, return the first result
  } catch (err) {
    throw err;
  }
}

module.exports = { registerUser, findUserByEmail };
