import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Users,
  BookOpen,
  Briefcase,
  FileText,
  Bell,
  Settings,
  PlusCircle,
  List,
  Edit,
  Trash2,
  MessageSquare,
  Mail,
  CheckCircle,
  RefreshCw,
  XCircle,
  AlertCircle,
  Globe,
  MessageCircle,
  Heart,
  Send,
  Image as ImageIcon,
  File,
  X,
  Paperclip as PaperclipIcon,
  Download
} from 'lucide-react';
import { apiClient, communityAPI } from '../api/apiClient';

// CSS styles for animations and gradients
const styles = {
  fadeIn: {
    animation: 'fadeIn 0.3s ease-out',
  },
  gradientRadial: {
    background: 'radial-gradient(circle, rgba(6, 182, 212, 0.1) 0%, rgba(0, 0, 0, 0) 70%)',
  }
};

// Animation keyframes
const keyframes = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    users: 0,
    courses: 0,
    jobs: 0,
    notices: 0,
    feedback: 0,
    globalPosts: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [recentJobs, setRecentJobs] = useState([]);
  const [recentNotices, setRecentNotices] = useState([]);
  const [recentCourses, setRecentCourses] = useState([]);
  
  // Feedback management state
  const [feedbackList, setFeedbackList] = useState([]);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [sendingResponse, setSendingResponse] = useState(false);
  const [feedbackFilter, setFeedbackFilter] = useState('all');

  // Community management state
  const [globalPosts, setGlobalPosts] = useState([]);
  const [loadingCommunity, setLoadingCommunity] = useState(false);
  const [newAnnouncementText, setNewAnnouncementText] = useState('');
  const [postImage, setPostImage] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [fileAttachment, setFileAttachment] = useState(null);
  const [commentText, setCommentText] = useState({});
  const [showCommunitySection, setShowCommunitySection] = useState(false);
  const fileInputRef = useRef(null);

  // Check if user is admin
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    
    if (!token || userRole !== 'admin') {
      navigate('/login', { state: { message: 'You must be logged in as admin to access this page' } });
      return;
    }
    
    // Verify admin status with the server
    const verifyAdminStatus = async () => {
      try {
        const response = await communityAPI.checkAdminStatus();
        if (!response.data.isAdmin) {
          console.error('User is not an admin:', response.data);
          localStorage.removeItem('userRole');
          navigate('/login', { state: { message: 'Admin access required' } });
        } else {
          console.log('Admin status verified:', response.data);
        }
      } catch (error) {
        console.error('Error verifying admin status:', error);
        // Continue anyway since we already checked localStorage
      }
    };
    
    verifyAdminStatus();
  }, [navigate]);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        
        // Get job count and recent jobs
        const jobsResponse = await axios.get('http://localhost:5000/api/jobs', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Get recent jobs
        const recentJobsData = jobsResponse.data.slice(0, 5);
        setRecentJobs(recentJobsData);
        
        // Get notices count and recent notices
        const noticesResponse = await axios.get('http://localhost:5000/api/notices', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Get recent notices
        const recentNoticesData = noticesResponse.data.slice(0, 5);
        setRecentNotices(recentNoticesData);
        
        // Get courses count and data
        const coursesResponse = await axios.get('http://localhost:5000/api/courses', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Get recent courses
        const recentCoursesData = coursesResponse.data.slice(0, 5);
        setRecentCourses(recentCoursesData);
        
        // Get feedback data
        const feedbackResponse = await axios.get('http://localhost:5000/api/feedback', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Get global posts data
        const globalPostsResponse = await communityAPI.getGlobalPosts();
        
        setStats(prev => ({
          ...prev,
          jobs: jobsResponse.data.length,
          notices: noticesResponse.data.length,
          courses: coursesResponse.data.length,
          feedback: feedbackResponse.data.length,
          globalPosts: globalPostsResponse.data.length
        }));
        
        // Set the feedback list with the most recent 5 items
        setFeedbackList(feedbackResponse.data.slice(0, 5));
        
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  // Load community section by default
  useEffect(() => {
    // Show community section and load data when component mounts
    setShowCommunitySection(true);
    fetchCommunityData();
  }, []);
  
  // Fetch community data
  const fetchCommunityData = async () => {
    setLoadingCommunity(true);
    try {
      // Get global posts
      const postsResponse = await communityAPI.getGlobalPosts();
      setGlobalPosts(postsResponse.data);
      
      // Fetch all users
      fetchAllUsers();
      
    } catch (error) {
      console.error('Error fetching community data:', error);
    } finally {
      setLoadingCommunity(false);
    }
  };

  // Dedicated function to fetch all users
  const fetchAllUsers = async () => {
    try {
      console.log('Fetching all users for admin chat...');
      // First try with new admin endpoint
      try {
        const usersResponse = await communityAPI.getAdminUsers();
        console.log('Admin users endpoint succeeded:', usersResponse.data.length, 'users found');
        setAllUsers(usersResponse.data);
        setFilteredUsers(usersResponse.data);
      } catch (adminError) {
        console.log('Admin endpoint failed:', adminError);
        // Try original admin endpoint
        try {
          console.log('Trying original endpoint...');
          const usersResponse = await communityAPI.getAllUsers();
          console.log('Original admin users endpoint succeeded:', usersResponse.data.length, 'users found');
          setAllUsers(usersResponse.data);
          setFilteredUsers(usersResponse.data);
        } catch (originalError) {
          // If admin endpoint fails, fall back to global members
          try {
            console.log('Falling back to global members endpoint');
            const globalMembersResponse = await communityAPI.getGlobalMembers();
            console.log('Global members endpoint succeeded:', globalMembersResponse.data.length, 'users found');
            setAllUsers(globalMembersResponse.data);
            setFilteredUsers(globalMembersResponse.data);
          } catch (globalError) {
            console.error('Global members endpoint also failed:', globalError);
            // Try a direct API call with axios as last resort
            try {
              const token = localStorage.getItem('token');
              const directResponse = await axios.get('http://localhost:5000/api/community/global/members', {
                headers: { Authorization: `Bearer ${token}` }
              });
              console.log('Direct API call succeeded:', directResponse.data.length, 'users found');
              setAllUsers(directResponse.data);
              setFilteredUsers(directResponse.data);
            } catch (directError) {
              console.error('Direct API call failed:', directError);
              throw new Error('All API methods failed');
            }
          }
        }
      }
    } catch (error) {
      console.error('All methods of fetching users failed:', error);
      alert('Could not load users. Please try refreshing the page.');
    }
  };
  
  // Filter users when search query changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredUsers(allUsers);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = allUsers.filter(user => 
      user.name.toLowerCase().includes(query) || 
      (user.university && user.university.toLowerCase().includes(query))
    );
    
    setFilteredUsers(filtered);
  }, [searchQuery, allUsers]);
  
  // Fetch conversation with a user
  const fetchConversation = async (userId) => {
    if (!userId) return;
    
    try {
      const response = await communityAPI.getConversation(userId);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching conversation:', error);
    }
  };
  
  // Toggle community management section and load data
  const toggleCommunitySection = () => {
    const newState = !showCommunitySection;
    setShowCommunitySection(newState);
    
    if (newState) {
      fetchCommunityData();
      // Add a small delay before scrolling to ensure the section is rendered
      setTimeout(() => {
        document.getElementById('community-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  // Function to handle clicking "Click to manage" in the stats card
  const handleManageCommunity = () => {
    setShowCommunitySection(true);
    fetchCommunityData();
    // Add a small delay before scrolling to ensure the section is rendered
    setTimeout(() => {
      document.getElementById('community-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };
  
  // Fetch feedback based on filter
  const fetchFeedback = async (status = 'all') => {
    setLoadingFeedback(true);
    try {
      const token = localStorage.getItem('token');
      let url = 'http://localhost:5000/api/feedback';
      
      if (status !== 'all') {
        url += `?status=${status}`;
      }
      
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setFeedbackList(response.data);
    } catch (error) {
      console.error('Error fetching feedback:', error);
    } finally {
      setLoadingFeedback(false);
    }
  };
  
  // Handle feedback status update
  const updateFeedbackStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/feedback/${id}`, 
        { status },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      // Refresh feedback list
      fetchFeedback(feedbackFilter);
    } catch (error) {
      console.error('Error updating feedback status:', error);
    }
  };
  
  // Handle open response modal
  const openResponseModal = (feedback) => {
    setSelectedFeedback(feedback);
    setResponseText('');
    setShowResponseModal(true);
  };
  
  // Handle sending response to user
  const sendResponse = async () => {
    if (!selectedFeedback || !responseText.trim()) return;
    
    setSendingResponse(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/feedback/${selectedFeedback._id}`, 
        { 
          status: 'resolved',
          adminResponse: responseText 
        },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      // Close modal and refresh feedback list
      setShowResponseModal(false);
      setResponseText('');
      setSelectedFeedback(null);
      fetchFeedback(feedbackFilter);
      
    } catch (error) {
      console.error('Error sending response:', error);
    } finally {
      setSendingResponse(false);
    }
  };

  // Handle image upload for global announcements
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('Image size should be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPostImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Create a new global announcement
  const handleCreateAnnouncement = async () => {
    if (!newAnnouncementText.trim()) return;
    
    try {
      // Check if admin role is properly set
      const userRole = localStorage.getItem('userRole');
      if (userRole !== 'admin') {
        console.error('User role is not admin:', userRole);
        alert('Error: You must be an admin to post global announcements.');
        return;
      }
      
      // Get user ID from localStorage
      const userId = localStorage.getItem('userId');
      if (!userId) {
        console.error('No user ID found in localStorage');
        alert('Error: User authentication issue. Please log in again.');
        return;
      }
      
      const postData = {
        content: newAnnouncementText,
        media: postImage || '',
        isGlobal: true,
        role: 'admin' // Explicitly include role
      };
      
      console.log("Creating announcement with data:", postData);
      
      // Check token validity before posting
      try {
        await communityAPI.checkAdminStatus();
      } catch (authError) {
        console.error('Admin status check failed:', authError);
        // Continue anyway - the createPost function has fallbacks
      }
      
      const response = await communityAPI.createPost(postData);
      console.log("Announcement creation response:", response);
      
      // Add the new post to the list and clear form
      setGlobalPosts(prevPosts => [response.data, ...prevPosts]);
      setNewAnnouncementText('');
      setPostImage(null);
      
      // Update stats
      setStats(prev => ({
        ...prev,
        globalPosts: prev.globalPosts + 1
      }));
      
    } catch (error) {
      console.error('Error creating announcement:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Error message:', error.message);
      
      // Display a more helpful error message
      let errorMessage = 'Error creating announcement. Please try again.';
      if (error.response?.data?.message) {
        errorMessage = `Error: ${error.response.data.message}`;
      } else if (error.message) {
        errorMessage = `Error: ${error.message}`;
      }
      
      alert(errorMessage);
    }
  };
  
  // Add a comment to a post
  const handleAddComment = async (postId) => {
    if (!commentText[postId]?.trim()) return;
    
    try {
      const response = await communityAPI.addComment(postId, commentText[postId]);
      
      // Update the posts state with the new comment
      const updatedPosts = globalPosts.map(post => 
        post._id === postId ? response.data : post
      );
      
      setGlobalPosts(updatedPosts);
      setCommentText({...commentText, [postId]: ''});
      
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Error adding comment. Please try again.');
    }
  };
  
  // Like a post
  const handleLikePost = async (postId) => {
    try {
      const response = await communityAPI.likePost(postId);
      
      // Update the posts state with the updated likes
      const updatedPosts = globalPosts.map(post => 
        post._id === postId ? response.data : post
      );
      
      setGlobalPosts(updatedPosts);
      
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };
  
  // Send a message to a user
  const handleSendMessage = async () => {
    if ((!newMessage.trim() && !fileAttachment) || !selectedUser) return;
    
    try {
      // Add global flag to allow cross-university messaging
      const response = await communityAPI.sendMessage(
        selectedUser._id, 
        newMessage || 'Sent an attachment', 
        fileAttachment ? fileAttachment.fileData : null,  // Include attachment if present
        true   // Set global flag to true for admin messages
      );
      
      // Add new message to the conversation
      setMessages(prevMessages => [...prevMessages, response.data]);
      setNewMessage('');
      setFileAttachment(null);
      
      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Error sending message. Please try again.');
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Handle file attachment
  const handleFileAttachment = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert('File size should be less than 10MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFileAttachment({
          file: file,
          fileName: file.name,
          fileType: file.type,
          fileData: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Clear file attachment
  const handleClearAttachment = () => {
    setFileAttachment(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Get file type icon
  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) {
      return <ImageIcon className="h-4 w-4" />;
    } else if (fileType.startsWith('application/pdf')) {
      return <FileText className="h-4 w-4" />;
    } else {
      return <File className="h-4 w-4" />;
    }
  };

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen">
      {/* Header/Navbar */}
      <header className="bg-gray-800 p-4 border-b border-gray-700">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-cyan-400">Edu Hub Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleManageCommunity} 
              className={`flex items-center px-3 py-1.5 rounded transition-colors ${
                showCommunitySection ? 'bg-cyan-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Globe className="h-4 w-4 mr-1.5" />
              Community
            </button>
            <span className="text-gray-300">Welcome, Admin!</span>
            <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white">
              View Site
            </button>
            <Settings className="h-5 w-5 text-gray-400 cursor-pointer hover:text-cyan-400 transition duration-200" />
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 p-6 rounded-lg border border-blue-700/50 shadow-lg">
            <div className="flex items-center mb-3">
              <Users className="h-7 w-7 text-blue-400 mr-3" />
              <h3 className="text-lg font-semibold text-gray-200">Total Users</h3>
            </div>
            <p className="text-3xl font-bold text-white">{isLoading ? '...' : stats.users || 0}</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 p-6 rounded-lg border border-green-700/50 shadow-lg">
            <div className="flex items-center mb-3">
              <BookOpen className="h-7 w-7 text-green-400 mr-3" />
              <h3 className="text-lg font-semibold text-gray-200">Total Courses</h3>
            </div>
            <p className="text-3xl font-bold text-white">{isLoading ? '...' : stats.courses || 0}</p>
        </div>

          <div className="bg-gradient-to-br from-amber-600/20 to-amber-800/20 p-6 rounded-lg border border-amber-700/50 shadow-lg">
            <div className="flex items-center mb-3">
              <Briefcase className="h-7 w-7 text-amber-400 mr-3" />
              <h3 className="text-lg font-semibold text-gray-200">Total Jobs</h3>
            </div>
            <p className="text-3xl font-bold text-white">{isLoading ? '...' : stats.jobs || 0}</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 p-6 rounded-lg border border-purple-700/50 shadow-lg">
            <div className="flex items-center mb-3">
              <Bell className="h-7 w-7 text-purple-400 mr-3" />
              <h3 className="text-lg font-semibold text-gray-200">Total Notices</h3>
            </div>
            <p className="text-3xl font-bold text-white">{isLoading ? '...' : stats.notices || 0}</p>
          </div>
          
          <div className="bg-gradient-to-br from-pink-600/20 to-pink-800/20 p-6 rounded-lg border border-pink-700/50 shadow-lg">
            <div className="flex items-center mb-3">
              <MessageSquare className="h-7 w-7 text-pink-400 mr-3" />
              <h3 className="text-lg font-semibold text-gray-200">Feedback</h3>
            </div>
            <p className="text-3xl font-bold text-white">{isLoading ? '...' : stats.feedback || 0}</p>
          </div>
          
          <div className="bg-gradient-to-br from-cyan-600/20 to-cyan-800/20 p-6 rounded-lg border border-cyan-700/50 shadow-lg cursor-pointer hover:bg-cyan-700/30 transition-colors" onClick={handleManageCommunity}>
            <div className="flex items-center mb-3">
              <Globe className="h-7 w-7 text-cyan-400 mr-3" />
              <h3 className="text-lg font-semibold text-gray-200">Community</h3>
            </div>
            <p className="text-3xl font-bold text-white">{isLoading ? '...' : stats.globalPosts || 0}</p>
            <div className="flex items-center mt-2">
              <MessageCircle className="h-3 w-3 mr-1 text-cyan-300" />
              <p className="text-xs text-cyan-300">
                Click to manage global community
              </p>
            </div>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="mb-10">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold mb-4 text-white">Quick Actions</h2>
            <button 
              onClick={handleManageCommunity}
              className="flex items-center mb-4 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg text-sm"
            >
              <Globe className="h-4 w-4 mr-2" />
              Jump to Community
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              onClick={() => navigate('/post-job')}
              className="flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white py-4 px-6 rounded-lg shadow-lg transition-all duration-200"
            >
              <PlusCircle className="h-5 w-5" />
              <span>Post New Job</span>
            </button>
            
            <button 
              onClick={() => navigate('/upload-course')}
              className="flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white py-4 px-6 rounded-lg shadow-lg transition-all duration-200"
            >
              <PlusCircle className="h-5 w-5" />
              <span>Upload New Course</span>
            </button>
            
            <button 
              onClick={() => navigate('/post-notice')}
              className="flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white py-4 px-6 rounded-lg shadow-lg transition-all duration-200"
            >
              <PlusCircle className="h-5 w-5" />
              <span>Post New Notice</span>
            </button>
          </div>
        </div>

        {/* Feedback Management Section */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">User Feedback & Suggestions</h2>
            <div className="flex space-x-2">
              <select
                value={feedbackFilter}
                onChange={(e) => {
                  setFeedbackFilter(e.target.value);
                  fetchFeedback(e.target.value);
                }}
                className="bg-gray-700 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 py-2 px-3"
              >
                <option value="all">All Feedback</option>
                <option value="new">New</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>
          
          {loadingFeedback ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mx-auto"></div>
              <p className="mt-3 text-gray-400">Loading feedback...</p>
      </div>
          ) : feedbackList.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">No feedback found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-gray-900 rounded-lg overflow-hidden">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Subject</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Type</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">From</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                    <th className="py-3 px-4 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {feedbackList.map(feedback => (
                    <tr key={feedback._id} className="hover:bg-gray-800/60">
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">{feedback.subject}</div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${feedback.category === 'suggestion' ? 'bg-blue-100 text-blue-800' : 
                          feedback.category === 'bug' ? 'bg-red-100 text-red-800' : 
                          feedback.category === 'feature' ? 'bg-green-100 text-green-800' : 
                          feedback.category === 'complaint' ? 'bg-amber-100 text-amber-800' :
                          feedback.category === 'praise' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'}`}>
                          {feedback.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">{feedback.userName}</div>
                        <div className="text-xs text-gray-400">{feedback.userEmail}</div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${feedback.status === 'new' ? 'bg-cyan-100 text-cyan-800' : 
                          feedback.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' : 
                          feedback.status === 'resolved' ? 'bg-green-100 text-green-800' : 
                          'bg-gray-100 text-gray-800'}`}>
                          {feedback.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">
                          {new Date(feedback.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => openResponseModal(feedback)}
                          className="text-cyan-400 hover:text-cyan-300 mr-3"
                          title="Reply to feedback"
                        >
                          <Mail className="h-4 w-4" />
                        </button>
                        
                        {feedback.status === 'new' && (
                          <button 
                            onClick={() => updateFeedbackStatus(feedback._id, 'in-progress')}
                            className="text-yellow-400 hover:text-yellow-300 mr-3"
                            title="Mark as in progress"
                          >
                            <RefreshCw className="h-4 w-4" />
                          </button>
                        )}
                        
                        {feedback.status !== 'resolved' && feedback.status !== 'closed' && (
                          <button 
                            onClick={() => updateFeedbackStatus(feedback._id, 'resolved')}
                            className="text-green-400 hover:text-green-300 mr-3"
                            title="Mark as resolved"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        )}
                        
                        {feedback.status !== 'closed' && (
                          <button 
                            onClick={() => updateFeedbackStatus(feedback._id, 'closed')}
                            className="text-red-400 hover:text-red-300"
                            title="Close feedback"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {/* Recent Jobs */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">Recently Posted Jobs</h2>
            <div className="flex space-x-2">
              <button 
                onClick={() => navigate('/post-job')}
                className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm flex items-center"
              >
                <PlusCircle className="h-4 w-4 mr-1" />
                Add New
              </button>
              <button 
                onClick={() => navigate('/manage-jobs')}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm flex items-center"
              >
                <List className="h-4 w-4 mr-1" />
                View All
              </button>
            </div>
          </div>
          
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500 mx-auto"></div>
              <p className="mt-3 text-gray-400">Loading jobs...</p>
            </div>
          ) : recentJobs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">No jobs posted yet</p>
              <button 
                onClick={() => navigate('/post-job')}
                className="mt-3 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm inline-flex items-center"
              >
                <PlusCircle className="h-4 w-4 mr-1" />
                Post Your First Job
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-gray-900 rounded-lg overflow-hidden">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Title</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Company</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Location</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Type</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Posted On</th>
                    <th className="py-3 px-4 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {recentJobs.map(job => (
                    <tr key={job._id} className="hover:bg-gray-800/60">
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">{job.title}</div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">{job.company}</div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">{job.location}</div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${job.type === 'full-time' ? 'bg-green-100 text-green-800' : 
                          job.type === 'part-time' ? 'bg-blue-100 text-blue-800' : 
                          job.type === 'internship' ? 'bg-purple-100 text-purple-800' : 
                          'bg-amber-100 text-amber-800'}`}>
                          {job.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">
                          {new Date(job.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-indigo-400 hover:text-indigo-300 mr-3">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-red-400 hover:text-red-300">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {/* Recent Courses */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">Academic Courses</h2>
            <div className="flex space-x-2">
              <button 
                onClick={() => navigate('/upload-course')}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm flex items-center"
              >
                <PlusCircle className="h-4 w-4 mr-1" />
                Add New
              </button>
              <button 
                onClick={() => navigate('/manage-courses')}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm flex items-center"
              >
                <List className="h-4 w-4 mr-1" />
                View All
              </button>
            </div>
          </div>
          
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
              <p className="mt-3 text-gray-400">Loading courses...</p>
            </div>
          ) : recentCourses.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">No courses uploaded yet</p>
              <button 
                onClick={() => navigate('/upload-course')}
                className="mt-3 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm inline-flex items-center"
              >
                <PlusCircle className="h-4 w-4 mr-1" />
                Upload Your First Course
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-gray-900 rounded-lg overflow-hidden">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Title</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Instructor</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Type</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Department</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Level</th>
                    <th className="py-3 px-4 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {recentCourses.map(course => (
                    <tr key={course._id} className="hover:bg-gray-800/60">
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">{course.title}</div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">{course.instructor}</div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${course.courseType === 'academic' ? 'bg-blue-100 text-blue-800' : 
                          'bg-purple-100 text-purple-800'}`}>
                          {course.courseType === 'academic' ? 'Academic' : 'Co-curricular'}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">
                          {course.courseType === 'academic' ? course.department : course.activityType}
                        </div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${course.skillLevel === 'beginner' ? 'bg-green-100 text-green-800' : 
                          course.skillLevel === 'intermediate' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'}`}>
                          {course.skillLevel.charAt(0).toUpperCase() + course.skillLevel.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-indigo-400 hover:text-indigo-300 mr-3">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-red-400 hover:text-red-300">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {/* Recent Notices */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">
              Recent Notices
            </h2>
            <button
              onClick={() => navigate('/post-notice')}
              className="flex items-center text-purple-400 hover:text-purple-300 transition-colors"
            >
              <PlusCircle className="h-5 w-5 mr-1" /> 
              Add New Notice
            </button>
          </div>
          
          {isLoading ? (
            <div className="bg-gray-800 rounded-lg p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
              <p className="mt-4 text-gray-400">Loading notices...</p>
            </div>
          ) : recentNotices.length === 0 ? (
            <div className="bg-gray-800 rounded-lg p-8 text-center">
              <Bell className="h-16 w-16 text-purple-500/50 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No Notices Posted Yet</h3>
              <p className="text-gray-400 mb-6">Start creating notices to keep students informed about important updates.</p>
              <button
                onClick={() => navigate('/post-notice')}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                Post Your First Notice
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-gray-900 rounded-lg overflow-hidden">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Title</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">University</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Category</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Importance</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Posted On</th>
                    <th className="py-3 px-4 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {recentNotices.map((notice) => (
                    <tr key={notice._id} className="hover:bg-gray-800/50">
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">{notice.title}</div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">{notice.targetUniversity}</div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          notice.category === 'academic' ? 'bg-blue-500/20 text-blue-400' : 
                          notice.category === 'event' ? 'bg-green-500/20 text-green-400' :
                          notice.category === 'announcement' ? 'bg-indigo-500/20 text-indigo-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {notice.category.charAt(0).toUpperCase() + notice.category.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          notice.importance === 'urgent' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                          notice.importance === 'important' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                          'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        }`}>
                          {notice.importance.charAt(0).toUpperCase() + notice.importance.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="text-sm text-gray-400">
                          {new Date(notice.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-indigo-400 hover:text-indigo-300 mr-3">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-red-400 hover:text-red-300">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Response Modal */}
      {showResponseModal && selectedFeedback && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-fadeIn">
            <div className="bg-gray-700 p-4">
              <h3 className="text-lg font-medium text-white">Reply to Feedback</h3>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <p className="text-sm text-gray-400">From: {selectedFeedback.userName} ({selectedFeedback.userEmail})</p>
                <p className="text-sm text-gray-400 mt-1">Subject: {selectedFeedback.subject}</p>
                <p className="text-sm text-gray-400 mt-1">Category: {selectedFeedback.category}</p>
              </div>
              
              <div className="mb-6 bg-gray-700 p-4 rounded-lg">
                <p className="text-sm text-gray-300">{selectedFeedback.message}</p>
              </div>
              
              <div className="mb-4">
                <label htmlFor="response" className="block text-sm font-medium text-gray-300 mb-2">
                  Your Response
                </label>
                <textarea
                  id="response"
                  rows="4"
                  className="w-full px-3 py-2 text-gray-100 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="Type your response here..."
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                ></textarea>
              </div>
            </div>
            
            <div className="px-6 py-4 bg-gray-700 flex justify-end space-x-3">
              <button
                onClick={() => setShowResponseModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-600 rounded-lg hover:bg-gray-500 focus:outline-none"
              >
                Cancel
              </button>
              <button
                onClick={sendResponse}
                disabled={!responseText.trim() || sendingResponse}
                className={`px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none flex items-center
                  ${!responseText.trim() || sendingResponse ? 'bg-cyan-600/50 cursor-not-allowed' : 'bg-cyan-600 hover:bg-cyan-700'}`}
              >
                {sendingResponse ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4 mr-2" />
                    Send Response
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Community Management Section - Conditionally rendered */}
      {showCommunitySection && (
        <div 
          id="community-section" 
          className="bg-gray-800 rounded-lg p-6 mb-8 border-2 border-cyan-600/50 mt-8 relative shadow-lg" 
          style={{...styles.fadeIn}}
        >
          <style>{keyframes}</style>
          <div style={{...styles.gradientRadial}} className="absolute top-0 right-0 w-20 h-20 rounded-full -mr-10 -mt-10 pointer-events-none"></div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-cyan-400 flex items-center">
              <Globe className="h-6 w-6 mr-2" />
              Global Community Management
            </h2>
            <button
              className="text-gray-400 hover:text-white transition-colors"
              onClick={toggleCommunitySection}
            >
              <XCircle className="h-6 w-6" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Global Posts and Create Announcement */}
            <div>
              <div className="bg-gray-750 p-4 rounded-lg shadow-md mb-6">
                <h3 className="text-lg font-semibold text-cyan-400 mb-4">Create Global Announcement</h3>
                
                <textarea
                  className="w-full bg-gray-700 text-white rounded-lg p-3 mb-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="Share an announcement with all users..."
                  rows="3"
                  value={newAnnouncementText}
                  onChange={(e) => setNewAnnouncementText(e.target.value)}
                />
                
                {postImage && (
                  <div className="mb-3 relative">
                    <img 
                      src={postImage} 
                      alt="Post preview" 
                      className="max-h-40 rounded-lg"
                    />
                    <button 
                      className="absolute top-2 right-2 bg-gray-800 p-1 rounded-full text-gray-300 hover:text-white"
                      onClick={() => setPostImage(null)}
                    >
                      <XCircle className="h-5 w-5" />
                    </button>
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <label className="cursor-pointer flex items-center text-gray-300 hover:text-white transition-colors">
                    <ImageIcon className="h-5 w-5 mr-2" />
                    <span>Add Image</span>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                  <button
                    className="bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleCreateAnnouncement}
                    disabled={!newAnnouncementText.trim()}
                  >
                    Post Global Announcement
                  </button>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-white mb-4">Global Announcements</h3>
              
              {loadingCommunity ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mx-auto"></div>
                  <p className="mt-3 text-gray-400">Loading announcements...</p>
                </div>
              ) : globalPosts.length === 0 ? (
                <div className="text-center py-8 bg-gray-750 rounded-lg">
                  <Globe className="h-12 w-12 mx-auto text-gray-600 mb-2" />
                  <p className="text-gray-400">No global announcements yet.</p>
                  <p className="text-sm text-gray-500">Create one using the form above.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {globalPosts.map(post => (
                    <div key={post._id} className="bg-gray-750 rounded-lg overflow-hidden">
                      {/* Post Header */}
                      <div className="p-3 border-b border-gray-700 bg-gradient-to-r from-gray-800 to-transparent">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                            {post.userName.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-2">
                            <p className="font-medium text-sm flex items-center">
                              {post.userName}
                              {post.userId === '000000000000000000000000' || post.university === 'Admin' ? (
                                <span className="ml-2 bg-cyan-900/50 text-cyan-400 text-xs px-2 py-0.5 rounded-full">
                                  Admin
                                </span>
                              ) : (
                                <span className="ml-2 bg-blue-900/50 text-blue-400 text-xs px-2 py-0.5 rounded-full">
                                  {post.university}
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-gray-400">{formatDate(post.createdAt)}</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Post Content */}
                      <div className="p-3">
                        <p className="text-sm whitespace-pre-wrap">{post.content}</p>
                        {post.media && (
                          <img 
                            src={post.media} 
                            alt="Post attachment" 
                            className="mt-2 max-h-60 rounded-lg w-full object-cover"
                          />
                        )}
                      </div>
                      
                      {/* Post Stats */}
                      <div className="px-3 py-2 border-t border-gray-700 flex text-sm">
                        <div className="flex items-center mr-4 text-gray-400">
                          <Heart className="h-4 w-4 mr-1" />
                          <span>{post.likes.length || 0} likes</span>
                        </div>
                        <div className="flex items-center text-gray-400">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          <span>{post.comments.length || 0} comments</span>
                        </div>
                      </div>
                      
                      {/* Comments */}
                      {post.comments.length > 0 && (
                        <div className="px-3 py-2 bg-gray-800 border-t border-gray-700">
                          <h4 className="text-xs font-medium text-gray-300 mb-2">Recent Comments</h4>
                          <div className="space-y-2 max-h-40 overflow-y-auto">
                            {post.comments.slice(0, 3).map((comment, index) => (
                              <div key={index} className="flex">
                                <div className="h-6 w-6 rounded-full bg-gray-600 flex items-center justify-center text-white text-xs mr-2 flex-shrink-0">
                                  {comment.userName.charAt(0).toUpperCase()}
                                </div>
                                <div className="bg-gray-700 rounded-lg p-2 flex-grow">
                                  <p className="text-xs font-medium flex items-center">
                                    {comment.userName}
                                    {comment.university && comment.university !== 'Admin' && (
                                      <span className="ml-2 bg-blue-900/30 text-blue-400 text-xs px-1.5 py-0.5 rounded-full text-[10px]">
                                        {comment.university}
                                      </span>
                                    )}
                                  </p>
                                  <p className="text-xs mt-1">{comment.content}</p>
                                </div>
                              </div>
                            ))}
                            {post.comments.length > 3 && (
                              <p className="text-xs text-gray-400 text-center mt-1">
                                +{post.comments.length - 3} more comments
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Add Comment */}
                      <div className="p-2 bg-gray-800 border-t border-gray-700 flex items-center">
                        <input
                          type="text"
                          className="bg-gray-700 rounded-full px-3 py-1 flex-grow text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500"
                          placeholder="Add a comment..."
                          value={commentText[post._id] || ''}
                          onChange={(e) => setCommentText({...commentText, [post._id]: e.target.value})}
                          onKeyPress={(e) => e.key === 'Enter' && handleAddComment(post._id)}
                        />
                        <button 
                          className="ml-2 p-1 rounded-full bg-cyan-600 hover:bg-cyan-700 transition-colors"
                          onClick={() => handleAddComment(post._id)}
                          disabled={!commentText[post._id]?.trim()}
                        >
                          <Send className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Right Column - User Chat */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Direct Messaging</h3>
              
              <div className="bg-gray-750 rounded-lg overflow-hidden h-[600px] flex flex-col">
                {/* User List */}
                <div className="p-3 border-b border-gray-700 bg-gray-800 flex justify-between items-center">
                  <h4 className="font-medium text-cyan-400">All Users</h4>
                  <button 
                    className="text-gray-400 hover:text-white p-1 rounded hover:bg-gray-700"
                    onClick={fetchAllUsers}
                    title="Refresh user list"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>
                </div>
                
                {/* Search Box */}
                <div className="p-2 border-b border-gray-700 bg-gray-800/50">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search users..."
                      className="w-full bg-gray-700 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                      <button 
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                        onClick={() => setSearchQuery('')}
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-grow overflow-hidden">
                  {/* Users List Sidebar */}
                  <div className="w-1/3 border-r border-gray-700 overflow-y-auto">
                    {loadingCommunity ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500"></div>
                        <p className="ml-3 text-sm text-gray-400">Loading users...</p>
                      </div>
                    ) : filteredUsers.length === 0 ? (
                      <div className="p-4 text-center text-gray-400">
                        {searchQuery ? (
                          <>
                            <p className="text-sm">No users found matching "{searchQuery}"</p>
                            <button 
                              className="mt-2 text-cyan-400 hover:text-cyan-300 text-xs"
                              onClick={() => setSearchQuery('')}
                            >
                              Clear search
                            </button>
                          </>
                        ) : allUsers.length === 0 ? (
                          <>
                            <AlertCircle className="h-8 w-8 mx-auto mb-2 text-amber-500" />
                            <p className="text-sm">Unable to load users</p>
                            <p className="text-xs text-gray-500 mt-1 mb-3">This might be due to server issues or permissions</p>
                            <div className="flex flex-col space-y-2 max-w-[200px] mx-auto">
                              <button 
                                className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-700 rounded text-white text-xs flex items-center justify-center"
                                onClick={fetchAllUsers}
                              >
                                <RefreshCw className="h-3 w-3 mr-1" /> Retry with Admin Access
                              </button>
                              <button 
                                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded text-white text-xs flex items-center justify-center"
                                onClick={async () => {
                                  try {
                                    const globalResponse = await communityAPI.getGlobalMembers();
                                    setAllUsers(globalResponse.data);
                                    setFilteredUsers(globalResponse.data);
                                  } catch (error) {
                                    console.error('Fallback to global members failed:', error);
                                    alert('Could not load users. Please check your connection and try again.');
                                  }
                                }}
                              >
                                <Globe className="h-3 w-3 mr-1" /> Get Global Members
                              </button>
                            </div>
                          </>
                        ) : (
                          <p className="text-sm">Something went wrong. Please try again.</p>
                        )}
                      </div>
                    ) : (
                      <div>
                        {/* User count */}
                        <div className="px-3 py-1 text-xs text-gray-400">
                          Showing {filteredUsers.length} {filteredUsers.length === 1 ? 'user' : 'users'}
                          {searchQuery && ` matching "${searchQuery}"`}
                          {filteredUsers.length < allUsers.length && ` (total: ${allUsers.length})`}
                        </div>
                        {filteredUsers.map(user => (
                          <div 
                            key={user._id}
                            className={`p-2 flex items-center cursor-pointer hover:bg-gray-700 transition-colors ${
                              selectedUser && selectedUser._id === user._id ? 'bg-gray-700' : ''
                            }`}
                            onClick={() => {
                              setSelectedUser(user);
                              fetchConversation(user._id);
                            }}
                          >
                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm mr-2">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="overflow-hidden">
                              <p className="font-medium text-sm truncate">{user.name}</p>
                              <p className="text-xs text-gray-400 truncate flex items-center">
                                {user.university ? (
                                  <>
                                    <Globe className="h-3 w-3 mr-1 text-cyan-400" />
                                    {user.university}
                                  </>
                                ) : (
                                  user.department || "No university"
                                )}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Chat Area */}
                  <div className="w-2/3 flex flex-col">
                    {selectedUser ? (
                      <>
                        {/* Chat Header */}
                        <div className="p-2 bg-gray-800 flex items-center border-b border-gray-700">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm mr-2">
                            {selectedUser.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{selectedUser.name}</p>
                            <p className="text-xs text-gray-400">{selectedUser.university}</p>
                          </div>
                        </div>
                        
                        {/* Messages */}
                        <div className="flex-grow p-3 overflow-y-auto bg-gray-800">
                          {messages.length === 0 ? (
                            <div className="h-full flex items-center justify-center text-gray-400">
                              <div className="text-center">
                                <MessageCircle className="h-12 w-12 mx-auto mb-2 text-gray-600" />
                                <p className="text-sm">No messages yet</p>
                                <p className="text-xs">Start the conversation!</p>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {messages.map((message, index) => {
                                const isAdmin = message.sender !== selectedUser._id;
                                return (
                                  <div 
                                    key={message._id || index} 
                                    className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}
                                  >
                                    {isAdmin && (
                                      <div className="self-end mb-1 mr-2">
                                        <span className="bg-cyan-900/50 text-cyan-400 text-xs px-2 py-0.5 rounded-full">
                                          Admin
                                        </span>
                                      </div>
                                    )}
                                    <div 
                                      className={`max-w-[80%] rounded-lg p-2 text-sm ${
                                        isAdmin
                                          ? 'bg-cyan-600 rounded-tr-none' 
                                          : 'bg-gray-700 rounded-tl-none'
                                      }`}
                                    >
                                      <p>{message.content}</p>
                                      {message.attachment && (
                                        <div className="mt-2">
                                          {message.attachment.startsWith('data:image') ? (
                                            <img
                                              src={message.attachment}
                                              alt="Attached media"
                                              className="max-h-48 rounded-md object-cover"
                                            />
                                          ) : (
                                            <div className="flex items-center p-2 bg-gray-800/40 rounded-md">
                                              <File className="h-4 w-4 mr-2" />
                                              <span className="text-xs">Attachment</span>
                                              <a 
                                                href={message.attachment} 
                                                download="attachment"
                                                className="ml-auto text-cyan-400 hover:text-cyan-300"
                                                target="_blank" 
                                                rel="noreferrer"
                                              >
                                                <Download className="h-4 w-4" />
                                              </a>
                                            </div>
                                          )}
                                        </div>
                                      )}
                                      <p className="text-xs text-right mt-1 opacity-80">
                                        {formatDate(message.createdAt)}
                                      </p>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                        
                        {/* Message Input */}
                        <div className="p-2 border-t border-gray-700">
                          {fileAttachment && (
                            <div className="mb-2 rounded bg-gray-800 p-2 flex items-center">
                              {getFileIcon(fileAttachment.fileType)}
                              <span className="ml-2 flex-grow truncate text-xs">{fileAttachment.fileName}</span>
                              <button
                                className="p-1 text-gray-400 hover:text-white"
                                onClick={handleClearAttachment}
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          )}
                          <div className="flex items-center">
                            <input
                              type="text"
                              className="flex-grow bg-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500"
                              placeholder="Type a message..."
                              value={newMessage}
                              onChange={(e) => setNewMessage(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            />
                            <label className="mx-2 p-1 rounded-full text-gray-300 hover:text-white hover:bg-gray-600 cursor-pointer">
                              <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                onChange={handleFileAttachment}
                              />
                              <PaperclipIcon className="h-4 w-4" />
                            </label>
                            <button
                              className="ml-2 p-2 bg-cyan-600 rounded-lg hover:bg-cyan-700 transition-colors disabled:opacity-50"
                              onClick={handleSendMessage}
                              disabled={(!newMessage.trim() && !fileAttachment)}
                            >
                              <Send className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="h-full flex items-center justify-center text-gray-400 p-4 text-center">
                        <div>
                          <MessageCircle className="h-12 w-12 mx-auto mb-3 text-gray-600" />
                          <h3 className="text-lg font-medium mb-2">Select a user</h3>
                          <p className="text-sm text-gray-500">
                            Choose a user from the list to start chatting
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
