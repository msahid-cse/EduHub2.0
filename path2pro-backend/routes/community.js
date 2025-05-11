import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { authMiddleware } from '../middleware/auth.js';
import { adminMiddleware } from '../middleware/admin.js';
import {
  getGlobalPosts,
  getUniversityPosts,
  createPost,
  addComment,
  likePost,
  getAllUsers,
  getUniversityMembers,
  sendMessage,
  getConversation,
  getUnreadCount,
  uploadAttachment,
  getGlobalCommunityMembers,
  checkAdminStatus,
  getPublicGlobalPosts
} from '../controllers/communityController.js';

const router = express.Router();

// Configure multer for file uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '../uploads/attachments');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max file size
});

// Public route for landing page (no auth required)
// @route   GET /api/community/public/posts
// @desc    Get a few global posts for public view (landing page)
// @access  Public
router.get('/public/posts', getPublicGlobalPosts);

// Global community routes
// @route   GET /api/community/global/posts
// @desc    Get all global posts
// @access  Private
router.get('/global/posts', authMiddleware, getGlobalPosts);

// University community routes
// @route   GET /api/community/posts
// @desc    Get posts from user's university
// @access  Private
router.get('/posts', authMiddleware, getUniversityPosts);

// @route   POST /api/community/posts
// @desc    Create a new post
// @access  Private
router.post('/posts', authMiddleware, createPost);

// @route   POST /api/community/posts/:postId/comments
// @desc    Add a comment to a post
// @access  Private
router.post('/posts/:postId/comments', authMiddleware, addComment);

// @route   POST /api/community/posts/:postId/like
// @desc    Like or unlike a post
// @access  Private
router.post('/posts/:postId/like', authMiddleware, likePost);

// @route   GET /api/community/members
// @desc    Get university members for chat
// @access  Private
router.get('/members', authMiddleware, getUniversityMembers);

// @route   GET /api/community/users
// @desc    Get all users (admin only)
// @access  Private (Admin)
router.get('/users', authMiddleware, adminMiddleware, getAllUsers);

// @route   GET /api/community/admin/users
// @desc    Alternative endpoint to get all users for admin dashboard
// @access  Private (checks admin role in controller)
router.get('/admin/users', authMiddleware, getAllUsers);

// @route   GET /api/community/global/members
// @desc    Get all users for global community
// @access  Private
router.get('/global/members', authMiddleware, getGlobalCommunityMembers);

// @route   POST /api/community/messages
// @desc    Send a message
// @access  Private
router.post('/messages', authMiddleware, sendMessage);

// @route   GET /api/community/messages/:userId
// @desc    Get conversation with another user
// @access  Private
router.get('/messages/:userId', authMiddleware, getConversation);

// @route   GET /api/community/messages/unread/count
// @desc    Get unread message count
// @access  Private
router.get('/messages/unread/count', authMiddleware, getUnreadCount);

// @route   POST /api/community/upload
// @desc    Upload a file attachment
// @access  Private
router.post('/upload', authMiddleware, upload.single('file'), uploadAttachment);

// @route   GET /api/community/admin/check
// @desc    Check if user has admin access
// @access  Private
router.get('/admin/check', authMiddleware, checkAdminStatus);

export default router; 