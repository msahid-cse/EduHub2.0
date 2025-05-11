import express from 'express';
import User from '../models/User.js';
import Course from '../models/Course.js';
import Job from '../models/Job.js';
import Instructor from '../models/Instructor.js';
import Partner from '../models/Partner.js';

const router = express.Router();

// @route   GET /api/platform/stats
// @desc    Get platform statistics
// @access  Public
router.get('/stats', async (req, res) => {
  try {
    // Execute all count queries in parallel
    const [
      coursesCount,
      instructorsCount,
      studentsCount,
      universitiesCount,
      jobsCount
    ] = await Promise.all([
      Course.countDocuments(),
      Instructor.countDocuments(),
      User.countDocuments({ role: 'user' }),
      Partner.countDocuments({ type: 'university', isActive: true }),
      Job.countDocuments()
    ]);

    res.json({
      courses: coursesCount,
      instructors: instructorsCount,
      students: studentsCount,
      universities: universitiesCount,
      jobs: jobsCount
    });
  } catch (err) {
    console.error('Error fetching platform stats:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET course count
router.get('/courses/count', async (req, res) => {
  try {
    const count = await Course.countDocuments();
    res.json({ count });
  } catch (err) {
    console.error('Error fetching course count:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET instructors count
router.get('/instructors/count', async (req, res) => {
  try {
    const count = await Instructor.countDocuments();
    res.json({ count });
  } catch (err) {
    console.error('Error fetching instructors count:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET students count
router.get('/students/count', async (req, res) => {
  try {
    const count = await User.countDocuments({ role: 'user' });
    res.json({ count });
  } catch (err) {
    console.error('Error fetching students count:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET jobs count
router.get('/jobs/count', async (req, res) => {
  try {
    const count = await Job.countDocuments();
    res.json({ count });
  } catch (err) {
    console.error('Error fetching jobs count:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 