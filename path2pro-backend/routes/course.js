import express from 'express';
import { authMiddleware, adminOnly } from '../middleware/auth.js';
import { 
  getAllCourses, 
  getCourseById, 
  createCourse, 
  updateCourse, 
  deleteCourse, 
  enrollCourse,
  getCoursesByDepartment,
  getCoursesByActivityType,
  batchImportCourses,
  uploadCourseMaterials,
  getCSVTemplate
} from '../controllers/courseController.js';
import { 
  uploadCourseThumbnail,
  uploadCSVFile,
  uploadCourseVideo
} from '../middleware/upload.js';

const router = express.Router();

// @route   GET /api/courses/csv-template
// @desc    Get the CSV template for batch import
// @access  Public (for testing, will later be changed to Private/Admin)
router.get('/csv-template', getCSVTemplate);

// @route   GET /api/courses/department/:department
// @desc    Get courses by department
// @access  Public
router.get('/department/:department', getCoursesByDepartment);

// @route   GET /api/courses/activity/:activityType
// @desc    Get courses by activity type
// @access  Public
router.get('/activity/:activityType', getCoursesByActivityType);

// @route   POST /api/courses/batch-import
// @desc    Batch import courses from CSV/Excel file
// @access  Private/Admin
router.post('/batch-import', authMiddleware, adminOnly, uploadCSVFile, batchImportCourses);

// @route   GET /api/courses
// @desc    Get all courses
// @access  Public
router.get('/', getAllCourses);

// @route   GET /api/courses/:id
// @desc    Get a course by ID
// @access  Public
router.get('/:id', getCourseById);

// @route   POST /api/courses
// @desc    Create a new course
// @access  Private/Admin
router.post('/', authMiddleware, adminOnly, createCourse);

// @route   PUT /api/courses/:id
// @desc    Update a course
// @access  Private/Admin
router.put('/:id', authMiddleware, adminOnly, updateCourse);

// @route   DELETE /api/courses/:id
// @desc    Delete a course
// @access  Private/Admin
router.delete('/:id', authMiddleware, adminOnly, deleteCourse);

// @route   POST /api/courses/:id/enroll
// @desc    Enroll in a course
// @access  Private
router.post('/:id/enroll', authMiddleware, enrollCourse);

// @route   POST /api/courses/:id/materials
// @desc    Upload course materials (videos, docs, etc.)
// @access  Private/Admin
router.post('/:id/materials', authMiddleware, adminOnly, uploadCourseVideo, uploadCourseMaterials);

export default router; 