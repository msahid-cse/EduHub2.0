import express from 'express';
import { 
  getAllFeedback, 
  getFeedbackById, 
  createFeedback, 
  updateFeedbackStatus, 
  deleteFeedback,
  getUserFeedback
} from '../controllers/feedbackController.js';
import { auth, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/feedback
// @desc    Get all feedback (admin only)
// @access  Private/Admin
router.get('/', auth, adminOnly, getAllFeedback);

// @route   GET /api/feedback/me
// @desc    Get current user's feedback
// @access  Private
router.get('/me', auth, getUserFeedback);

// @route   GET /api/feedback/:id
// @desc    Get feedback by ID
// @access  Private
router.get('/:id', auth, getFeedbackById);

// @route   POST /api/feedback
// @desc    Create a new feedback
// @access  Private
router.post('/', auth, createFeedback);

// @route   PUT /api/feedback/:id
// @desc    Update feedback status (admin only)
// @access  Private/Admin
router.put('/:id', auth, adminOnly, updateFeedbackStatus);

// @route   DELETE /api/feedback/:id
// @desc    Delete feedback (admin only)
// @access  Private/Admin
router.delete('/:id', auth, adminOnly, deleteFeedback);

export default router; 