import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  instructor: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String,
    default: ''
  },
  content: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  skillLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  courseType: {
    type: String,
    enum: ['academic', 'professional', 'co-curricular'],
    required: true
  },
  courseSegment: {
    type: String,
    enum: ['video', 'theory', 'hybrid'],
    required: true
  },
  // Video related fields
  videoUrl: {
    type: String,
    default: ''
  },
  youtubeVideoUrl: {
    type: String,
    default: ''
  },
  youtubePlaylistUrl: {
    type: String,
    default: ''
  },
  driveVideoUrl: {
    type: String,
    default: ''
  },
  videoFiles: [{
    fileName: String,
    fileUrl: String,
    fileSize: Number,
    fileType: String,
    uploadDate: {
      type: Date,
      default: Date.now
    }
  }],
  // Theory related fields
  theoryUrl: {
    type: String,
    required: function() { return this.courseSegment === 'theory'; }
  },
  theoryLinks: [{
    title: String,
    url: String,
    description: String
  }],
  // Department/Activity info
  department: {
    type: String,
    required: function() { return this.courseType === 'academic'; }
  },
  activityType: {
    type: String,
    required: function() { return this.courseType === 'co-curricular'; }
  },
  university: {
    type: String,
    default: ''
  },
  tags: [{
    type: String
  }],
  // Tracking fields
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  enrolledStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  // Import tracking
  importedBatch: {
    type: String,
    default: ''
  },
  importedAt: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const Course = mongoose.model('Course', courseSchema);

export default Course; 