# Backend API Implementation Plan for Admin Dashboard

## Overview
This document outlines the backend API implementation required to support the admin dashboard in EduHub 2.0. It provides a list of required endpoints, their expected functionality, response formats, and implementation details.

## Required Endpoints

### Primary Dashboard Stats Endpoint
**Route:** `GET /api/admin/dashboard`  
**Description:** Returns all statistics needed for the admin dashboard  
**Access:** Admin only  

**Implementation:**
```javascript
// In controllers/adminController.js
export const getDashboardStats = async (req, res) => {
  try {
    // Get counts of various entities
    const userCount = await User.countDocuments();
    const courseCount = await Course.countDocuments();
    const jobCount = await Job.countDocuments();
    const noticeCount = await Notice.countDocuments();
    const feedbackCount = await Feedback.countDocuments();
    const globalPostCount = await Post.countDocuments({ isGlobal: true });
    const instructorCount = await Instructor.countDocuments();
    const eventCount = await Event.countDocuments();
    
    const jobsApplied = await JobApplication.countDocuments();
    const eventHits = await EventAnalytics.countDocuments();
    
    res.status(200).json({
      users: userCount,
      courses: courseCount,
      jobs: jobCount,
      notices: noticeCount,
      feedback: feedbackCount,
      globalPosts: globalPostCount,
      instructors: instructorCount,
      events: eventCount,
      jobsApplied,
      eventHits
    });
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    res.status(500).json({ message: 'Server error while getting dashboard stats' });
  }
};
```

### User Count Endpoint
**Route:** `GET /api/admin/users/count`  
**Description:** Returns the count of all users  
**Access:** Admin only  

**Implementation:**
```javascript
// In controllers/adminController.js
export const getUserCount = async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    console.error('Error getting user count:', error);
    res.status(500).json({ message: 'Server error while getting user count' });
  }
};
```

### Job Applications Count
**Route:** `GET /api/jobs/applications/count`  
**Description:** Returns count of all job applications  
**Access:** Admin only  

**Implementation:**
```javascript
// In controllers/jobController.js
export const getApplicationsCount = async (req, res) => {
  try {
    const count = await JobApplication.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    console.error('Error getting job applications count:', error);
    res.status(500).json({ message: 'Server error while getting job applications count' });
  }
};
```

### Event Hits Count
**Route:** `GET /api/events/hits/count`  
**Description:** Returns count of all event views/hits  
**Access:** Admin only  

**Implementation:**
```javascript
// In controllers/eventController.js
export const getEventHitsCount = async (req, res) => {
  try {
    const count = await EventAnalytics.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    console.error('Error getting event hits count:', error);
    res.status(500).json({ message: 'Server error while getting event hits count' });
  }
};
```

### Recent Jobs
**Route:** `GET /api/jobs`  
**Description:** Returns list of jobs, with pagination  
**Query Parameters:** `limit` (optional), `page` (optional)  
**Access:** Public  

**Implementation:**
```javascript
// In controllers/jobController.js
export const getJobs = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;
    
    const jobs = await Job.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Job.countDocuments();
    
    res.status(200).json({
      jobs,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error getting jobs:', error);
    res.status(500).json({ message: 'Server error while getting jobs' });
  }
};
```

### Recent Notices
**Route:** `GET /api/notices`  
**Description:** Returns list of notices, with pagination  
**Query Parameters:** `limit` (optional), `page` (optional)  
**Access:** Public  

**Implementation:**
```javascript
// In controllers/noticeController.js
export const getNotices = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;
    
    const notices = await Notice.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Notice.countDocuments();
    
    res.status(200).json({
      notices,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error getting notices:', error);
    res.status(500).json({ message: 'Server error while getting notices' });
  }
};
```

### Recent Courses
**Route:** `GET /api/courses`  
**Description:** Returns list of courses, with pagination  
**Query Parameters:** `limit` (optional), `page` (optional)  
**Access:** Public  

**Implementation:**
```javascript
// In controllers/courseController.js
export const getCourses = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;
    
    const courses = await Course.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Course.countDocuments();
    
    res.status(200).json({
      courses,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error getting courses:', error);
    res.status(500).json({ message: 'Server error while getting courses' });
  }
};
```

### Alternative Endpoints for Fallback

**Job Count:**  
**Route:** `GET /api/jobs/count`  

```javascript
export const getJobCount = async (req, res) => {
  try {
    const count = await Job.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    console.error('Error getting job count:', error);
    res.status(500).json({ message: 'Server error while getting job count' });
  }
};
```

**Course Count:**  
**Route:** `GET /api/courses/count`  

```javascript
export const getCourseCount = async (req, res) => {
  try {
    const count = await Course.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    console.error('Error getting course count:', error);
    res.status(500).json({ message: 'Server error while getting course count' });
  }
};
```

**Notice Count:**  
**Route:** `GET /api/notices/count`  

```javascript
export const getNoticeCount = async (req, res) => {
  try {
    const count = await Notice.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    console.error('Error getting notice count:', error);
    res.status(500).json({ message: 'Server error while getting notice count' });
  }
};
```

## Middleware Setup

Ensure proper authentication middleware is applied to admin-only routes:

```javascript
// In routes/admin.js
import express from 'express';
import { auth, adminOnly } from '../middleware/auth.js';
import { 
  getDashboardStats,
  getUserCount
} from '../controllers/adminController.js';

const router = express.Router();

// Dashboard data
router.get('/dashboard', auth, adminOnly, getDashboardStats);

// User count
router.get('/users/count', auth, adminOnly, getUserCount);

export default router;
```

## Error Handling

Implement consistent error handling across all endpoints:

```javascript
// Reusable error handler
const handleApiError = (error, res, operation) => {
  console.error(`Error ${operation}:`, error);
  const statusCode = error.statusCode || 500;
  const message = error.message || `Server error while ${operation}`;
  res.status(statusCode).json({ message });
};
```

## Response Format Standardization

All API responses should follow a consistent format:

```javascript
// Success response format
{
  "success": true,
  "data": {
    // Response data here...
  },
  "pagination": {
    // If applicable
  }
}

// Error response format
{
  "success": false,
  "message": "Error message here",
  "error": {
    // Detailed error info (dev env only)
  }
}
```

## Implementation Steps

1. **Update Models**:
   - Ensure all required models exist (User, Course, Job, etc.)
   - Add any missing fields needed for the dashboard

2. **Implement Controllers**:
   - Create or update controller functions for all endpoints
   - Implement proper error handling
   - Add pagination where appropriate

3. **Configure Routes**:
   - Register all routes with appropriate middleware
   - Ensure correct HTTP methods are used

4. **Test Endpoints**:
   - Test each endpoint individually using Postman or similar tool
   - Verify correct data is returned
   - Check authentication and authorization

5. **Document API**:
   - Update API documentation with all endpoints
   - Include sample requests and responses 