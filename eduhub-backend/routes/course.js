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
  getCoursesByActivityType 
} from '../controllers/courseController.js';

const router = express.Router();

// @route   GET /api/courses
// @desc    Get all courses
// @access  Public
router.get('/', getAllCourses);

// @route   GET /api/courses/:id
// @desc    Get course by ID
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

// @route   GET /api/courses/department/:department
// @desc    Get courses by department
// @access  Public
router.get('/department/:department', getCoursesByDepartment);

// @route   GET /api/courses/activity/:activityType
// @desc    Get co-curricular courses by activity type
// @access  Public
router.get('/activity/:activityType', getCoursesByActivityType);

export default router; 