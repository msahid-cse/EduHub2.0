import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import crypto from 'crypto';

// Make sure JWT_SECRET is defined
const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex');

// Middleware to verify admin JWT token
export const verifyAdminToken = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    
    // Extract the token (remove 'Bearer ' prefix if present)
    const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;
    
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Check if token is for an admin
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }
    
    // Check if admin still exists in the database
    const admin = await Admin.findById(decoded.userId);
    if (!admin) {
      return res.status(401).json({ message: 'Invalid token. Admin not found.' });
    }
    
    // Add admin ID and role to request object
    req.userId = decoded.userId;
    req.userRole = 'admin';
    req.permissions = decoded.permissions;
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token.' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired.' });
    }
    console.error('Admin auth middleware error:', error);
    res.status(500).json({ message: 'Server error during authentication' });
  }
};

// Middleware to check specific admin permissions
export const checkPermission = (permissionType) => {
  return (req, res, next) => {
    // If no specific permission is required, just check for admin role
    if (!permissionType) {
      return next();
    }
    
    // Check if admin has the required permission
    const hasPermission = req.permissions && req.permissions[permissionType];
    
    if (!hasPermission) {
      return res.status(403).json({ 
        message: `Access denied. '${permissionType}' permission required.` 
      });
    }
    
    next();
  };
}; 