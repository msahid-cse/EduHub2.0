# Admin Dashboard Documentation

## Overview
The Admin Dashboard in EduHub 2.0 provides comprehensive management capabilities for administrators. This document outlines how the dashboard works, its key features, and how to troubleshoot common issues.

## Key Features
- **Dashboard Statistics**: View counts of users, courses, jobs, notices, feedback, community posts, instructors, and events
- **Quick Actions**: Shortcuts to common administrative tasks
- **Recent Data Sections**: View and manage recent instructors, jobs, courses, and notices
- **User Feedback Management**: Handle, respond to, and track user feedback and suggestions
- **Community Management**: Post announcements and interact with users

## Authentication
The admin dashboard requires admin privileges to access. When a user logs in:
1. Authentication status is checked via `localStorage.getItem('isLoggedIn')`
2. User role is verified via `localStorage.getItem('userRole')`
3. If not logged in or not an admin, the user is redirected to the appropriate page

## API Integration
The dashboard integrates with multiple backend endpoints:

### Primary Endpoints
- `/api/admin/dashboard` - Get all dashboard statistics
- `/api/jobs?limit=5` - Get recent jobs
- `/api/notices?limit=5` - Get recent notices
- `/api/courses?limit=5` - Get recent courses
- `/api/instructors` - Get all instructors
- `/api/jobs/applications/count` - Get count of job applications
- `/api/events/hits/count` - Get count of event hits

### Fallback Mechanisms
The dashboard implements fallback mechanisms for API failures:

1. If main dashboard stats fail:
   - Try individual count endpoints
   - Attempt to count items from list endpoints

2. For user count specifically, tries in sequence:
   - `/api/admin/users/count`
   - Community API admin users
   - Global members list
   - University members list

## Testing API Connectivity
To help diagnose API connectivity issues, we've included a test utility:

1. Navigate to `/test-connection` in your browser
2. Use the "Test Server Connection" button to check basic connectivity
3. Test specific endpoints with the "Custom Endpoint Test" field
4. Use common tests like "Test Dashboard Stats" to validate specific API functions
5. Check "Test User Count Methods" to see which user count fallbacks work

## Troubleshooting Common Issues

### Blank Dashboard or "Failed to load dashboard data"
- Check that the backend server is running
- Verify API connectivity using the test tool
- Ensure your token has admin privileges
- Check the browser console for specific API errors

### Zeros for Statistics
- Check API responses in the test tool
- Verify database has data for the relevant collections
- Ensure endpoints have proper authentication middleware

### Missing Data in Recent Sections
- Check if the API endpoints return data
- Verify list limits are properly set
- Check sorting order in backend API

## Error Handling
The dashboard implements multiple layers of error handling:

1. Individual try/catch blocks for each API call
2. Fallback data sources when primary sources fail
3. Partial data display when some endpoints fail
4. User-friendly error messages with retry options

## Adding New Features
When adding new features to the admin dashboard:

1. Add new API endpoints to the `adminService` in `apiClient.js`
2. Create UI components in the `AdminDashboard.jsx`
3. Add proper error handling and fallback mechanisms
4. Implement loading states for async operations 