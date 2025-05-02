import mongoose from 'mongoose';
import 'dotenv/config';
import Course from './eduhub-backend/models/Course.js';

console.log('Testing Course creation functionality...');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('MONGODB_URI:', process.env.MONGODB_URI || 'Not set, using default');

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/eduhub';

// Connect to MongoDB
mongoose.connect(mongoUri)
  .then(async () => {
    console.log("✅ MongoDB connection successful");
    
    // Create a test course
    const testCourse = new Course({
      title: "Test Course",
      description: "This is a test course created for testing purposes",
      instructor: new mongoose.Types.ObjectId(), // Generated dummy ID for testing
      price: 19.99,
      duration: "4 weeks",
      level: "Beginner",
      tags: ["test", "development"],
      thumbnail: "https://example.com/test-thumbnail.jpg",
      isPublished: true,
      modules: [
        {
          title: "Module 1: Introduction",
          content: "Introduction content here",
          resources: ["resource1.pdf", "resource2.pdf"],
          quizzes: []
        }
      ]
    });
    
    // Save the test course
    try {
      const savedCourse = await testCourse.save();
      console.log("✅ Test course created successfully:", savedCourse._id);
      console.log("✅ Course details:", JSON.stringify(savedCourse, null, 2));
      
      // Clean up test course
      await Course.findByIdAndDelete(savedCourse._id);
      console.log("✅ Test cleanup successful");
    } catch (error) {
      console.error("❌ Error creating test course:", error.message);
    } finally {
      mongoose.connection.close();
      console.log("MongoDB connection closed");
    }
  })
  .catch(err => {
    console.error("❌ MongoDB Connection Error:", err.message);
    console.error("Please check your MongoDB installation or connection string");
    process.exit(1);
  }); 