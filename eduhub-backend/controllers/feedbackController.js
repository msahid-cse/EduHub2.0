import Feedback from '../models/Feedback.js';
import User from '../models/User.js';
import nodemailer from 'nodemailer';

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // use SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Email sending function with better error handling
const sendEmail = async (mailOptions) => {
  if (process.env.NODE_ENV === 'development') {
    // In development, log the email content but don't actually try to send
    console.log('DEVELOPMENT MODE: Email would be sent with the following details:');
    console.log('To:', mailOptions.to);
    console.log('Subject:', mailOptions.subject);
    console.log('Content:', mailOptions.html.substring(0, 100) + '...');
    return { success: true, development: true };
  }
  
  // In production, actually send the email
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Email sending error:', error);
        reject(error);
      } else {
        console.log('Email sent:', info.response);
        resolve(info);
      }
    });
  });
};

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

// Send confirmation email to user after feedback submission
const sendFeedbackConfirmation = async (userName, userEmail, category) => {
  try {
    const feedbackType = category.charAt(0).toUpperCase() + category.slice(1);
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `Thank you for your ${feedbackType} - EduHub`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; background-color: #f9f9f9;">
          <h2 style="color: #00897b; text-align: center;">Thank You for Your ${feedbackType}</h2>
          <p>Hello ${userName},</p>
          <p>Thank you for submitting your ${category} to EduHub. We appreciate your input!</p>
          <p>Our admin team will review your submission as soon as possible and may contact you if needed.</p>
          <p style="margin-top: 20px;">Best regards,</p>
          <p>The EduHub Team</p>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666; font-size: 12px;">
            <p>This is an automated message. Please do not reply to this email.</p>
          </div>
        </div>
      `
    };
    
    await sendEmail(mailOptions);
    console.log(`Confirmation email sent to ${userEmail}`);
    return true;
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return false;
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
    
    // Send confirmation email to user
    await sendFeedbackConfirmation(user.name, user.email, feedback.category);
    
    res.status(201).json({ message: 'Feedback submitted successfully', feedback });
  } catch (error) {
    console.error('Error creating feedback:', error);
    res.status(500).json({ message: 'Server error while submitting feedback' });
  }
};

// Send admin response email to user
const sendAdminResponseEmail = async (feedback, adminResponse) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: feedback.userEmail,
      subject: `Response to Your ${feedback.category.charAt(0).toUpperCase() + feedback.category.slice(1)} - EduHub`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; background-color: #f9f9f9;">
          <h2 style="color: #00897b; text-align: center;">Response to Your Feedback</h2>
          <p>Hello ${feedback.userName},</p>
          <p>Thank you for your recent ${feedback.category} to EduHub.</p>
          <p>The EduHub admin team has reviewed your submission and provided the following response:</p>
          <div style="margin: 20px 0; padding: 15px; background-color: #f0f0f0; border-left: 4px solid #00897b; border-radius: 4px;">
            <p style="margin: 0; font-style: italic;">${adminResponse}</p>
          </div>
          <p>Your feedback helps us improve EduHub for everyone. Thank you for being part of our community!</p>
          <p style="margin-top: 20px;">Best regards,</p>
          <p>The EduHub Team</p>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666; font-size: 12px;">
            <p>If you have any further questions or concerns, please don't hesitate to contact us.</p>
          </div>
        </div>
      `
    };
    
    await sendEmail(mailOptions);
    console.log(`Response email sent to ${feedback.userEmail}`);
    return true;
  } catch (error) {
    console.error('Error sending admin response email:', error);
    return false;
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
      
      // Send email to user with admin response
      await sendAdminResponseEmail(feedback, adminResponse);
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