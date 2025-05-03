import { apiClient } from './apiClient';

const userService = {
  // Get all users with pagination and sorting
  getAllUsers: async (page = 1, limit = 10, sortBy = 'name', sortOrder = 'asc') => {
    try {
      const response = await apiClient.get('/api/users', {
        params: { page, limit, sortBy, sortOrder }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting all users:', error);
      throw error;
    }
  },

  // Search users by name or email
  searchUsers: async (query, page = 1, limit = 10) => {
    try {
      const response = await apiClient.get('/api/users/search', {
        params: { query, page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  },

  // Get user by ID
  getUserById: async (userId) => {
    try {
      const response = await apiClient.get(`/api/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error getting user with ID ${userId}:`, error);
      throw error;
    }
  },

  // Delete user account
  deleteUser: async (userId) => {
    try {
      const response = await apiClient.delete(`/api/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting user with ID ${userId}:`, error);
      throw error;
    }
  },

  // Send violation email to user
  sendViolationEmail: async (userId, emailData) => {
    try {
      const response = await apiClient.post(`/api/users/${userId}/violation-email`, emailData);
      return response.data;
    } catch (error) {
      console.error(`Error sending violation email to user with ID ${userId}:`, error);
      throw error;
    }
  },

  // Ban user temporarily
  banUser: async (userId, banData) => {
    try {
      const response = await apiClient.post(`/api/users/${userId}/ban`, banData);
      return response.data;
    } catch (error) {
      console.error(`Error banning user with ID ${userId}:`, error);
      throw error;
    }
  },

  // Get user activity logs
  getUserActivity: async (userId, page = 1, limit = 10) => {
    try {
      const response = await apiClient.get(`/api/users/${userId}/activity`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error(`Error getting activity logs for user with ID ${userId}:`, error);
      throw error;
    }
  }
};

export default userService; 