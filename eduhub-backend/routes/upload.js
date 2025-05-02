import express from 'express';
import { authMiddleware, adminOnly } from '../middleware/auth.js';
import { uploadCourseThumbnail, uploadCourseVideo } from '../middleware/upload.js';

const router = express.Router();

// @route   POST /api/upload/course-thumbnail
// @desc    Upload course thumbnail image
// @access  Private/Admin
router.post('/course-thumbnail', authMiddleware, adminOnly, uploadCourseThumbnail, (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  
  // Return the thumbnail URL
  const thumbnailUrl = `/uploads/courses/${req.file.filename}`;
  return res.status(200).json({ 
    message: 'Thumbnail uploaded successfully',
    thumbnailUrl
  });
});

// @route   POST /api/upload/course-video
// @desc    Upload course video file
// @access  Private/Admin
router.post('/course-video', authMiddleware, adminOnly, uploadCourseVideo, (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  
  // Return the video URL
  const videoUrl = `/uploads/course-videos/${req.file.filename}`;
  return res.status(200).json({ 
    message: 'Video uploaded successfully',
    videoUrl,
    fileInfo: {
      fileName: req.file.originalname,
      fileSize: req.file.size,
      mimeType: req.file.mimetype
    }
  });
});

export default router; 