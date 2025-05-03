import axios from 'axios';

// API base URL - can be overridden with environment variable
const API_BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:5000';

// Base API client
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Server health check function
const checkServerConnection = async () => {
  try {
    console.log(`Testing connection to server at ${API_BASE_URL}...`);
    const response = await axios.get(`${API_BASE_URL}/api/health`, { timeout: 5000 });
    console.log('Server connection successful:', response.data);
    return {
      success: true,
      message: 'Server connection successful',
      data: response.data
    };
  } catch (error) {
    console.error('Server connection failed:', error.message);
    return {
      success: false,
      message: 'Server connection failed',
      error: error.message
    };
  }
};

// Test CSV template download directly
const testCSVDownload = async () => {
  try {
    console.log(`Testing CSV template at ${API_BASE_URL}/api/courses/csv-template...`);
    const response = await axios.get(`${API_BASE_URL}/api/courses/csv-template`, { 
      responseType: 'blob',
      timeout: 5000
    });
    console.log('CSV template download successful, content type:', response.headers['content-type']);
    return {
      success: true,
      message: 'CSV template download successful',
      data: response
    };
  } catch (error) {
    console.error('CSV template download failed:', error.message);
    return {
      success: false,
      message: 'CSV template download failed',
      error: error.message
    };
  }
};

// Community API endpoints
const communityAPI = {
  // Get global posts (visible to all users)
  getGlobalPosts: () => apiClient.get('/api/community/global/posts'),
  
  // Get university posts (visible only to users from the same university)
  getPosts: () => apiClient.get('/api/community/posts'),
  
  // Create a new post
  createPost: (postData) => apiClient.post('/api/community/posts', postData),
  
  // Add a comment to a post
  addComment: (postId, content) => apiClient.post(`/api/community/posts/${postId}/comments`, { content }),
  
  // Like or unlike a post
  likePost: (postId) => apiClient.post(`/api/community/posts/${postId}/like`),
  
  // Get university members for chat
  getMembers: () => apiClient.get('/api/community/members'),
  
  // Get all users (admin only)
  getAllUsers: () => apiClient.get('/api/community/users'),
  
  // Alternative method to get all users for admin
  getAdminUsers: () => apiClient.get('/api/community/admin/users'),
  
  // Get global community members (all users regardless of university)
  getGlobalMembers: () => apiClient.get('/api/community/global/members'),
  
  // Send a message to another user
  sendMessage: (receiverId, content, attachment = null, isGlobal = false) => 
    apiClient.post('/api/community/messages', { 
      receiverId, 
      content, 
      attachment,
      global: isGlobal
    }),
  
  // Get conversation with another user
  getConversation: (userId) => apiClient.get(`/api/community/messages/${userId}`),
  
  // Get unread message count
  getUnreadCount: () => apiClient.get('/api/community/messages/unread/count'),
  
  // Upload file attachment
  uploadAttachment: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/api/community/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
  },
  
  // Check admin status
  checkAdminStatus: () => apiClient.get('/api/community/admin/check'),
};

// Instructor service endpoints
const instructorService = {
  getAllInstructors: () => {
    return apiClient.get('/api/instructors');
  },
  getInstructorById: (id) => {
    return apiClient.get(`/api/instructors/${id}`);
  },
  createInstructor: (formData) => {
    return apiClient.post('/api/instructors', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
  },
  uploadInstructorData: (formData) => {
    return apiClient.post('/api/instructors/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
  },
  addInstructorsManually: (data) => apiClient.post('/api/instructors/add-manually', data),
  updateInstructor: (id, formData) => {
    return apiClient.put(`/api/instructors/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
  },
  deleteInstructor: (id) => apiClient.delete(`/api/instructors/${id}`),
  getCSVTemplate: () => {
    return apiClient.get('/api/instructors/csv-template', {
      responseType: 'blob',
      headers: {
        'Accept': 'text/csv'
      },
      timeout: 10000 // 10 second timeout
    });
  }
};

// API service functions
const authService = {
  login: (email, password) => {
    return apiClient.post('/api/auth/login', { email, password });
  },
  
  register: (userData) => {
    // Log the registration attempt for debugging
    console.log('Sending registration request with data:', { ...userData, password: '[HIDDEN]' });
    return apiClient.post('/api/auth/register', userData);
  },
  
  verifyEmail: (verificationData) => {
    // Log the verification attempt
    console.log('Sending verification request with code for:', verificationData.email);
    return apiClient.post('/api/auth/verify-email', verificationData);
  },
  
  resendVerification: (email) => {
    console.log('Requesting new verification code for:', email);
    return apiClient.post('/api/auth/resend-verification', { email });
  },
  
  changePassword: (userId, oldPassword, newPassword) => 
    apiClient.post('/api/auth/change-password', { userId, oldPassword, newPassword }),

  // Get the Google OAuth URL
  getGoogleAuthUrl: () => {
    return `${apiClient.defaults.baseURL}/api/auth/google`;
  },
  
  // Get the GitHub OAuth URL
  getGithubAuthUrl: () => {
    return `${apiClient.defaults.baseURL}/api/auth/github`;
  },

  getCurrentUser: () => {
    return apiClient.get('/api/auth/current-user');
  },
};

const userService = {
  getProfile: (userId) => apiClient.get(`/api/users/${userId}`),
  updateProfile: (userId, userData) => apiClient.put(`/api/users/${userId}`, userData),
  updateProfilePhoto: (userId, formData) => {
    // For file uploads, need to use FormData and different Content-Type
    return axios.put(`${API_BASE_URL}/api/users/${userId}/profile-photo`, formData, {
      headers: { 
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  },
  updateSkills: (userId, skills) => apiClient.put(`/api/users/${userId}/skills`, { skills }),
};

const courseService = {
  getAllCourses: () => apiClient.get('/api/courses'),
  getCourseById: (courseId) => apiClient.get(`/api/courses/${courseId}`),
  createCourse: (courseData) => apiClient.post('/api/courses', courseData),
  enrollInCourse: (courseId, userId) => apiClient.post(`/api/courses/${courseId}/enroll`, { userId }),
  updateProgress: (progressData) => apiClient.post('/api/courses/update-progress', progressData),
  searchCourses: (query) => apiClient.get(`/api/courses/search?query=${query}`),
  getCSVTemplate: () => {
    return apiClient.get('/api/courses/csv-template', { 
      responseType: 'blob',
      headers: {
        'Accept': 'text/csv'
      },
      timeout: 10000, // 10 second timeout
    }).catch(error => {
      console.error('CSV template request failed:', error);
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timed out. Server might be busy.');
      }
      throw error;
    });
  },
  batchImportCourses: (formData) => apiClient.post('/api/courses/batch-import', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
  uploadCourseMaterial: (courseId, formData) => apiClient.post(`/api/courses/${courseId}/materials`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
};

const learningProgressService = {
  getUserProgress: (userId) => apiClient.get(`/api/users/${userId}/learning-progress`),
  updateStudySession: (userId, sessionData) => 
    apiClient.post(`/api/users/${userId}/study-session`, sessionData),
  getAnalytics: (userId) => apiClient.get(`/api/users/${userId}/analytics`),
};

const noticeService = {
  getAllNotices: (params) => apiClient.get('/api/notices', { params }),
  getNoticeById: (noticeId) => apiClient.get(`/api/notices/${noticeId}`),
  createNotice: (noticeData) => apiClient.post('/api/notices', noticeData),
};

const jobService = {
  getAllJobs: () => {
    return apiClient.get('/api/jobs');
  },
  getJobById: (id) => {
    return apiClient.get(`/api/jobs/${id}`);
  },
  applyForJob: (id, formData) => {
    return apiClient.post(`/api/jobs/${id}/apply`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  getUserApplications: () => {
    return apiClient.get('/api/jobs/user/applications');
  },
  downloadCoverLetter: (applicationId) => {
    return apiClient.get(`/api/jobs/applications/${applicationId}/cover-letter`, {
      responseType: 'blob'
    });
  },
  // Add admin-specific methods
  getAllJobApplications: () => {
    return apiClient.get('/api/jobs/applications/all');
  },
  getJobApplications: (jobId) => {
    return apiClient.get(`/api/jobs/${jobId}/applications`);
  },
  updateApplicationStatus: (applicationId, data) => {
    return apiClient.put(`/api/jobs/applications/${applicationId}`, data);
  }
};

// Admin service for dashboard operations
const adminService = {
  // Get dashboard statistics
  getDashboardStats: () => apiClient.get('/api/admin/dashboard'),
  // Get job applications count
  getJobApplicationsCount: () => apiClient.get('/api/jobs/applications/count'),
  // Get event hits count
  getEventHitsCount: () => apiClient.get('/api/events/hits/count'),
  // Get event count
  getEventCount: () => apiClient.get('/api/events/count'),
  // Get user count - multiple fallback options
  getUserCount: () => apiClient.get('/api/admin/users/count'),
  // Fallback methods for getting user counts
  getUserCountFallback: () => apiClient.get('/api/users/count')
};

// Department service endpoints
const departmentService = {
  getAllDepartments: () => apiClient.get('/api/departments'),
  getDepartmentById: (id) => apiClient.get(`/api/departments/${id}`),
  createDepartment: (departmentData) => apiClient.post('/api/departments', departmentData),
  updateDepartment: (id, departmentData) => apiClient.put(`/api/departments/${id}`, departmentData),
  deleteDepartment: (id) => apiClient.delete(`/api/departments/${id}`),
  seedDepartments: () => apiClient.post('/api/departments/seed')
};

// University service endpoints
const universityService = {
  getCountries: () => apiClient.get('/api/universities/countries'),
  getUniversitiesByCountry: (country) => apiClient.get(`/api/universities?country=${encodeURIComponent(country)}`),
  getAllUniversities: () => apiClient.get('/api/universities')
};

// Promotional Video service
const promotionalVideoService = {
  // Get active promotional video
  getActiveVideo: () => apiClient.get('/api/promotional-video'),
  
  // Get all promotional videos (admin)
  getAllVideos: () => apiClient.get('/api/promotional-video/all'),
  
  // Create a new promotional video
  createVideo: (data) => apiClient.post('/api/promotional-video', data),
  
  // Update a promotional video
  updateVideo: (id, data) => apiClient.put(`/api/promotional-video/${id}`, data),
  
  // Delete a promotional video
  deleteVideo: (id) => apiClient.delete(`/api/promotional-video/${id}`),
  
  // Upload a promotional video file
  uploadVideo: (formData) => apiClient.post('/api/promotional-video/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
};

export {
  apiClient,
  authService,
  userService,
  courseService,
  learningProgressService,
  noticeService,
  jobService,
  communityAPI,
  instructorService,
  checkServerConnection,
  adminService,
  testCSVDownload,
  departmentService,
  universityService,
  promotionalVideoService
}; 