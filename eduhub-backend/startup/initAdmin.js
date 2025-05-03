import Admin from '../models/Admin.js';
import bcrypt from 'bcrypt';

export const initializeAdmin = async () => {
  try {
    console.log('Checking for initial admin account...');
    
    // Check if any admin exists
    const adminCount = await Admin.countDocuments();
    
    if (adminCount === 0) {
      console.log('No admin accounts found. Creating default admin accounts...');
      
      // Create default admin
      const defaultAdmin = {
        name: 'System Administrator',
        email: 'admin@eduhub.com',
        password: 'admin123', // This should be changed immediately after first login
        permissions: {
          manageUsers: true,
          manageContent: true,
          manageCourses: true,
          manageJobs: true,
          manageNotices: true
        }
      };
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(defaultAdmin.password, salt);
      
      // Create admin
      const admin = new Admin({
        name: defaultAdmin.name,
        email: defaultAdmin.email,
        password: hashedPassword,
        permissions: defaultAdmin.permissions
      });
      
      await admin.save();
      
      console.log('Default admin account created successfully.');
      console.log('Email: admin@eduhub.com');
      console.log('Password: admin123');
      console.log('IMPORTANT: Please change this password after first login!');

      // Create demo admin accounts
      console.log('Creating demo admin accounts...');
      
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
      
      // Insert demo admin accounts
      for (const demoAdmin of demoAdmins) {
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(demoAdmin.password, salt);
        
        // Create admin
        const adminAccount = new Admin({
          name: demoAdmin.name,
          email: demoAdmin.email,
          password: hashedPassword,
          permissions: demoAdmin.permissions
        });
        
        await adminAccount.save();
        console.log(`Demo admin created: ${demoAdmin.email}`);
      }
      
      console.log('All demo admin accounts created successfully.');
      console.log('All accounts have password: admin123');
    } else {
      console.log(`Found ${adminCount} existing admin accounts. Skipping initialization.`);
    }
  } catch (error) {
    console.error('Error initializing admin accounts:', error);
  }
};

// Function to create demo admin accounts
export const createDemoAdmins = async () => {
  try {
    console.log('Creating demo admin accounts...');
    
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
    for (const admin of demoAdmins) {
      // Check if this admin already exists
      const existingAdmin = await Admin.findOne({ email: admin.email });
      if (existingAdmin) {
        console.log(`Admin with email ${admin.email} already exists. Skipping.`);
        continue;
      }
      
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
      console.log(`Created demo admin: ${admin.email}`);
    }
    
    console.log('Demo admin accounts created successfully!');
    console.log('Login credentials for all accounts: password = admin123');
  } catch (error) {
    console.error('Error creating demo admin accounts:', error);
  }
}; 