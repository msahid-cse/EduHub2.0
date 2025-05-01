import express from 'express';
import { auth, adminOnly } from '../middleware/auth.js';
import { getDashboardStats } from '../controllers/adminController.js';

const router = express.Router();

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard data
// @access  Private/Admin
router.get('/dashboard', auth, adminOnly, getDashboardStats);

export default router; 