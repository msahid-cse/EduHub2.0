import mongoose from 'mongoose';

const userJobApplicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  applicantEmail: {
    type: String,
    required: true
  },
  cvPath: {
    type: String,
    required: true
  },
  coverLetter: {
    type: String,
    default: ''
  },
  coverLetterPdfPath: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'reviewing', 'accepted', 'rejected'],
    default: 'pending'
  },
  adminFeedback: {
    type: String,
    default: ''
  },
  appliedAt: {
    type: Date,
    default: Date.now
  },
  // Reference to the original job application in the admin collection
  originalApplication: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobApplication',
    required: true
  }
}, { timestamps: true });

// Creating a compound index to ensure a user can only apply once to a job
userJobApplicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

const UserJobApplication = mongoose.model('UserJobApplication', userJobApplicationSchema);

export default UserJobApplication; 