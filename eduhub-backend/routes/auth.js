import express from 'express';
import { register, login, verifyEmail, resendVerificationCode, getCurrentUser } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/auth.js';
import nodemailer from 'nodemailer';

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', register);

// @route   POST /api/auth/login
// @desc    Login a user
// @access  Public
router.post('/login', login);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/current-user', authMiddleware, getCurrentUser);

// @route   POST /api/auth/verify-email
// @desc    Verify user email with code
// @access  Public
router.post('/verify-email', verifyEmail);

// @route   POST /api/auth/resend-verification
// @desc    Resend verification code
// @access  Public
router.post('/resend-verification', resendVerificationCode);

// Diagnostic route for email - REMOVE in production
router.get('/email-diagnostic', (req, res) => {
  // Only available in development
  if (process.env.NODE_ENV !== 'development') {
    return res.status(404).json({ message: 'Route not found' });
  }
  
  const diagnostics = {
    email: {
      host: 'smtp.gmail.com',
      port: 465,
      user: process.env.EMAIL_USER,
      passLength: process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 0,
      status: 'unknown'
    }
  };
  
  // Test email connection
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });
  
  transporter.verify((error, success) => {
    if (error) {
      diagnostics.email.status = 'error';
      diagnostics.email.error = error.message;
      res.status(200).json(diagnostics);
    } else {
      diagnostics.email.status = 'success';
      res.status(200).json(diagnostics);
    }
  });
});

export default router; 