const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log('Auth header received:', authHeader); // Debug incoming header

    if (!authHeader || !authHeader.startsWith("Bearer")) {
      console.log('No token or invalid format'); // Debug missing/invalid token
      return res.status(401).json({ 
        message: "Not authorized, no token provided or invalid format" 
      });
    }

    const token = authHeader.split(" ")[1];
    console.log('Token extracted:', token.substring(0, 10) + '...'); // Debug token (first 10 chars)

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Token decoded:', decoded); // Debug decoded token

      const user = await User.findById(decoded.id).select("-password");
      console.log('User found:', user ? 'yes' : 'no'); // Debug user lookup

      if (!user) {
        return res.status(401).json({ message: "User no longer exists" });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error("Token verification failed:", error);
      return res.status(401).json({ 
        message: error.name === 'TokenExpiredError' 
          ? "Token has expired" 
          : "Not authorized, invalid token"
      });
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { protect }; // Export as an object
