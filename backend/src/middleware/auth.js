const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

// Protect routes
exports.protect = async (req, res, next) => {
  let token;

  // Check for token in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from Bearer token
    token = req.headers.authorization.split(' ')[1];
  }

  // Make sure token exists
  if (!token) {
    return res.status(401).json({ error: 'Not authorized to access this route' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key_dev_only');

    // Set user to req.user
    req.user = await User.findById(decoded.id);

    next();
  } catch (err) {
    logger.error('Authentication error:', err);
    return res.status(401).json({ error: 'Not authorized to access this route' });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authorized to access this route' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: `User role ${req.user.role} is not authorized to access this route` });
    }
    
    next();
  };
}; 