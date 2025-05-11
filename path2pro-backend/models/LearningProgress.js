import mongoose from 'mongoose';

const studySessionSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  hoursSpent: {
    type: Number,
    required: true,
    min: 0
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  },
  learningMode: {
    type: String,
    enum: ['video', 'theory', 'practice', 'assessment'],
    default: 'video'
  },
  notes: {
    type: String
  }
});

const courseProgressSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  percentComplete: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  completed: {
    type: Boolean,
    default: false
  },
  lastAccessed: {
    type: Date,
    default: Date.now
  },
  enrollmentDate: {
    type: Date,
    default: Date.now
  },
  assessmentScores: [{
    assessmentId: String,
    score: Number,
    maxScore: Number,
    completedAt: Date
  }],
  completedLessons: [{
    lessonId: String,
    completedAt: Date
  }]
});

const learningProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  totalHoursSpent: {
    type: Number,
    default: 0
  },
  coursesCompleted: {
    type: Number,
    default: 0
  },
  averageScore: {
    type: Number,
    default: 85
  },
  streakDays: {
    type: Number,
    default: 0
  },
  lastActiveDate: {
    type: Date,
    default: Date.now
  },
  skillsGained: [{
    type: String
  }],
  progressHistory: [{
    date: {
      type: Date,
      default: Date.now
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    },
    hoursSpent: {
      type: Number,
      required: true
    },
    learningMode: {
      type: String,
      enum: ['video', 'theory', 'practice', 'assessment'],
      default: 'video'
    },
    notes: String
  }],
  courseProgress: {
    type: Map,
    of: {
      percentComplete: {
        type: Number,
        default: 0
      },
      completed: {
        type: Boolean,
        default: false
      },
      lastUpdated: {
        type: Date,
        default: Date.now
      }
    },
    default: {}
  },
  assessments: [{
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    },
    score: {
      type: Number,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
  courseDistribution: {
    academic: {
      type: Number,
      default: 60
    },
    coCurricular: {
      type: Number,
      default: 40
    },
    video: {
      type: Number,
      default: 70
    },
    theory: {
      type: Number,
      default: 30
    }
  },
  weeklyGoals: {
    studyHours: {
      target: {
        type: Number,
        default: 10
      },
      achieved: {
        type: Number,
        default: 0
      }
    },
    coursesCompleted: {
      target: {
        type: Number,
        default: 1
      },
      achieved: {
        type: Number,
        default: 0
      }
    }
  },
  analyticsConsent: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Update the updatedAt field on save
learningProgressSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const LearningProgress = mongoose.model('LearningProgress', learningProgressSchema);

export default LearningProgress; 