const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

const protect = async (req, res, next) => {
  try {
    console.log('Request headers:', req.headers); // Log all headers
    const authHeader = req.headers.authorization;
    console.log('Auth header received:', authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer")) {
      console.log('No token or invalid format');
      return res.status(401).json({ 
        message: "Not authorized, no token provided or invalid format",
        headers: req.headers // Include headers in response for debugging
      });
    }

    const token = authHeader.split(" ")[1];
    console.log('Token extracted:', token.substring(0, 10) + '...');

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Token decoded successfully:', decoded);

      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        console.log('No user found for decoded token');
        return res.status(401).json({ message: "User no longer exists" });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error("Token verification failed:", error);
      return res.status(401).json({ 
        message: error.name === 'TokenExpiredError' 
          ? "Token has expired" 
          : "Not authorized, invalid token",
        error: error.message
      });
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({ 
      message: "Server error",
      error: error.message 
    });
  }
};

module.exports = { protect }; // Export as an object
