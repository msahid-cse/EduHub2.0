import express from 'express';
import { authMiddleware, adminOnly } from '../middleware/auth.js';
import { 
  getAllNotices, 
  getNoticeById, 
  createNotice, 
  updateNotice, 
  deleteNotice, 
  getNoticesByUniversity 
} from '../controllers/noticeController.js';
import { uploadNoticePDF, uploadErrorHandler } from '../utils/fileUpload.js';

const router = express.Router();

// @route   GET /api/notices
// @desc    Get all notices
// @access  Public
router.get('/', getAllNotices);

// @route   GET /api/notices/:id
// @desc    Get notice by ID
// @access  Public
router.get('/:id', getNoticeById);

// @route   POST /api/notices
// @desc    Create a new notice
// @access  Private/Admin
router.post('/', authMiddleware, adminOnly, createNotice);

// @route   POST /api/notices/upload-pdf
// @desc    Upload a PDF file for notice
// @access  Private/Admin
router.post('/upload-pdf', authMiddleware, adminOnly, uploadNoticePDF.single('pdfFile'), uploadErrorHandler, (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  
  // Return the file path that can be stored in the notice
  const filePath = `/uploads/notices/${req.file.filename}`;
  return res.status(200).json({ 
    message: 'File uploaded successfully',
    filePath
  });
});

// @route   PUT /api/notices/:id
// @desc    Update a notice
// @access  Private/Admin
router.put('/:id', authMiddleware, adminOnly, updateNotice);

// @route   DELETE /api/notices/:id
// @desc    Delete a notice
// @access  Private/Admin
router.delete('/:id', authMiddleware, adminOnly, deleteNotice);

// @route   GET /api/notices/university/:university
// @desc    Get notices by university
// @access  Public
router.get('/university/:university', getNoticesByUniversity);

export default router; 