const pool = require('../config/db');

async function registerProfasonal(firstName, lastName, work, experience, img, email, ploneNo, serviceCharge, aadhar, pan) {
  const query = `
    INSERT INTO proffesonial 
    (firstName, lastName, work, experience, img, email, ploneNo, serviceCharge, aadhar, pan) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  try {
    const [results] = await pool.execute(query, [
      firstName, lastName, work, experience, img, email, ploneNo, serviceCharge, aadhar, pan
    ]);
    return results;
  } catch (err) {
    throw err;
  }
}

module.exports = { registerProfasonal };
