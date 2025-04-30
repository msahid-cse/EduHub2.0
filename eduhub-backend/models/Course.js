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
    enum: ['academic', 'co-curricular'],
    required: true
  },
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
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  enrolledStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const Course = mongoose.model('Course', courseSchema);

export default Course; 