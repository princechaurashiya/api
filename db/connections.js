const mongose = require('mongoose');
require('dotenv').config();  // Load environment variables

 
 let connection= mongose.connect('mongodb+srv://pkc1618:Pri9097429446@cluster0.9bqla.mongodb.net/m_service?retryWrites=true&w=majority&appName=Cluster0')
   .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));
 

module.exports = connection;  // Export the promise-based pool
