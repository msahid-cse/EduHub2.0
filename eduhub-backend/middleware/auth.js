import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';

// Make sure JWT_SECRET is defined, using the same pattern as in authController
const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex');

export const authMiddleware = async (req, res, next) => {
  // Get token from header
  const token = req.header('Authorization')?.replace('Bearer ', '');

  // Check if no token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Add user from payload
    req.user = decoded;
    
    // Validate user role if possible (won't block execution if user not found)
    try {
      const user = await User.findById(decoded.userId);
      if (user) {
        // Update role from database to ensure it's current
        req.user.role = user.role;
        req.user.name = user.name;
        req.user.email = user.email;
        req.user.university = user.university;
      }
    } catch (userLookupError) {
      console.log('User lookup warning (continuing):', userLookupError.message);
    }
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// For backward compatibility
export const auth = authMiddleware;

// Admin middleware
export const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied, admin only' });
  }
  next();
}; 