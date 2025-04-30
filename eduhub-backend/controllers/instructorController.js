import Instructor from '../models/Instructor.js';
import User from '../models/User.js';

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