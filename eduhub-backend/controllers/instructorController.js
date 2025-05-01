import Instructor from '../models/Instructor.js';
import User from '../models/User.js';
import xlsx from 'xlsx';
import fs from 'fs';
import csvParser from 'csv-parser';

// Get all instructors
export const getAllInstructors = async (req, res) => {
  try {
    // Filter by university if provided
    const { university } = req.query;
    const filter = university ? { university } : {};
    
    const instructors = await Instructor.find(filter).sort({ createdAt: -1 });
    res.status(200).json(instructors);
  } catch (error) {
    console.error('Error fetching instructors:', error);
    res.status(500).json({ message: 'Server error while fetching instructors' });
  }
};

// Get instructor by ID
export const getInstructorById = async (req, res) => {
  try {
    const instructor = await Instructor.findById(req.params.id).populate('courses');
    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found' });
    }
    res.status(200).json(instructor);
  } catch (error) {
    console.error('Error fetching instructor:', error);
    res.status(500).json({ message: 'Server error while fetching instructor' });
  }
};

// Create a new instructor
export const createInstructor = async (req, res) => {
  try {
    const { name, email, university, department, position, bio, specializations, contactInfo } = req.body;
    
    // Check if instructor already exists
    const existingInstructor = await Instructor.findOne({ email });
    if (existingInstructor) {
      return res.status(400).json({ message: 'Instructor with this email already exists' });
    }
    
    // Create new instructor
    const instructor = new Instructor({
      name,
      email,
      university,
      department,
      position,
      bio,
      specializations: specializations || [],
      contactInfo: contactInfo || {},
      createdBy: req.user.userId
    });
    
    // Add profile picture if uploaded
    if (req.file) {
      instructor.profilePicture = req.file.path;
    }
    
    await instructor.save();
    res.status(201).json({ message: 'Instructor created successfully', instructor });
  } catch (error) {
    console.error('Error creating instructor:', error);
    res.status(500).json({ message: 'Server error while creating instructor' });
  }
};

// Update an instructor
export const updateInstructor = async (req, res) => {
  try {
    const { name, email, university, department, position, bio, specializations, contactInfo } = req.body;
    
    // Find instructor
    const instructor = await Instructor.findById(req.params.id);
    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found' });
    }
    
    // Update fields
    instructor.name = name || instructor.name;
    instructor.email = email || instructor.email;
    instructor.university = university || instructor.university;
    instructor.department = department || instructor.department;
    instructor.position = position || instructor.position;
    instructor.bio = bio || instructor.bio;
    instructor.specializations = specializations || instructor.specializations;
    instructor.contactInfo = contactInfo || instructor.contactInfo;
    
    // Update profile picture if uploaded
    if (req.file) {
      instructor.profilePicture = req.file.path;
    }
    
    await instructor.save();
    res.status(200).json({ message: 'Instructor updated successfully', instructor });
  } catch (error) {
    console.error('Error updating instructor:', error);
    res.status(500).json({ message: 'Server error while updating instructor' });
  }
};

// Delete an instructor
export const deleteInstructor = async (req, res) => {
  try {
    const instructor = await Instructor.findById(req.params.id);
    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found' });
    }
    
    await instructor.deleteOne();
    res.status(200).json({ message: 'Instructor deleted successfully' });
  } catch (error) {
    console.error('Error deleting instructor:', error);
    res.status(500).json({ message: 'Server error while deleting instructor' });
  }
};

// Upload and process instructor data from Excel/CSV files
export const uploadInstructorData = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const { university } = req.body;

    if (!university) {
      // Clean up the uploaded file if university not provided
      fs.unlinkSync(filePath);
      return res.status(400).json({ message: 'University name is required' });
    }

    // Array to hold instructor data
    const instructors = [];
    const errors = [];
    
    // Process based on file type
    const fileExtension = req.file.originalname.split('.').pop().toLowerCase();
    
    if (fileExtension === 'csv') {
      // Process CSV file
      await new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
          .pipe(csvParser())
          .on('data', (row) => {
            instructors.push({
              name: row['Name'],
              position: row['Designation'],
              code: row['Code'],
              roomNo: row['Room No.'],
              deskNo: row['Desk No.'],
              email: row['E-mail ID'],
              university,
              department: row['Department'] || '',
              createdBy: req.user.userId
            });
          })
          .on('end', resolve)
          .on('error', reject);
      });
    } else {
      // Process Excel file
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = xlsx.utils.sheet_to_json(worksheet);
      
      data.forEach(row => {
        instructors.push({
          name: row['Name'],
          position: row['Designation'],
          code: row['Code'],
          roomNo: row['Room No.'],
          deskNo: row['Desk No.'],
          email: row['E-mail ID'],
          university,
          department: row['Department'] || '',
          createdBy: req.user.userId
        });
      });
    }
    
    // Clean up the uploaded file as we've read its data
    fs.unlinkSync(filePath);
    
    // Validation and save
    if (instructors.length === 0) {
      return res.status(400).json({ message: 'No valid instructor data found in the file' });
    }
    
    // Save instructors to database
    const savedInstructors = [];
    const errorInstructors = [];
    
    for (const instructor of instructors) {
      try {
        // Check if email and university combination already exists
        const existingInstructor = await Instructor.findOne({ 
          email: instructor.email,
          university: instructor.university
        });
        
        if (existingInstructor) {
          errorInstructors.push({
            ...instructor,
            error: 'Instructor with this email and university already exists'
          });
          continue;
        }
        
        const newInstructor = new Instructor(instructor);
        const savedInstructor = await newInstructor.save();
        savedInstructors.push(savedInstructor);
      } catch (error) {
        errorInstructors.push({
          ...instructor,
          error: error.message
        });
      }
    }
    
    res.status(201).json({
      message: `Successfully added ${savedInstructors.length} instructor(s)`,
      success: savedInstructors.length,
      failed: errorInstructors.length,
      savedInstructors,
      errors: errorInstructors
    });
    
  } catch (error) {
    console.error('Error uploading instructor data:', error);
    res.status(500).json({ message: 'Server error processing instructor data' });
  }
};

// Process manually entered instructor data
export const addInstructorsManually = async (req, res) => {
  try {
    const { instructors, university } = req.body;
    
    if (!university) {
      return res.status(400).json({ message: 'University name is required' });
    }
    
    if (!instructors || !Array.isArray(instructors) || instructors.length === 0) {
      return res.status(400).json({ message: 'No instructor data provided' });
    }
    
    // Save instructors to database
    const savedInstructors = [];
    const errorInstructors = [];
    
    for (const instructor of instructors) {
      try {
        // Add university to each instructor
        instructor.university = university;
        instructor.createdBy = req.user.userId;
        
        // Check if email and university combination already exists
        const existingInstructor = await Instructor.findOne({ 
          email: instructor.email,
          university
        });
        
        if (existingInstructor) {
          errorInstructors.push({
            ...instructor,
            error: 'Instructor with this email and university already exists'
          });
          continue;
        }
        
        const newInstructor = new Instructor(instructor);
        const savedInstructor = await newInstructor.save();
        savedInstructors.push(savedInstructor);
      } catch (error) {
        errorInstructors.push({
          ...instructor,
          error: error.message
        });
      }
    }
    
    res.status(201).json({
      message: `Successfully added ${savedInstructors.length} instructor(s)`,
      success: savedInstructors.length,
      failed: errorInstructors.length,
      savedInstructors,
      errors: errorInstructors
    });
    
  } catch (error) {
    console.error('Error adding instructors manually:', error);
    res.status(500).json({ message: 'Server error processing instructor data' });
  }
}; 