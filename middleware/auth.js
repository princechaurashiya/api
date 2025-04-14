// let jwt = require('jsonwebtoken');
// let User = require('../models/User');
// require('dotenv').config();

// let auth = async (req, res, next) => {
//   try {
//     // Step 1: Check if token exists
//     //let tokon = req.cookies.jwt;
//     let tokon = req.cookies.jwt || req.headers['authorization']?.split('Bearer ')[1];

//     //console.log(req);
//     if (!tokon) {
//       return res.status(401).json({
//         mess: "Authentication token is missing",
//         success: false,
//         error: true,
//       });
//     }

//     // Step 2: Verify token
//     let verifiedUser;
//     try {
//       verifiedUser = jwt.verify(tokon, process.env.JWT_SECRET);
//     } catch (error) {
//       console.log('Token verification failed:', error);
//       return res.status(401).json({
//         mess: "Invalid or expired token",
//         success: false,
//         error: true,
//       });
//     }

//     // Step 3: Find user in database
//     console.log('User ID:', verifiedUser._id);  // Debugging
//     let user = await User.findOne({ _id: verifiedUser._id });
//     if (!user) {
//       console.log('User not found');
//       return res.status(404).json({
//         mess: "User not found",
//         success: false,
//         error: true,
//       });
//     }

//     // Step 4: Attach user and token to request object
//     req.tokon = tokon;
//     req.AuthUser = user;
//     req.Role = user.Role;

//     // Step 5: Proceed to next middleware/route
//     next();
//   } catch (e) {
//     console.log('Error in auth middleware:', e);
//     res.status(401).json({
//       mess: "Authentication failed",
//       success: false,
//       error: true,
//     });
//   }
// };

// module.exports = auth;


let jwt = require('jsonwebtoken');
let User = require('../models/User');
require('dotenv').config();

let auth = async (req, res, next) => {
  try {
    // Step 1: Check if token exists (from cookie or Authorization header)
    let tokon = req.cookies.jwt || req.headers['authorization']?.split('Bearer ')[1];

    // If no token is found, return an authentication error
    if (!tokon) {
      return res.status(401).json({
        mess: "Authentication token is missing",
        success: false,
        error: true,
      });
    }

    // Step 2: Verify the token
    let verifiedUser;
    try {
      verifiedUser = jwt.verify(tokon, process.env.JWT_SECRET);
    } catch (error) {
      console.log('Token verification failed:', error);
      return res.status(401).json({
        mess: "Invalid or expired token",
        success: false,
        error: true,
      });
    }

    // Step 3: Find user in the database
    let user = await User.findOne({ _id: verifiedUser._id });
    if (!user) {
      return res.status(404).json({
        mess: "User not found",
        success: false,
        error: true,
      });
    }

    // Step 4: Attach user and token to request object
    req.tokon = tokon;
    req.AuthUser = user;
    req.Role = user.Role;

    // Step 5: Proceed to next middleware/route
    next();
  } catch (e) {
    console.log('Error in auth middleware:', e);
    res.status(401).json({
      mess: "Authentication failed",
      success: false,
      error: true,
    });
  }
};

module.exports = auth;
