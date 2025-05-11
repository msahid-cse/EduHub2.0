import express from 'express';
import { 
  adminLogin, 
  getCurrentAdmin, 
  createAdmin, 
  updateAdmin, 
  changePassword, 
  getAllAdmins, 
  deleteAdmin 
} from '../controllers/adminController.js';
import { verifyAdminToken, checkPermission } from '../middleware/adminAuth.js';

const router = express.Router();

// Public routes
router.post('/login', adminLogin);

// Protected routes
router.get('/current', verifyAdminToken, getCurrentAdmin);
router.post('/create', verifyAdminToken, createAdmin);
router.put('/:id', verifyAdminToken, updateAdmin);
router.post('/change-password', verifyAdminToken, changePassword);
router.get('/all', verifyAdminToken, getAllAdmins);
router.delete('/:id', verifyAdminToken, deleteAdmin);

export default router; 