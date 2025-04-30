import mongoose from 'mongoose';

const noticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['general', 'academic', 'event', 'announcement'],
    default: 'general'
  },
  importance: {
    type: String,
    enum: ['normal', 'important', 'urgent'],
    default: 'normal'
  },
  targetUniversity: {
    type: String,
    required: true
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  attachment: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const Notice = mongoose.model('Notice', noticeSchema);

export default Notice; 