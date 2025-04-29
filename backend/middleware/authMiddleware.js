const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res.status(401).json({ 
        message: "Not authorized, no token provided or invalid format"
      });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");
      
      if (!user) {
        return res.status(401).json({ message: "User no longer exists" });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ 
        message: error.name === 'TokenExpiredError' 
          ? "Token has expired" 
          : "Not authorized, invalid token"
      });
    }
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { protect }; // Export as an object
