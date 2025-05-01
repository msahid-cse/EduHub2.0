import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, GraduationCap, Info, Tag, Upload, Users, Save, ArrowLeft } from 'lucide-react';
import { apiClient } from '../api/apiClient';

const AddNewCourse = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructor: '',
    duration: '',
    courseType: 'academic',
    courseSegment: 'video',
    price: 0,
    isFree: true,
    isPublished: true,
    tags: [],
    prerequisites: []
  });
  
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [currentTag, setCurrentTag] = useState('');
  const [currentPrerequisite, setCurrentPrerequisite] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'price' && formData.isFree) {
      // Don't update price if course is free
      return;
    }
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // If "Free Course" is checked, set price to 0
    if (name === 'isFree' && checked) {
      setFormData({
        ...formData,
        price: 0,
        isFree: true
      });
    }
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, currentTag.trim()]
      });
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tag) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag)
    });
  };

  const handleAddPrerequisite = () => {
    if (currentPrerequisite.trim() && !formData.prerequisites.includes(currentPrerequisite.trim())) {
      setFormData({
        ...formData,
        prerequisites: [...formData.prerequisites, currentPrerequisite.trim()]
      });
      setCurrentPrerequisite('');
    }
  };

  const handleRemovePrerequisite = (prerequisite) => {
    setFormData({
      ...formData,
      prerequisites: formData.prerequisites.filter(p => p !== prerequisite)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Validate form
      if (!formData.title || !formData.description || !formData.instructor) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }
      
      let thumbnailUrl = '';
      
      // Upload thumbnail if selected
      if (thumbnail) {
        try {
          const formDataUpload = new FormData();
          formDataUpload.append('thumbnail', thumbnail);
          
          const uploadResponse = await apiClient.post('/upload/course-thumbnail', formDataUpload, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          
          thumbnailUrl = uploadResponse.data.thumbnailUrl;
        } catch (thumbnailError) {
          console.error('Error uploading thumbnail:', thumbnailError);
          setError('Failed to upload thumbnail. The course will be created without a thumbnail.');
          // Continue without thumbnail
        }
      }
      
      // Create course
      const courseData = {
        ...formData,
        thumbnail: thumbnailUrl
      };
      
      const response = await apiClient.post('/courses', courseData);
      
      setSuccess('Course created successfully!');
      setTimeout(() => {
        navigate('/admin-dashboard');
      }, 2000);
    } catch (error) {
      console.error('Error creating course:', error);
      setError(error.response?.data?.message || 'Failed to create course. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-blue-800 to-purple-900">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold flex items-center">
                <BookOpen className="mr-2" size={24} />
                Add New Course
              </h1>
              <button
                onClick={() => navigate('/admin-dashboard')}
                className="px-3 py-1.5 bg-blue-700/40 hover:bg-blue-700/60 rounded-md text-sm transition-colors flex items-center"
              >
                <ArrowLeft size={16} className="mr-1" />
                Back to Dashboard
              </button>
            </div>
            <p className="text-blue-200 mt-2">Create a new course for EduHub</p>
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
            {/* Course Title */}
            <div>
              <label className="block text-gray-300 mb-2">
                Course Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter course title"
                className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            
            {/* Course Description */}
            <div>
              <label className="block text-gray-300 mb-2">
                Description <span className="text-red-400">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter course description"
                className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500 min-h-[120px]"
                required
              ></textarea>
            </div>
            
            {/* Instructor & Duration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 mb-2">
                  Instructor <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    type="text"
                    name="instructor"
                    value={formData.instructor}
                    onChange={handleChange}
                    placeholder="Enter instructor name"
                    className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">
                  Duration
                </label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="e.g. 10 hours, 8 weeks"
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
            
            {/* Course Type & Segment */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 mb-2">
                  Course Type
                </label>
                <select
                  name="courseType"
                  value={formData.courseType}
                  onChange={handleChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                >
                  <option value="academic">Academic</option>
                  <option value="professional">Professional</option>
                  <option value="co-curricular">Co-Curricular</option>
                </select>
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">
                  Course Segment
                </label>
                <select
                  name="courseSegment"
                  value={formData.courseSegment}
                  onChange={handleChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                >
                  <option value="video">Video Course</option>
                  <option value="theory">Theory Materials</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
            </div>
            
            {/* Price & Free Course */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 mb-2">
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0"
                  className={`w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500 ${
                    formData.isFree ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={formData.isFree}
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div className="flex items-end">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isFree"
                    checked={formData.isFree}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-500 rounded focus:ring-2 focus:ring-blue-500 bg-gray-700 border-gray-600"
                  />
                  <span className="text-gray-300">This is a free course</span>
                </label>
              </div>
            </div>
            
            {/* Tags */}
            <div>
              <label className="block text-gray-300 mb-2">
                Tags
              </label>
              <div className="flex mb-2">
                <input
                  type="text"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  placeholder="Enter a tag"
                  className="flex-grow bg-gray-700 border border-gray-600 rounded-l-md py-2 px-3 focus:outline-none focus:border-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-r-md"
                >
                  Add
                </button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-blue-900/30 text-blue-300 px-2 py-1 rounded-md text-sm flex items-center"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-2 text-blue-300 hover:text-blue-100"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            {/* Prerequisites */}
            <div>
              <label className="block text-gray-300 mb-2">
                Prerequisites
              </label>
              <div className="flex mb-2">
                <input
                  type="text"
                  value={currentPrerequisite}
                  onChange={(e) => setCurrentPrerequisite(e.target.value)}
                  placeholder="Enter a prerequisite"
                  className="flex-grow bg-gray-700 border border-gray-600 rounded-l-md py-2 px-3 focus:outline-none focus:border-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddPrerequisite())}
                />
                <button
                  type="button"
                  onClick={handleAddPrerequisite}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-r-md"
                >
                  Add
                </button>
              </div>
              {formData.prerequisites.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.prerequisites.map((prerequisite, index) => (
                    <span
                      key={index}
                      className="bg-purple-900/30 text-purple-300 px-2 py-1 rounded-md text-sm flex items-center"
                    >
                      {prerequisite}
                      <button
                        type="button"
                        onClick={() => handleRemovePrerequisite(prerequisite)}
                        className="ml-2 text-purple-300 hover:text-purple-100"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            {/* Thumbnail Upload */}
            <div>
              <label className="block text-gray-300 mb-2">
                Course Thumbnail
              </label>
              <div className="flex items-center justify-center border-2 border-dashed border-gray-600 rounded-lg p-6 bg-gray-700/50">
                {thumbnailPreview ? (
                  <div className="relative w-full h-48">
                    <img
                      src={thumbnailPreview}
                      alt="Thumbnail preview"
                      className="w-full h-full object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setThumbnail(null);
                        setThumbnailPreview(null);
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
                      Drag and drop an image, or <span className="text-blue-400">browse</span>
                    </p>
                    <input
                      type="file"
                      name="thumbnail"
                      accept="image/*"
                      onChange={handleThumbnailChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                )}
              </div>
            </div>
            
            {/* Publishing Options */}
            <div>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isPublished"
                  checked={formData.isPublished}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-500 rounded focus:ring-2 focus:ring-blue-500 bg-gray-700 border-gray-600"
                />
                <span className="text-gray-300">Publish this course immediately</span>
              </label>
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
                disabled={loading}
                className={`px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-md font-medium transition-colors flex items-center ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="mr-2" size={18} />
                    Create Course
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddNewCourse; 