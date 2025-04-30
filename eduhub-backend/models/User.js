import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
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
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  profilePicture: {
    type: String,
    default: ''
  },
  cvPath: {
    type: String,
    default: ''
  },
  university: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  skills: [{
    type: String
  }],
  courses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  jobsApplied: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job'
  }],
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  verificationCode: {
    type: String,
    default: null
  },
  verificationCodeExpires: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User; 