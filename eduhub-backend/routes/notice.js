import express from 'express';
import { auth, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/notices
// @desc    Get all notices
// @access  Public
router.get('/', (req, res) => {
  // This will be implemented with actual functionality later
  res.json({ message: 'All notices' });
});

// @route   GET /api/notices/:id
// @desc    Get notice by ID
// @access  Public
router.get('/:id', (req, res) => {
  // This will be implemented with actual functionality later
  res.json({ message: `Notice with id ${req.params.id}` });
});

// @route   POST /api/notices
// @desc    Create a new notice
// @access  Private/Admin
router.post('/', auth, adminOnly, (req, res) => {
  // This will be implemented with actual functionality later
  res.json({ message: 'Notice created' });
});

// @route   PUT /api/notices/:id
// @desc    Update a notice
// @access  Private/Admin
router.put('/:id', auth, adminOnly, (req, res) => {
  // This will be implemented with actual functionality later
  res.json({ message: `Notice with id ${req.params.id} updated` });
});

// @route   DELETE /api/notices/:id
// @desc    Delete a notice
// @access  Private/Admin
router.delete('/:id', auth, adminOnly, (req, res) => {
  // This will be implemented with actual functionality later
  res.json({ message: `Notice with id ${req.params.id} deleted` });
});

// @route   GET /api/notices/university/:university
// @desc    Get notices by university
// @access  Public
router.get('/university/:university', (req, res) => {
  // This will be implemented with actual functionality later
  res.json({ message: `Notices for university ${req.params.university}` });
});

export default router; 