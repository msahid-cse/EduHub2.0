import User from '../models/User.js';

export const adminMiddleware = async (req, res, next) => {
  try {
    // User ID should be attached by authMiddleware
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: 'Unauthorized access' });
    }
    
    // If the role is already set in the token and verified by authMiddleware
    if (req.user.role === 'admin') {
      console.log('Admin role verified from token');
      return next();
    }

    // Double-check with database
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      console.error('Admin check: User not found with ID:', req.user.userId);
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user has admin role
    if (user.role !== 'admin') {
      console.error('Admin access denied for user:', { id: user._id, role: user.role });
      return res.status(403).json({ message: 'Access denied: Requires admin privileges' });
    }

    // Update req.user with current data
    req.user.role = user.role;
    req.user.name = user.name;
    req.user.email = user.email;
    req.user.university = user.university;

    // User is admin, proceed to next middleware
    console.log('Admin status confirmed for user:', user._id);
    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 