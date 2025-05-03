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
    
    // Get creator ID from request user with fallbacks
    const creatorId = req.user?.userId || req.user?.id || req.user?._id;
    
    // If still no creator ID, return error
    if (!creatorId) {
      console.error('No creator ID found in request:', {
        userObject: req.user,
        headers: req.headers
      });
      return res.status(400).json({ message: 'Creator ID not found in request' });
    }
    
    // Create new instructor
    const instructor = new Instructor({
      name,
      email,
      university,
      department,
      position: position || 'Instructor', // Default if not provided
      bio,
      specializations: specializations || [],
      contactInfo: contactInfo || {},
      createdBy: creatorId
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
    
    // Get creator ID from request user with fallbacks
    const creatorId = req.user?.userId || req.user?.id || req.user?._id;
    
    // If still no creator ID, return error
    if (!creatorId) {
      console.error('No creator ID found in request:', {
        userObject: req.user,
        headers: req.headers
      });
      fs.unlinkSync(filePath);
      return res.status(400).json({ message: 'Creator ID not found in request' });
    }

    // Array to hold instructor data
    const instructors = [];
    const errors = [];
    
    // Process based on file type
    const fileExtension = req.file.originalname.split('.').pop().toLowerCase();
    
    // Debug log
    console.log('Processing file:', req.file.originalname, 'Extension:', fileExtension);
    
    if (fileExtension === 'csv') {
      // Process CSV file
      console.log('Processing CSV file...');
      await new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
          .pipe(csvParser())
          .on('data', (row) => {
            console.log('CSV Row:', row);
            
            // Map column headers based on our template
            const instructorData = {
              name: row['Name'],
              email: row['Email'],
              position: row['Position'] || 'Instructor',
              department: row['Department'] || '',
              code: row['Code'],
              roomNo: row['Room No.'],
              deskNo: row['Desk No.'],
              university,
              createdBy: creatorId,
              contactInfo: {}
            };
            
            // Add contact info if available
            if (row['Website']) instructorData.contactInfo.website = row['Website'];
            if (row['Phone']) instructorData.contactInfo.phone = row['Phone'];
            
            // Add bio if available
            if (row['Bio']) instructorData.bio = row['Bio'];
            
            // Add specializations if available
            if (row['Specializations']) {
              instructorData.specializations = row['Specializations']
                .split(',')
                .map(spec => spec.trim())
                .filter(spec => spec.length > 0);
            }
            
            // Validate required fields
            if (!instructorData.name || !instructorData.email) {
              errors.push({
                data: row,
                error: 'Name and email are required fields'
              });
            } else {
              instructors.push(instructorData);
            }
          })
          .on('end', resolve)
          .on('error', (err) => {
            console.error('CSV parsing error:', err);
            reject(err);
          });
      });
    } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
      // Process Excel file
      console.log('Processing Excel file...');
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = xlsx.utils.sheet_to_json(worksheet);
      
      console.log('Excel data length:', data.length);
      
      data.forEach(row => {
        console.log('Excel Row:', row);
        
        // Map column headers based on our template
        const instructorData = {
          name: row['Name'],
          email: row['Email'],
          position: row['Position'] || 'Instructor',
          department: row['Department'] || '',
          code: row['Code'],
          roomNo: row['Room No.'],
          deskNo: row['Desk No.'],
          university,
          createdBy: creatorId,
          contactInfo: {}
        };
        
        // Add contact info if available
        if (row['Website']) instructorData.contactInfo.website = row['Website'];
        if (row['Phone']) instructorData.contactInfo.phone = row['Phone'];
        
        // Add bio if available
        if (row['Bio']) instructorData.bio = row['Bio'];
        
        // Add specializations if available
        if (row['Specializations']) {
          instructorData.specializations = row['Specializations']
            .split(',')
            .map(spec => spec.trim())
            .filter(spec => spec.length > 0);
        }
        
        // Validate required fields
        if (!instructorData.name || !instructorData.email) {
          errors.push({
            data: row,
            error: 'Name and email are required fields'
          });
        } else {
          instructors.push(instructorData);
        }
      });
    } else {
      // Unsupported file type
      fs.unlinkSync(filePath);
      return res.status(400).json({ 
        message: 'Unsupported file type. Please upload a CSV or Excel file.' 
      });
    }
    
    // Clean up the uploaded file as we've read its data
    fs.unlinkSync(filePath);
    
    // Validation and save
    if (instructors.length === 0) {
      return res.status(400).json({ 
        message: 'No valid instructor data found in the file',
        errors: errors
      });
    }
    
    console.log(`Found ${instructors.length} instructors to import`);
    
    // Save instructors to database
    const savedInstructors = [];
    const errorInstructors = [];
    
    for (const instructor of instructors) {
      try {
        console.log('Processing instructor:', instructor.name, instructor.email);
        
        // Check if email already exists
        const existingInstructor = await Instructor.findOne({ 
          email: instructor.email,
          university: instructor.university
        });
        
        if (existingInstructor) {
          console.log('Instructor already exists:', instructor.email);
          errorInstructors.push({
            ...instructor,
            error: 'Instructor with this email and university already exists'
          });
          continue;
        }
        
        const newInstructor = new Instructor(instructor);
        const savedInstructor = await newInstructor.save();
        savedInstructors.push(savedInstructor);
        console.log('Instructor saved successfully:', savedInstructor._id);
      } catch (error) {
        console.error('Error saving instructor:', error.message);
        errorInstructors.push({
          ...instructor,
          error: error.message
        });
      }
    }
    
    console.log(`Import complete: ${savedInstructors.length} successful, ${errorInstructors.length} failed`);
    
    res.status(201).json({
      message: `Successfully added ${savedInstructors.length} instructor(s)`,
      total: instructors.length,
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
    
    // Get creator ID from request user with fallbacks
    const creatorId = req.user?.userId || req.user?.id || req.user?._id;
    
    // If still no creator ID, return error
    if (!creatorId) {
      console.error('No creator ID found in request:', {
        userObject: req.user,
        headers: req.headers
      });
      return res.status(400).json({ message: 'Creator ID not found in request' });
    }
    
    // Save instructors to database
    const savedInstructors = [];
    const errorInstructors = [];
    
    for (const instructor of instructors) {
      try {
        // Add university to each instructor
        instructor.university = university;
        instructor.createdBy = creatorId;
        
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

// Generate and download CSV template for instructors
export const getCSVTemplate = async (req, res) => {
  try {
    // Define the CSV header row
    const header = 'Name,Email,Position,Department,Code,Room No.,Desk No.,Website,Phone,Bio,Specializations\n';
    
    // Define a sample data row for reference
    const sampleRow = 'John Doe,john.doe@example.com,Professor,Computer Science,CS101,A-123,D-45,https://example.com,+1234567890,"Professor with 10 years of experience","Machine Learning,Artificial Intelligence"\n';
    
    // Add another example
    const sampleRow2 = 'Jane Smith,jane.smith@university.edu,Associate Professor,Physics,PHY202,B-456,D-78,https://janesmith.edu,+9876543210,"Physics researcher with expertise in quantum mechanics","Quantum Physics,Theoretical Physics"\n';
    
    // Combine header and sample rows
    const csvContent = header + sampleRow + sampleRow2;
    
    // Set response headers for file download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=instructor-template.csv');
    
    // Send the CSV content
    res.status(200).send(csvContent);
  } catch (error) {
    console.error('Error generating CSV template:', error);
    res.status(500).json({ message: 'Server error while generating CSV template' });
  }
}; 