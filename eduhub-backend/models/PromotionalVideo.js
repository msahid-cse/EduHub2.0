import mongoose from 'mongoose';

const promotionalVideoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    videoUrl: {
      type: String,
      required: [true, 'Video URL is required'],
    },
    videoType: {
      type: String,
      enum: ['youtube', 'drive', 'upload'],
      required: [true, 'Video type is required'],
    },
    thumbnailUrl: {
      type: String,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
  },
  { timestamps: true }
);

// Only one promotional video should be active at a time
promotionalVideoSchema.pre('save', async function (next) {
  if (this.isActive) {
    // Set all other videos to inactive
    await this.constructor.updateMany(
      { _id: { $ne: this._id } },
      { isActive: false }
    );
  }
  next();
});

const PromotionalVideo = mongoose.model('PromotionalVideo', promotionalVideoSchema);

export default PromotionalVideo; 