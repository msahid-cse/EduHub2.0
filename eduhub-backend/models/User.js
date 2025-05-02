import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
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
  password: {
    type: String,
    required: function() {
      // Password is required unless user signed up with OAuth
      return !this.googleId && !this.githubId;
    }
  },
  googleId: {
    type: String,
    default: null
  },
  githubId: {
    type: String,
    default: null
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  profilePicture: {
    type: String,
    default: ''
  },
  phoneNumber: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: ''
  },
  cvPath: {
    type: String,
    default: ''
  },
  university: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  skills: [{
    type: String
  }],
  skillsMap: {
    type: Map,
    of: {
      proficiency: {
        type: Number,
        min: 0,
        max: 100,
        default: 50
      },
      lastUpdated: {
        type: Date,
        default: Date.now
      }
    },
    default: {}
  },
  github: {
    type: String,
    default: ''
  },
  codeforces: {
    type: String,
    default: ''
  },
  linkedin: {
    type: String,
    default: ''
  },
  twitter: {
    type: String,
    default: ''
  },
  courses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  jobsApplied: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job'
  }],
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  verificationCode: {
    type: String,
    default: null
  },
  verificationCodeExpires: {
    type: Date,
    default: null
  },
  passwordResetToken: {
    type: String,
    default: null
  },
  passwordResetExpires: {
    type: Date,
    default: null
  },
  lastLoginAt: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Update a skill's proficiency
userSchema.methods.updateSkillProficiency = function(skillName, proficiency) {
  if (!this.skillsMap) {
    this.skillsMap = new Map();
  }
  
  // Add skill to skills array if not already present
  if (!this.skills.includes(skillName)) {
    this.skills.push(skillName);
  }
  
  // Update skill proficiency in the skillsMap
  this.skillsMap.set(skillName, {
    proficiency: Math.min(Math.max(proficiency, 0), 100), // Ensure between 0 and 100
    lastUpdated: new Date()
  });
};

const User = mongoose.model('User', userSchema);

export default User; 