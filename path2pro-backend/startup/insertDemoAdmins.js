/**
 * MongoDB Shell Script to create demo admin accounts
 * 
 * Instructions to use:
 * 1. Start MongoDB shell: mongosh
 * 2. Connect to the admin database: use eduhub-admin
 * 3. Copy and paste this entire script into the MongoDB shell
 * 
 * This will create 5 demo admin accounts with the password 'admin123'
 */

// Hash function for password (a simple one for direct MongoDB use)
function hashPassword(password) {
  // This is a simplified hash for demo purposes only
  // In production, proper bcrypt hashing should be used
  return `$2b$10$demo_password_hash_${password}`;
}

// Get current timestamp
const now = new Date();

// Define demo admin accounts
const demoAdmins = [
  {
    name: 'Admin 1',
    email: 'admin1@eduhub.com',
    password: hashPassword('admin123'),
    profilePicture: '',
    role: 'admin',
    permissions: {
      manageUsers: true,
      manageContent: true,
      manageCourses: true,
      manageJobs: true,
      manageNotices: true
    },
    lastLoginAt: now,
    createdAt: now,
    updatedAt: now
  },
  {
    name: 'Admin 2',
    email: 'admin2@eduhub.com',
    password: hashPassword('admin123'),
    profilePicture: '',
    role: 'admin',
    permissions: {
      manageUsers: true,
      manageContent: true,
      manageCourses: true,
      manageJobs: false,
      manageNotices: true
    },
    lastLoginAt: now,
    createdAt: now,
    updatedAt: now
  },
  {
    name: 'Admin 3',
    email: 'admin3@eduhub.com',
    password: hashPassword('admin123'),
    profilePicture: '',
    role: 'admin',
    permissions: {
      manageUsers: true,
      manageContent: true,
      manageCourses: false,
      manageJobs: true,
      manageNotices: false
    },
    lastLoginAt: now,
    createdAt: now,
    updatedAt: now
  },
  {
    name: 'Admin 4',
    email: 'admin4@eduhub.com',
    password: hashPassword('admin123'),
    profilePicture: '',
    role: 'admin',
    permissions: {
      manageUsers: false,
      manageContent: true,
      manageCourses: true,
      manageJobs: true,
      manageNotices: true
    },
    lastLoginAt: now,
    createdAt: now,
    updatedAt: now
  },
  {
    name: 'Admin 5',
    email: 'admin5@eduhub.com',
    password: hashPassword('admin123'),
    profilePicture: '',
    role: 'admin',
    permissions: {
      manageUsers: true,
      manageContent: false,
      manageCourses: true,
      manageJobs: true,
      manageNotices: true
    },
    lastLoginAt: now,
    createdAt: now,
    updatedAt: now
  }
];

// First, check if any of these admins already exist
for (const admin of demoAdmins) {
  const existingAdmin = db.admins.findOne({ email: admin.email });
  if (!existingAdmin) {
    // Insert admin if it doesn't exist
    db.admins.insertOne(admin);
    print(`Created demo admin: ${admin.email}`);
  } else {
    print(`Admin with email ${admin.email} already exists. Skipping.`);
  }
}

print('Script completed. Check above for results.'); 