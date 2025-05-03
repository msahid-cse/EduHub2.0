import express from 'express';
import { authMiddleware, adminOnly } from '../middleware/auth.js';
import { uploadPromotionalVideo } from '../middleware/upload.js';
import PromotionalVideo from '../models/PromotionalVideo.js';

const router = express.Router();

// @route   GET /api/promotional-video
// @desc    Get active promotional video
// @access  Public
router.get('/', async (req, res) => {
  try {
    const video = await PromotionalVideo.findOne({ isActive: true });
    if (!video) {
      return res.status(404).json({ message: 'No active promotional video found' });
    }
    return res.status(200).json({ video });
  } catch (error) {
    console.error('Error fetching promotional video:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/promotional-video/all
// @desc    Get all promotional videos (for admin dashboard)
// @access  Private/Admin
router.get('/all', authMiddleware, adminOnly, async (req, res) => {
  try {
    const videos = await PromotionalVideo.find().sort({ createdAt: -1 });
    return res.status(200).json({ videos });
  } catch (error) {
    console.error('Error fetching all promotional videos:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/promotional-video
// @desc    Create a new promotional video
// @access  Private/Admin
router.post('/', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { title, description, videoUrl, videoType } = req.body;
    
    // Validate required fields
    if (!title || !description || !videoUrl || !videoType) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Create new promotional video
    const newVideo = new PromotionalVideo({
      title,
      description,
      videoUrl,
      videoType,
      thumbnailUrl: req.body.thumbnailUrl || null,
      isActive: req.body.isActive !== undefined ? req.body.isActive : true,
      createdBy: req.user ? req.user.id : req.user?.id || '000000000000000000000000' // Use a default ID if user is not available
    });
    
    // Save the video to the database
    const savedVideo = await newVideo.save();
    
    return res.status(201).json({ 
      message: 'Promotional video created successfully',
      video: savedVideo
    });
  } catch (error) {
    console.error('Error creating promotional video:', error);
    return res.status(500).json({ message: error.message || 'Server error', error: error.message });
  }
});

// @route   POST /api/promotional-video/upload
// @desc    Upload promotional video file
// @access  Private/Admin
router.post('/upload', authMiddleware, adminOnly, uploadPromotionalVideo, (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  
  // Return the video URL
  const videoUrl = `/uploads/promotional-videos/${req.file.filename}`;
  return res.status(200).json({ 
    message: 'Video uploaded successfully',
    videoUrl,
    videoType: 'upload',
    fileInfo: {
      fileName: req.file.originalname,
      fileSize: req.file.size,
      mimeType: req.file.mimetype
    }
  });
});

// @route   PUT /api/promotional-video/:id
// @desc    Update a promotional video
// @access  Private/Admin
router.put('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { title, description, videoUrl, videoType, isActive } = req.body;
    
    // Find the video
    const video = await PromotionalVideo.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: 'Promotional video not found' });
    }
    
    // Update fields
    if (title) video.title = title;
    if (description) video.description = description;
    if (videoUrl) video.videoUrl = videoUrl;
    if (videoType) video.videoType = videoType;
    if (req.body.thumbnailUrl) video.thumbnailUrl = req.body.thumbnailUrl;
    if (isActive !== undefined) video.isActive = isActive;
    
    // Save the updated video
    const updatedVideo = await video.save();
    
    return res.status(200).json({
      message: 'Promotional video updated successfully',
      video: updatedVideo
    });
  } catch (error) {
    console.error('Error updating promotional video:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/promotional-video/:id
// @desc    Delete a promotional video
// @access  Private/Admin
router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const video = await PromotionalVideo.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: 'Promotional video not found' });
    }
    
    await PromotionalVideo.deleteOne({ _id: req.params.id });
    
    return res.status(200).json({ message: 'Promotional video deleted successfully' });
  } catch (error) {
    console.error('Error deleting promotional video:', error);
    return res.status(500).json({ message: error.message || 'Server error', error: error.message });
  }
});

export default router; 