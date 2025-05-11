import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, Info, Tag, Link as LinkIcon, Globe, Upload, User, AlertTriangle, ArrowLeft } from 'lucide-react';
import eventService from '../api/eventService';
import axios from 'axios';

const AddNewEvent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    organizer: '',
    category: 'other',
    isGlobal: true,
    registrationRequired: false,
    registrationLink: ''
  });
  
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [userRole, setUserRole] = useState('user');

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to create an event');
        setIsAuthenticated(false);
        setAuthChecked(true);
        return;
      }

      try {
        // Verify the token is valid by making a test request
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        await axios.get(`${API_URL}/auth/verify-token`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setIsAuthenticated(true);
        setAuthChecked(true);
        setError('');
        
        // Check if user is admin
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          if (payload && payload.role) {
            setUserRole(payload.role);
          }
        } catch (err) {
          console.error('Error parsing token:', err);
        }
      } catch (err) {
        console.error('Auth verification error:', err);
        setError('Your login session may have expired. Please try logging in again.');
        setIsAuthenticated(false);
        setAuthChecked(true);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should not exceed 5MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // First verify we're still authenticated
      if (!isAuthenticated) {
        setError('You must be logged in to create an event. Please login and try again.');
        setIsLoading(false);
        return;
      }

      // Validate form
      if (!formData.title || !formData.description || !formData.date || !formData.time || !formData.location || !formData.organizer) {
        setError('Please fill in all required fields');
        setIsLoading(false);
        return;
      }
      
      // If registration is required, validate registration link
      if (formData.registrationRequired && !formData.registrationLink) {
        setError('Registration link is required when registration is enabled');
        setIsLoading(false);
        return;
      }
      
      // Validate date
      const eventDate = new Date(formData.date);
      if (isNaN(eventDate.getTime())) {
        setError('Please enter a valid date');
        setIsLoading(false);
        return;
      }
      
      let imageUrl = '';
      
      // Upload image if selected
      if (image) {
        try {
          console.log('Uploading image...');
          const uploadResponse = await eventService.uploadEventImage(image);
          console.log('Upload response:', uploadResponse);
          
          if (uploadResponse && uploadResponse.imageUrl) {
            imageUrl = uploadResponse.imageUrl;
            console.log('Image URL:', imageUrl);
          } else {
            console.error('Invalid upload response:', uploadResponse);
            setError('Failed to process the uploaded image. The event will be created without an image.');
          }
        } catch (imageError) {
          console.error('Error uploading image:', imageError);
          setError('Failed to upload image. The event will be created without an image.');
          // Continue without image
        }
      }
      
      // Format date properly to prevent timezone issues
      const formattedDate = formData.date;
      
      // Create event object
      const eventData = {
        ...formData,
        date: formattedDate,
        image: imageUrl
      };
      
      console.log('Submitting event data:', eventData);
      
      // Create event
      const response = await eventService.createEvent(eventData);
      console.log('Event creation response:', response);
      
      if (response && response.event) {
        setSuccess('Event created successfully!');
        setTimeout(() => {
          navigate('/events');
        }, 2000);
      } else {
        setError('Received an invalid response from the server. Please try again.');
      }
    } catch (error) {
      console.error('Error creating event:', error);
      
      // If it's an authentication error, provide login guidance
      if (error.response && error.response.status === 401) {
        setError('Your login session has expired. Please login again before creating an event.');
        setTimeout(() => {
          navigate('/login', { state: { returnTo: '/add-event' } });
        }, 3000);
        return;
      }
      
      if (error.message) {
        setError(error.message);
      } else {
        setError('Failed to create event. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Show login message if not authenticated after check completes
  if (authChecked && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-teal-800 to-teal-900">
              <h1 className="text-2xl font-bold flex items-center">
                <Calendar className="mr-2" size={24} />
                Authentication Required
              </h1>
            </div>
            <div className="p-6">
              <div className="bg-red-900/30 border border-red-500 text-red-300 p-4 rounded-md flex items-start mb-6">
                <AlertTriangle className="mr-2 mt-0.5 text-red-400 shrink-0" size={18} />
                <span>You must be logged in to create an event.</span>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => navigate('/login', { state: { returnTo: '/add-event' } })}
                  className="px-6 py-2 bg-teal-600 hover:bg-teal-700 rounded-md font-medium transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/events')}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
                >
                  Back to Events
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-teal-800 to-teal-900 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold flex items-center">
                <Calendar className="mr-2" size={24} />
                Add New Event
              </h1>
              <p className="text-teal-200 mt-2">Create a new event for the EduHub community</p>
            </div>
            <div className="flex gap-2">
              {userRole === 'admin' && (
                <button
                  onClick={() => navigate('/admin')}
                  className="px-3 py-1.5 bg-teal-700/40 hover:bg-teal-700/60 rounded-md text-sm flex items-center"
                >
                  <ArrowLeft size={16} className="mr-1" />
                  Back to Admin
                </button>
              )}
              <button
                onClick={() => navigate('/events')}
                className="px-3 py-1.5 bg-teal-700/40 hover:bg-teal-700/60 rounded-md text-sm flex items-center"
              >
                <ArrowLeft size={16} className="mr-1" />
                Back to Events
              </button>
            </div>
          </div>
          
          {error && (
            <div className="bg-red-900/30 border border-red-500 text-red-300 p-4 m-6 rounded-md flex items-start">
              <AlertTriangle className="mr-2 mt-0.5 text-red-400 shrink-0" size={18} />
              <span>{error}</span>
            </div>
          )}
          
          {success && (
            <div className="bg-green-900/30 border border-green-500 text-green-300 p-4 m-6 rounded-md flex items-start">
              <Info className="mr-2 mt-0.5 text-green-400 shrink-0" size={18} />
              <span>{success}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Title & Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 mb-2">
                  Event Title <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Info className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter event title"
                    className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-10 focus:outline-none focus:border-teal-500"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">
                  Category <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-10 focus:outline-none focus:border-teal-500 appearance-none"
                    required
                  >
                    <option value="academic">Academic</option>
                    <option value="career">Career</option>
                    <option value="workshop">Workshop</option>
                    <option value="seminar">Seminar</option>
                    <option value="conference">Conference</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Description */}
            <div>
              <label className="block text-gray-300 mb-2">
                Description <span className="text-red-400">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter event description"
                className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:border-teal-500 min-h-[120px]"
                required
              ></textarea>
            </div>
            
            {/* Date & Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 mb-2">
                  Date <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-10 focus:outline-none focus:border-teal-500"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">
                  Time <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-10 focus:outline-none focus:border-teal-500"
                    required
                  />
                </div>
              </div>
            </div>
            
            {/* Location & Organizer */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 mb-2">
                  Location <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Enter event location"
                    className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-10 focus:outline-none focus:border-teal-500"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">
                  Organizer <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    type="text"
                    name="organizer"
                    value={formData.organizer}
                    onChange={handleChange}
                    placeholder="Enter organizer name"
                    className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-10 focus:outline-none focus:border-teal-500"
                    required
                  />
                </div>
              </div>
            </div>
            
            {/* Visibility & Registration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 mb-2">
                  Visibility Settings
                </label>
                <div className="flex items-center space-x-2 bg-gray-700 border border-gray-600 rounded-md py-2 px-3">
                  <input
                    type="checkbox"
                    name="isGlobal"
                    checked={formData.isGlobal}
                    onChange={handleChange}
                    className="h-4 w-4 text-teal-500 rounded focus:ring-2 focus:ring-teal-500"
                  />
                  <span className="text-gray-300 flex items-center">
                    <Globe size={16} className="mr-1 text-gray-500" />
                    Make this event visible to all users
                  </span>
                </div>
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">
                  Registration
                </label>
                <div className="flex items-center space-x-2 bg-gray-700 border border-gray-600 rounded-md py-2 px-3">
                  <input
                    type="checkbox"
                    name="registrationRequired"
                    checked={formData.registrationRequired}
                    onChange={handleChange}
                    className="h-4 w-4 text-teal-500 rounded focus:ring-2 focus:ring-teal-500"
                  />
                  <span className="text-gray-300 flex items-center">
                    <Users size={16} className="mr-1 text-gray-500" />
                    Require registration for this event
                  </span>
                </div>
              </div>
            </div>
            
            {/* Registration Link (conditionally shown) */}
            {formData.registrationRequired && (
              <div>
                <label className="block text-gray-300 mb-2">
                  Registration Link <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    type="url"
                    name="registrationLink"
                    value={formData.registrationLink}
                    onChange={handleChange}
                    placeholder="Enter registration link"
                    className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-10 focus:outline-none focus:border-teal-500"
                    required={formData.registrationRequired}
                  />
                </div>
              </div>
            )}
            
            {/* Image Upload */}
            <div>
              <label className="block text-gray-300 mb-2">
                Event Image <span className="text-gray-500 text-sm">(optional, max 5MB)</span>
              </label>
              <div className="flex items-center justify-center border-2 border-dashed border-gray-600 rounded-lg p-6 bg-gray-700/50">
                {imagePreview ? (
                  <div className="relative w-full h-48">
                    <img
                      src={imagePreview}
                      alt="Event preview"
                      className="w-full h-full object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImage(null);
                        setImagePreview(null);
                      }}
                      className="absolute top-2 right-2 bg-red-500 rounded-full p-1 text-white"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="text-center w-full h-full relative">
                    <Upload className="mx-auto h-12 w-12 text-gray-500" />
                    <p className="mt-2 text-sm text-gray-400">
                      Drag and drop an image, or <span className="text-teal-400">browse</span>
                    </p>
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                )}
              </div>
            </div>
            
            {/* Submit Button */}
            <div className="flex justify-end space-x-4 mt-8">
              <button
                type="submit"
                disabled={isLoading}
                className={`px-6 py-2 bg-teal-600 hover:bg-teal-700 rounded-md font-medium transition-colors flex items-center ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  'Create Event'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Add the keyframes for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default AddNewEvent; 