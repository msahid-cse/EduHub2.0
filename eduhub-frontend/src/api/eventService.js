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
    // Handle and log errors but don't automatically redirect
    if (error.response && error.response.status === 401) {
      console.error('Authentication error:', error.response.data);
      // Instead of redirecting, return a rejection with clear message
      return Promise.reject({
        ...error,
        message: 'Your session has expired or you are not authenticated. Please check your login status.'
      });
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
      // Make sure date is in the correct format if provided
      if (eventData.date) {
        try {
          const dateObj = new Date(eventData.date);
          if (!isNaN(dateObj.getTime())) {
            // Use ISO string for consistent date format
            eventData.date = dateObj.toISOString();
          }
        } catch (dateError) {
          console.warn('Error formatting date:', dateError);
          // Continue with the original date value
        }
      }
      
      // Log the event data being sent
      console.log('Creating event with data:', eventData);
      
      const response = await eventApi.post('/', eventData);
      return response.data;
    } catch (error) {
      console.error('Error creating event:', error);
      // Provide more detailed error message
      if (error.response) {
        console.error('Server response:', error.response.data);
        throw new Error(error.response.data.message || 'Failed to create event. Server error.');
      } else if (error.request) {
        console.error('No response from server');
        throw new Error('Failed to create event. No response from server.');
      } else {
        throw error;
      }
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
      console.log(`Sending invitations for event ${id} with data:`, JSON.stringify(invitationData));
      const response = await eventApi.post(`/${id}/send-invitations`, invitationData);
      console.log('Invitation response:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error sending invitations for event ${id}:`, error);
      
      // Log more detailed error information
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Server response error data:', error.response.data);
        console.error('Server response status:', error.response.status);
        console.error('Server response headers:', error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received from server:', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', error.message);
      }
      
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
      if (!file) {
        throw new Error('No file provided');
      }
      
      console.log('Uploading event image:', file.name);
      
      const formData = new FormData();
      formData.append('image', file);
      
      // Get token directly inside the function to ensure it's fresh
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required to upload images');
      }
      
      // Make sure we're using the correct API URL
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      console.log('Using API URL for image upload:', API_URL);
      
      const response = await axios.post(`${API_URL}/upload/event-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Image upload response:', response.data);
      
      // Make sure the imageUrl is correctly formatted with the API URL if it's a relative path
      let imageUrl = response.data.imageUrl;
      if (imageUrl && imageUrl.startsWith('/uploads')) {
        // Convert relative path to absolute URL based on API URL
        const baseUrl = API_URL.replace('/api', '');
        imageUrl = `${baseUrl}${imageUrl}`;
        console.log('Converted image URL to absolute path:', imageUrl);
      }
      
      return { ...response.data, imageUrl };
    } catch (error) {
      console.error('Error uploading event image:', error);
      // Provide more detailed error message
      if (error.response) {
        console.error('Server response:', error.response.data);
        throw new Error(error.response.data.message || 'Failed to upload image. Server error.');
      } else if (error.request) {
        console.error('No response from server');
        throw new Error('Failed to upload image. No response from server.');
      } else {
        throw error;
      }
    }
  }
};

export default eventService; 