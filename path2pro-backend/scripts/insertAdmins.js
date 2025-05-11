import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import 'dotenv/config';

// Admin schema definition
const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  profilePicture: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    default: 'admin'
  },
  permissions: {
    manageUsers: { type: Boolean, default: true },
    manageContent: { type: Boolean, default: true },
    manageCourses: { type: Boolean, default: true },
    manageJobs: { type: Boolean, default: true },
    manageNotices: { type: Boolean, default: true }
  },
  lastLoginAt: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Main function to create admin users
async function createAdmins() {
  try {
    // Connect to MongoDB
    const adminMongoUri = process.env.ADMIN_MONGODB_URI || 'mongodb://127.0.0.1:27017/eduhub-admin';
    console.log(`Connecting to MongoDB at ${adminMongoUri}...`);
    
    const connection = await mongoose.connect(adminMongoUri);
    console.log('Connected to MongoDB successfully');
    
    // Register Admin model
    const Admin = mongoose.model('Admin', adminSchema);
    
    // Demo admin data
    const demoAdmins = [
      {
        name: 'Admin 1',
        email: 'admin1@eduhub.com',
        password: 'admin123',
        permissions: {
          manageUsers: true,
          manageContent: true,
          manageCourses: true,
          manageJobs: true,
          manageNotices: true
        }
      },
      {
        name: 'Admin 2',
        email: 'admin2@eduhub.com',
        password: 'admin123',
        permissions: {
          manageUsers: true,
          manageContent: true,
          manageCourses: true,
          manageJobs: false,
          manageNotices: true
        }
      },
      {
        name: 'Admin 3',
        email: 'admin3@eduhub.com',
        password: 'admin123',
        permissions: {
          manageUsers: true,
          manageContent: true,
          manageCourses: false,
          manageJobs: true,
          manageNotices: false
        }
      },
      {
        name: 'Admin 4',
        email: 'admin4@eduhub.com',
        password: 'admin123',
        permissions: {
          manageUsers: false,
          manageContent: true,
          manageCourses: true,
          manageJobs: true,
          manageNotices: true
        }
      },
      {
        name: 'Admin 5',
        email: 'admin5@eduhub.com',
        password: 'admin123',
        permissions: {
          manageUsers: true,
          manageContent: false,
          manageCourses: true,
          manageJobs: true,
          manageNotices: true
        }
      }
    ];
    
    // Process each admin
    console.log('Creating admin accounts...');
    let createdCount = 0;
    
    for (const admin of demoAdmins) {
      // Check if admin already exists
      const exists = await Admin.findOne({ email: admin.email });
      
      if (exists) {
        console.log(`Admin with email ${admin.email} already exists. Skipping.`);
        continue;
      }
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(admin.password, salt);
      
      // Create new admin
      const newAdmin = new Admin({
        name: admin.name,
        email: admin.email,
        password: hashedPassword,
        permissions: admin.permissions
      });
      
      await newAdmin.save();
      createdCount++;
      console.log(`Created admin account: ${admin.email}`);
    }
    
    console.log(`\nCreated ${createdCount} new admin accounts.`);
    console.log('All admins have password: admin123');
    
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    
  } catch (error) {
    console.error('Error creating admin accounts:', error);
  }
}

// Run the function
createAdmins(); 