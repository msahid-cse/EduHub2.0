import User from '../models/User.js';
import Course from '../models/Course.js';

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
    const {
      name,
      phoneNumber,
      department,
      university,
      bio,
      skills,
      github,
      linkedin,
      twitter
    } = req.body;
    
    const userFields = {};
    if (name) userFields.name = name;
    if (phoneNumber) userFields.phoneNumber = phoneNumber;
    if (department) userFields.department = department;
    if (university) userFields.university = university;
    if (bio) userFields.bio = bio;
    if (skills) userFields.skills = skills;
    if (github) userFields.github = github;
    if (linkedin) userFields.linkedin = linkedin;
    if (twitter) userFields.twitter = twitter;
    
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: userFields },
      { new: true }
    ).select('-password');
    
    res.status(200).json(user);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Server error' });
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