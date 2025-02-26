require('dotenv').config(); // Load environment variables
const express = require('express');
 const app = express();
let router=require('./route/route')
require('./db/connections')
let cors=require('cors')
app.use(express.json()); // Middleware to parse JSON requests
let cookie=require('cookie-parser')


// Swagger setup
// const options = {
//   definition: {
//     openapi: '3.0.0',
//     info: {
//       title: 'Node.js API Project for SQL',
//       version: '1.0.0',
//     },
//     servers: [
//       {
//         url: 'http://localhost:3004/',
//       },
//     ],
//   },
//   apis: ['./app.js'], // Adjust this if API documentation is elsewhere
// };

// const swaggerSpec = swaggerJSDoc(options);
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));




app.use(router)

 app.get('/',(req,res)=>{
   res.send('data come ')
 })

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
