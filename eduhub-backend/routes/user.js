import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { 
  getUserProfile, 
  updateUserProfile, 
  getEnrolledCourses, 
  trackCourseProgress 
} from '../controllers/userController.js';

const router = express.Router();

// @route   GET /api/users/dashboard
// @desc    Get user dashboard data
// @access  Private
router.get('/dashboard', authMiddleware, (req, res) => {
  // This will be implemented with actual functionality later
  res.json({ message: 'User dashboard data' });
});

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', authMiddleware, getUserProfile);

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', authMiddleware, updateUserProfile);

// @route   GET /api/users/enrolled-courses
// @desc    Get user enrolled courses
// @access  Private
router.get('/enrolled-courses', authMiddleware, getEnrolledCourses);

// @route   GET /api/users/applied-jobs
// @desc    Get user applied jobs
// @access  Private
router.get('/applied-jobs', authMiddleware, (req, res) => {
  // This will be implemented with actual functionality later
  res.json({ message: 'User applied jobs' });
});

// @route   POST /api/users/courses/:courseId/progress
// @desc    Track course progress
// @access  Private
router.post('/courses/:courseId/progress', authMiddleware, trackCourseProgress);

export default router; 