import User from '../models/User.js';
import Course from '../models/Course.js';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

// In-memory store for verification codes (in production, use Redis or similar)
const verificationCodes = {};

// Helper function to send verification email
const sendVerificationEmail = async (email, verificationCode, purpose = 'password_change') => {
  try {
    console.log(`Attempting to send verification code ${verificationCode} to ${email} for ${purpose}`);
    
    // Check if we have email configuration in environment variables
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;
    
    let transporter;
    
    if (emailUser && emailPass) {
      // Use Gmail for sending emails
      console.log(`Using Gmail with account: ${emailUser}`);
      
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: emailUser,
          pass: emailPass
        }
      });
    } else {
      // Fall back to Ethereal for testing if no email credentials are provided
      console.log('No email credentials found in .env, falling back to Ethereal test account');
      
      // For development - create a test account with Ethereal
      let testAccount;
      try {
        testAccount = await nodemailer.createTestAccount();
        console.log('Created test account:', testAccount.user);
      } catch (testAccountError) {
        console.error('Error creating test account:', testAccountError);
        // Continue with default values if test account creation fails
        testAccount = {
          user: 'test@example.com',
          pass: 'testpassword'
        };
      }
      
      // Create a transporter with Ethereal email for testing
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
    }
    
    // Configure email based on purpose
    let subject, text, html;
    
    if (purpose === 'account_deletion') {
      subject = 'EduHub Account Deletion Request';
      text = `Your verification code for account deletion is: ${verificationCode}. This code will expire in 10 minutes. If you did not request to delete your account, please contact support immediately.`;
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #e53e3e;">EduHub Account Deletion</h2>
          <p>You have requested to delete your account. Please use the following verification code to confirm your identity:</p>
          <div style="background-color: #f4f4f4; padding: 10px; text-align: center; font-size: 24px; letter-spacing: 5px; margin: 20px 0;">
            <strong>${verificationCode}</strong>
          </div>
          <p>This code will expire in 10 minutes.</p>
          <p><strong style="color: #e53e3e;">Warning:</strong> Account deletion is permanent and all your data will be lost.</p>
          <p>If you did not request this action, please ignore this email or contact support immediately.</p>
          <hr style="border: 1px solid #eee; margin: 20px 0;" />
          <p style="color: #888; font-size: 12px;">EduHub Learning Platform</p>
        </div>
      `;
    } else {
      // Default to password change
      subject = 'EduHub Password Change Verification Code';
      text = `Your verification code for password change is: ${verificationCode}. This code will expire in 10 minutes.`;
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4a90e2;">EduHub Password Change</h2>
          <p>You have requested to change your password. Please use the following verification code:</p>
          <div style="background-color: #f4f4f4; padding: 10px; text-align: center; font-size: 24px; letter-spacing: 5px; margin: 20px 0;">
            <strong>${verificationCode}</strong>
          </div>
          <p>This code will expire in 10 minutes.</p>
          <p>If you did not request this change, please ignore this email or contact support.</p>
          <hr style="border: 1px solid #eee; margin: 20px 0;" />
          <p style="color: #888; font-size: 12px;">EduHub Learning Platform</p>
        </div>
      `;
    }
    
    // Send mail with defined transport object
    const info = await transporter.sendMail({
      from: emailUser ? `"EduHub Support" <${emailUser}>` : '"EduHub Support" <support@eduhub.com>',
      to: email,
      subject,
      text,
      html
    });
    
    console.log('Verification email sent:', info.messageId);
    
    // Only for Ethereal test accounts
    const previewUrl = info.messageId.includes('ethereal') ? 
      nodemailer.getTestMessageUrl(info) : null;
    
    if (previewUrl) {
      console.log('Preview URL:', previewUrl);
    }
    
    return {
      success: true,
      previewUrl: previewUrl
    };
  } catch (error) {
    console.error('Error sending verification email:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(user);
  } catch (error) {
    console.error('Error getting user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    console.log('Profile update request received for user:', req.user.userId);
    
    const {
      name,
      phoneNumber,
      department,
      university,
      bio,
      skills,
      skillsMap,
      github,
      codeforces,
      linkedin,
      twitter,
      profilePicture
    } = req.body;
    
    // Find the current user to get existing data
    const existingUser = await User.findById(req.user.userId);
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Create userFields object with existing values as fallbacks
    const userFields = {
      name: name || existingUser.name,
      phoneNumber: phoneNumber || existingUser.phoneNumber,
      department: department || existingUser.department,
      university: university || existingUser.university,
      bio: bio || existingUser.bio,
      github: github || existingUser.github,
      codeforces: codeforces || existingUser.codeforces,
      linkedin: linkedin || existingUser.linkedin,
      twitter: twitter || existingUser.twitter
    };
    
    // Handle skills array and skillsMap separately to ensure data integrity
    if (skills && Array.isArray(skills)) {
      userFields.skills = skills;
      console.log(`Updating ${skills.length} skills for user`);
    }
    
    if (skillsMap && typeof skillsMap === 'object') {
      // Convert skillsMap from frontend format to MongoDB Map format
      const newSkillsMap = new Map();
      
      // Process each skill in the skillsMap
      Object.keys(skillsMap).forEach(skill => {
        if (skillsMap[skill] && typeof skillsMap[skill].proficiency !== 'undefined') {
          newSkillsMap.set(skill, {
            proficiency: skillsMap[skill].proficiency,
            lastUpdated: skillsMap[skill].lastUpdated || new Date().toISOString()
          });
        }
      });
      
      userFields.skillsMap = newSkillsMap;
      console.log('Updating skills proficiency map with skills:', Array.from(newSkillsMap.keys()));
    }
    
    // Handle profile picture - check if it's a new base64 image or an existing URL
    if (profilePicture) {
      // If it's a new base64 image
      if (profilePicture.startsWith('data:image')) {
        console.log('New profile picture uploaded (base64)');
        userFields.profilePicture = profilePicture;
      } else {
        // Keep existing profile picture URL
        console.log('Using existing profile picture URL');
        userFields.profilePicture = profilePicture;
      }
    }
    
    console.log('Updating user profile with fields:', Object.keys(userFields));
    
    // Update user with the new fields
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: userFields },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found after update' });
    }
    
    console.log('User profile updated successfully');
    
    // Convert MongoDB Map back to a regular object for the response
    const responseUser = user.toObject();
    if (responseUser.skillsMap) {
      const skillsMapObject = {};
      
      // Convert Map entries to regular object
      responseUser.skillsMap.forEach((value, key) => {
        skillsMapObject[key] = value;
      });
      
      responseUser.skillsMap = skillsMapObject;
    }
    
    res.status(200).json(responseUser);
  } catch (error) {
    console.error('Error updating user profile:', error);
    
    // Provide more specific error messages
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        details: error.message,
        errors: error.errors 
      });
    } else if (error.name === 'MongoError' || error.name === 'MongoServerError') {
      return res.status(500).json({ 
        message: 'Database error', 
        details: error.message 
      });
    }
    
    res.status(500).json({ 
      message: 'Server error updating profile', 
      details: error.message 
    });
  }
};

// Request verification code for password change
export const requestVerificationCode = async (req, res) => {
  try {
    console.log('Verification code request received');
    const { email } = req.body;
    
    // Verify the provided email matches the authenticated user's email
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (user.email !== email) {
      console.log('Email mismatch:', { provided: email, userEmail: user.email });
      return res.status(400).json({ message: 'Email does not match your account email' });
    }
    
    console.log('User verification successful:', { userId: user._id, email: user.email });
    
    // Generate a random 6-digit code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('Generated verification code:', verificationCode);
    
    // Store the code with an expiration time (10 minutes)
    verificationCodes[user._id] = {
      code: verificationCode,
      expiresAt: Date.now() + 600000 // 10 minutes in milliseconds
    };
    
    // Try to send verification email, but don't fail if it doesn't work
    const emailResult = await sendVerificationEmail(email, verificationCode);
    
    if (!emailResult.success) {
      console.log('Email sending failed, but proceeding with verification code storage');
      // For development purposes only, include the code in the response
      // REMOVE THIS IN PRODUCTION!
      return res.status(200).json({ 
        message: 'Email service unavailable. For testing purposes, your verification code is: ' + verificationCode,
        note: 'In production, this code would only be sent via email',
        code: verificationCode // REMOVE IN PRODUCTION
      });
    }
    
    console.log('Verification code sent successfully');
    res.status(200).json({ 
      message: 'Verification code sent to your email',
      previewUrl: emailResult.previewUrl || null
    });
  } catch (error) {
    console.error('Error requesting verification code:', error);
    res.status(500).json({ 
      message: 'Server error processing verification code request', 
      error: error.message 
    });
  }
};

// Change password
export const changePassword = async (req, res) => {
  try {
    console.log('Change password request received:', { userId: req.user.userId });
    const { currentPassword, newPassword, verificationCode } = req.body;
    
    // Input validation
    if (!currentPassword || !newPassword || !verificationCode) {
      console.log('Missing required fields');
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    if (newPassword.length < 6) {
      console.log('New password too short');
      return res.status(400).json({ message: 'New password must be at least 6 characters long' });
    }
    
    // Find the user
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }
    
    console.log('User found:', { userId: user._id.toString() });
    
    // Verify current password
    try {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      
      if (!isMatch) {
        console.log('Current password is incorrect');
        return res.status(400).json({ message: 'Current password is incorrect' });
      }
      
      console.log('Current password verified successfully');
    } catch (bcryptError) {
      console.error('bcrypt error:', bcryptError);
      return res.status(500).json({ message: 'Error verifying password', error: bcryptError.message });
    }
    
    // Verify the verification code
    const storedVerification = verificationCodes[user._id];
    
    if (!storedVerification) {
      console.log('Verification code not found');
      return res.status(400).json({ message: 'Verification code not found. Please request a new one.' });
    }
    
    if (Date.now() > storedVerification.expiresAt) {
      // Remove expired code
      delete verificationCodes[user._id];
      console.log('Verification code has expired');
      return res.status(400).json({ message: 'Verification code has expired. Please request a new one.' });
    }
    
    if (storedVerification.code !== verificationCode) {
      console.log('Invalid verification code', { provided: verificationCode, expected: storedVerification.code });
      return res.status(400).json({ message: 'Invalid verification code' });
    }
    
    console.log('Verification code valid, updating password');
    
    // All checks passed, update the password
    try {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      
      await user.save();
      
      // Remove the used verification code
      delete verificationCodes[user._id];
      
      console.log('Password changed successfully');
      res.status(200).json({ message: 'Password changed successfully', requireRelogin: true });
    } catch (passwordError) {
      console.error('Error updating password:', passwordError);
      return res.status(500).json({ message: 'Error updating password', error: passwordError.message });
    }
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user enrolled courses
export const getEnrolledCourses = async (req, res) => {
  try {
    // Find all courses where this user is in enrolledStudents array
    const courses = await Course.find({ 
      enrolledStudents: req.user.userId 
    }).sort({ createdAt: -1 });
    
    // Add progress field to each course (for future tracking)
    const coursesWithProgress = courses.map(course => {
      // In a real application, this would come from a separate collection
      // that tracks user progress for each course
      return {
        ...course.toObject(),
        progress: {
          completed: false,
          percentComplete: 0,
          lastAccessed: new Date(),
          // Additional progress metrics could be added here
        }
      };
    });
    
    res.status(200).json(coursesWithProgress);
  } catch (error) {
    console.error('Error getting enrolled courses:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Track course progress
export const trackCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { percentComplete, completed, lastAccessedSection } = req.body;
    
    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if user is enrolled in the course
    if (!course.enrolledStudents.includes(req.user.userId)) {
      return res.status(403).json({ message: 'You are not enrolled in this course' });
    }
    
    // In a real application, update the progress in a separate collection
    // For this implementation, we'll just return a success message
    
    res.status(200).json({ 
      message: 'Progress tracked successfully',
      progress: {
        courseId,
        userId: req.user.userId,
        percentComplete: percentComplete || 0,
        completed: completed || false,
        lastAccessedSection: lastAccessedSection || '',
        lastUpdated: new Date()
      }
    });
  } catch (error) {
    console.error('Error tracking course progress:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Send account deletion verification code
export const sendAccountDeletionCode = async (req, res) => {
  try {
    console.log('Account deletion verification code request received');
    
    const userId = req.user.userId;
    
    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Generate a random 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Set the verification code and expiration (10 minutes)
    user.verificationCode = verificationCode;
    user.verificationCodeExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    
    // Save the user with verification code
    await user.save();
    
    // Send the verification code via email with account_deletion purpose
    const emailResult = await sendVerificationEmail(user.email, verificationCode, 'account_deletion');
    
    if (!emailResult.success) {
      return res.status(500).json({ 
        message: 'Failed to send verification code email',
        error: emailResult.error
      });
    }
    
    res.status(200).json({ 
      message: 'Verification code sent to your email',
      previewUrl: emailResult.previewUrl // Only for development
    });
  } catch (error) {
    console.error('Error sending account deletion verification code:', error);
    res.status(500).json({ 
      message: 'Server error', 
      details: error.message 
    });
  }
};

// Delete user account with verification
export const deleteUserAccount = async (req, res) => {
  try {
    console.log('Account deletion request received');
    
    const { verificationCode } = req.body;
    const userId = req.user.userId;
    
    if (!verificationCode) {
      return res.status(400).json({ message: 'Verification code is required' });
    }
    
    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check verification code
    if (user.verificationCode !== verificationCode) {
      return res.status(400).json({ message: 'Invalid verification code' });
    }
    
    // Check if verification code has expired
    if (user.verificationCodeExpires < Date.now()) {
      return res.status(400).json({ 
        message: 'Verification code has expired',
        expired: true
      });
    }
    
    // Delete user from the database
    await User.findByIdAndDelete(userId);
    
    // Return success response
    res.status(200).json({ 
      message: 'Your account has been successfully deleted'
    });
  } catch (error) {
    console.error('Error deleting user account:', error);
    res.status(500).json({ 
      message: 'Server error', 
      details: error.message 
    });
  }
};

// Admin: Get all users with pagination and sorting
export const getAllUsers = async (req, res) => {
  try {
    // Verify admin role
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Admin privileges required' });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Handle sorting
    const sortBy = req.query.sortBy || 'name';
    const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
    
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder;

    // Get total count for pagination
    const total = await User.countDocuments();
    
    // Get users with pagination and sorting
    const users = await User.find()
      .select('-password -verificationCode')
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      users,
      total,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Error getting all users:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Admin: Search users by name or email
export const searchUsers = async (req, res) => {
  try {
    // Verify admin role
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Admin privileges required' });
    }

    const query = req.query.query || '';
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Create search criteria
    const searchCriteria = {
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ]
    };

    // Get total count for pagination
    const total = await User.countDocuments(searchCriteria);
    
    // Get users with pagination
    const users = await User.find(searchCriteria)
      .select('-password -verificationCode')
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      users,
      total,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Admin: Delete user
export const deleteUserByAdmin = async (req, res) => {
  try {
    // Verify admin role
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Admin privileges required' });
    }

    const userId = req.params.id;
    
    // Check if the target user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Prevent deletion of admin users by other admins for security
    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Cannot delete another admin user' });
    }

    // Delete the user
    await User.findByIdAndDelete(userId);
    
    // Here you might also want to handle dependent data like:
    // - Delete user's posts, comments, etc.
    // - Delete enrollments
    // - Remove from any groups or communities
    // - Notify other systems if needed

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Admin: Send violation email to user
export const sendViolationEmail = async (req, res) => {
  try {
    // Verify admin role
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Admin privileges required' });
    }

    const userId = req.params.id;
    const { subject, message } = req.body;
    
    // Validate required fields
    if (!subject || !message) {
      return res.status(400).json({ message: 'Subject and message are required' });
    }
    
    // Check if the target user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Set up email transport
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;
    
    let transporter;
    
    if (emailUser && emailPass) {
      // Use Gmail for sending emails
      console.log(`Using Gmail with account: ${emailUser}`);
      
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: emailUser,
          pass: emailPass
        }
      });
    } else {
      // Fall back to Ethereal for testing if no email credentials are provided
      console.log('No email credentials found in .env, falling back to Ethereal test account');
      
      // For development - create a test account with Ethereal
      let testAccount;
      try {
        testAccount = await nodemailer.createTestAccount();
        console.log('Created test account:', testAccount.user);
      } catch (testAccountError) {
        console.error('Error creating test account:', testAccountError);
        // Continue with default values if test account creation fails
        testAccount = {
          user: 'test@example.com',
          pass: 'testpassword'
        };
      }
      
      // Create a transporter with Ethereal email for testing
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
    }
    
    // Send the violation email
    const info = await transporter.sendMail({
      from: emailUser ? `"EduHub Administration" <${emailUser}>` : '"EduHub Administration" <admin@eduhub.com>',
      to: user.email,
      subject,
      text: message,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #e53e3e;">Notice from EduHub Administration</h2>
          <hr style="border: 1px solid #eee; margin: 20px 0;" />
          <div style="line-height: 1.6;">
            ${message.replace(/\n/g, '<br/>')}
          </div>
          <hr style="border: 1px solid #eee; margin: 20px 0;" />
          <p style="color: #888; font-size: 12px;">
            This is an official communication from the EduHub Administration Team.
            <br>Please do not reply to this email. If you need to contact us, please use the feedback form on the platform.
          </p>
        </div>
      `
    });
    
    console.log('Violation email sent:', info.messageId);
    
    // Only for Ethereal test accounts
    const previewUrl = info.messageId?.includes('ethereal') ? 
      nodemailer.getTestMessageUrl(info) : null;
    
    if (previewUrl) {
      console.log('Preview URL:', previewUrl);
    }
    
    // Record this action in admin logs (if implemented)
    // ...
    
    res.status(200).json({ 
      message: 'Violation email sent successfully',
      previewUrl: previewUrl || null
    });
  } catch (error) {
    console.error('Error sending violation email:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 