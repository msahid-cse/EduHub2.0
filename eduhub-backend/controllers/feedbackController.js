import Feedback from '../models/Feedback.js';
import User from '../models/User.js';

// Get all feedback
export const getAllFeedback = async (req, res) => {
  try {
    const { status, category } = req.query;
    const filter = {};
    
    // Add filters if provided
    if (status) filter.status = status;
    if (category) filter.category = category;
    
    const feedbacks = await Feedback.find(filter).sort({ createdAt: -1 });
    res.status(200).json(feedbacks);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ message: 'Server error while fetching feedback' });
  }
};

// Get feedback by ID
export const getFeedbackById = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    res.status(200).json(feedback);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ message: 'Server error while fetching feedback' });
  }
};

// Create a new feedback
export const createFeedback = async (req, res) => {
  try {
    const { subject, message, category } = req.body;
    
    // Get user info from token
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Create new feedback
    const feedback = new Feedback({
      userId: req.user.userId,
      userName: user.name,
      userEmail: user.email,
      subject,
      message,
      category: category || 'suggestion'
    });
    
    await feedback.save();
    res.status(201).json({ message: 'Feedback submitted successfully', feedback });
  } catch (error) {
    console.error('Error creating feedback:', error);
    res.status(500).json({ message: 'Server error while submitting feedback' });
  }
};

// Update feedback status (admin only)
export const updateFeedbackStatus = async (req, res) => {
  try {
    const { status, adminResponse } = req.body;
    
    // Find feedback
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    
    // Update status
    feedback.status = status || feedback.status;
    
    // Add admin response if provided
    if (adminResponse) {
      feedback.adminResponse = {
        message: adminResponse,
        respondedAt: new Date(),
        respondedBy: req.user.userId
      };
    }
    
    await feedback.save();
    res.status(200).json({ message: 'Feedback updated successfully', feedback });
  } catch (error) {
    console.error('Error updating feedback:', error);
    res.status(500).json({ message: 'Server error while updating feedback' });
  }
};

// Delete feedback (admin only)
export const deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    
    await feedback.deleteOne();
    res.status(200).json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    console.error('Error deleting feedback:', error);
    res.status(500).json({ message: 'Server error while deleting feedback' });
  }
};

// Get feedback submitted by the current user
export const getUserFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.status(200).json(feedbacks);
  } catch (error) {
    console.error('Error fetching user feedback:', error);
    res.status(500).json({ message: 'Server error while fetching user feedback' });
  }
}; 