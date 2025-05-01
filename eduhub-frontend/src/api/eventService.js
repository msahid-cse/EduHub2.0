import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create an axios instance with default config
const eventApi = axios.create({
  baseURL: `${API_URL}/events`,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add auth token to requests
eventApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
eventApi.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle unauthorized errors (token expired)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const eventService = {
  // Get all events with optional filters
  getEvents: async (params = {}) => {
    try {
      const response = await eventApi.get('/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  },

  // Get single event by ID
  getEventById: async (id) => {
    try {
      const response = await eventApi.get(`/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching event ${id}:`, error);
      throw error;
    }
  },

  // Create new event
  createEvent: async (eventData) => {
    try {
      const response = await eventApi.post('/', eventData);
      return response.data;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  },

  // Update existing event
  updateEvent: async (id, eventData) => {
    try {
      const response = await eventApi.put(`/${id}`, eventData);
      return response.data;
    } catch (error) {
      console.error(`Error updating event ${id}:`, error);
      throw error;
    }
  },

  // Delete event
  deleteEvent: async (id) => {
    try {
      const response = await eventApi.delete(`/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting event ${id}:`, error);
      throw error;
    }
  },

  // Express interest in event
  expressInterest: async (id) => {
    try {
      const response = await eventApi.post(`/${id}/interest`);
      return response.data;
    } catch (error) {
      console.error(`Error expressing interest in event ${id}:`, error);
      throw error;
    }
  },

  // Remove interest in event
  removeInterest: async (id) => {
    try {
      const response = await eventApi.delete(`/${id}/interest`);
      return response.data;
    } catch (error) {
      console.error(`Error removing interest from event ${id}:`, error);
      throw error;
    }
  },

  // Get interested users for an event
  getInterestedUsers: async (id) => {
    try {
      const response = await eventApi.get(`/${id}/interested-users`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching interested users for event ${id}:`, error);
      throw error;
    }
  },

  // Send invitations to users
  sendInvitations: async (id, invitationData) => {
    try {
      const response = await eventApi.post(`/${id}/send-invitations`, invitationData);
      return response.data;
    } catch (error) {
      console.error(`Error sending invitations for event ${id}:`, error);
      throw error;
    }
  },

  // Get event hits count (admin only)
  getEventHitsCount: async () => {
    try {
      const response = await eventApi.get('/hits/count');
      return response.data;
    } catch (error) {
      console.error('Error fetching event hits count:', error);
      throw error;
    }
  },

  // Upload event image
  uploadEventImage: async (file) => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await axios.post(`${API_URL}/upload/event-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error uploading event image:', error);
      throw error;
    }
  }
};

export default eventService; 