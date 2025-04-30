import express from 'express';
import { auth, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/courses
// @desc    Get all courses
// @access  Public
router.get('/', (req, res) => {
  // This will be implemented with actual functionality later
  res.json({ message: 'All courses' });
});

// @route   GET /api/courses/:id
// @desc    Get course by ID
// @access  Public
router.get('/:id', (req, res) => {
  // This will be implemented with actual functionality later
  res.json({ message: `Course with id ${req.params.id}` });
});

// @route   POST /api/courses
// @desc    Create a new course
// @access  Private/Admin
router.post('/', auth, adminOnly, (req, res) => {
  // This will be implemented with actual functionality later
  res.json({ message: 'Course created' });
});

// @route   PUT /api/courses/:id
// @desc    Update a course
// @access  Private/Admin
router.put('/:id', auth, adminOnly, (req, res) => {
  // This will be implemented with actual functionality later
  res.json({ message: `Course with id ${req.params.id} updated` });
});

// @route   DELETE /api/courses/:id
// @desc    Delete a course
// @access  Private/Admin
router.delete('/:id', auth, adminOnly, (req, res) => {
  // This will be implemented with actual functionality later
  res.json({ message: `Course with id ${req.params.id} deleted` });
});

// @route   POST /api/courses/:id/enroll
// @desc    Enroll in a course
// @access  Private
router.post('/:id/enroll', auth, (req, res) => {
  // This will be implemented with actual functionality later
  res.json({ message: `Enrolled in course with id ${req.params.id}` });
});

export default router; 