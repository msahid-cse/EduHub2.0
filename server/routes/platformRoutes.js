const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Import models
const User = require('../models/User');
const Course = require('../models/Course');
const Job = require('../models/Job');
const University = require('../models/University');
const Partner = require('../models/Partner');
const Instructor = require('../models/Instructor');

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
      Job.countDocuments({ isActive: true })
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

// GET universities count
router.get('/universities/count', async (req, res) => {
  try {
    const count = await Partner.countDocuments({ type: 'university', isActive: true });
    res.json({ count });
  } catch (err) {
    console.error('Error fetching universities count:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET jobs count
router.get('/jobs/count', async (req, res) => {
  try {
    const count = await Job.countDocuments({ isActive: true });
    res.json({ count });
  } catch (err) {
    console.error('Error fetching jobs count:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 