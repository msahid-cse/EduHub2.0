import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

// Make sure JWT_SECRET is defined
const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex');
if (!process.env.JWT_SECRET) {
  console.warn('Warning: JWT_SECRET not found in environment variables');
  console.warn('Using a randomly generated secret. This will invalidate all existing tokens when the server restarts.');
  console.warn('Please set a proper JWT_SECRET in your .env file');
}

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // use SSL
  auth: {
    user: process.env.EMAIL_USER || 'development@example.com',
    pass: process.env.EMAIL_PASS || 'developmentpassword'
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Test email connection
transporter.verify((error, success) => {
  if (error) {
    console.error('Email configuration error:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

// Email sending function for better error handling
const sendEmail = async (mailOptions) => {
  if (process.env.NODE_ENV === 'development') {
    // In development, log the email content but don't actually try to send
    console.log('DEVELOPMENT MODE: Email would be sent with the following details:');
    console.log('To:', mailOptions.to);
    console.log('Subject:', mailOptions.subject);
    console.log('Content contains verification code');
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

// Register a new user
export const register = async (req, res) => {
  try {
    console.log('Register request received:', req.body);
    const { name, email, password, university, country, department } = req.body;
    
    // Check if required fields are present
    if (!name || !email || !password || !university || !country || !department) {
      console.log('Missing required fields:', { name, email, password, university, country, department });
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationCodeExpires = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes

    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      university,
      country,
      department,
      role: 'user', // Default to user
      verificationCode,
      verificationCodeExpires,
      isEmailVerified: false
    });

    await user.save();

    // Send verification email
    const mailOptions = {
      from: process.env.EMAIL_USER || 'development@example.com',
      to: email,
      subject: 'EduHub Email Verification',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
          <h2 style="color: #00897b; text-align: center;">Welcome to EduHub!</h2>
          <p>Hello ${name},</p>
          <p>Thank you for registering with EduHub. To complete your registration, please use the verification code below:</p>
          <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
            ${verificationCode}
          </div>
          <p>This code will expire in 2 minutes.</p>
          <p>If you didn't request this verification, please ignore this email.</p>
          <p>Best regards,<br>The EduHub Team</p>
        </div>
      `
    };

    try {
      // Use Promise to properly handle email sending
      await sendEmail(mailOptions);
      console.log('Verification email sent or simulated');
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      console.warn('Continuing with registration despite email failure');
      // Continue with registration even if email fails
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('User registered successfully:', user._id);
    
    res.status(201).json({
      message: 'User registered successfully. Please verify your email.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        university: user.university,
        country: user.country,
        department: user.department,
        isEmailVerified: user.isEmailVerified
      },
      token,
      // For development environments only - remove in production
      verificationCode: process.env.NODE_ENV === 'development' ? verificationCode : undefined
    });
  } catch (error) {
    console.error('Register error details:', error);
    res.status(500).json({ 
      message: 'Server error during registration',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Verify email
export const verifyEmail = async (req, res) => {
  try {
    const { email, verificationCode } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if verification code is valid and not expired
    if (user.verificationCode !== verificationCode) {
      return res.status(400).json({ message: 'Invalid verification code' });
    }

    if (user.verificationCodeExpires < new Date()) {
      return res.status(400).json({ message: 'Verification code expired' });
    }

    // Update user as verified
    user.isEmailVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpires = null;
    await user.save();

    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ message: 'Server error during email verification' });
  }
};

// Resend verification code
export const resendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate new verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationCodeExpires = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes

    // Update user with new verification code
    user.verificationCode = verificationCode;
    user.verificationCodeExpires = verificationCodeExpires;
    await user.save();

    // Send verification email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'EduHub Email Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
          <h2 style="color: #00897b; text-align: center;">EduHub Verification</h2>
          <p>Hello ${user.name},</p>
          <p>You requested a new verification code. Please use the code below to verify your email:</p>
          <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
            ${verificationCode}
          </div>
          <p>This code will expire in 2 minutes.</p>
          <p>If you didn't request this verification, please ignore this email.</p>
          <p>Best regards,<br>The EduHub Team</p>
        </div>
      `
    };

    // Use Promise to properly handle email sending
    await sendEmail(mailOptions);

    return res.status(200).json({ message: 'Verification code sent successfully' });
  } catch (error) {
    console.error('Resend verification error:', error);
    return res.status(500).json({ 
      message: 'Failed to resend verification code. Please try again.',
      error: error.message 
    });
  }
};

// Login a user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Admin credentials check
    if (email === 'admin@eduhub.com' && password === 'admin123') {
      const adminId = '000000000000000000000000';
      const token = jwt.sign(
        { userId: adminId, role: 'admin' },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      return res.status(200).json({
        message: 'Admin login successful',
        token,
        user: {
          email: 'admin@eduhub.com',
          role: 'admin',
          name: 'Admin',
          _id: adminId,
          id: adminId,
          userId: adminId
        }
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password - validate password first before proceeding with verification flow
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Check if email is verified
    if (!user.isEmailVerified) {
      console.log('User tried to login with unverified email:', email);
      
      // Generate new verification code
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
      
      // Update user with new verification code
      user.verificationCode = verificationCode;
      user.verificationCodeExpires = verificationCodeExpires;
      await user.save();
      
      // Send verification email
      const mailOptions = {
        from: process.env.EMAIL_USER || 'development@example.com',
        to: email,
        subject: 'EduHub Email Verification Code',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
            <h2 style="color: #00897b; text-align: center;">EduHub Verification</h2>
            <p>Hello ${user.name},</p>
            <p>You attempted to login with an unverified email. Please use the code below to verify your email:</p>
            <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
              ${verificationCode}
            </div>
            <p>This code will expire in 10 minutes.</p>
            <p>If you didn't request this verification, please ignore this email.</p>
            <p>Best regards,<br>The EduHub Team</p>
          </div>
        `
      };
      
      try {
        // Send the verification email
        await sendEmail(mailOptions);
        console.log('Verification email sent to:', email);
      } catch (emailError) {
        console.error('Error sending verification email:', emailError);
        // Continue even if email fails
      }
      
      return res.status(401).json({ 
        message: 'Please verify your email before logging in',
        needsVerification: true,
        email: user.email,
        // Include the verification code in development environment only
        verificationCode: process.env.NODE_ENV === 'development' ? verificationCode : undefined
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id.toString(),
        _id: user._id.toString(),
        userId: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        university: user.university,
        country: user.country,
        department: user.department
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Get current user
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        university: user.university,
        country: user.country,
        profilePicture: user.profilePicture,
        cvPath: user.cvPath,
        skills: user.skills,
        isEmailVerified: user.isEmailVerified
      }
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Google OAuth success handler
export const googleAuthCallback = async (req, res) => {
  try {
    // req.user is provided by the passport Google strategy
    const user = req.user;
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/oauth-callback?token=${token}&userId=${user._id}&role=${user.role}&email=${user.email}`);
  } catch (error) {
    console.error('Google auth callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=oauth_failed`);
  }
};

// GitHub OAuth success handler
export const githubAuthCallback = async (req, res) => {
  try {
    // req.user is provided by the passport GitHub strategy
    const user = req.user;
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/oauth-callback?token=${token}&userId=${user._id}&role=${user.role}&email=${user.email}`);
  } catch (error) {
    console.error('GitHub auth callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=oauth_failed`);
  }
}; 