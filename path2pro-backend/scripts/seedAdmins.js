import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import 'dotenv/config';

// Connect to admin database
const connectAdminDB = async () => {
  try {
    const adminMongoUri = process.env.ADMIN_MONGODB_URI || 'mongodb://127.0.0.1:27017/eduhub-admin';
    console.log('Connecting to Admin MongoDB at:', adminMongoUri);
    
    // Add connection options with shorter timeout
    const adminConnection = await mongoose.createConnection(adminMongoUri, {
      serverSelectionTimeoutMS: 5000, // Reduce the timeout to 5 seconds
      connectTimeoutMS: 5000
    });
    
    console.log("Admin MongoDB Connected Successfully");
    return adminConnection;
  } catch (err) {
    console.error("Admin MongoDB Connection Error:", err.message);
    console.error("Please make sure MongoDB is running. You can start it with:");
    console.error("  - On Windows: Start MongoDB Compass or run 'net start MongoDB'");
    console.error("  - On Linux/Mac: run 'sudo systemctl start mongod'");
    process.exit(1);
  }
};

// Define Admin schema
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

// Seed admin accounts
const seedAdmins = async () => {
  const adminConnection = await connectAdminDB();
  
  // Register Admin model on this connection
  const Admin = adminConnection.model('Admin', adminSchema);
  
  // Check if any admins already exist
  const existingCount = await Admin.countDocuments();
  console.log(`Found ${existingCount} existing admin accounts.`);
  
  if (existingCount > 0) {
    console.log('Admin accounts already exist. To prevent duplicates, please drop the collection first if you want to reseed.');
    await adminConnection.close();
    process.exit(0);
  }
  
  // Define demo admin accounts
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
  
  // Insert admin accounts
  console.log('Creating demo admin accounts...');
  
  for (const admin of demoAdmins) {
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(admin.password, salt);
    
    // Create admin with hashed password
    const adminDoc = new Admin({
      name: admin.name,
      email: admin.email,
      password: hashedPassword,
      permissions: admin.permissions
    });
    
    await adminDoc.save();
    console.log(`Created admin: ${admin.email}`);
  }
  
  console.log('Demo admin accounts created successfully!');
  console.log('Login credentials for all accounts: password = admin123');
  
  // Close connection
  await adminConnection.close();
  console.log('Database connection closed');
};

// Run the seed function
seedAdmins().catch(err => {
  console.error('Error seeding admin accounts:', err);
  process.exit(1);
}); 