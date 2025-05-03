import mongoose from 'mongoose';
import 'dotenv/config';
import { createDemoAdmins } from '../startup/initAdmin.js';

// Connect to admin database
const connectAdminDB = async () => {
  try {
    const adminMongoUri = process.env.ADMIN_MONGODB_URI || 'mongodb://127.0.0.1:27017/eduhub-admin';
    console.log('Attempting to connect to Admin MongoDB at:', adminMongoUri);
    
    // Create a separate connection for admin database
    const adminConnection = mongoose.createConnection(adminMongoUri);
    
    adminConnection.on('connected', () => {
      console.log("Admin MongoDB Connected Successfully");
    });
    
    adminConnection.on('error', (err) => {
      console.error("Admin MongoDB Connection Error:", err.message);
    });
    
    // Set global adminDb connection to be used by Admin model
    global.adminDb = adminConnection;
    
    return adminConnection;
  } catch (err) {
    console.error("Admin MongoDB Connection Error:", err.message);
    process.exit(1);
  }
};

// Run the script
const run = async () => {
  try {
    // Connect to admin database
    await connectAdminDB();
    
    // Create demo admin accounts
    await createDemoAdmins();
    
    console.log('Script completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error running script:', error);
    process.exit(1);
  }
};

run(); 