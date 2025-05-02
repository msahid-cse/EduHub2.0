import axios from 'axios';

// Create a base API client with default config
const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api', 
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add authorization headers automatically if token exists
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Handle response errors 
apiClient.interceptors.response.use(
  response => response,
  error => {
    // Handle token expiration
    if (error.response && error.response.status === 401) {
      // If we get an unauthorized error, check if it's due to token expiration
      if (error.response.data.message === 'Token is not valid' || 
          error.response.data.message === 'Token expired') {
        // Clear localStorage and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userRole');
        
        // Redirect to login page
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Community API endpoints
const communityAPI = {
  // Get global posts (visible to all users)
  getGlobalPosts: () => apiClient.get('/community/global/posts'),
  
  // Get university posts (visible only to users from the same university)
  getPosts: () => apiClient.get('/community/posts'),
  
  // Create a new post
  createPost: (postData) => apiClient.post('/community/posts', postData),
  
  // Add a comment to a post
  addComment: (postId, content) => apiClient.post(`/community/posts/${postId}/comments`, { content }),
  
  // Like or unlike a post
  likePost: (postId) => apiClient.post(`/community/posts/${postId}/like`),
  
  // Get university members for chat
  getMembers: () => apiClient.get('/community/members'),
  
  // Get all users (admin only)
  getAllUsers: () => apiClient.get('/community/users'),
  
  // Alternative method to get all users for admin
  getAdminUsers: () => apiClient.get('/community/admin/users'),
  
  // Get global community members (all users regardless of university)
  getGlobalMembers: () => apiClient.get('/community/global/members'),
  
  // Send a message to another user
  sendMessage: (receiverId, content, attachment = null, isGlobal = false) => 
    apiClient.post('/community/messages', { 
      receiverId, 
      content, 
      attachment,
      global: isGlobal
    }),
  
  // Get conversation with another user
  getConversation: (userId) => apiClient.get(`/community/messages/${userId}`),
  
  // Get unread message count
  getUnreadCount: () => apiClient.get('/community/messages/unread/count'),
  
  // Upload file attachment
  uploadAttachment: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/community/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
  },
  
  // Check admin status
  checkAdminStatus: () => apiClient.get('/community/admin/check'),
};

// Instructor service endpoints
const instructorService = {
  getAllInstructors: (university) => {
    const params = university ? { university } : {};
    return apiClient.get('/instructors', { params });
  },
  getInstructorById: (id) => apiClient.get(`/instructors/${id}`),
  createInstructor: (formData) => {
    return apiClient.post('/instructors', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
  },
  uploadInstructorData: (formData) => {
    return apiClient.post('/instructors/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
  },
  addInstructorsManually: (data) => apiClient.post('/instructors/add-manually', data),
  updateInstructor: (id, formData) => {
    return apiClient.put(`/instructors/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
  },
  deleteInstructor: (id) => apiClient.delete(`/instructors/${id}`),
};

// API service functions
const authService = {
  login: (email, password) => apiClient.post('/auth/login', { email, password }),
  register: (userData) => apiClient.post('/auth/register', userData),
  verifyEmail: (verificationData) => apiClient.post('/auth/verify-email', verificationData),
  resendVerification: (email) => apiClient.post('/auth/resend-verification', { email }),
  changePassword: (userId, oldPassword, newPassword) => 
    apiClient.post('/auth/change-password', { userId, oldPassword, newPassword }),

  // Get the Google OAuth URL
  getGoogleAuthUrl: () => {
    return `${apiClient.defaults.baseURL}/auth/google`;
  },
  
  // Get the GitHub OAuth URL
  getGithubAuthUrl: () => {
    return `${apiClient.defaults.baseURL}/auth/github`;
  },
};

const userService = {
  getProfile: (userId) => apiClient.get(`/users/${userId}`),
  updateProfile: (userId, userData) => apiClient.put(`/users/${userId}`, userData),
  updateProfilePhoto: (userId, formData) => {
    // For file uploads, need to use FormData and different Content-Type
    return axios.put(`${API_URL}/users/${userId}/profile-photo`, formData, {
      headers: { 
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  },
  updateSkills: (userId, skills) => apiClient.put(`/users/${userId}/skills`, { skills }),
};

const courseService = {
  getAllCourses: () => apiClient.get('/courses'),
  getCourseById: (courseId) => apiClient.get(`/courses/${courseId}`),
  enrollInCourse: (courseId, userId) => apiClient.post(`/courses/${courseId}/enroll`, { userId }),
  updateProgress: (progressData) => apiClient.post('/courses/update-progress', progressData),
  searchCourses: (query) => apiClient.get(`/courses/search?query=${query}`),
};

const learningProgressService = {
  getUserProgress: (userId) => apiClient.get(`/users/${userId}/learning-progress`),
  updateStudySession: (userId, sessionData) => 
    apiClient.post(`/users/${userId}/study-session`, sessionData),
  getAnalytics: (userId) => apiClient.get(`/users/${userId}/analytics`),
};

const noticeService = {
  getAllNotices: () => apiClient.get('/notices'),
  getNoticeById: (noticeId) => apiClient.get(`/notices/${noticeId}`),
  createNotice: (noticeData) => apiClient.post('/notices', noticeData),
};

const jobService = {
  getAllJobs: () => apiClient.get('/jobs'),
  getJobById: (jobId) => apiClient.get(`/jobs/${jobId}`),
  applyForJob: (jobId, userId, applicationData) => 
    apiClient.post(`/jobs/${jobId}/apply`, { userId, ...applicationData }),
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
  instructorService
}; 