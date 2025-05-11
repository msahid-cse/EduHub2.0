import User from '../models/User.js';
import Course from '../models/Course.js';
import Job from '../models/Job.js';
import Notice from '../models/Notice.js';
import Feedback from '../models/Feedback.js';
import Post from '../models/Post.js';
import Instructor from '../models/Instructor.js';
import Event from '../models/Event.js';
import EventHit from '../models/EventHit.js';
import Admin from '../models/Admin.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// Get admin dashboard stats
export const getDashboardStats = async (req, res) => {
  try {
    // Get counts of various entities
    const userCount = await User.countDocuments();
    const courseCount = await Course.countDocuments();
    const jobCount = await Job.countDocuments();
    const noticeCount = await Notice.countDocuments();
    const feedbackCount = await Feedback.countDocuments();
    const globalPostCount = await Post.countDocuments({ isGlobal: true });
    const instructorCount = await Instructor.countDocuments();
    const eventCount = await Event.countDocuments();
    const eventHitCount = await EventHit.countDocuments();
    
    res.status(200).json({
      users: userCount,
      courses: courseCount,
      jobs: jobCount,
      notices: noticeCount,
      feedback: feedbackCount,
      globalPosts: globalPostCount,
      instructors: instructorCount,
      events: eventCount,
      eventHits: eventHitCount
    });
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    res.status(500).json({ message: 'Server error while getting dashboard stats' });
  }
};

// Make sure JWT_SECRET is defined
const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex');

// Admin Login
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    // Find admin by email
    const admin = await Admin.findOne({ email });
    
    // Check if admin exists
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Verify password
    const isPasswordValid = await admin.comparePassword(password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Update last login time
    admin.lastLoginAt = Date.now();
    await admin.save();
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: admin._id, 
        role: 'admin',
        email: admin.email,
        permissions: admin.permissions
      },
      JWT_SECRET,
      { expiresIn: '1d' }
    );
    
    // Return admin data and token
    res.status(200).json({
      message: 'Login successful',
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: 'admin',
        permissions: admin.permissions
      },
      token
    });
    
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ 
      message: 'Server error during admin login',
      error: error.message
    });
  }
};

// Get Current Admin
export const getCurrentAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.userId);
    
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    
    res.status(200).json({
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: 'admin',
        permissions: admin.permissions,
        profilePicture: admin.profilePicture,
        lastLoginAt: admin.lastLoginAt
      }
    });
    
  } catch (error) {
    console.error('Get current admin error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create Admin (Only for initial setup or super admin)
export const createAdmin = async (req, res) => {
  try {
    const { name, email, password, permissions } = req.body;
    
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin with this email already exists' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new admin
    const admin = new Admin({
      name,
      email,
      password: hashedPassword,
      permissions: permissions || {} // Use provided permissions or default
    });
    
    await admin.save();
    
    res.status(201).json({
      message: 'Admin created successfully',
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: 'admin',
        permissions: admin.permissions
      }
    });
    
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({ 
      message: 'Server error during admin creation',
      error: error.message
    });
  }
};

// Update Admin
export const updateAdmin = async (req, res) => {
  try {
    const { name, email, permissions, profilePicture } = req.body;
    const adminId = req.params.id;
    
    // Find admin by ID
    const admin = await Admin.findById(adminId);
    
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    
    // Update admin fields
    if (name) admin.name = name;
    if (email) admin.email = email;
    if (permissions) admin.permissions = { ...admin.permissions, ...permissions };
    if (profilePicture) admin.profilePicture = profilePicture;
    
    await admin.save();
    
    res.status(200).json({
      message: 'Admin updated successfully',
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: 'admin',
        permissions: admin.permissions,
        profilePicture: admin.profilePicture
      }
    });
    
  } catch (error) {
    console.error('Update admin error:', error);
    res.status(500).json({ message: 'Server error during admin update' });
  }
};

// Change Admin Password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Find admin by ID
    const admin = await Admin.findById(req.userId);
    
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    
    // Verify current password
    const isPasswordValid = await admin.comparePassword(currentPassword);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }
    
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // Update password
    admin.password = hashedPassword;
    await admin.save();
    
    res.status(200).json({ message: 'Password changed successfully' });
    
  } catch (error) {
    console.error('Change admin password error:', error);
    res.status(500).json({ message: 'Server error during password change' });
  }
};

// List All Admins (for super admin)
export const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select('-password');
    
    res.status(200).json({
      admins: admins.map(admin => ({
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: 'admin',
        permissions: admin.permissions,
        lastLoginAt: admin.lastLoginAt,
        createdAt: admin.createdAt
      }))
    });
    
  } catch (error) {
    console.error('Get all admins error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete Admin
export const deleteAdmin = async (req, res) => {
  try {
    const adminId = req.params.id;
    
    // Count total admins to prevent deleting the last admin
    const adminCount = await Admin.countDocuments();
    
    if (adminCount <= 1) {
      return res.status(400).json({ message: 'Cannot delete the last admin account' });
    }
    
    const result = await Admin.findByIdAndDelete(adminId);
    
    if (!result) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    
    res.status(200).json({ message: 'Admin deleted successfully' });
    
  } catch (error) {
    console.error('Delete admin error:', error);
    res.status(500).json({ message: 'Server error during admin deletion' });
  }
}; 