import LearningProgress from '../models/LearningProgress.js';
import User from '../models/User.js';
import Course from '../models/Course.js';

// Get user learning stats
export const getLearningStats = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Find or create learning progress for this user
    let userLearningProgress = await LearningProgress.findOne({ userId });
    
    if (!userLearningProgress) {
      // Create a new record if none exists
      userLearningProgress = new LearningProgress({ 
        userId,
        totalHoursSpent: 0,
        coursesCompleted: 0,
        streakDays: 0,
        lastActiveDate: new Date(),
        skillsGained: [],
        progressHistory: [],
        courseDistribution: {
          academic: 50,
          coCurricular: 50,
          video: 50,
          theory: 50
        },
        weeklyGoals: {
          studyHours: {
            target: 10,
            achieved: 0
          },
          coursesCompleted: {
            target: 1,
            achieved: 0
          }
        }
      });
      await userLearningProgress.save();
    }
    
    // Calculate average score based on assessments
    const averageScore = userLearningProgress.assessments && userLearningProgress.assessments.length > 0
      ? userLearningProgress.assessments.reduce((sum, assessment) => sum + assessment.score, 0) / userLearningProgress.assessments.length
      : userLearningProgress.averageScore || 85; // Default value if no assessments
    
    // Format the response
    const learningStats = {
      totalHoursSpent: userLearningProgress.totalHoursSpent || 0,
      coursesCompleted: userLearningProgress.coursesCompleted || 0,
      averageScore: Math.round(averageScore),
      streakDays: userLearningProgress.streakDays || 0,
      lastActiveDate: userLearningProgress.lastActiveDate,
      skillsGained: userLearningProgress.skillsGained || [],
      progressHistory: userLearningProgress.progressHistory || [],
      courseDistribution: userLearningProgress.courseDistribution || {
        academic: 60,
        coCurricular: 40,
        video: 70,
        theory: 30
      },
      weeklyGoals: userLearningProgress.weeklyGoals || {
        studyHours: {
          target: 10,
          achieved: 6
        },
        coursesCompleted: {
          target: 2,
          achieved: 1
        }
      }
    };
    
    res.status(200).json(learningStats);
  } catch (error) {
    console.error('Error in getLearningStats:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update course progress data
export const updateCourseProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const courseId = req.params.courseId;
    const { percentComplete, completed } = req.body;
    
    // Find user learning progress
    let userLearningProgress = await LearningProgress.findOne({ userId });
    
    if (!userLearningProgress) {
      // Create a new record if none exists
      userLearningProgress = new LearningProgress({ 
        userId,
        totalHoursSpent: 0,
        coursesCompleted: 0,
        streakDays: 0,
        lastActiveDate: new Date(),
        skillsGained: [],
        progressHistory: [],
        courseProgress: {}
      });
    }
    
    // Update course progress
    if (!userLearningProgress.courseProgress) {
      userLearningProgress.courseProgress = {};
    }
    
    // Update lastActiveDate and streak
    const lastActive = new Date(userLearningProgress.lastActiveDate);
    const today = new Date();
    
    // If last active date is more than 1 day ago and less than 2 days ago, it's a consecutive day
    if (
      today.getDate() !== lastActive.getDate() && 
      today - lastActive < 2 * 24 * 60 * 60 * 1000
    ) {
      userLearningProgress.streakDays += 1;
    } 
    // If last active date is more than 2 days ago, reset streak
    else if (today - lastActive >= 2 * 24 * 60 * 60 * 1000) {
      userLearningProgress.streakDays = 1;
    }
    
    userLearningProgress.lastActiveDate = today;
    
    // Was this course already marked as completed before?
    const wasCompletedBefore = userLearningProgress.courseProgress[courseId]?.completed || false;
    
    // Update the specific course progress
    userLearningProgress.courseProgress[courseId] = {
      ...userLearningProgress.courseProgress[courseId],
      percentComplete: percentComplete || 0,
      completed: completed || false,
      lastUpdated: new Date()
    };
    
    // If course is newly completed, increment the coursesCompleted counter
    if (completed && !wasCompletedBefore) {
      userLearningProgress.coursesCompleted += 1;
      
      // Update weekly goals if exists
      if (userLearningProgress.weeklyGoals?.coursesCompleted) {
        userLearningProgress.weeklyGoals.coursesCompleted.achieved += 1;
      }
    }
    
    await userLearningProgress.save();
    
    res.status(200).json({ 
      message: 'Course progress updated successfully',
      courseProgress: userLearningProgress.courseProgress[courseId]
    });
  } catch (error) {
    console.error('Error in updateCourseProgress:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add a study session
export const addStudySession = async (req, res) => {
  try {
    const userId = req.user.id;
    const { courseId, hoursSpent, learningMode, notes } = req.body;
    
    if (!courseId || !hoursSpent) {
      return res.status(400).json({ message: 'courseId and hoursSpent are required' });
    }
    
    // Find user learning progress
    let userLearningProgress = await LearningProgress.findOne({ userId });
    
    if (!userLearningProgress) {
      // Create a new record if none exists
      userLearningProgress = new LearningProgress({ 
        userId,
        totalHoursSpent: 0,
        coursesCompleted: 0,
        streakDays: 0,
        lastActiveDate: new Date(),
        skillsGained: [],
        progressHistory: [],
        courseProgress: {}
      });
    }
    
    // Add hours to total
    userLearningProgress.totalHoursSpent += parseFloat(hoursSpent);
    
    // Update weekly goals if exists
    if (userLearningProgress.weeklyGoals?.studyHours) {
      userLearningProgress.weeklyGoals.studyHours.achieved += parseFloat(hoursSpent);
    }
    
    // Add to progress history
    userLearningProgress.progressHistory.push({
      date: new Date(),
      courseId,
      hoursSpent: parseFloat(hoursSpent),
      learningMode,
      notes
    });
    
    // If we have a learning mode, add it to skills gained if not already there
    if (learningMode && !userLearningProgress.skillsGained.includes(learningMode)) {
      userLearningProgress.skillsGained.push(learningMode);
    }
    
    // Update the lastActiveDate and streak
    const lastActive = new Date(userLearningProgress.lastActiveDate);
    const today = new Date();
    
    // If last active date is more than 1 day ago and less than 2 days ago, it's a consecutive day
    if (
      today.getDate() !== lastActive.getDate() && 
      today - lastActive < 2 * 24 * 60 * 60 * 1000
    ) {
      userLearningProgress.streakDays += 1;
    } 
    // If last active date is more than 2 days ago, reset streak
    else if (today - lastActive >= 2 * 24 * 60 * 60 * 1000) {
      userLearningProgress.streakDays = 1;
    }
    
    userLearningProgress.lastActiveDate = today;
    
    await userLearningProgress.save();
    
    res.status(200).json({ 
      message: 'Study session added successfully',
      totalHours: userLearningProgress.totalHoursSpent,
      session: userLearningProgress.progressHistory[userLearningProgress.progressHistory.length - 1]
    });
  } catch (error) {
    console.error('Error in addStudySession:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Set weekly goals
export const setWeeklyGoals = async (req, res) => {
  try {
    const userId = req.user.id;
    const { studyHoursTarget, coursesCompletedTarget } = req.body;
    
    // Find user learning progress
    let userLearningProgress = await LearningProgress.findOne({ userId });
    
    if (!userLearningProgress) {
      // Create a new record if none exists
      userLearningProgress = new LearningProgress({ 
        userId,
        totalHoursSpent: 0,
        coursesCompleted: 0,
        streakDays: 0,
        lastActiveDate: new Date(),
        skillsGained: [],
        progressHistory: [],
        courseProgress: {}
      });
    }
    
    // Update or initialize weekly goals
    userLearningProgress.weeklyGoals = {
      studyHours: {
        target: studyHoursTarget || 10,
        achieved: userLearningProgress.weeklyGoals?.studyHours?.achieved || 0
      },
      coursesCompleted: {
        target: coursesCompletedTarget || 1,
        achieved: userLearningProgress.weeklyGoals?.coursesCompleted?.achieved || 0
      }
    };
    
    await userLearningProgress.save();
    
    res.status(200).json({ 
      message: 'Weekly goals updated successfully',
      weeklyGoals: userLearningProgress.weeklyGoals
    });
  } catch (error) {
    console.error('Error in setWeeklyGoals:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export default {
  getLearningStats,
  updateCourseProgress,
  addStudySession,
  setWeeklyGoals
}; 