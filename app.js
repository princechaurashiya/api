require('dotenv').config(); // Load environment variables
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User'); // Your user model
const proff = require('./models/profetionals_registration'); // Your user model

const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
app.use(express.json()); // Middleware to parse JSON requests

// Swagger setup
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Node.js API Project for SQL',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'http://localhost:3004/',
      },
    ],
  },
  apis: ['./app.js'], // Adjust this if API documentation is elsewhere
};

const swaggerSpec = swaggerJSDoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Status route
app.get('/status', (req, res) => {
  res.status(200).json({ message: 'Server is running successfully!' });
});

// Register route
app.post('/register', async (req, res) => {
  const { email, password } = req.body; // Extract email and password from request body

  console.log(email)
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // Register the user using the User model
    await User.registerUser(email, password);
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (err) {
    console.error(err);
    if (err.code === 'ER_DUP_ENTRY') {
      // Handle duplicate email error for MySQL
      res.status(400).json({ error: 'Email already exists' });
    } else {
      res.status(500).json({ error: 'Registration failed' });
    }
  }
});

// Login route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // Find the user by email
    const user = await User.findUserByEmail(email);

    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
});


// profesonal
app.post('/prof', async (req, res) => {
  const { firstName, lastName, work, experience, img, email, ploneNo, serviceCharge, aadhar, pan } = req.body; 
  // Extract email and password from request body

   // if (!email || !password) {
  //   return res.status(400).json({ error: 'Email and password are required' });
  // }

  try {
    // Register the user using the User model
    await proff.registerProfasonal(firstName, lastName, work, experience, img, email, ploneNo, serviceCharge, aadhar, pan);

    res.status(201).json({ message: 'User registered successfully!' });
  } catch (err) {
    console.error(err);
    if (err.code === 'ER_DUP_ENTRY') {
      // Handle duplicate email error for MySQL
      res.status(400).json({ error: 'Email already exists' });
    } else {
      res.status(500).json({ error: 'Registration failed' });
    }
  }
});



// Start server
const PORT = process.env.PORT || 3004;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
//   //