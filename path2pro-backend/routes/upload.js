import express from 'express';
import { authMiddleware, adminOnly } from '../middleware/auth.js';
import { uploadCourseThumbnail, uploadCourseVideo, uploadEventImage } from '../middleware/upload.js';

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

// @route   POST /api/upload/event-image
// @desc    Upload event image
// @access  Private/Admin
router.post('/event-image', authMiddleware, uploadEventImage, (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  
  // Get the base URL from request or env vars
  const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
  
  // Return the absolute image URL
  const relativePath = `/uploads/events/${req.file.filename}`;
  const imageUrl = `${baseUrl}${relativePath}`;
  
  console.log('Event image uploaded successfully:', {
    relativePath, 
    absoluteUrl: imageUrl,
    fileInfo: {
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      mimeType: req.file.mimetype
    }
  });
  
  return res.status(200).json({ 
    message: 'Event image uploaded successfully',
    imageUrl,
    relativePath
  });
});

export default router; 