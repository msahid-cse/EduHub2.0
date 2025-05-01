import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Mail, Building, Phone, Globe, Info, ArrowLeft, Save, Upload, User, BookOpen, X } from 'lucide-react';
import { apiClient, instructorService } from '../api/apiClient';

const AddNewInstructor = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    university: '',
    specialization: '',
    courses: [],
    bio: '',
    website: '',
    isActive: true
  });
  
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentCourse, setCurrentCourse] = useState('');
  
  // For university selection
  const [universities, setUniversities] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUniversities, setFilteredUniversities] = useState([]);
  const [isLoadingUniversities, setIsLoadingUniversities] = useState(false);
  const [showUniversityDropdown, setShowUniversityDropdown] = useState(false);

  useEffect(() => {
    fetchUniversities();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = universities.filter(uni => 
        uni.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUniversities(filtered.slice(0, 10)); // Limit to 10 results
    } else {
      setFilteredUniversities([]);
    }
  }, [searchQuery, universities]);

  const fetchUniversities = async () => {
    try {
      setIsLoadingUniversities(true);
      const response = await apiClient.get('/universities');
      setUniversities(response.data || []);
    } catch (err) {
      console.error('Error fetching universities:', err);
      // Don't show error, just use empty list
      setUniversities([]);
    } finally {
      setIsLoadingUniversities(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUniversitySelect = (university) => {
    setFormData({
      ...formData,
      university: university.name
    });
    setSearchQuery(university.name);
    setShowUniversityDropdown(false);
  };

  const handleAddCourse = () => {
    if (currentCourse.trim() && !formData.courses.includes(currentCourse.trim())) {
      setFormData({
        ...formData,
        courses: [...formData.courses, currentCourse.trim()]
      });
      setCurrentCourse('');
    }
  };

  const handleRemoveCourse = (course) => {
    setFormData({
      ...formData,
      courses: formData.courses.filter(c => c !== course)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Validate form
      if (!formData.name || !formData.email || !formData.department) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('Please enter a valid email address');
        setLoading(false);
        return;
      }
      
      let profileImageUrl = '';
      
      // Upload profile image if selected
      if (profileImage) {
        try {
          const formDataUpload = new FormData();
          formDataUpload.append('profileImage', profileImage);
          
          const uploadResponse = await apiClient.post('/upload/instructor-image', formDataUpload, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          
          profileImageUrl = uploadResponse.data.imageUrl;
        } catch (uploadError) {
          console.error('Error uploading profile image:', uploadError);
          setError('Failed to upload profile image. The instructor will be created without a profile image.');
          // Continue without profile image
        }
      }
      
      // Create instructor
      const instructorData = {
        ...formData,
        profileImage: profileImageUrl
      };
      
      const response = await instructorService.addInstructor(instructorData);
      
      setSuccess('Instructor added successfully!');
      setTimeout(() => {
        navigate('/admin-dashboard');
      }, 2000);
    } catch (error) {
      console.error('Error adding instructor:', error);
      setError(error.response?.data?.message || 'Failed to add instructor. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-indigo-800 to-purple-900">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold flex items-center">
                <GraduationCap className="mr-2" size={24} />
                Add New Instructor
              </h1>
              <button
                onClick={() => navigate('/admin-dashboard')}
                className="px-3 py-1.5 bg-indigo-700/40 hover:bg-indigo-700/60 rounded-md text-sm transition-colors flex items-center"
              >
                <ArrowLeft size={16} className="mr-1" />
                Back to Dashboard
              </button>
            </div>
            <p className="text-indigo-200 mt-2">Add a new instructor to the EduHub platform</p>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Profile Image Upload */}
              <div className="md:col-span-1">
                <label className="block text-gray-300 mb-2">
                  Profile Image
                </label>
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-600 rounded-lg p-6 bg-gray-700/50 h-48">
                  {profileImagePreview ? (
                    <div className="relative w-32 h-32 rounded-full overflow-hidden">
                      <img
                        src={profileImagePreview}
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setProfileImage(null);
                          setProfileImagePreview(null);
                        }}
                        className="absolute top-1 right-1 bg-red-500 rounded-full p-1 text-white"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <User className="mx-auto h-12 w-12 text-gray-500" />
                      <p className="mt-2 text-xs text-gray-400">
                        Upload a profile image
                      </p>
                      <input
                        type="file"
                        name="profileImage"
                        accept="image/*"
                        onChange={handleProfileImageChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                  )}
                </div>
              </div>
              
              {/* Basic Info */}
              <div className="md:col-span-2 space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter instructor name"
                    className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2">
                      Email <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter email address"
                        className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:border-indigo-500"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter phone number"
                        className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* University & Department */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 mb-2">
                  University
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setFormData({
                        ...formData,
                        university: e.target.value
                      });
                      setShowUniversityDropdown(true);
                    }}
                    placeholder="Search for university"
                    className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:border-indigo-500"
                    onFocus={() => setShowUniversityDropdown(true)}
                    onBlur={() => setTimeout(() => setShowUniversityDropdown(false), 200)}
                  />
                  {showUniversityDropdown && filteredUniversities.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full bg-gray-700 border border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {filteredUniversities.map((university) => (
                        <div
                          key={university.id}
                          className="px-4 py-2 hover:bg-gray-600 cursor-pointer"
                          onClick={() => handleUniversitySelect(university)}
                        >
                          {university.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">
                  Department <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="e.g. Computer Science, Mathematics"
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
            </div>
            
            {/* Position & Specialization */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 mb-2">
                  Position
                </label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  placeholder="e.g. Professor, Assistant Professor"
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:border-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">
                  Specialization
                </label>
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  placeholder="e.g. Machine Learning, Organic Chemistry"
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
            
            {/* Courses */}
            <div>
              <label className="block text-gray-300 mb-2">
                Courses
              </label>
              <div className="flex mb-2">
                <div className="relative flex-grow">
                  <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
                  <input
                    type="text"
                    value={currentCourse}
                    onChange={(e) => setCurrentCourse(e.target.value)}
                    placeholder="Enter course name"
                    className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-l-md focus:outline-none focus:border-indigo-500"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCourse())}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddCourse}
                  className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-r-md"
                >
                  Add
                </button>
              </div>
              {formData.courses.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.courses.map((course, index) => (
                    <span
                      key={index}
                      className="bg-indigo-900/30 text-indigo-300 px-2 py-1 rounded-md text-sm flex items-center"
                    >
                      {course}
                      <button
                        type="button"
                        onClick={() => handleRemoveCourse(course)}
                        className="ml-2 text-indigo-300 hover:text-indigo-100"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            {/* Bio */}
            <div>
              <label className="block text-gray-300 mb-2">
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Enter instructor bio"
                className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:border-indigo-500 min-h-[120px]"
              ></textarea>
            </div>
            
            {/* Website */}
            <div>
              <label className="block text-gray-300 mb-2">
                Website
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="e.g. https://example.com"
                  className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
            
            {/* Active Status */}
            <div>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-500 rounded focus:ring-2 focus:ring-indigo-500 bg-gray-700 border-gray-600"
                />
                <span className="text-gray-300">Instructor is active</span>
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
                className={`px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md font-medium transition-colors flex items-center ${
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
                    Add Instructor
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

export default AddNewInstructor; 