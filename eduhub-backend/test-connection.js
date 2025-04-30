import mongoose from 'mongoose';
import 'dotenv/config';

console.log('Testing MongoDB connection...');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('MONGODB_URI:', process.env.MONGODB_URI || 'Not set, using default');

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/eduhub';

mongoose.connect(mongoUri)
  .then(() => {
    console.log("✅ MongoDB connection successful");
    
    // Test database by creating a temporary collection
    const testSchema = new mongoose.Schema({
      name: String,
      timestamp: { type: Date, default: Date.now }
    });
    
    const TestModel = mongoose.model('TestConnection', testSchema);
    
    return TestModel.create({ name: 'connection_test' });
  })
  .then((doc) => {
    console.log("✅ Test document created successfully:", doc._id);
    console.log("✅ Database is working properly");
    
    // Clean up test document
    return mongoose.connection.collections.testconnections.drop();
  })
  .then(() => {
    console.log("✅ Test cleanup successful");
    process.exit(0);
  })
  .catch(err => {
    console.error("❌ MongoDB Connection Error:", err.message);
    console.error("Please check your MongoDB installation or connection string");
    process.exit(1);
  }); 