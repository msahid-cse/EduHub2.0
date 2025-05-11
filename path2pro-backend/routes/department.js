import express from 'express';
import {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  seedDepartments
} from '../controllers/departmentController.js';
import { auth, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/departments
// @desc    Get all departments
// @access  Public
router.get('/', getAllDepartments);

// @route   GET /api/departments/:id
// @desc    Get department by ID
// @access  Public
router.get('/:id', getDepartmentById);

// @route   POST /api/departments
// @desc    Create a new department
// @access  Private/Admin
router.post('/', auth, adminOnly, createDepartment);

// @route   POST /api/departments/seed
// @desc    Seed common departments
// @access  Private/Admin
router.post('/seed', auth, adminOnly, seedDepartments);

// @route   PUT /api/departments/:id
// @desc    Update a department
// @access  Private/Admin
router.put('/:id', auth, adminOnly, updateDepartment);

// @route   DELETE /api/departments/:id
// @desc    Delete a department
// @access  Private/Admin
router.delete('/:id', auth, adminOnly, deleteDepartment);

export default router; 