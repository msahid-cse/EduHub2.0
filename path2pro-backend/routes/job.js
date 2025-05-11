import express from 'express';
import { authMiddleware, adminOnly } from '../middleware/auth.js';
import { 
  getAllJobs, 
  getJobById, 
  createJob, 
  updateJob, 
  deleteJob, 
  applyForJob, 
  getJobsByType,
  getJobApplications,
  updateApplicationStatus,
  getUserApplications,
  getAllJobApplications,
  getJobApplicationCount,
  downloadCoverLetter
} from '../controllers/jobController.js';
import { uploadCV } from '../middleware/upload.js';

const router = express.Router();

// @route   GET /api/jobs
// @desc    Get all jobs
// @access  Public
router.get('/', getAllJobs);

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
// @desc    Apply for a job with CV upload
// @access  Private
router.post('/:id/apply', authMiddleware, uploadCV, applyForJob);

// @route   GET /api/jobs/:id/applications
// @desc    Get all applications for a job
// @access  Private/Admin
router.get('/:id/applications', authMiddleware, adminOnly, getJobApplications);

// @route   PUT /api/jobs/applications/:applicationId
// @desc    Update application status
// @access  Private/Admin
router.put('/applications/:applicationId', authMiddleware, adminOnly, updateApplicationStatus);

// @route   GET /api/jobs/applications/all
// @desc    Get all applications across all jobs
// @access  Private/Admin
router.get('/applications/all', authMiddleware, adminOnly, getAllJobApplications);

// @route   GET /api/jobs/applications/count
// @desc    Get count of all applications
// @access  Private/Admin
router.get('/applications/count', authMiddleware, adminOnly, getJobApplicationCount);

// @route   GET /api/jobs/user/applications
// @desc    Get all applications for a user
// @access  Private
router.get('/user/applications', authMiddleware, getUserApplications);

// @route   GET /api/jobs/applications/:applicationId/cover-letter
// @desc    Download cover letter PDF for an application
// @access  Private
router.get('/applications/:applicationId/cover-letter', authMiddleware, downloadCoverLetter);

// @route   GET /api/jobs/type/:type
// @desc    Get jobs by type
// @access  Public
router.get('/type/:type', getJobsByType);

export default router; 