import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, Info, Tag, Link as LinkIcon, Globe, Upload, User } from 'lucide-react';
import eventService from '../api/eventService';

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
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Validate form
      if (!formData.title || !formData.description || !formData.date || !formData.time || !formData.location || !formData.organizer) {
        setError('Please fill in all required fields');
        setIsLoading(false);
        return;
      }
      
      let imageUrl = '';
      
      // Upload image if selected
      if (image) {
        try {
          const uploadResponse = await eventService.uploadEventImage(image);
          imageUrl = uploadResponse.imageUrl;
        } catch (imageError) {
          console.error('Error uploading image:', imageError);
          setError('Failed to upload image. The event will be created without an image.');
          // Continue without image
        }
      }
      
      // Create event
      const eventData = {
        ...formData,
        image: imageUrl
      };
      
      const response = await eventService.createEvent(eventData);
      
      setSuccess('Event created successfully!');
      setTimeout(() => {
        navigate('/admin-dashboard');
      }, 2000);
    } catch (error) {
      console.error('Error creating event:', error);
      setError(error.response?.data?.message || 'Failed to create event. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-teal-800 to-teal-900">
            <h1 className="text-2xl font-bold flex items-center">
              <Calendar className="mr-2" size={24} />
              Add New Event
            </h1>
            <p className="text-teal-200 mt-2">Create a new event for the EduHub community</p>
          </div>
          
          {error && (
            <div className="bg-red-900/30 border border-red-500 text-red-300 p-4 m-6 rounded-md flex items-start">
              <Info className="mr-2 mt-0.5 text-red-400 shrink-0" size={18} />
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
                Event Image
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
                  <div className="text-center">
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
                type="button"
                onClick={() => navigate('/admin-dashboard')}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
              >
                Cancel
              </button>
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
    </div>
  );
};

export default AddNewEvent; 