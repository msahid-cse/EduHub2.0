import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Department from '../models/Department.js';
import User from '../models/User.js';

// Load environment variables
dotenv.config();

const seedDepartments = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/eduhub';
    console.log('Connecting to MongoDB at:', mongoUri);
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Check if departments already exist
    const departmentCount = await Department.countDocuments();
    if (departmentCount > 0) {
      console.log(`Departments already exist in the database (${departmentCount} found). Skipping seed.`);
      await mongoose.disconnect();
      return;
    }

    // Find admin user for reference (or create one if not found)
    let adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      console.log('No admin user found. Creating one...');
      adminUser = new User({
        name: 'System Admin',
        email: 'admin@eduhub.com',
        password: '$2a$10$XKw0UhuYvEh3VhpAsb5Y5.CQ9YlU7aTAVLSNh1XOl3GJrvBQ.b3hK', // hashed password for 'admin123'
        role: 'admin',
        verified: true
      });
      await adminUser.save();
      console.log('Admin user created');
    }

    // Common academic departments
    const commonDepartments = [
      { name: 'Computer Science and Engineering', code: 'CSE' },
      { name: 'Electrical and Electronic Engineering', code: 'EEE' },
      { name: 'Mechanical Engineering', code: 'ME' },
      { name: 'Civil Engineering', code: 'CE' },
      { name: 'Mathematics', code: 'MATH' },
      { name: 'Physics', code: 'PHY' },
      { name: 'Chemistry', code: 'CHEM' },
      { name: 'Biology', code: 'BIO' },
      { name: 'Business Administration', code: 'BBA' },
      { name: 'Economics', code: 'ECON' },
      { name: 'English', code: 'ENG' },
      { name: 'History', code: 'HIST' },
      { name: 'Philosophy', code: 'PHIL' },
      { name: 'Psychology', code: 'PSYCH' },
      { name: 'Sociology', code: 'SOC' },
      { name: 'Political Science', code: 'POLS' },
      { name: 'Architecture', code: 'ARCH' },
      { name: 'Medical Sciences', code: 'MED' }
    ];

    const departmentsToInsert = commonDepartments.map(dept => ({
      ...dept,
      createdBy: adminUser._id
    }));

    await Department.insertMany(departmentsToInsert);
    console.log(`Successfully seeded ${departmentsToInsert.length} departments`);

    // Disconnect from database
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    
  } catch (error) {
    console.error('Error seeding departments:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDepartments(); 