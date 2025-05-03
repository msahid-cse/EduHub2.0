import mongoose from 'mongoose';
import Course from './models/Course.js';
import User from './models/User.js';
import Job from './models/Job.js';
import Instructor from './models/Instructor.js';
import Partner from './models/Partner.js';
import 'dotenv/config';

// Test function to get platform stats
const getPlatformStats = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/eduhub';
    console.log('Connecting to MongoDB at:', mongoUri);
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Execute all count queries
    const [
      coursesCount,
      instructorsCount,
      studentsCount,
      jobsCount,
      universitiesCount,
      industryCount
    ] = await Promise.all([
      Course.countDocuments(),
      Instructor.countDocuments(),
      User.countDocuments({ role: 'user' }),
      Job.countDocuments({ isActive: true }),
      Partner.countDocuments({ type: 'university', isActive: true }),
      Partner.countDocuments({ type: 'industry', isActive: true })
    ]);

    // Log the stats
    console.log('Platform Statistics:');
    console.log('-----------------');
    console.log(`Courses: ${coursesCount}`);
    console.log(`Instructors: ${instructorsCount}`);
    console.log(`Students: ${studentsCount}`);
    console.log(`Jobs: ${jobsCount}`);
    console.log(`University Partners: ${universitiesCount}`);
    console.log(`Industry Partners: ${industryCount}`);

    // Debugging: Check if Partner model exists and is being used correctly
    const partnerExists = mongoose.modelNames().includes('Partner');
    console.log(`Partner model exists: ${partnerExists ? 'Yes' : 'No'}`);
    
    if (partnerExists) {
      console.log('Partner Model Schema:', Object.keys(Partner.schema.paths));
      
      // List a few partners if any
      const partners = await Partner.find().limit(3);
      console.log('Sample Partners:', partners.map(p => ({ 
        id: p._id, 
        name: p.name, 
        type: p.type,
        isActive: p.isActive
      })));
    }

  } catch (error) {
    console.error('Error getting platform stats:', error);
  } finally {
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the test
getPlatformStats(); 