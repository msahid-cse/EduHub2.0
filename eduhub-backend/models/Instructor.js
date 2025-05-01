import mongoose from 'mongoose';

const instructorSchema = new mongoose.Schema({
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
  university: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true
  },
  code: {
    type: String,
    trim: true
  },
  roomNo: {
    type: String,
    trim: true
  },
  deskNo: {
    type: String,
    trim: true
  },
  bio: {
    type: String,
    default: ''
  },
  profilePicture: {
    type: String,
    default: ''
  },
  contactInfo: {
    phone: String,
    website: String,
    address: String
  },
  specializations: [{
    type: String
  }],
  courses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const Instructor = mongoose.model('Instructor', instructorSchema);

export default Instructor; 