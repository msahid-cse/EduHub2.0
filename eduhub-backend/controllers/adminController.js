import User from '../models/User.js';
import Course from '../models/Course.js';
import Job from '../models/Job.js';
import Notice from '../models/Notice.js';
import Feedback from '../models/Feedback.js';
import Post from '../models/Post.js';
import Instructor from '../models/Instructor.js';

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
    
    res.status(200).json({
      users: userCount,
      courses: courseCount,
      jobs: jobCount,
      notices: noticeCount,
      feedback: feedbackCount,
      globalPosts: globalPostCount,
      instructors: instructorCount
    });
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    res.status(500).json({ message: 'Server error while getting dashboard stats' });
  }
}; 