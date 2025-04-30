import express from 'express';
import { auth, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard data
// @access  Private/Admin
router.get('/dashboard', auth, adminOnly, (req, res) => {
  // This will be implemented with actual functionality later
  res.json({ message: 'Admin dashboard data' });
});

export default router; 