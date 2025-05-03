import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PlayCircle, 
  Upload, 
  Trash2, 
  Edit, 
  Check, 
  X, 
  ArrowLeft, 
  Youtube, 
  FileVideo, 
  AlertTriangle,
  Loader,
  Eye,
  ExternalLink
} from 'lucide-react';
import { promotionalVideoService } from '../api/apiClient';

const PromotionalVideoManager = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videoUrl: '',
    videoType: 'youtube',
    thumbnailUrl: ''
  });
  const [videoFile, setVideoFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Check if user is logged in and is admin
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userRole = localStorage.getItem('userRole');
    
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    
    if (userRole !== 'admin') {
      navigate('/userdashboard');
      return;
    }
    
    fetchVideos();
  }, [navigate]);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await promotionalVideoService.getAllVideos();
      setVideos(response.data.videos || []);
    } catch (err) {
      console.error('Error fetching promotional videos:', err);
      setError('Failed to load promotional videos');
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleVideoTypeChange = (type) => {
    setFormData({
      ...formData,
      videoType: type,
      videoUrl: ''
    });
    
    if (type === 'upload') {
      setVideoFile(null);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsUploading(true);
      setError(null);
      setSuccess(null);
      
      // Create a copy of form data to submit
      const videoData = {
        ...formData,
        isActive: editingVideo ? formData.isActive : true
      };
      
      // If file upload is selected
      if (formData.videoType === 'upload' && videoFile) {
        try {
          const formDataUpload = new FormData();
          formDataUpload.append('video', videoFile);
          
          // Upload the video file first
          const uploadResponse = await promotionalVideoService.uploadVideo(formDataUpload);
          
          if (uploadResponse.data && uploadResponse.data.videoUrl) {
            // Set the videoUrl from upload response
            videoData.videoUrl = uploadResponse.data.videoUrl;
          } else {
            throw new Error('Video upload failed - no URL returned from server');
          }
        } catch (uploadErr) {
          console.error('Error uploading video file:', uploadErr);
          throw new Error(`Video upload failed: ${uploadErr.response?.data?.message || uploadErr.message}`);
        }
      }
      
      // Ensure we have a valid videoUrl
      if (!videoData.videoUrl) {
        throw new Error('Video URL is required');
      }
      
      // Create or update the promotional video
      let response;
      if (editingVideo) {
        response = await promotionalVideoService.updateVideo(editingVideo._id, videoData);
        setSuccess('Promotional video updated successfully!');
      } else {
        response = await promotionalVideoService.createVideo(videoData);
        setSuccess('Promotional video created successfully!');
      }
      
      // Reset form and fetch updated videos
      setFormData({
        title: '',
        description: '',
        videoUrl: '',
        videoType: 'youtube',
        thumbnailUrl: ''
      });
      setVideoFile(null);
      setShowForm(false);
      setEditingVideo(null);
      setUploadSuccess(true);
      
      fetchVideos();
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 5000);
      
    } catch (err) {
      console.error('Error saving promotional video:', err);
      // Display more specific error message
      setError(err.response?.data?.message || err.message || 'Failed to save promotional video');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDeleteVideo = async (id) => {
    if (!window.confirm('Are you sure you want to delete this promotional video?')) {
      return;
    }
    
    try {
      setError(null);
      setSuccess(null);
      await promotionalVideoService.deleteVideo(id);
      setSuccess('Promotional video deleted successfully!');
      fetchVideos();
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 5000);
    } catch (err) {
      console.error('Error deleting promotional video:', err);
      setError(err.response?.data?.message || err.message || 'Failed to delete promotional video');
    }
  };

  const handleEditVideo = (video) => {
    setFormData({
      title: video.title,
      description: video.description,
      videoUrl: video.videoUrl,
      videoType: video.videoType,
      thumbnailUrl: video.thumbnailUrl || ''
    });
    setEditingVideo(video);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      videoUrl: '',
      videoType: 'youtube',
      thumbnailUrl: ''
    });
    setVideoFile(null);
    setEditingVideo(null);
    setShowForm(false);
  };

  // Function to get YouTube video ID from URL
  const getYoutubeVideoId = (url) => {
    if (!url) return null;
    
    // Regular expressions to extract YouTube video ID from different URL formats
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    
    return match && match[2].length === 11 ? match[2] : null;
  };

  const setActiveVideo = async (video) => {
    try {
      setError(null);
      setSuccess(null);
      await promotionalVideoService.updateVideo(video._id, { ...video, isActive: true });
      setSuccess(`"${video.title}" is now set as the active promotional video`);
      fetchVideos();
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 5000);
    } catch (err) {
      console.error('Error setting active video:', err);
      setError(err.response?.data?.message || err.message || 'Failed to set active video');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 p-4 shadow-md">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={() => navigate('/admindashboard')}
              className="text-gray-400 hover:text-white flex items-center mr-4"
            >
              <ArrowLeft className="w-5 h-5 mr-1" />
              Back to Dashboard
            </button>
            <h1 className="text-2xl font-bold text-red-400">Promotional Video Manager</h1>
          </div>
          
          {!showForm && (
            <button 
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg flex items-center"
            >
              <Upload className="w-5 h-5 mr-2" />
              Add New Video
            </button>
          )}
        </div>
      </header>
      
      <main className="container mx-auto py-8 px-4">
        {error && (
          <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6 flex items-start">
            <AlertTriangle className="w-5 h-5 mr-2 mt-0.5" />
            <div>
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
          </div>
        )}
        
        {success && (
          <div className="bg-green-900/20 border border-green-500 text-green-400 px-4 py-3 rounded-lg mb-6 flex items-start">
            <Check className="w-5 h-5 mr-2 mt-0.5" />
            <div>
              <p className="font-bold">Success</p>
              <p>{success}</p>
            </div>
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader className="w-8 h-8 text-red-500 animate-spin" />
            <span className="ml-2 text-xl text-gray-400">Loading videos...</span>
          </div>
        ) : (
          <>
            {showForm ? (
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">
                    {editingVideo ? 'Edit Promotional Video' : 'Add New Promotional Video'}
                  </h2>
                  <button 
                    onClick={resetForm} 
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-gray-300 mb-2">Video Title</label>
                      <input 
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Enter video title"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-300 mb-2">Thumbnail URL (Optional)</label>
                      <input 
                        type="url"
                        name="thumbnailUrl"
                        value={formData.thumbnailUrl}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Enter thumbnail URL"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-gray-300 mb-2">Video Description</label>
                    <textarea 
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 min-h-[100px]"
                      placeholder="Enter video description"
                      required
                    ></textarea>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-gray-300 mb-2">Video Type</label>
                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => handleVideoTypeChange('youtube')}
                        className={`px-4 py-2 rounded-lg flex items-center ${
                          formData.videoType === 'youtube' 
                            ? 'bg-red-600 text-white' 
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        <Youtube className="w-5 h-5 mr-2" />
                        YouTube
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => handleVideoTypeChange('drive')}
                        className={`px-4 py-2 rounded-lg flex items-center ${
                          formData.videoType === 'drive' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        <ExternalLink className="w-5 h-5 mr-2" />
                        Google Drive
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => handleVideoTypeChange('upload')}
                        className={`px-4 py-2 rounded-lg flex items-center ${
                          formData.videoType === 'upload' 
                            ? 'bg-green-600 text-white' 
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        <FileVideo className="w-5 h-5 mr-2" />
                        Upload Video
                      </button>
                    </div>
                  </div>
                  
                  {formData.videoType === 'youtube' && (
                    <div className="mb-6">
                      <label className="block text-gray-300 mb-2">YouTube Video URL</label>
                      <input 
                        type="url"
                        name="videoUrl"
                        value={formData.videoUrl}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="https://www.youtube.com/watch?v=..."
                        required
                      />
                      
                      {formData.videoUrl && getYoutubeVideoId(formData.videoUrl) && (
                        <div className="mt-4 p-3 bg-gray-700/50 rounded-lg">
                          <p className="text-sm text-gray-300 mb-2">Preview:</p>
                          <div className="aspect-video bg-black">
                            <iframe 
                              src={`https://www.youtube.com/embed/${getYoutubeVideoId(formData.videoUrl)}`}
                              title="YouTube Video Preview"
                              className="w-full h-full"
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            ></iframe>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {formData.videoType === 'drive' && (
                    <div className="mb-6">
                      <label className="block text-gray-300 mb-2">Google Drive Embed URL</label>
                      <input 
                        type="url"
                        name="videoUrl"
                        value={formData.videoUrl}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="https://drive.google.com/file/d/..."
                        required
                      />
                      <p className="text-sm text-gray-400 mt-1">
                        Make sure your Google Drive video has sharing permissions set to "Anyone with the link can view"
                      </p>
                    </div>
                  )}
                  
                  {formData.videoType === 'upload' && (
                    <div className="mb-6">
                      <label className="block text-gray-300 mb-2">Upload Video File</label>
                      
                      <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
                        {videoFile ? (
                          <div>
                            <p className="text-gray-300 mb-2">{videoFile.name}</p>
                            <p className="text-gray-400 text-sm mb-3">
                              {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                            <button
                              type="button"
                              onClick={() => setVideoFile(null)}
                              className="px-3 py-1 bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
                            >
                              Remove
                            </button>
                          </div>
                        ) : (
                          <div>
                            <FileVideo className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                            <p className="text-gray-300 mb-2">Drag and drop a video file or click to browse</p>
                            <p className="text-gray-400 text-sm mb-3">
                              MP4, WebM, or Ogg format, max 200MB
                            </p>
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="px-4 py-2 bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
                            >
                              Browse Files
                            </button>
                            <input 
                              type="file"
                              ref={fileInputRef}
                              onChange={handleFileChange}
                              accept="video/mp4,video/webm,video/ogg"
                              className="hidden"
                            />
                          </div>
                        )}
                      </div>
                      
                      {isUploading && (
                        <div className="mt-4">
                          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-red-500" 
                              style={{ width: `${uploadProgress}%` }}
                            ></div>
                          </div>
                          <p className="text-gray-400 text-sm mt-1">
                            Uploading: {uploadProgress}%
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="flex justify-end mt-8">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg mr-3 hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                    
                    <button
                      type="submit"
                      disabled={isUploading || (formData.videoType === 'upload' && !videoFile && !formData.videoUrl)}
                      className={`px-4 py-2 rounded-lg flex items-center ${
                        isUploading || (formData.videoType === 'upload' && !videoFile && !formData.videoUrl)
                          ? 'bg-red-500/50 text-white cursor-not-allowed'
                          : 'bg-red-600 text-white hover:bg-red-700'
                      }`}
                    >
                      {isUploading ? (
                        <>
                          <Loader className="w-5 h-5 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Check className="w-5 h-5 mr-2" />
                          {editingVideo ? 'Update Video' : 'Save Video'}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            ) : null}
            
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-6">Promotional Videos</h2>
              
              {videos.length === 0 ? (
                <div className="bg-gray-800 rounded-lg p-8 text-center border border-gray-700">
                  <PlayCircle className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                  <p className="text-gray-300 mb-2">No promotional videos available</p>
                  <p className="text-gray-400 text-sm mb-4">
                    Add a new promotional video to showcase on the landing page
                  </p>
                  <button 
                    onClick={() => setShowForm(true)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg flex items-center mx-auto"
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    Add New Video
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {videos.map((video) => (
                    <div 
                      key={video._id} 
                      className={`bg-gray-800 rounded-lg overflow-hidden border ${
                        video.isActive ? 'border-red-500' : 'border-gray-700'
                      }`}
                    >
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/3 relative overflow-hidden">
                          {video.videoType === 'youtube' && getYoutubeVideoId(video.videoUrl) ? (
                            <img 
                              src={video.thumbnailUrl || `https://img.youtube.com/vi/${getYoutubeVideoId(video.videoUrl)}/maxresdefault.jpg`}
                              alt={video.title}
                              className="w-full h-full object-cover aspect-video"
                            />
                          ) : (
                            <div className="bg-gray-900 aspect-video flex items-center justify-center">
                              <PlayCircle className="w-12 h-12 text-red-500" />
                            </div>
                          )}
                          
                          {video.isActive && (
                            <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                              Active
                            </div>
                          )}
                        </div>
                        
                        <div className="p-6 flex-1">
                          <h3 className="text-xl font-bold mb-2">{video.title}</h3>
                          <p className="text-gray-400 mb-4">{video.description}</p>
                          
                          <div className="flex flex-wrap gap-2 mb-4">
                            <span className={`px-2 py-1 rounded text-xs ${
                              video.videoType === 'youtube' ? 'bg-red-500/20 text-red-400' :
                              video.videoType === 'drive' ? 'bg-blue-500/20 text-blue-400' :
                              'bg-green-500/20 text-green-400'
                            }`}>
                              {video.videoType === 'youtube' ? 'YouTube' : 
                               video.videoType === 'drive' ? 'Google Drive' : 
                               'Uploaded Video'}
                            </span>
                            
                            <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">
                              {new Date(video.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => handleEditVideo(video)}
                              className="px-3 py-1 bg-blue-600 text-white rounded-lg flex items-center text-sm hover:bg-blue-700"
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </button>
                            
                            {!video.isActive && (
                              <button
                                onClick={() => setActiveVideo(video)}
                                className="px-3 py-1 bg-green-600 text-white rounded-lg flex items-center text-sm hover:bg-green-700"
                              >
                                <Check className="w-4 h-4 mr-1" />
                                Set Active
                              </button>
                            )}
                            
                            {video.isActive && (
                              <span className="px-3 py-1 bg-green-600/20 text-green-400 rounded-lg flex items-center text-sm">
                                <Check className="w-4 h-4 mr-1" />
                                Active Video
                              </span>
                            )}
                            
                            <button
                              onClick={() => handleDeleteVideo(video._id)}
                              className="px-3 py-1 bg-red-600 text-white rounded-lg flex items-center text-sm hover:bg-red-700"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Delete
                            </button>
                            
                            <a
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                window.open('/', '_blank');
                              }}
                              className="px-3 py-1 bg-gray-700 text-gray-300 rounded-lg flex items-center text-sm hover:bg-gray-600"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Preview on Site
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default PromotionalVideoManager; 