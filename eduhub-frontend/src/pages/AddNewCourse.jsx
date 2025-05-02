import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, GraduationCap, Info, Tag, Upload, Users, Save, ArrowLeft, FileText, Video, Link as LinkIcon, Youtube, HardDrive, Plus, AlertTriangle } from 'lucide-react';
import { apiClient, courseService, testCSVDownload } from '../api/apiClient';

const AddNewCourse = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructor: '',
    content: '',
    duration: '',
    courseType: 'academic',
    courseSegment: 'video',
    videoUrl: '',
    youtubeVideoUrl: '',
    driveVideoUrl: '',
    youtubePlaylistUrl: '',
    theoryUrl: '',
    theoryLinks: [],
    department: 'CSE',
    activityType: '',
    price: 0,
    isFree: true,
    isPublished: true,
    tags: [],
    prerequisites: []
  });
  
  // List of departments
  const departments = [
    { value: 'CSE', label: 'Computer Science & Engineering' },
    { value: 'EEE', label: 'Electrical & Electronic Engineering' },
    { value: 'LAW', label: 'Law' },
    { value: 'BBA', label: 'Business Administration' },
    { value: 'AI_DS', label: 'AI & Data Science' },
    { value: 'MEDICAL', label: 'Medical Sciences' },
    { value: 'CIVIL', label: 'Civil Engineering' },
    { value: 'MATHEMATICS', label: 'Mathematics' },
    { value: 'ENGLISH', label: 'English Literature' },
    { value: 'PHYSICS', label: 'Physics' },
    { value: 'CHEMISTRY', label: 'Chemistry' },
    { value: 'OTHERS', label: 'Others' }
  ];
  
  // Activity types for co-curricular courses
  const activityTypes = [
    { value: 'SPORTS', label: 'Sports' },
    { value: 'MUSIC', label: 'Music' },
    { value: 'ART', label: 'Art & Crafts' },
    { value: 'DEBATE', label: 'Debate & Public Speaking' },
    { value: 'VOLUNTEER', label: 'Volunteer & Social Work' },
    { value: 'OTHERS', label: 'Others' }
  ];
  
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [currentTag, setCurrentTag] = useState('');
  const [currentPrerequisite, setCurrentPrerequisite] = useState('');
  const [currentTheoryLink, setCurrentTheoryLink] = useState({ title: '', url: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [csvFile, setCsvFile] = useState(null);
  const [showBatchUpload, setShowBatchUpload] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const [videoRequired, setVideoRequired] = useState(false);

  // Check if any of the video fields are filled
  useEffect(() => {
    if (formData.courseSegment === 'video') {
      const hasVideoSource = formData.videoUrl || formData.youtubeVideoUrl || formData.driveVideoUrl || 
                             formData.youtubePlaylistUrl || videoFile;
      setVideoRequired(!hasVideoSource);
    } else {
      setVideoRequired(false);
    }
  }, [formData.videoUrl, formData.youtubeVideoUrl, formData.driveVideoUrl, formData.youtubePlaylistUrl, videoFile, formData.courseSegment]);

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

  const handleVideoFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
    }
  };

  const handleCSVFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCsvFile(file);
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

  const handleTheoryLinkChange = (e) => {
    const { name, value } = e.target;
    setCurrentTheoryLink({
      ...currentTheoryLink,
      [name]: value
    });
  };

  const handleAddTheoryLink = () => {
    if (currentTheoryLink.title.trim() && currentTheoryLink.url.trim()) {
      setFormData({
        ...formData,
        theoryLinks: [...formData.theoryLinks, { ...currentTheoryLink }]
      });
      setCurrentTheoryLink({ title: '', url: '', description: '' });
    }
  };

  const handleRemoveTheoryLink = (index) => {
    setFormData({
      ...formData,
      theoryLinks: formData.theoryLinks.filter((_, i) => i !== index)
    });
  };

  const handleDownloadCSVTemplate = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Requesting CSV template...');
      const response = await courseService.getCSVTemplate();
      
      // Check if response has data
      if (!response || !response.data) {
        throw new Error('Empty response from server');
      }
      
      console.log('CSV template received, creating download');
      
      // Create download link
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'course-import-template.csv');
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      link.remove();
      
      setSuccess('CSV template downloaded successfully');
    } catch (error) {
      console.error('Error downloading CSV template:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
      setError(`Failed to download CSV template: ${errorMessage}. Please try again in a few moments.`);
    } finally {
      setLoading(false);
    }
  };

  // Direct test function for CSV download
  const handleDirectCSVTest = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('Testing direct CSV download...');
      
      const result = await testCSVDownload();
      
      if (result.success) {
        setSuccess('Direct CSV test successful! Try the normal download button again.');
      } else {
        setError(`Direct CSV test failed: ${result.error}. This indicates a server issue.`);
      }
    } catch (e) {
      setError(`Direct test error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    console.log('Submitting course form with data:', formData);
    
    try {
      // Validate form
      if (!formData.title || !formData.description || !formData.instructor || !formData.content || !formData.duration) {
        console.error('Missing required fields');
        const missingFields = [];
        if (!formData.title) missingFields.push('title');
        if (!formData.description) missingFields.push('description');
        if (!formData.instructor) missingFields.push('instructor');
        if (!formData.content) missingFields.push('content');
        if (!formData.duration) missingFields.push('duration');
        
        console.error('Missing fields:', missingFields);
        setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
        setLoading(false);
        return;
      }
      
      // Validate video/theory links based on course segment
      if (formData.courseSegment === 'video' && !formData.videoUrl && !formData.youtubeVideoUrl && !formData.driveVideoUrl && !formData.youtubePlaylistUrl && !videoFile) {
        setError('Please provide at least one video source');
        setLoading(false);
        return;
      }
      
      if (formData.courseSegment === 'theory' && !formData.theoryUrl && formData.theoryLinks.length === 0) {
        setError('Please provide at least one theory resource');
        setLoading(false);
        return;
      }
      
      if (formData.courseSegment === 'hybrid') {
        const hasVideoSource = formData.videoUrl || formData.youtubeVideoUrl || formData.driveVideoUrl || videoFile;
        const hasTheorySource = formData.theoryUrl || formData.theoryLinks.length > 0;
        
        if (!hasVideoSource && !hasTheorySource) {
          setError('For hybrid courses, please provide at least one video or theory resource');
          setLoading(false);
          return;
        }
      }
      
      let thumbnailUrl = '';
      
      // Upload thumbnail if selected
      if (thumbnail) {
        try {
          console.log('Uploading thumbnail...');
          const formDataUpload = new FormData();
          formDataUpload.append('thumbnail', thumbnail);
          
          const uploadResponse = await apiClient.post('/api/upload/course-thumbnail', formDataUpload, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          
          thumbnailUrl = uploadResponse.data.thumbnailUrl;
          console.log('Thumbnail uploaded successfully:', thumbnailUrl);
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
      
      console.log('Sending course data to API:', courseData);
      const response = await courseService.createCourse(courseData);
      console.log('Course created successfully:', response.data);
      
      // If we have a video file, upload it
      if (videoFile && response.data.course._id) {
        try {
          console.log('Uploading video file...');
          const videoFormData = new FormData();
          videoFormData.append('video', videoFile);
          
          await courseService.uploadCourseMaterial(response.data.course._id, videoFormData);
          console.log('Video uploaded successfully');
        } catch (videoError) {
          console.error('Error uploading video file:', videoError);
          setError('Course created, but failed to upload video file.');
        }
      }
      
      setSuccess('Course created successfully!');
      setTimeout(() => {
        navigate('/admindashboard');
      }, 2000);
    } catch (error) {
      console.error('Error creating course:', error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to create course. Please try again.';
      console.error('Error details:', error.response?.data);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  const handleBatchUpload = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    if (!csvFile) {
      setError('Please select a CSV or Excel file to upload');
      setLoading(false);
      return;
    }
    
    try {
      const formData = new FormData();
      formData.append('csvFile', csvFile);
      
      const response = await courseService.batchImportCourses(formData);
      
      setSuccess('Batch upload started successfully! Courses are being processed in the background.');
      setTimeout(() => {
        navigate('/admindashboard');
      }, 2000);
    } catch (error) {
      console.error('Error batch uploading courses:', error);
      setError(error.response?.data?.message || 'Failed to batch upload courses. Please try again.');
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
                {showBatchUpload ? 'Batch Upload Courses' : 'Add New Course'}
              </h1>
              <button
                onClick={() => navigate('/admindashboard')}
                className="px-3 py-1.5 bg-blue-700/40 hover:bg-blue-700/60 rounded-md text-sm transition-colors flex items-center"
              >
                <ArrowLeft size={16} className="mr-1" />
                Back to Dashboard
              </button>
            </div>
            <p className="text-blue-200 mt-2">
              {showBatchUpload 
                ? 'Upload multiple courses at once using a CSV file' 
                : 'Create a new course for EduHub'}
            </p>
          </div>
          
          {/* Toggle between single course and batch upload */}
          <div className="flex border-b border-gray-700">
            <button
              onClick={() => setShowBatchUpload(false)}
              className={`flex-1 py-3 px-4 text-center ${!showBatchUpload ? 'bg-blue-600/20 border-b-2 border-blue-500 text-blue-300' : 'text-gray-400 hover:text-gray-200'}`}
            >
              Single Course
            </button>
            <button
              onClick={() => setShowBatchUpload(true)}
              className={`flex-1 py-3 px-4 text-center ${showBatchUpload ? 'bg-blue-600/20 border-b-2 border-blue-500 text-blue-300' : 'text-gray-400 hover:text-gray-200'}`}
            >
              Batch Upload
            </button>
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
          
          {showBatchUpload ? (
            <form onSubmit={handleBatchUpload} className="p-6 space-y-6">
              <div className="p-4 bg-blue-900/20 border border-blue-700 rounded-md">
                <h3 className="text-lg font-medium text-blue-300 mb-2">Batch Upload Instructions</h3>
                <p className="text-sm text-gray-300 mb-4">
                  You can upload multiple courses at once using a CSV or Excel file with the required format.
                  Please download the template below to see the required format.
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleDownloadCSVTemplate}
                    disabled={loading}
                    className={`px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded-md text-sm font-medium flex items-center ${
                      loading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Downloading...
                      </>
                    ) : (
                      <>
                        <FileText size={16} className="mr-2" />
                        Download CSV Template
                      </>
                    )}
                  </button>
                  
                  {error && (
                    <button
                      type="button"
                      onClick={handleDirectCSVTest}
                      disabled={loading}
                      className="px-4 py-2 bg-green-700 hover:bg-green-600 rounded-md text-sm font-medium flex items-center"
                    >
                      Try Direct Download Test
                    </button>
                  )}
                </div>
              </div>
              
              <div className="mt-6">
                <label className="block text-gray-300 mb-2">
                  Upload CSV File <span className="text-red-400">*</span>
                </label>
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 bg-gray-700/50">
                  <div className="flex flex-col items-center">
                    <Upload className="text-gray-500 mb-3" size={32} />
                    <p className="text-sm text-gray-400 mb-4">
                      {csvFile ? csvFile.name : 'Drag & drop your CSV/Excel file, or click to select'}
                    </p>
                    <input
                      type="file"
                      accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                      onChange={handleCSVFileChange}
                      className="block w-full text-sm text-gray-400
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-medium
                        file:bg-blue-700 file:text-white
                        hover:file:bg-blue-600"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-4 mt-8">
                <button
                  type="button"
                  onClick={() => navigate('/admindashboard')}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !csvFile}
                  className={`px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-md font-medium transition-colors flex items-center ${
                    (loading || !csvFile) ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2" size={18} />
                      Upload Courses
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
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
                    placeholder="e.g. 8 weeks, 2 hours"
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
              
              {/* Academic Department or Co-Curricular Activity Type */}
              {formData.courseType === 'academic' && (
                <div>
                  <label className="block text-gray-300 mb-2">
                    Department <span className="text-red-400">*</span>
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                  >
                    {departments.map(department => (
                      <option key={department.value} value={department.value}>{department.label}</option>
                    ))}
                  </select>
                </div>
              )}
              
              {formData.courseType === 'co-curricular' && (
                <div>
                  <label className="block text-gray-300 mb-2">
                    Activity Type <span className="text-red-400">*</span>
                  </label>
                  <select
                    name="activityType"
                    value={formData.activityType}
                    onChange={handleChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                  >
                    {activityTypes.map(activity => (
                      <option key={activity.value} value={activity.value}>{activity.label}</option>
                    ))}
                  </select>
                </div>
              )}
              
              {/* Video Course Options */}
              {(formData.courseSegment === 'video' || formData.courseSegment === 'hybrid') && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-lg text-blue-300 flex items-center">
                      <Video className="mr-2" size={20} />
                      Video Resources
                    </h3>
                    {videoRequired && (
                      <div className="text-amber-400 text-sm flex items-center">
                        <AlertTriangle size={16} className="mr-1" />
                        At least one video source is required
                      </div>
                    )}
                  </div>
                  
                  <div className="p-3 bg-blue-900/20 border border-blue-700 rounded-md text-sm text-blue-300">
                    <p>You must provide at least one of the following video sources:</p>
                    <ul className="list-disc list-inside mt-1 ml-2">
                      <li>Upload a video file directly</li>
                      <li>Provide a YouTube video URL</li>
                      <li>Add a YouTube playlist URL</li>
                      <li>Link to a Google Drive video</li>
                      <li>Enter any other direct video URL</li>
                    </ul>
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">
                      Upload Video File
                    </label>
                    <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 bg-gray-700/50">
                      <div className="flex flex-col items-center">
                        <Upload className="text-gray-500 mb-2" size={24} />
                        <p className="text-sm text-gray-400 mb-3">
                          {videoFile ? videoFile.name : 'Select a video file to upload'}
                        </p>
                        <input
                          type="file"
                          accept="video/*"
                          onChange={handleVideoFileChange}
                          className="block w-full text-sm text-gray-400
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-md file:border-0
                            file:text-sm file:font-medium
                            file:bg-blue-700 file:text-white
                            hover:file:bg-blue-600"
                        />
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      Supported formats: MP4, MPEG, MOV, AVI, WMV (max 100MB)
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">
                      <div className="flex items-center">
                        <Youtube className="mr-2" size={18} />
                        YouTube Video URL
                      </div>
                    </label>
                    <input
                      type="text"
                      name="youtubeVideoUrl"
                      value={formData.youtubeVideoUrl}
                      onChange={handleChange}
                      placeholder="e.g. https://www.youtube.com/watch?v=example"
                      className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      For a single YouTube video (not a playlist)
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">
                      <div className="flex items-center">
                        <Youtube className="mr-2" size={18} />
                        YouTube Playlist URL
                      </div>
                    </label>
                    <input
                      type="text"
                      name="youtubePlaylistUrl"
                      value={formData.youtubePlaylistUrl}
                      onChange={handleChange}
                      placeholder="e.g. https://www.youtube.com/playlist?list=example"
                      className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      For a complete YouTube playlist
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">
                      <div className="flex items-center">
                        <HardDrive className="mr-2" size={18} />
                        Google Drive Video URL
                      </div>
                    </label>
                    <input
                      type="text"
                      name="driveVideoUrl"
                      value={formData.driveVideoUrl}
                      onChange={handleChange}
                      placeholder="e.g. https://drive.google.com/file/d/example"
                      className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">
                      Other Video URL
                    </label>
                    <input
                      type="text"
                      name="videoUrl"
                      value={formData.videoUrl}
                      onChange={handleChange}
                      placeholder="Enter any other direct video URL"
                      className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              )}
              
              {/* Theory Materials Options */}
              {(formData.courseSegment === 'theory' || formData.courseSegment === 'hybrid') && (
                <div className="space-y-4">
                  <h3 className="font-medium text-lg text-green-300 flex items-center">
                    <FileText className="mr-2" size={20} />
                    Theory Resources
                  </h3>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">
                      Main Theory Resource URL
                    </label>
                    <input
                      type="text"
                      name="theoryUrl"
                      value={formData.theoryUrl}
                      onChange={handleChange}
                      placeholder="e.g. https://example.com/course-materials"
                      className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <label className="block text-gray-300">
                      Additional Theory Links
                    </label>
                    
                    <div className="space-y-3 mb-4">
                      {formData.theoryLinks.map((link, index) => (
                        <div key={index} className="p-3 bg-gray-700/80 rounded-md border border-gray-600 flex items-center">
                          <div className="flex-grow">
                            <h4 className="text-sm font-medium text-blue-300">{link.title}</h4>
                            <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400 hover:text-blue-400 truncate block">
                              {link.url}
                            </a>
                            {link.description && (
                              <p className="text-xs text-gray-400 mt-1">{link.description}</p>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveTheoryLink(index)}
                            className="p-1 bg-red-900/30 text-red-400 rounded-full hover:bg-red-900/50"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                    
                    <div className="p-4 bg-gray-700/50 rounded-md border border-gray-600">
                      <h4 className="text-sm font-medium text-gray-300 mb-3">Add New Link</h4>
                      <div className="space-y-3">
                        <input
                          type="text"
                          name="title"
                          value={currentTheoryLink.title}
                          onChange={handleTheoryLinkChange}
                          placeholder="Link Title"
                          className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                        />
                        <input
                          type="text"
                          name="url"
                          value={currentTheoryLink.url}
                          onChange={handleTheoryLinkChange}
                          placeholder="URL"
                          className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                        />
                        <textarea
                          name="description"
                          value={currentTheoryLink.description}
                          onChange={handleTheoryLinkChange}
                          placeholder="Description (optional)"
                          className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500 min-h-[60px]"
                        ></textarea>
                        <button
                          type="button"
                          onClick={handleAddTheoryLink}
                          disabled={!currentTheoryLink.title || !currentTheoryLink.url}
                          className={`px-4 py-2 rounded-md text-sm font-medium flex items-center ${
                            !currentTheoryLink.title || !currentTheoryLink.url
                              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                              : 'bg-blue-700 hover:bg-blue-600 text-white'
                          }`}
                        >
                          <Plus size={16} className="mr-1" />
                          Add Link
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Course Thumbnail */}
              <div>
                <label className="block text-gray-300 mb-2 flex items-center">
                  Course Thumbnail <span className="text-amber-400 text-sm ml-2">(Will be displayed in course listings)</span>
                </label>
                <div className="flex items-center justify-center border-2 border-dashed border-gray-600 rounded-lg p-6 bg-gray-700/50">
                  {thumbnailPreview ? (
                    <div className="relative w-full h-48">
                      <img
                        src={thumbnailPreview}
                        alt="Thumbnail preview"
                        className="w-full h-full object-cover rounded-md"
                      />
                      <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs py-1 px-2 rounded">
                        This is how your thumbnail will appear in course listings
                      </div>
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
                    <div className="space-y-3 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-500" />
                      <div className="text-sm text-gray-400">
                        <label htmlFor="thumbnail-upload" className="relative cursor-pointer bg-blue-700 rounded-md py-2 px-4 text-sm font-medium text-white hover:bg-blue-600">
                          <span>Upload an image</span>
                          <input 
                            id="thumbnail-upload" 
                            name="thumbnail" 
                            type="file" 
                            className="sr-only" 
                            accept="image/*"
                            onChange={handleThumbnailChange}
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 3MB</p>
                      <p className="text-xs text-amber-400">A good thumbnail increases course visibility</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Course Content */}
              <div>
                <label className="block text-gray-300 mb-2">
                  Course Content <span className="text-red-400">*</span>
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="Enter course content or syllabus"
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500 min-h-[120px]"
                  required
                ></textarea>
                <p className="text-xs text-gray-400 mt-1">
                  Provide the course content outline or syllabus. This is required.
                </p>
              </div>
              
              {/* Tags */}
              <div>
                <label className="block text-gray-300 mb-2 flex items-center">
                  <Tag className="mr-2" size={16} />
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.tags.map(tag => (
                    <div key={tag} className="bg-blue-900/40 text-blue-300 px-3 py-1 rounded-full text-sm flex items-center">
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-2 text-blue-300 hover:text-blue-100"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex">
                  <input
                    type="text"
                    value={currentTag}
                    onChange={e => setCurrentTag(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    placeholder="Add a tag"
                    className="flex-grow bg-gray-700 border border-gray-600 rounded-l-md py-2 px-3 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="bg-blue-600 hover:bg-blue-700 rounded-r-md px-4 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
              
              {/* Prerequisites */}
              <div>
                <label className="block text-gray-300 mb-2 flex items-center">
                  <BookOpen className="mr-2" size={16} />
                  Prerequisites
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.prerequisites.map(prerequisite => (
                    <div key={prerequisite} className="bg-purple-900/40 text-purple-300 px-3 py-1 rounded-full text-sm flex items-center">
                      {prerequisite}
                      <button
                        type="button"
                        onClick={() => handleRemovePrerequisite(prerequisite)}
                        className="ml-2 text-purple-300 hover:text-purple-100"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex">
                  <input
                    type="text"
                    value={currentPrerequisite}
                    onChange={e => setCurrentPrerequisite(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), handleAddPrerequisite())}
                    placeholder="Add a prerequisite"
                    className="flex-grow bg-gray-700 border border-gray-600 rounded-l-md py-2 px-3 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddPrerequisite}
                    className="bg-purple-600 hover:bg-purple-700 rounded-r-md px-4 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
              
              {/* Submit Buttons */}
              <div className="flex justify-end space-x-4 mt-8">
                <button
                  type="button"
                  onClick={() => navigate('/admindashboard')}
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
          )}
        </div>
      </div>
    </div>
  );
};

export default AddNewCourse; 