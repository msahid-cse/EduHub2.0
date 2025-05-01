import User from '../models/User.js';

export const adminMiddleware = async (req, res, next) => {
  try {
    // User ID should be attached by authMiddleware
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: 'Unauthorized access' });
    }

    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user has admin role
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Requires admin privileges' });
    }

    // User is admin, proceed to next middleware
    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 