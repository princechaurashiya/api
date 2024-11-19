require('dotenv').config(); // Load environment variables
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');

const app = express();
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express"); // Correct module for Swagger UI
const { version } = require('mongoose');

app.use(express.json());

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Node Js API Project for SQL",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:3004/",
      },
    ],
  },
  apis: ["./app.js"], // File containing Swagger definitions
};

const swaggerSpec = swaggerJSDoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Status route
app.get('/status', (req, res) => {
  res.status(200).json({ message: 'Server is running successfully!' });
});

// Register route
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    await User.registerUser(email, password);
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findUserByEmail(email);

    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Start server
const PORT = process.env.PORT || 3004;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
