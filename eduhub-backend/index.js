import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import 'dotenv/config';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';

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

const app = express();
const PORT = process.env.PORT || 5000;

// Get the directory name using the ESM approach
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(morgan("tiny"));
app.use(express.json());
app.use(cors());

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Connection Error:", err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/instructors', instructorRoutes);
app.use('/api/feedback', feedbackRoutes);

// Health check route
app.get("/", (req, res) => {
    res.json({ message: "EduHub API is running!" });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});