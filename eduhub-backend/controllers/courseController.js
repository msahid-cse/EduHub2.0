import Course from '../models/Course.js';

// Get all courses
export const getAllCourses = async (req, res) => {
  try {
    const { department, courseType, activityType, university } = req.query;
    let query = {};
    
    // Filter by department if provided
    if (department) {
      query.department = department;
    }
    
    // Filter by courseType if provided
    if (courseType) {
      query.courseType = courseType;
    }
    
    // Filter by activityType if provided
    if (activityType) {
      query.activityType = activityType;
    }
    
    // Filter by university if provided
    if (university) {
      query.university = university;
    }
    
    const courses = await Course.find(query)
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name');
      
    res.status(200).json(courses);
  } catch (error) {
    console.error('Error getting courses:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get course by ID
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('createdBy', 'name');
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    res.status(200).json(course);
  } catch (error) {
    console.error('Error getting course by ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new course
export const createCourse = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      instructor,
      content,
      duration,
      skillLevel,
      courseType,
      courseSegment,
      videoUrl,
      theoryUrl,
      department,
      activityType,
      university,
      thumbnail,
      tags
    } = req.body;
    
    console.log('Creating course with data:', req.body);
    console.log('User from auth middleware:', req.user);
    
    // Validate required fields
    if (!title || !description || !instructor || !content || !duration || !courseType || !courseSegment) {
      return res.status(400).json({ 
        message: 'Please provide all required fields (title, description, instructor, content, duration, courseType, courseSegment)' 
      });
    }
    
    // Validate course type specific fields
    if (courseType === 'academic' && !department) {
      return res.status(400).json({ message: 'Department is required for academic courses' });
    }
    
    if (courseType === 'co-curricular' && !activityType) {
      return res.status(400).json({ message: 'Activity type is required for co-curricular courses' });
    }
    
    // Validate course segment specific fields
    if (courseSegment === 'video' && !videoUrl) {
      return res.status(400).json({ message: 'Video URL is required for video courses' });
    }
    
    if (courseSegment === 'theory' && !theoryUrl) {
      return res.status(400).json({ message: 'Theory URL is required for theory courses' });
    }
    
    // Create new course
    const newCourse = new Course({
      title,
      description,
      instructor,
      content,
      duration,
      skillLevel: skillLevel || 'beginner',
      courseType,
      courseSegment,
      videoUrl,
      theoryUrl,
      department,
      activityType,
      university,
      thumbnail,
      tags: tags || [],
      createdBy: req.user.userId,
    });
    
    await newCourse.save();
    
    res.status(201).json({
      message: 'Course created successfully',
      course: newCourse
    });
  } catch (error) {
    console.error('Error creating course:', error);
    
    // Send more detailed error information
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: 'Validation error', 
        errors,
        details: error.message
      });
    }
    
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message
    });
  }
};

// Update a course
export const updateCourse = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      instructor,
      content,
      duration,
      skillLevel,
      courseType,
      courseSegment,
      videoUrl,
      theoryUrl,
      department,
      activityType,
      university,
      thumbnail,
      tags
    } = req.body;
    
    // Find and update course
    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        instructor,
        content,
        duration,
        skillLevel,
        courseType,
        courseSegment,
        videoUrl,
        theoryUrl,
        department,
        activityType,
        university,
        thumbnail,
        tags
      },
      { new: true }
    );
    
    if (!updatedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    res.status(200).json({
      message: 'Course updated successfully',
      course: updatedCourse
    });
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a course
export const deleteCourse = async (req, res) => {
  try {
    const deletedCourse = await Course.findByIdAndDelete(req.params.id);
    
    if (!deletedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Enroll in a course
export const enrollCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if user is already enrolled
    if (course.enrolledStudents.includes(req.user.userId)) {
      return res.status(400).json({ message: 'You are already enrolled in this course' });
    }
    
    // Add user to enrolled students
    course.enrolledStudents.push(req.user.userId);
    await course.save();
    
    res.status(200).json({ message: 'Enrolled in course successfully' });
  } catch (error) {
    console.error('Error enrolling in course:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get courses by department
export const getCoursesByDepartment = async (req, res) => {
  try {
    const { department } = req.params;
    
    const courses = await Course.find({ 
      department: department,
      courseType: 'academic'
    })
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name');
      
    res.status(200).json(courses);
  } catch (error) {
    console.error('Error getting courses by department:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get co-curricular courses by activity type
export const getCoursesByActivityType = async (req, res) => {
  try {
    const { activityType } = req.params;
    
    const courses = await Course.find({ 
      activityType: activityType,
      courseType: 'co-curricular'
    })
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name');
      
    res.status(200).json(courses);
  } catch (error) {
    console.error('Error getting courses by activity type:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 