import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { 
  getUserProfile, 
  updateUserProfile, 
  getEnrolledCourses, 
  trackCourseProgress,
  requestVerificationCode,
  changePassword,
  sendAccountDeletionCode,
  deleteUserAccount,
  getAllUsers,
  searchUsers,
  deleteUserByAdmin,
  sendViolationEmail
} from '../controllers/userController.js';

import { 
  getLearningStats, 
  updateCourseProgress as updateLearningProgress,
  addStudySession,
  setWeeklyGoals
} from '../controllers/learningProgressController.js';

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

// @route   POST /api/users/request-verification
// @desc    Request verification code for password change
// @access  Private
router.post('/request-verification', authMiddleware, requestVerificationCode);

// @route   POST /api/users/change-password
// @desc    Change user password with verification
// @access  Private
router.post('/change-password', authMiddleware, changePassword);

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

// @route   GET /api/users/learning-stats
// @desc    Get user learning stats and analytics
// @access  Private
router.get('/learning-stats', authMiddleware, getLearningStats);

// @route   PUT /api/users/learning/course-progress/:courseId
// @desc    Update course progress for learning analytics
// @access  Private
router.put('/learning/course-progress/:courseId', authMiddleware, updateLearningProgress);

// @route   POST /api/users/learning/study-session
// @desc    Add a new study session for analytics
// @access  Private
router.post('/learning/study-session', authMiddleware, addStudySession);

// @route   PUT /api/users/learning/weekly-goals
// @desc    Set weekly learning goals
// @access  Private
router.put('/learning/weekly-goals', authMiddleware, setWeeklyGoals);

// @route   POST /api/users/request-account-deletion
// @desc    Request account deletion verification code
// @access  Private
router.post('/request-account-deletion', authMiddleware, sendAccountDeletionCode);

// @route   DELETE /api/users/delete-account
// @desc    Delete user account with verification
// @access  Private
router.delete('/delete-account', authMiddleware, deleteUserAccount);

// ---------- ADMIN ROUTES ----------

// @route   GET /api/users
// @desc    Get all users with pagination and sorting (admin only)
// @access  Private/Admin
router.get('/', authMiddleware, getAllUsers);

// @route   GET /api/users/search
// @desc    Search users by name or email (admin only)
// @access  Private/Admin
router.get('/search', authMiddleware, searchUsers);

// @route   DELETE /api/users/:id
// @desc    Delete user by admin
// @access  Private/Admin
router.delete('/:id', authMiddleware, deleteUserByAdmin);

// @route   POST /api/users/:id/violation-email
// @desc    Send violation email to user
// @access  Private/Admin
router.post('/:id/violation-email', authMiddleware, sendViolationEmail);

export default router; 