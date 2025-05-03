import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

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

// Password comparison method
adminSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Use the global adminDb connection if available, otherwise use the default connection
const Admin = (global.adminDb || mongoose).model('Admin', adminSchema);

export default Admin; 