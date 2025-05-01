import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  senderName: {
    type: String,
    required: true
  },
  university: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  attachment: {
    fileName: String,
    fileType: String,
    fileUrl: String,
    fileSize: Number
  },
  isRead: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Index to improve query performance for conversations
messageSchema.index({ sender: 1, receiver: 1 });
messageSchema.index({ university: 1 });

const Message = mongoose.model('Message', messageSchema);

export default Message; 