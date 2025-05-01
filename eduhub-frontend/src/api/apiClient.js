import axios from 'axios';

// Create a base axios instance with common configuration
const API_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include authentication token
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

// Add a response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common error cases
    if (error.response) {
      // Server responded with a status code outside of 2xx
      if (error.response.status === 401) {
        // Unauthorized - clear local storage and redirect to login
        localStorage.clear();
        window.location.href = '/login';
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Network error - no response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up request:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// API service functions
const authService = {
  login: (email, password) => apiClient.post('/auth/login', { email, password }),
  register: (userData) => apiClient.post('/auth/register', userData),
  verifyEmail: (verificationData) => apiClient.post('/auth/verify-email', verificationData),
  resendVerification: (email) => apiClient.post('/auth/resend-verification', { email }),
  changePassword: (userId, oldPassword, newPassword) => 
    apiClient.post('/auth/change-password', { userId, oldPassword, newPassword }),
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
}; 