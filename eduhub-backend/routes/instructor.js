import express from 'express';
import { 
  getAllInstructors, 
  getInstructorById, 
  createInstructor, 
  updateInstructor, 
  deleteInstructor,
  uploadInstructorData,
  addInstructorsManually
} from '../controllers/instructorController.js';
import { auth, adminOnly } from '../middleware/auth.js';
import { uploadProfilePicture, uploadInstructorData as uploadInstructorDataMiddleware } from '../middleware/upload.js';

const router = express.Router();

// @route   GET /api/instructors
// @desc    Get all instructors or filter by university
// @access  Public
router.get('/', getAllInstructors);

// @route   GET /api/instructors/:id
// @desc    Get instructor by ID
// @access  Public
router.get('/:id', getInstructorById);

// @route   POST /api/instructors
// @desc    Create a new instructor
// @access  Private/Admin
router.post('/', auth, adminOnly, uploadProfilePicture, createInstructor);

// @route   POST /api/instructors/upload
// @desc    Upload instructor data (Excel/CSV)
// @access  Private/Admin
router.post('/upload', auth, adminOnly, uploadInstructorDataMiddleware, uploadInstructorData);

// @route   POST /api/instructors/add-manually
// @desc    Add instructors manually
// @access  Private/Admin
router.post('/add-manually', auth, adminOnly, addInstructorsManually);

// @route   PUT /api/instructors/:id
// @desc    Update an instructor
// @access  Private/Admin
router.put('/:id', auth, adminOnly, uploadProfilePicture, updateInstructor);

// @route   DELETE /api/instructors/:id
// @desc    Delete an instructor
// @access  Private/Admin
router.delete('/:id', auth, adminOnly, deleteInstructor);

export default router; 