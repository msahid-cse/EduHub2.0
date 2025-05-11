import mongoose from 'mongoose';

const partnerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['university', 'industry'],
    default: 'university'
  },
  description: {
    type: String,
    trim: true
  },
  logoUrl: {
    type: String,
    required: true
  },
  websiteUrl: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  ranking: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  contactInfo: {
    name: { type: String, trim: true },
    email: { type: String, trim: true },
    phone: { type: String, trim: true }
  }
}, {
  timestamps: true
});

partnerSchema.index({ name: 1, type: 1 }, { unique: true });

const Partner = mongoose.model('Partner', partnerSchema);

export default Partner; 