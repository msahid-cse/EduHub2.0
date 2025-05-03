import mongoose from 'mongoose';

const eventHitSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  },
  referrer: {
    type: String
  },
  action: {
    type: String,
    enum: ['view', 'interest', 'register', 'attend'],
    default: 'view'
  }
});

// Index for efficient queries
eventHitSchema.index({ event: 1, timestamp: -1 });
eventHitSchema.index({ user: 1, event: 1 }, { unique: false });

const EventHit = mongoose.model('EventHit', eventHitSchema);
export default EventHit; 