import Course from '../models/Course.js';
import fs from 'fs';
import { parse } from 'csv-parse';

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
    console.log('🔍 Create course request received');
    console.log('📋 Request body:', JSON.stringify(req.body, null, 2));
    
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
      youtubeVideoUrl,
      youtubePlaylistUrl,
      driveVideoUrl,
      theoryUrl,
      theoryLinks,
      department,
      activityType,
      university,
      thumbnail,
      tags,
      prerequisites
    } = req.body;
    
    console.log('👤 User auth data:', req.user);
    
    // Validate required fields
    if (!title || !description || !instructor || !content || !duration || !courseType || !courseSegment) {
      console.log('❌ Missing required fields');
      const missingFields = [];
      if (!title) missingFields.push('title');
      if (!description) missingFields.push('description');
      if (!instructor) missingFields.push('instructor');
      if (!content) missingFields.push('content');
      if (!duration) missingFields.push('duration');
      if (!courseType) missingFields.push('courseType');
      if (!courseSegment) missingFields.push('courseSegment');
      console.log('❌ Missing fields:', missingFields);
      
      return res.status(400).json({ 
        message: 'Please provide all required fields (title, description, instructor, content, duration, courseType, courseSegment)',
        missingFields
      });
    }
    
    // Validate course type specific fields
    if (courseType === 'academic' && !department) {
      console.log('❌ Missing department for academic course');
      return res.status(400).json({ message: 'Department is required for academic courses' });
    }
    
    if (courseType === 'co-curricular' && !activityType) {
      console.log('❌ Missing activity type for co-curricular course');
      return res.status(400).json({ message: 'Activity type is required for co-curricular courses' });
    }
    
    // Validate course segment specific fields
    if (courseSegment === 'video') {
      const hasVideoSource = 
        videoUrl || 
        youtubeVideoUrl || 
        youtubePlaylistUrl || 
        driveVideoUrl;
      
      if (!hasVideoSource) {
        console.log('❌ Missing video source for video course');
        return res.status(400).json({ 
          message: 'For video courses, please provide at least one video source (videoUrl, youtubeVideoUrl, youtubePlaylistUrl or driveVideoUrl)' 
        });
      }
    }
    
    if (courseSegment === 'theory' && !theoryUrl && (!theoryLinks || theoryLinks.length === 0)) {
      console.log('❌ Missing theory URL or links for theory course');
      return res.status(400).json({ 
        message: 'For theory courses, please provide either a theory URL or at least one theory link' 
      });
    }
    
    if (courseSegment === 'hybrid') {
      // Hybrid courses need at least one video source or one theory source
      const hasVideoSource = videoUrl || youtubeVideoUrl || driveVideoUrl;
      const hasTheorySource = theoryUrl || (theoryLinks && theoryLinks.length > 0);
      
      if (!hasVideoSource && !hasTheorySource) {
        console.log('❌ Missing sources for hybrid course');
        return res.status(400).json({ 
          message: 'For hybrid courses, please provide at least one video source or one theory source' 
        });
      }
    }
    
    // Create new course
    console.log('📝 Creating new course...');
    
    const courseData = {
      title,
      description,
      instructor,
      content,
      duration,
      skillLevel: skillLevel || 'beginner',
      courseType,
      courseSegment,
      videoUrl,
      youtubeVideoUrl,
      youtubePlaylistUrl,
      driveVideoUrl,
      theoryUrl,
      theoryLinks: theoryLinks || [],
      department,
      activityType,
      university,
      thumbnail,
      tags: tags || [],
      prerequisites: prerequisites || [],
      createdBy: req.user.userId,
    };
    
    console.log('📝 Course data to save:', JSON.stringify(courseData, null, 2));
    
    const newCourse = new Course(courseData);
    
    console.log('💾 Saving course to database...');
    await newCourse.save();
    console.log('✅ Course saved successfully');
    
    res.status(201).json({
      message: 'Course created successfully',
      course: newCourse
    });
  } catch (error) {
    console.error('❌❌❌ Error creating course:', error);
    
    // Send more detailed error information
    if (error.name === 'ValidationError') {
      console.error('❌ Validation error:', error.message);
      const errors = Object.values(error.errors).map(err => err.message);
      console.error('❌ Validation errors:', errors);
      return res.status(400).json({ 
        message: 'Validation error', 
        errors,
        details: error.message
      });
    }
    
    if (error.name === 'TypeError') {
      console.error('❌ Type error:', error.message);
      return res.status(400).json({ 
        message: 'Type error', 
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

// Batch import courses from CSV/Excel file
export const batchImportCourses = async (req, res) => {
  try {
    console.log('🔄 Batch import request received');
    
    // Check if file was uploaded
    if (!req.file) {
      console.log('❌ No file uploaded for batch import');
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const fileType = req.file.mimetype;
    
    console.log('📋 File uploaded:', {
      path: filePath,
      type: fileType,
      originalName: req.file.originalname,
      size: req.file.size
    });
    
    // Create a unique batch ID
    const batchId = `batch-${Date.now()}`;
    
    // Respond immediately to prevent timeout
    res.status(200).json({
      message: 'CSV file uploaded successfully. Processing will begin shortly.',
      batchId,
      fileInfo: {
        originalName: req.file.originalname,
        filename: req.file.filename,
        size: req.file.size,
        path: req.file.path
      }
    });
    
    // Process CSV file asynchronously
    try {
      const results = [];
      
      // Create a readable stream from the CSV file
      const parser = fs.createReadStream(filePath)
        .pipe(parse({
          columns: true,
          trim: true,
          skip_empty_lines: true,
          cast: true
        }));
      
      console.log('📊 Starting to process CSV data...');
      
      // Process each row in the CSV
      for await (const row of parser) {
        try {
          console.log('Processing row:', row);
          
          // Process the CSV row data
          // Convert tags and prerequisites from semicolon-separated strings to arrays
          if (row.tags) {
            row.tags = row.tags.split(';').map(tag => tag.trim()).filter(Boolean);
          } else {
            row.tags = [];
          }
          
          if (row.prerequisites) {
            row.prerequisites = row.prerequisites.split(';').map(prereq => prereq.trim()).filter(Boolean);
          } else {
            row.prerequisites = [];
          }
          
          // Add metadata
          const courseData = {
            ...row,
            createdBy: req.user.userId,
            importedBatch: batchId,
            importedAt: new Date()
          };
          
          // Validate required fields
          const requiredFields = ['title', 'description', 'instructor', 'content', 'duration', 'courseType', 'courseSegment'];
          const missingFields = requiredFields.filter(field => !courseData[field]);
          
          if (missingFields.length > 0) {
            throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
          }
          
          // Validate course type specific fields
          if (courseData.courseType === 'academic' && !courseData.department) {
            throw new Error('Department is required for academic courses');
          }
          
          if (courseData.courseType === 'co-curricular' && !courseData.activityType) {
            throw new Error('Activity type is required for co-curricular courses');
          }
          
          // Create and save the course
          const newCourse = new Course(courseData);
          await newCourse.save();
          console.log(`✅ Imported course: ${courseData.title}`);
          
          results.push({
            title: courseData.title,
            status: 'success'
          });
        } catch (courseError) {
          console.error(`❌ Error importing course: ${row.title || 'unknown'}`, courseError);
          results.push({
            title: row.title || 'unknown',
            status: 'error',
            error: courseError.message
          });
        }
      }
      
      console.log(`✅ Batch import ${batchId} completed. Total: ${results.length} courses`);
      
    } catch (processingError) {
      console.error(`❌ Error processing batch ${batchId}:`, processingError);
    }
    
  } catch (error) {
    console.error('❌ Error importing courses:', error);
    res.status(500).json({ 
      message: 'Server error during import', 
      error: error.message 
    });
  }
};

// Get CSV template for batch import
export const getCSVTemplate = async (req, res) => {
  try {
    console.log('CSV template requested - IP:', req.ip);
    
    // Generate a comprehensive CSV template with all possible fields and examples
    const csvTemplate = 
`title,description,instructor,content,duration,skillLevel,courseType,courseSegment,videoUrl,youtubeVideoUrl,youtubePlaylistUrl,driveVideoUrl,theoryUrl,department,activityType,university,tags,prerequisites
Example Academic Course,This is an example academic course description,Prof. John Doe,"Course content overview including syllabus, objectives, and outcomes",4 weeks,beginner,academic,video,,https://youtube.com/watch?v=example,,,,"CSE",,Example University,"programming;web development;javascript","basic programming;html"
Example With YouTube Playlist,Complete course with multiple videos,Jane Smith,"Professional training content with modules and exercises",2 months,intermediate,academic,video,,,https://youtube.com/playlist?list=example,,,"EEE",,Example University,"engineering;electronics;circuits","mathematics;physics"
Example Professional Course,Professional course for career advancement,Dr. Robert James,"Professional training content with modules and exercises",6 weeks,advanced,professional,hybrid,https://example.com/professional-video,,,,https://example.com/docs,,,Example Corp,"career;professional development;training","work experience"
Example Co-Curricular Course,Arts and crafts co-curricular activity,Art Instructor,"Activity details including materials and schedule",6 sessions,beginner,co-curricular,theory,,,,,"https://example.com/art-materials",,SPORTS,Example College,"arts;crafts;creativity",
Example With Google Drive,Video course hosted on Google Drive,Tech Instructor,"Technical course covering programming concepts",10 weeks,intermediate,academic,video,,,https://drive.google.com/file/d/example,,"AI_DS",,Tech University,"programming;AI;machine learning","coding basics"
,,,,,,,,,,,,,,,,,,`;
    
    // Set headers for file download
    res.set({
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="course-import-template.csv"',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    });
    
    // Send CSV content
    console.log('Sending CSV template to client...');
    res.status(200).send(csvTemplate);
    
  } catch (error) {
    console.error('Error generating CSV template:', error);
    res.status(500).json({ 
      message: 'Server error generating CSV template', 
      error: error.message 
    });
  }
};

// Upload course materials (videos, documents, etc.)
export const uploadCourseMaterials = async (req, res) => {
  try {
    const courseId = req.params.id;
    
    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const file = req.file;
    const fileUrl = `/uploads/course-videos/${file.filename}`;
    
    // Create file data object
    const fileData = {
      fileName: file.originalname,
      fileUrl,
      fileSize: file.size,
      fileType: file.mimetype,
      uploadDate: new Date()
    };
    
    // Add file to course's video files array
    if (!course.videoFiles) {
      course.videoFiles = [];
    }
    
    course.videoFiles.push(fileData);
    
    // Save course
    await course.save();
    
    res.status(200).json({
      message: 'Course material uploaded successfully',
      file: fileData
    });
    
  } catch (error) {
    console.error('Error uploading course material:', error);
    res.status(500).json({ 
      message: 'Server error during upload', 
      error: error.message 
    });
  }
}; 