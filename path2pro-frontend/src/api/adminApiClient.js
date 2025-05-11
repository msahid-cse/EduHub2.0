import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create admin-specific axios instance
const adminApiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to attach the admin token to all requests
adminApiClient.interceptors.request.use(
  (config) => {
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
adminApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // If unauthorized or forbidden, clear admin auth and redirect to admin login
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminEmail');
      localStorage.removeItem('adminName');
      localStorage.removeItem('isAdminLoggedIn');
      localStorage.removeItem('adminPermissions');
      
      // Redirect to admin login page
      if (window.location.pathname !== '/admin-login') {
        window.location.href = '/admin-login';
      }
    }
    return Promise.reject(error);
  }
);

// Admin authentication service
export const adminAuthService = {
  login: (email, password) => {
    return adminApiClient.post('/admin-auth/login', { email, password });
  },
  
  getCurrentAdmin: () => {
    return adminApiClient.get('/admin-auth/current');
  },
  
  logout: () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
    localStorage.removeItem('adminName');
    localStorage.removeItem('isAdminLoggedIn');
    localStorage.removeItem('adminPermissions');
    
    // Redirect to admin login
    window.location.href = '/admin-login';
  },
  
  isAuthenticated: () => {
    return localStorage.getItem('adminToken') !== null && 
           localStorage.getItem('isAdminLoggedIn') === 'true';
  }
};

// Admin management service
export const adminService = {
  createAdmin: (adminData) => {
    return adminApiClient.post('/admin-auth/create', adminData);
  },
  
  updateAdmin: (adminId, adminData) => {
    return adminApiClient.put(`/admin-auth/${adminId}`, adminData);
  },
  
  getAllAdmins: () => {
    return adminApiClient.get('/admin-auth/all');
  },
  
  deleteAdmin: (adminId) => {
    return adminApiClient.delete(`/admin-auth/${adminId}`);
  },
  
  changePassword: (passwordData) => {
    return adminApiClient.post('/admin-auth/change-password', passwordData);
  }
};

export default adminApiClient; 