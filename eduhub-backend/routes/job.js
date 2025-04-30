import express from 'express';
import { authMiddleware, adminOnly } from '../middleware/auth.js';
import { 
  getAllJobs, 
  getJobById, 
  createJob, 
  updateJob, 
  deleteJob, 
  applyForJob, 
  getJobsByType 
} from '../controllers/jobController.js';

const router = express.Router();

// @route   GET /api/jobs
// @desc    Get all jobs
// @access  Public
router.get('/', getAllJobs);

// @route   GET /api/jobs/type/:type
// @desc    Get jobs by type
// @access  Public
router.get('/type/:type', getJobsByType);

// @route   GET /api/jobs/:id
// @desc    Get job by ID
// @access  Public
router.get('/:id', getJobById);

// @route   POST /api/jobs
// @desc    Create a new job
// @access  Private/Admin
router.post('/', authMiddleware, adminOnly, createJob);

// @route   PUT /api/jobs/:id
// @desc    Update a job
// @access  Private/Admin
router.put('/:id', authMiddleware, adminOnly, updateJob);

// @route   DELETE /api/jobs/:id
// @desc    Delete a job
// @access  Private/Admin
router.delete('/:id', authMiddleware, adminOnly, deleteJob);

// @route   POST /api/jobs/:id/apply
// @desc    Apply for a job
// @access  Private
router.post('/:id/apply', authMiddleware, applyForJob);

export default router; 