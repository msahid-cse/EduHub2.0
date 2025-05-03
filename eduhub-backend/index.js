import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import 'dotenv/config';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';
import passport from './utils/passport.js';
import { seedInitialData } from './startup/seedData.js';

// Fix email password by removing spaces if it exists
if (process.env.EMAIL_PASS) {
  process.env.EMAIL_PASS = process.env.EMAIL_PASS.replace(/\s+/g, '');
  console.log('Email configuration: Password formatted for proper use');
}

// Test email configuration at startup
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

transporter.verify((error, success) => {
  if (error) {
    console.error('Email configuration error:', error);
    console.error('This may cause issues with email verification!');
  } else {
    console.log('Email server connection verified successfully');
  }
});

// Import routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import adminRoutes from './routes/admin.js';
import courseRoutes from './routes/course.js';
import noticeRoutes from './routes/notice.js';
import jobRoutes from './routes/job.js';
import instructorRoutes from './routes/instructor.js';
import feedbackRoutes from './routes/feedback.js';
import universityRoutes from './routes/university.js';
import communityRoutes from './routes/community.js';
import uploadRoutes from './routes/upload.js';
import departmentRoutes from './routes/department.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Get the directory name using the ESM approach
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(morgan("tiny"));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS configuration
const corsOptions = {
  origin: '*', // Change in production to restrict origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// Initialize Passport
app.use(passport.initialize());

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/eduhub';
    console.log('Attempting to connect to MongoDB at:', mongoUri);
    
    await mongoose.connect(mongoUri);
    console.log("MongoDB Connected Successfully");
  } catch (err) {
    console.error("MongoDB Connection Error:", err.message);
    // Try connecting to localhost if the main connection fails
    try {
      console.log("Trying fallback connection to local MongoDB...");
      await mongoose.connect('mongodb://127.0.0.1:27017/eduhub');
      console.log("Connected to local MongoDB successfully");
    } catch (fallbackErr) {
      console.error("Fallback MongoDB connection failed:", fallbackErr.message);
      console.error("Application may not function correctly without database connection");
    }
  }
};

// Initialize database connection
connectDB().then(async () => {
  // Seed initial data after successful connection
  await seedInitialData();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/instructors', instructorRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/universities', universityRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/departments', departmentRoutes);

// Add a health check route near the beginning of your routes
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'API server is running',
    time: new Date().toISOString(),
    version: '1.0'
  });
});

// Health check route
app.get("/", (req, res) => {
    res.json({ message: "EduHub API is running!" });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});