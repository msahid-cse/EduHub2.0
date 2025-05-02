import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';
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
  Download,
  Upload,
  GraduationCap,
  Calendar
} from 'lucide-react';
import { apiClient, communityAPI, instructorService, adminService } from '../api/apiClient';

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

const AdminDashboard = ({ initialSection }) => {
  const navigate = useNavigate();
  
  // Utility function to safely render potentially problematic data types
  const safeRender = (value) => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'number' || typeof value === 'boolean') return String(value);
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  };
  
  const [stats, setStats] = useState({
    users: 0,
    courses: 0,
    jobs: 0,
    notices: 0,
    feedback: 0,
    globalPosts: 0,
    instructors: 0,
    events: 0,
    jobsApplied: 0,
    eventHits: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState('');
  const [recentJobs, setRecentJobs] = useState([]);
  const [recentNotices, setRecentNotices] = useState([]);
  const [recentCourses, setRecentCourses] = useState([]);
  const [recentInstructors, setRecentInstructors] = useState([]);
  
  // Feedback management state
  const [feedbackList, setFeedbackList] = useState([]);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [sendingResponse, setSendingResponse] = useState(false);
  const [feedbackFilter, setFeedbackFilter] = useState('pending');
  const [assignedTo, setAssignedTo] = useState('');
  const [feedbackError, setFeedbackError] = useState('');
  const [teamMembers, setTeamMembers] = useState([
    { id: '1', name: 'Admin 1', department: 'Support' },
    { id: '2', name: 'Admin 2', department: 'Technical' },
    { id: '3', name: 'Admin 3', department: 'Content' },
    { id: '4', name: 'Admin 4', department: 'Operations' }
  ]);
  // New state for feedback category filtering
  const [categoryFilter, setCategoryFilter] = useState('all');

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

  // Instructor upload state
  const [showInstructorUploadSection, setShowInstructorUploadSection] = useState(false);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [universities, setUniversities] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState('');
  const [isCountriesLoading, setIsCountriesLoading] = useState(false);
  const [isUniversitiesLoading, setIsUniversitiesLoading] = useState(false);
  const [instructorUploadFile, setInstructorUploadFile] = useState(null);
  const [isInstructorUploading, setIsInstructorUploading] = useState(false);
  const [instructorUploadProgress, setInstructorUploadProgress] = useState(0);
  const [instructorUploadResult, setInstructorUploadResult] = useState(null);
  const [manualInstructors, setManualInstructors] = useState([{ name: '', email: '', position: '', department: '' }]);
  const [uploadOption, setUploadOption] = useState('file'); // 'file' or 'manual'

  // Add state for university search
  const [universitySearch, setUniversitySearch] = useState('');
  const [filteredUniversities, setFilteredUniversities] = useState([]);

  // Helper to get appropriate color for feedback category
  const getCategoryColor = (category) => {
    switch (category?.toLowerCase()) {
      case 'bug':
        return 'red';
      case 'feature':
        return 'green';
      case 'enhancement':
        return 'blue';
      case 'content':
        return 'purple';
      case 'support':
        return 'orange';
      case 'security':
        return 'amber';
      case 'ui/ux':
        return 'pink';
      case 'performance':
        return 'indigo';
      default:
        return 'gray';
    }
  };

  // Helper to render feedback category badge with appropriate styling
  const renderCategoryBadge = (category) => {
    if (!category) return null;
    
    const color = getCategoryColor(category);
    
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-${color}-500/10 text-${color}-400 border border-${color}-500/30`}>
        {category}
      </span>
    );
  };

  // Define all the functions from the original component here
  // ...

  // Retry loading dashboard data
  const retryDashboard = () => {
    console.log('Retrying dashboard data load');
    setDashboardError('');
    fetchDashboardData();
  };

  // Fetch dashboard data function
  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setDashboardError('');
      console.log('Fetching dashboard data...');
      
      let hasErrors = false;
      let fallbackStats = { ...stats };
      
      // Fetch stats using adminService
      try {
        console.log('Trying to fetch main dashboard stats...');
        const statsResponse = await adminService.getDashboardStats();
        console.log('Stats response:', statsResponse.data);
        if (statsResponse.data) {
          setStats(statsResponse.data);
          fallbackStats = statsResponse.data;
        }
      } catch (statsError) {
        console.error('Error fetching stats:', statsError);
        console.log('Will try individual data fetching as fallback');
        hasErrors = true;
        
        // If main dashboard stats fail, try to fetch individual counts
        try {
          // Try to get user count through various methods
          let userCount = 0;
          
          // Method 1: Try admin user count endpoint
          try {
            const usersResponse = await adminService.getUserCount();
            if (usersResponse.data && typeof usersResponse.data.count === 'number') {
              userCount = usersResponse.data.count;
            }
          } catch (userCountError) {
            console.error('Admin user count failed:', userCountError);
            
            // Method 2: Try community API user listing
            try {
              const adminUsersResponse = await communityAPI.getAdminUsers();
              if (adminUsersResponse.data && Array.isArray(adminUsersResponse.data)) {
                userCount = adminUsersResponse.data.length;
              }
            } catch (adminUsersError) {
              console.error('Admin users listing failed:', adminUsersError);
              
              // Method 3: Try global members endpoint
              try {
                const membersResponse = await communityAPI.getGlobalMembers();
                if (membersResponse.data && Array.isArray(membersResponse.data)) {
                  userCount = membersResponse.data.length;
                }
              } catch (membersError) {
                console.error('Global members listing failed:', membersError);
                
                // Method 4: Try standard members endpoint
                try {
                  const localMembersResponse = await communityAPI.getMembers();
                  if (localMembersResponse.data && Array.isArray(localMembersResponse.data)) {
                    userCount = localMembersResponse.data.length;
                  }
                } catch (localMembersError) {
                  console.error('Local members listing failed:', localMembersError);
                }
              }
            }
          }
          
          // Try to get other counts directly from APIs
          let courseCount = 0;
          try {
            const coursesCountResponse = await apiClient.get('/api/courses/count');
            if (coursesCountResponse.data && typeof coursesCountResponse.data.count === 'number') {
              courseCount = coursesCountResponse.data.count;
            }
          } catch (coursesCountError) {
            console.error('Courses count failed:', coursesCountError);
          }
          
          let jobCount = 0;
          try {
            const jobsCountResponse = await apiClient.get('/api/jobs/count');
            if (jobsCountResponse.data && typeof jobsCountResponse.data.count === 'number') {
              jobCount = jobsCountResponse.data.count;
            }
          } catch (jobsCountError) {
            console.error('Jobs count failed:', jobsCountError);
          }
          
          let noticeCount = 0;
          try {
            const noticesCountResponse = await apiClient.get('/api/notices/count');
            if (noticesCountResponse.data && typeof noticesCountResponse.data.count === 'number') {
              noticeCount = noticesCountResponse.data.count;
            }
          } catch (noticesCountError) {
            console.error('Notices count failed:', noticesCountError);
          }
          
          // Update stats with what we could get
          setStats(prev => ({
            ...prev,
            users: userCount || prev.users,
            courses: courseCount || prev.courses,
            jobs: jobCount || prev.jobs,
            notices: noticeCount || prev.notices
          }));
          
        } catch (individualFetchError) {
          console.error('Failed to fetch individual counts:', individualFetchError);
        }
      }
      
      // Fetch job applications data if not included in main stats
      try {
        if (!fallbackStats.jobsApplied) {
          console.log('Fetching job applications data...');
          const jobsAppliedResponse = await adminService.getJobApplicationsCount();
          console.log('Jobs applied response:', jobsAppliedResponse.data);
          if (jobsAppliedResponse.data && typeof jobsAppliedResponse.data.count === 'number') {
            // Update stats with job applications count
            setStats(prev => ({
              ...prev,
              jobsApplied: jobsAppliedResponse.data.count
            }));
          }
        }
      } catch (jobsAppliedError) {
        console.error('Error fetching job applications count:', jobsAppliedError);
        // Don't fail completely, just show 0
      }
      
      // Fetch event hits data if not included in main stats
      try {
        if (!fallbackStats.eventHits) {
          console.log('Fetching event hits data...');
          const eventHitsResponse = await adminService.getEventHitsCount();
          console.log('Event hits response:', eventHitsResponse.data);
          if (eventHitsResponse.data && typeof eventHitsResponse.data.count === 'number') {
            // Update stats with event hits count
            setStats(prev => ({
              ...prev,
              eventHits: eventHitsResponse.data.count
            }));
          }
        }
      } catch (eventHitsError) {
        console.error('Error fetching event hits count:', eventHitsError);
        // Don't fail completely, just show 0
      }
      
      // Fetch recent jobs
      try {
        const jobsResponse = await apiClient.get('/api/jobs?limit=5');
        console.log('Jobs response:', jobsResponse.data);
        if (jobsResponse.data) {
          setRecentJobs(jobsResponse.data);
        }
      } catch (jobsError) {
        console.error('Error fetching jobs:', jobsError);
        // Try alternative endpoint
        try {
          const jobsAltResponse = await apiClient.get('/api/jobs/recent');
          if (jobsAltResponse.data) {
            setRecentJobs(jobsAltResponse.data);
          } else {
            setRecentJobs([]);
            hasErrors = true;
          }
        } catch (jobsAltError) {
          console.error('Alternative jobs fetch failed:', jobsAltError);
          setRecentJobs([]);
          hasErrors = true;
        }
      }
      
      // Fetch recent notices
      try {
        const noticesResponse = await apiClient.get('/api/notices?limit=5');
        console.log('Notices response:', noticesResponse.data);
        if (noticesResponse.data) {
          setRecentNotices(noticesResponse.data);
        }
      } catch (noticesError) {
        console.error('Error fetching notices:', noticesError);
        // Try alternative endpoint
        try {
          const noticesAltResponse = await apiClient.get('/api/notices/recent');
          if (noticesAltResponse.data) {
            setRecentNotices(noticesAltResponse.data);
          } else {
            setRecentNotices([]);
            hasErrors = true;
          }
        } catch (noticesAltError) {
          console.error('Alternative notices fetch failed:', noticesAltError);
          setRecentNotices([]);
          hasErrors = true;
        }
      }
      
      // Fetch recent courses
      try {
        const coursesResponse = await apiClient.get('/api/courses?limit=5');
        console.log('Courses response:', coursesResponse.data);
        if (coursesResponse.data) {
          setRecentCourses(coursesResponse.data);
        }
      } catch (coursesError) {
        console.error('Error fetching courses:', coursesError);
        // Try alternative endpoint
        try {
          const coursesAltResponse = await apiClient.get('/api/courses/recent');
          if (coursesAltResponse.data) {
            setRecentCourses(coursesAltResponse.data);
          } else {
            setRecentCourses([]);
            hasErrors = true;
          }
        } catch (coursesAltError) {
          console.error('Alternative courses fetch failed:', coursesAltError);
          setRecentCourses([]);
          hasErrors = true;
        }
      }
      
      // Fetch recent instructors
      try {
        const instructorsResponse = await instructorService.getAllInstructors();
        console.log('Instructors response:', instructorsResponse.data);
        if (instructorsResponse.data) {
          // Get the 5 most recent instructors
          setRecentInstructors(instructorsResponse.data.slice(0, 5));
        }
      } catch (instructorsError) {
        console.error('Error fetching instructors:', instructorsError);
        setRecentInstructors([]);
        hasErrors = true;
      }
      
      // If we have errors but managed to get at least some data, show a warning
      if (hasErrors) {
        setDashboardError('Some dashboard data could not be loaded. You may see partial information.');
      }
      
      setIsLoading(false);
      console.log('Dashboard data fetching complete');
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setDashboardError('Failed to load dashboard data. Please try again.');
      setIsLoading(false);
    }
  };
  
  // Use fetchDashboardData when component mounts
  useEffect(() => {
    console.log('AdminDashboard component mounted');
    
    // Check authentication and role
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userRole = localStorage.getItem('userRole');
    console.log('Auth status:', { isLoggedIn, userRole });
    
    if (!isLoggedIn) {
      console.error('User not logged in, should redirect to login');
      navigate('/login');
      return;
    }
    
    if (userRole !== 'admin') {
      console.error('User is not admin, should redirect to user dashboard');
      navigate('/userdashboard');
      return;
    }
    
    // Set initial section if provided
    if (initialSection) {
      console.log('Initial section specified:', initialSection);
      if (initialSection === 'instructors') {
        setShowInstructorUploadSection(true);
      } else if (initialSection === 'community') {
        setShowCommunitySection(true);
      }
    }
    
    // Fetch data if authentication checks pass
    fetchDashboardData();
    fetchFeedback('pending'); // Changed to pending to show only new feedback by default
  }, [navigate, initialSection]);
  
  // Fetch feedback based on filter
  const fetchFeedback = async (status = 'all', category = 'all') => {
    setLoadingFeedback(true);
    setFeedbackError('');
    console.log('Fetching feedback with status:', status, 'and category:', category);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      let endpoint = '/api/feedback';
      const params = [];
      
      if (status !== 'all') {
        params.push(`status=${status}`);
      }
      
      if (category !== 'all') {
        params.push(`category=${category}`);
      }
      
      if (params.length > 0) {
        endpoint += `?${params.join('&')}`;
      }
      
      console.log('Calling feedback API endpoint:', endpoint);
      
      // Use apiClient instead of direct axios calls for consistency
      const response = await apiClient.get(endpoint);
      console.log('Feedback response:', response.data);
      
      // Process the data to ensure safe rendering
      const processedData = response.data.map(feedback => {
        // Make a shallow copy of the feedback object
        const processed = { ...feedback };
        
        // Convert object fields to strings to avoid React rendering errors
        if (typeof processed.adminResponse === 'object') {
          processed.adminResponse = JSON.stringify(processed.adminResponse);
        }
        
        if (typeof processed.response === 'object') {
          processed.response = JSON.stringify(processed.response);
        }
        
        return processed;
      });
      
      setFeedbackList(processedData);
    } catch (error) {
      console.error('Error fetching feedback:', error);
      setFeedbackError(error.response?.data?.message || 'Failed to load feedback data');
      // Set empty list to prevent UI issues
      setFeedbackList([]);
    } finally {
      setLoadingFeedback(false);
    }
  };
  
  // Delete feedback entry
  const deleteFeedback = async (id) => {
    if (!window.confirm('Are you sure you want to delete this feedback entry?')) {
      return;
    }
    
    try {
      console.log('Deleting feedback with ID:', id);
      await apiClient.delete(`/api/feedback/${id}`);
      
      // Remove from state to update UI immediately
      setFeedbackList(prevList => prevList.filter(item => item._id !== id));
      console.log('Feedback deleted successfully');
      
    } catch (error) {
      console.error('Error deleting feedback:', error);
      alert('Failed to delete feedback. Please try again.');
    }
  };
  
  // Handle feedback status update
  const updateFeedbackStatus = async (id, status) => {
    try {
      console.log(`Updating feedback ${id} status to: ${status}`);
      await apiClient.put(`/api/feedback/${id}`, { status });
      
      // Refresh feedback list
      fetchFeedback(feedbackFilter, categoryFilter);
    } catch (error) {
      console.error('Error updating feedback status:', error);
      alert(`Failed to update status to ${status}. Please try again.`);
    }
  };
  
  // Handle open response modal
  const openResponseModal = (feedback) => {
    setSelectedFeedback(feedback);
    setResponseText(feedback.adminResponse || '');
    setAssignedTo(feedback.assignedTo || '');
    setShowResponseModal(true);
  };
  
  // Handle sending response to user - Updated version
  const sendResponse = async () => {
    if (!selectedFeedback) return;
    
    setSendingResponse(true);
    try {
      // Use just the plain text response instead of a JSON object
      const adminResponseValue = responseText.trim();
      
      console.log('Sending response to feedback:', selectedFeedback._id);
      await apiClient.put(`/api/feedback/${selectedFeedback._id}`, { 
        status: adminResponseValue ? 'resolved' : 'in-progress',
        adminResponse: adminResponseValue,
        assignedTo: assignedTo || null
      });
      
      // Close modal and refresh feedback list
      setShowResponseModal(false);
      setResponseText('');
      setAssignedTo('');
      setSelectedFeedback(null);
      fetchFeedback(feedbackFilter, categoryFilter);
      console.log('Response sent successfully');
      
    } catch (error) {
      console.error('Error sending response:', error);
      alert('Failed to send response. Please try again.');
    } finally {
      setSendingResponse(false);
    }
  };

  // Format date function
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Other functions
  const handleManageCommunity = () => {
    setShowCommunitySection(true);
    // Rest of the implementation
  };

  const handleManageInstructors = () => {
    setShowInstructorUploadSection(true);
    // Rest of the implementation
  };

  // Export feedback to CSV
  const exportFeedbackToCSV = () => {
    if (feedbackList.length === 0) {
      alert('No feedback data to export');
        return;
      }
      
    // Prepare CSV header and data
    const headers = ['ID', 'Subject', 'Category', 'Message', 'User', 'Email', 'Status', 'Created At', 'Updated At', 'Assigned To', 'Response'];
    
    const csvData = feedbackList.map(feedback => [
      feedback._id,
      feedback.subject,
      feedback.category,
      feedback.message,
      typeof feedback.user === 'string' ? feedback.user : (feedback.user?.name || 'Anonymous'),
      feedback.userEmail || feedback.user?.email || 'N/A',
      feedback.status,
      new Date(feedback.createdAt).toLocaleString(),
      new Date(feedback.updatedAt).toLocaleString(),
      feedback.assignedTo ? teamMembers.find(m => m.id === feedback.assignedTo)?.name || feedback.assignedTo : 'Unassigned',
      feedback.adminResponse || ''
    ]);
    
    // Convert to CSV format
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    
    // Create a download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `feedback_export_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Format admin response for display - Simplified version
  const formatAdminResponse = (response) => {
    if (!response) return '';
    
    try {
      // If it's a string that looks like JSON, try to parse it
      if (typeof response === 'string' && (response.startsWith('{') || response.startsWith('['))) {
        try {
          const parsed = JSON.parse(response);
          // If it has a message property, show just the message
          if (parsed && parsed.message) {
            return (
              <div className="bg-gray-700/30 p-3 rounded border border-gray-600 mt-1">
                <p className="text-gray-200">{parsed.message}</p>
              </div>
            );
          }
        } catch (err) {
          // If parsing fails, just show the original string
        }
      }
      
      // For plain strings or if JSON parsing failed
      return (
        <div className="bg-gray-700/30 p-3 rounded border border-gray-600 mt-1">
          <p className="text-gray-200">{String(response)}</p>
        </div>
      );
    } catch (error) {
      console.error('Error formatting admin response:', error);
      return (
        <div className="bg-gray-700/30 p-3 rounded border border-gray-600 mt-1">
          <p className="text-gray-200">{String(response)}</p>
        </div>
      );
    }
  };

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen">
      {/* Header/Navbar */}
      <header className="bg-gray-800 p-4 border-b border-gray-700">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-cyan-400">Edu Hub Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-300">Welcome, Admin!</span>
            <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white">
              View Site
            </button>
            <Settings className="h-5 w-5 text-gray-400 cursor-pointer hover:text-cyan-400 transition duration-200" />
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6">
        {/* Stats Cards - First Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-6">
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
              <h3 className="text-lg font-semibold text-gray-200">Active Jobs</h3>
            </div>
            <p className="text-3xl font-bold text-white">{isLoading ? '...' : stats.jobs || 0}</p>
          </div>

          <div className="bg-gradient-to-br from-red-600/20 to-red-800/20 p-6 rounded-lg border border-red-700/50 shadow-lg">
            <div className="flex items-center mb-3">
              <Send className="h-7 w-7 text-red-400 mr-3" />
              <h3 className="text-lg font-semibold text-gray-200">Jobs Applied</h3>
            </div>
            <p className="text-3xl font-bold text-white">{isLoading ? '...' : stats.jobsApplied || 0}</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 p-6 rounded-lg border border-purple-700/50 shadow-lg">
            <div className="flex items-center mb-3">
              <GraduationCap className="h-7 w-7 text-purple-400 mr-3" />
              <h3 className="text-lg font-semibold text-gray-200">Instructors</h3>
            </div>
            <p className="text-3xl font-bold text-white">{isLoading ? '...' : stats.instructors || 0}</p>
          </div>
        </div>
        
        {/* Stats Cards - Second Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-gradient-to-br from-indigo-600/20 to-indigo-800/20 p-6 rounded-lg border border-indigo-700/50 shadow-lg">
            <div className="flex items-center mb-3">
              <Bell className="h-7 w-7 text-indigo-400 mr-3" />
              <h3 className="text-lg font-semibold text-gray-200">Total Notices</h3>
            </div>
            <p className="text-3xl font-bold text-white">{isLoading ? '...' : stats.notices || 0}</p>
          </div>
          
          <div className="bg-gradient-to-br from-pink-600/20 to-pink-800/20 p-6 rounded-lg border border-pink-700/50 shadow-lg">
            <div className="flex items-center mb-3">
              <MessageSquare className="h-7 w-7 text-pink-400 mr-3" />
              <h3 className="text-lg font-semibold text-gray-200">Feedback Entries</h3>
            </div>
            <p className="text-3xl font-bold text-white">{isLoading ? '...' : stats.feedback || 0}</p>
          </div>
          
          <div className="bg-gradient-to-br from-cyan-600/20 to-cyan-800/20 p-6 rounded-lg border border-cyan-700/50 shadow-lg">
            <div className="flex items-center mb-3">
              <Globe className="h-7 w-7 text-cyan-400 mr-3" />
              <h3 className="text-lg font-semibold text-gray-200">Community Posts</h3>
            </div>
            <p className="text-3xl font-bold text-white">{isLoading ? '...' : stats.globalPosts || 0}</p>
          </div>
          
          <div className="bg-gradient-to-br from-orange-600/20 to-orange-800/20 p-6 rounded-lg border border-orange-700/50 shadow-lg">
            <div className="flex items-center mb-3">
              <Calendar className="h-7 w-7 text-orange-400 mr-3" />
              <h3 className="text-lg font-semibold text-gray-200">Events Hosted</h3>
            </div>
            <p className="text-3xl font-bold text-white">{isLoading ? '...' : stats.events || 0}</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-600/20 to-yellow-800/20 p-6 rounded-lg border border-yellow-700/50 shadow-lg">
            <div className="flex items-center mb-3">
              <Heart className="h-7 w-7 text-yellow-400 mr-3" />
              <h3 className="text-lg font-semibold text-gray-200">Event Hits</h3>
            </div>
            <p className="text-3xl font-bold text-white">{isLoading ? '...' : stats.eventHits || 0}</p>
          </div>
        </div>
        
        {/* Error display */}
        {dashboardError && (
          <div className="bg-red-900/20 border border-red-500/40 p-4 rounded-lg mb-6 animate-pulse">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
              <div>
                <p className="text-red-400 font-medium">Error loading dashboard data</p>
                <p className="text-gray-400 text-sm mt-1">{dashboardError}</p>
            <button 
                  onClick={retryDashboard}
                  className="mt-2 px-3 py-1 bg-red-900/30 text-red-400 hover:bg-red-900/50 rounded text-sm flex items-center"
            >
                  <RefreshCw className="h-3 w-3 mr-2" />
                  Retry Loading Dashboard
            </button>
          </div>
            </div>
          </div>
        )}
        
        {/* Quick Actions Section */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Quick Actions</h2>
          </div>
          
          {/* First Row of Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <button 
              onClick={() => navigate('/post-job')}
              className="bg-gradient-to-br from-green-600/20 to-green-800/20 p-3 rounded-lg border border-green-700/50 hover:border-green-500/50 transition-colors shadow-lg flex items-center justify-center h-12"
            >
              <Briefcase className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
              <span className="text-sm font-medium text-white">Post New Job</span>
            </button>
            
            <button 
              onClick={() => navigate('/post-notice')}
              className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 p-3 rounded-lg border border-purple-700/50 hover:border-purple-500/50 transition-colors shadow-lg flex items-center justify-center h-12"
            >
              <Bell className="w-5 h-5 text-purple-400 mr-3 flex-shrink-0" />
              <span className="text-sm font-medium text-white">Post New Notice</span>
            </button>
            
            <button 
              onClick={() => navigate('/add-course')}
              className="bg-gradient-to-br from-orange-600/20 to-orange-800/20 p-3 rounded-lg border border-orange-700/50 hover:border-orange-500/50 transition-colors shadow-lg flex items-center justify-center h-12"
            >
              <BookOpen className="w-5 h-5 text-orange-400 mr-3 flex-shrink-0" />
              <span className="text-sm font-medium text-white">Add New Course</span>
            </button>
            
            <button 
              onClick={() => navigate('/view-applications')}
              className="bg-gradient-to-br from-cyan-600/20 to-cyan-800/20 p-3 rounded-lg border border-cyan-700/50 hover:border-cyan-500/50 transition-colors shadow-lg flex items-center justify-center h-12"
            >
              <FileText className="w-5 h-5 text-cyan-400 mr-3 flex-shrink-0" />
              <span className="text-sm font-medium text-white">View Applications</span>
            </button>
          </div>
          
          {/* Second Row of Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button 
              onClick={() => navigate('/manage-instructors')}
              className="bg-gradient-to-br from-indigo-600/20 to-indigo-800/20 p-3 rounded-lg border border-indigo-700/50 hover:border-indigo-500/50 transition-colors shadow-lg flex items-center justify-center h-12"
            >
              <Users className="w-5 h-5 text-indigo-400 mr-3 flex-shrink-0" />
              <span className="text-sm font-medium text-white">Add New Instructor</span>
            </button>
            
            <button 
              onClick={() => navigate('/community')}
              className="bg-gradient-to-br from-teal-600/20 to-teal-800/20 p-3 rounded-lg border border-teal-700/50 hover:border-teal-500/50 transition-colors shadow-lg flex items-center justify-center h-12"
            >
              <Globe className="w-5 h-5 text-teal-400 mr-3 flex-shrink-0" />
              <span className="text-sm font-medium text-white">Manage Community</span>
            </button>
            
            <button 
              onClick={() => navigate('/add-event')}
              className="bg-gradient-to-br from-amber-600/20 to-amber-800/20 p-3 rounded-lg border border-amber-700/50 hover:border-amber-500/50 transition-colors shadow-lg flex items-center justify-center h-12"
            >
              <Calendar className="w-5 h-5 text-amber-400 mr-3 flex-shrink-0" />
              <span className="text-sm font-medium text-white">Add New Event</span>
            </button>
            
            <button 
              onClick={() => navigate('/manage-feedback')}
              className="bg-gradient-to-br from-red-600/20 to-red-800/20 p-3 rounded-lg border border-red-700/50 hover:border-red-500/50 transition-colors shadow-lg flex items-center justify-center h-12"
            >
              <MessageCircle className="w-5 h-5 text-red-400 mr-3 flex-shrink-0" />
              <span className="text-sm font-medium text-white">Manage Feedback</span>
            </button>
          </div>
        </div>

        {/* Recent Instructors Section */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 shadow-lg mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Recent Instructors</h2>
            <Link to="/manage-instructors" className="text-sm text-purple-400 hover:text-purple-300">
              View All
            </Link>
            </div>
          {isLoading ? (
            <div className="flex justify-center py-6">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-purple-500"></div>
            </div>
          ) : (
            recentInstructors.length === 0 ? (
              <p className="text-gray-400 py-4">No instructors added yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-gray-900 rounded-lg overflow-hidden">
                <thead className="bg-gray-700">
                  <tr>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Position</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Department</th>
                    <th className="py-3 px-4 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                    {recentInstructors.map((instructor) => (
                      <tr key={instructor._id} className="hover:bg-gray-800/50">
                        <td className="py-2 px-4 text-sm font-medium text-white">{instructor.name}</td>
                        <td className="py-2 px-4 text-sm text-gray-300">{instructor.position}</td>
                        <td className="py-2 px-4 text-sm text-gray-300">{instructor.department}</td>
                        <td className="py-2 px-4 text-right">
                          <button className="p-1 text-blue-400 hover:text-blue-300">
                            <Edit className="h-4 w-4" />
                        </button>
                          <button className="p-1 ml-2 text-red-400 hover:text-red-300">
                            <Trash2 className="h-4 w-4" />
                          </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            )
          )}
        </div>
        
        {/* Recently Posted Jobs Section */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 shadow-lg mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Recently Posted Jobs</h2>
            <Link to="/manage-jobs" className="text-sm text-amber-400 hover:text-amber-300">
                View All
            </Link>
            </div>
          {isLoading ? (
            <div className="flex justify-center py-6">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500"></div>
            </div>
          ) : (
            recentJobs.length === 0 ? (
              <p className="text-gray-400 py-4">No jobs posted yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-gray-900 rounded-lg overflow-hidden">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Title</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Company</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Type</th>
                    <th className="py-3 px-4 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                    {recentJobs.map((job) => (
                      <tr key={job._id} className="hover:bg-gray-800/50">
                        <td className="py-2 px-4 text-sm font-medium text-white">{job.title}</td>
                        <td className="py-2 px-4 text-sm text-gray-300">{job.company}</td>
                        <td className="py-2 px-4 text-xs">
                          <span className="px-2 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                            {job.type || job.jobType}
                        </span>
                      </td>
                        <td className="py-2 px-4 text-right">
                          <button className="p-1 text-blue-400 hover:text-blue-300">
                          <Edit className="h-4 w-4" />
                        </button>
                          <button className="p-1 ml-2 text-red-400 hover:text-red-300">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            )
          )}
        </div>
        
        {/* Academic Courses Section */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 shadow-lg mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Academic Courses</h2>
            <Link to="/manage-courses" className="text-sm text-green-400 hover:text-green-300">
                View All
            </Link>
            </div>
          {isLoading ? (
            <div className="flex justify-center py-6">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : (
            recentCourses.length === 0 ? (
              <p className="text-gray-400 py-4">No courses added yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-gray-900 rounded-lg overflow-hidden">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Title</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Instructor</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Department</th>
                    <th className="py-3 px-4 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                    {recentCourses.map((course) => (
                      <tr key={course._id} className="hover:bg-gray-800/50">
                        <td className="py-2 px-4 text-sm font-medium text-white">{course.title}</td>
                        <td className="py-2 px-4 text-sm text-gray-300">{course.instructor}</td>
                        <td className="py-2 px-4 text-sm text-gray-300">{course.department}</td>
                        <td className="py-2 px-4 text-right">
                          <button className="p-1 text-blue-400 hover:text-blue-300">
                          <Edit className="h-4 w-4" />
                        </button>
                          <button className="p-1 ml-2 text-red-400 hover:text-red-300">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            )
          )}
        </div>
        
        {/* Recent Notices Section */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 shadow-lg mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Recent Notices</h2>
            <Link to="/manage-notices" className="text-sm text-indigo-400 hover:text-indigo-300">
              View All
            </Link>
          </div>
          {isLoading ? (
            <div className="flex justify-center py-6">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : (
            recentNotices.length === 0 ? (
              <p className="text-gray-400 py-4">No notices posted yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-gray-900 rounded-lg overflow-hidden">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Title</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">University</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Importance</th>
                    <th className="py-3 px-4 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {recentNotices.map((notice) => (
                    <tr key={notice._id} className="hover:bg-gray-800/50">
                        <td className="py-2 px-4 text-sm font-medium text-white">{notice.title}</td>
                        <td className="py-2 px-4 text-sm text-gray-300">{notice.university}</td>
                        <td className="py-2 px-4 text-xs">
                          <span className={`px-2 py-1 rounded-full 
                            ${notice.importance === 'urgent' 
                              ? 'bg-red-500/10 text-red-400 border border-red-500/30' 
                              : notice.importance === 'important' 
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' 
                                : 'bg-blue-500/10 text-blue-400 border border-blue-500/30'}`
                          }>
                            {notice.importance}
                        </span>
                      </td>
                        <td className="py-2 px-4 text-right">
                          <button className="p-1 text-blue-400 hover:text-blue-300">
                          <Edit className="h-4 w-4" />
                        </button>
                          <button className="p-1 ml-2 text-red-400 hover:text-red-300">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            )
          )}
      </div>

        {/* User Feedback Section */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 shadow-lg mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">User Feedback & Suggestions</h2>
            <div className="flex space-x-3">
              <button 
                onClick={exportFeedbackToCSV}
                className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center"
                disabled={loadingFeedback || feedbackList.length === 0}
              >
                <Download className="h-4 w-4 mr-1" />
                Export CSV
              </button>
              <button 
                onClick={() => fetchFeedback('all')}
                className="text-sm text-pink-400 hover:text-pink-300"
              >
                View All
              </button>
            </div>
              </div>
              
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className={`bg-gray-700/50 p-3 rounded-lg border ${feedbackFilter === 'pending' ? 'border-amber-500' : 'border-amber-600/20'}`}>
              <p className="text-amber-400 text-xs uppercase font-semibold mb-1">Pending</p>
              <p className="text-2xl font-bold text-white">{feedbackList.filter(f => f.status === 'pending').length}</p>
              </div>
            <div className={`bg-gray-700/50 p-3 rounded-lg border ${feedbackFilter === 'in-progress' ? 'border-blue-500' : 'border-blue-600/20'}`}>
              <p className="text-blue-400 text-xs uppercase font-semibold mb-1">In Progress</p>
              <p className="text-2xl font-bold text-white">{feedbackList.filter(f => f.status === 'in-progress').length}</p>
            </div>
            <div className={`bg-gray-700/50 p-3 rounded-lg border ${feedbackFilter === 'resolved' ? 'border-green-500' : 'border-green-600/20'}`}>
              <p className="text-green-400 text-xs uppercase font-semibold mb-1">Resolved</p>
              <p className="text-2xl font-bold text-white">{feedbackList.filter(f => f.status === 'resolved').length}</p>
              </div>
            </div>
            
          <div className="flex flex-wrap gap-2 mb-4">
            <div className="mr-2">
              <span className="text-gray-400 text-xs mr-2">Status:</span>
              <button
                onClick={() => {setFeedbackFilter('all'); fetchFeedback('all', categoryFilter);}}
                className={`px-3 py-1 rounded text-sm transition-colors ${feedbackFilter === 'all' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                All
              </button>
              <button
                onClick={() => {setFeedbackFilter('pending'); fetchFeedback('pending', categoryFilter);}}
                className={`px-3 py-1 rounded text-sm transition-colors ${feedbackFilter === 'pending' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
                title="Show new feedback that needs attention"
              >
                New
              </button>
              <button 
                onClick={() => {setFeedbackFilter('in-progress'); fetchFeedback('in-progress', categoryFilter);}}
                className={`px-3 py-1 rounded text-sm transition-colors ${feedbackFilter === 'in-progress' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
                title="Show feedback currently being worked on"
              >
                In Progress
              </button>
            <button
                onClick={() => {setFeedbackFilter('resolved'); fetchFeedback('resolved', categoryFilter);}}
                className={`px-3 py-1 rounded text-sm transition-colors ${feedbackFilter === 'resolved' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
                title="Show resolved feedback"
            >
                Resolved
            </button>
          </div>
          
            {/* Category filter - optional depending on your API */}
            <div className="flex items-center">
              <span className="text-gray-400 text-xs mr-2">Category:</span>
              <select
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  fetchFeedback(feedbackFilter, e.target.value);
                }}
                className="bg-gray-700 text-white text-sm rounded px-2 py-1 border border-gray-600 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              >
                <option value="all">All Categories</option>
                <option value="bug">Bug Reports</option>
                <option value="feature">Feature Requests</option>
                <option value="enhancement">Enhancements</option>
                <option value="content">Content Issues</option>
                <option value="support">Support Requests</option>
                <option value="security">Security Concerns</option>
                <option value="ui/ux">UI/UX Feedback</option>
                <option value="performance">Performance Issues</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          
          {feedbackError && (
            <div className="bg-red-900/20 border border-red-500/40 p-3 rounded-lg mb-4">
              <p className="text-red-400 text-sm flex items-center">
                <AlertCircle className="h-4 w-4 mr-2" />
                {feedbackError}
              </p>
                    <button 
                onClick={() => fetchFeedback(feedbackFilter, categoryFilter)}
                className="text-xs text-red-400 underline mt-1 hover:text-red-300"
                    >
                Try again
                    </button>
                  </div>
                )}
                
          {loadingFeedback ? (
            <div className="flex justify-center py-6">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-pink-500"></div>
            </div>
          ) : (
            feedbackList.length === 0 ? (
              <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-8 text-center">
                <MessageSquare className="h-10 w-10 text-gray-600 mx-auto mb-2" />
                <p className="text-gray-400">No feedback entries available for the selected filters.</p>
                  <button
                  onClick={() => {setFeedbackFilter('all'); setCategoryFilter('all'); fetchFeedback('all', 'all');}}
                  className="mt-3 text-cyan-400 hover:text-cyan-300 text-sm"
                  >
                  Clear filters
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                {feedbackList.slice(0, 5).map((feedback) => (
                  <div key={feedback._id} className="bg-gray-900 p-4 rounded-lg border border-gray-700 transition-all hover:border-gray-600">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-white font-medium">{safeRender(feedback.subject)}</h3>
                          {renderCategoryBadge(feedback.category)}
                          </div>
                        <p className="text-gray-400 text-sm flex items-center gap-1">
                          <span>{typeof feedback.user === 'string' ? feedback.user : (feedback.user?.name || 'Anonymous')}</span>
                          <span className="text-gray-600">•</span>
                          <span>{formatDate(feedback.createdAt)}</span>
                          {feedback.userEmail && (
                            <span className="ml-2 text-xs bg-gray-800 px-2 py-0.5 rounded-full border border-gray-700">
                              {feedback.userEmail}
                                </span>
                              )}
                            </p>
                          </div>
                      <div className="flex items-center gap-2">
                        {feedback.priority && (
                          <span className={`px-2 py-0.5 text-xs rounded-full ${
                            feedback.priority === 'high' ? 'bg-red-500/10 text-red-400 border border-red-500/30' :
                            feedback.priority === 'medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                            'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                          }`} title={`Priority: ${feedback.priority}`}>
                            {feedback.priority}
                          </span>
                        )}
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          feedback.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                          feedback.status === 'in-progress' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30' :
                          'bg-green-500/10 text-green-400 border border-green-500/30'
                        }`}>
                          {safeRender(feedback.status)}
                        </span>
                        </div>
                      </div>
                      
                    <div className="bg-gray-800/50 p-3 rounded border border-gray-700 mb-3">
                      <p className="text-gray-300">{safeRender(feedback.message)}</p>
                      </div>
                      
                    <div className="flex flex-wrap justify-between mt-3">
                      <div className="flex flex-wrap gap-2 mb-2 sm:mb-0">
                        <button 
                          onClick={() => updateFeedbackStatus(feedback._id, 'in-progress')} 
                          className="text-xs px-2 py-1 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded flex items-center"
                          disabled={feedback.status === 'in-progress'}
                          title="Mark as being worked on"
                        >
                          <RefreshCw className="h-3 w-3 mr-1" />
                          In Progress
                        </button>
                        <button 
                          onClick={() => updateFeedbackStatus(feedback._id, 'resolved')} 
                          className="text-xs px-2 py-1 bg-green-500/10 text-green-400 hover:bg-green-500/20 rounded flex items-center"
                          disabled={feedback.status === 'resolved'}
                          title="Mark as resolved"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Resolved
                        </button>
                        {feedback.status === 'resolved' && (
                          <button 
                            onClick={() => updateFeedbackStatus(feedback._id, 'pending')} 
                            className="text-xs px-2 py-1 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 rounded flex items-center"
                            title="Reopen this feedback"
                          >
                            <XCircle className="h-3 w-3 mr-1" />
                            Reopen
                          </button>
                        )}
                        </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => openResponseModal(feedback)}
                          className="text-xs px-2 py-1 bg-pink-500/10 text-pink-400 hover:bg-pink-500/20 rounded flex items-center"
                          title="Write a response to this feedback"
                        >
                          <MessageCircle className="h-3 w-3 mr-1" />
                          Respond
                        </button>
                        <button 
                          onClick={() => deleteFeedback(feedback._id)}
                          className="text-xs px-2 py-1 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded flex items-center"
                          title="Delete this feedback permanently"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Delete
                        </button>
                        </div>
                      </div>
                      
                    {feedback.adminResponse && (
                      <div className="mt-3 pt-3 border-t border-gray-700">
                        <p className="text-gray-400 text-xs mb-1">Admin Response:</p>
                        <div className="text-gray-300 text-sm">{formatAdminResponse(feedback.adminResponse)}</div>
                                </div>
                    )}
                    {feedback.response && feedback.response !== feedback.adminResponse && (
                      <div className="mt-3 pt-3 border-t border-gray-700">
                        <p className="text-gray-400 text-xs mb-1">Additional Response Details:</p>
                        <div className="text-gray-300 text-sm">{formatAdminResponse(feedback.response)}</div>
                                </div>
                    )}
                    
                    {feedback.assignedTo && (
                      <div className="mt-3 pt-2 border-t border-gray-700/50">
                        <p className="text-gray-500 text-xs flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          Assigned to: {teamMembers.find(m => m.id === feedback.assignedTo)?.name || feedback.assignedTo}
                        </p>
                        </div>
                      )}
                  </div>
                ))}
                
                {feedbackList.length > 5 && (
                  <div className="text-center pt-2">
                        <button 
                      onClick={() => fetchFeedback(feedbackFilter, categoryFilter)}
                      className="text-pink-400 hover:text-pink-300 text-sm flex items-center justify-center mx-auto"
                        >
                      <RefreshCw className="h-3 w-3 mr-1" />
                      View All Feedback ({feedbackList.length})
                        </button>
                      </div>
                )}
                    </div>
            )
              )}
            </div>
            
        {/* Events Section */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 shadow-lg mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Upcoming Events</h2>
            <Link to="/manage-events" className="text-sm text-orange-400 hover:text-orange-300">
              View All
            </Link>
          </div>
          
          <div className="flex justify-center py-6">
            <div className="text-center">
              <Calendar className="h-14 w-14 text-orange-400 mx-auto mb-3" />
              <h3 className="text-xl font-semibold text-white">Event Management</h3>
              <p className="text-gray-400 max-w-md mx-auto mt-2 mb-4">Create and manage university events, workshops, seminars, and other activities</p>
              <Link 
                to="/add-event" 
                className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add New Event
              </Link>
            </div>
          </div>
                </div>
                
        {/* Additional Custom Sections as needed */}
        
        {/* Instructor Upload Section */}
        {showInstructorUploadSection && (
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 shadow-xl mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-purple-400">Upload Instructors</h2>
                      <button 
                onClick={() => setShowInstructorUploadSection(false)}
                className="text-gray-400 hover:text-white"
                      >
                <X className="h-5 w-5" />
                      </button>
                  </div>
            <p className="text-gray-300 mb-4">
              Upload instructor information via CSV/Excel file or manual entry.
            </p>
            
            {/* Instructor upload implementation details */}
                      </div>
        )}
        
        {/* Community Management Section */}
        {showCommunitySection && (
          <div id="community-section" className="bg-gray-800 rounded-lg p-6 border border-gray-700 shadow-xl mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-cyan-400">Community Management</h2>
                            <button 
                onClick={() => setShowCommunitySection(false)}
                className="text-gray-400 hover:text-white"
                            >
                <X className="h-5 w-5" />
                            </button>
            </div>
            <p className="text-gray-300 mb-4">
              Manage global announcements and communicate with users.
            </p>
            
            {/* Community management implementation details */}
          </div>
        )}
        
        {/* Response Modal */}
        {showResponseModal && selectedFeedback && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-gray-700">
              <div className="bg-gray-700 p-4 flex justify-between items-center">
                <h3 className="text-lg font-medium text-white">Feedback Response</h3>
                              <button 
                  onClick={() => setShowResponseModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                              </button>
                            </div>
              
              <div className="p-6">
                <div className="mb-4 bg-gray-700/50 p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-gray-400">From: <span className="text-white">{safeRender(selectedFeedback.user?.name || 'Anonymous')}</span></p>
                      {selectedFeedback.category && renderCategoryBadge(selectedFeedback.category)}
                      </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      selectedFeedback.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                      selectedFeedback.status === 'in-progress' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30' :
                      'bg-green-500/10 text-green-400 border border-green-500/30'
                    }`}>
                      {safeRender(selectedFeedback.status)}
                    </span>
                            </div>
                  <div className="text-sm grid grid-cols-2 gap-2">
                    <p className="text-gray-400">Email: <span className="text-white">{safeRender(selectedFeedback.userEmail || selectedFeedback.user?.email || 'N/A')}</span></p>
                    <p className="text-gray-400">Date: <span className="text-white">{formatDate(selectedFeedback.createdAt)}</span></p>
                    <p className="text-gray-400">Subject: <span className="text-white">{safeRender(selectedFeedback.subject)}</span></p>
                    {selectedFeedback.priority && (
                      <p className="text-gray-400">Priority: 
                        <span className={`ml-1 px-1.5 py-0.5 text-xs rounded-full ${
                          selectedFeedback.priority === 'high' ? 'bg-red-500/10 text-red-400 border border-red-500/30' :
                          selectedFeedback.priority === 'medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                          'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                        }`}>
                          {selectedFeedback.priority}
                        </span>
                      </p>
                    )}
                            </div>
                  {selectedFeedback.response && (
                    <div className="text-xs text-gray-400 mt-2 pt-2 border-t border-gray-600">
                      Response Info: {safeRender(selectedFeedback.response)}
                      </div>
                    )}
                  </div>
                  
                <div className="mb-6 bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-300 mb-1">Message:</p>
                  <p className="text-sm text-gray-300">{safeRender(selectedFeedback.message)}</p>
                        </div>
                        
                <div className="mb-4">
                  <label htmlFor="assignedTo" className="flex items-center justify-between text-sm font-medium text-gray-300 mb-2">
                    <span>Assign To</span>
                    {assignedTo && (
                      <button 
                        onClick={() => setAssignedTo('')}
                        className="text-xs text-red-400 hover:text-red-300"
                      >
                        Clear Assignment
                      </button>
                    )}
                  </label>
                  <select
                    id="assignedTo"
                    className="w-full px-3 py-2 text-gray-100 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                  >
                    <option value="">Unassigned</option>
                    {teamMembers.map(member => (
                      <option key={member.id} value={member.id}>
                        {member.name} ({member.department})
                      </option>
                    ))}
                  </select>
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
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>{responseText.length} characters</span>
                    <button 
                      onClick={() => setResponseText('')}
                      className="text-cyan-400 hover:text-cyan-300"
                      disabled={!responseText}
                    >
                      Clear
                    </button>
                                            </div>
                                        </div>

                {selectedFeedback.adminResponse && (
                  <div className="mb-4 mt-6 border-t border-gray-700 pt-4">
                    <p className="text-sm font-medium text-gray-300 mb-2">Previous Response:</p>
                    <div className="text-sm text-gray-300">
                      {formatAdminResponse(selectedFeedback.adminResponse)}
                                    </div>
                            </div>
                          )}
                        </div>
                        
              <div className="px-6 py-4 bg-gray-700 flex justify-between">
                <div>
                              <button
                    onClick={() => updateFeedbackStatus(selectedFeedback._id, 'resolved')}
                    className="px-3 py-1 text-xs font-medium text-green-400 bg-green-500/10 rounded-lg border border-green-500/30 hover:bg-green-500/20 focus:outline-none mr-2"
                              >
                    <CheckCircle className="h-3 w-3 inline mr-1" />
                    Mark Resolved
                              </button>
                            <button
                    onClick={() => updateFeedbackStatus(selectedFeedback._id, 'in-progress')}
                    className="px-3 py-1 text-xs font-medium text-blue-400 bg-blue-500/10 rounded-lg border border-blue-500/30 hover:bg-blue-500/20 focus:outline-none"
                            >
                    <RefreshCw className="h-3 w-3 inline mr-1" />
                    In Progress
                            </button>
                          </div>
                <div className="space-x-3">
                  <button
                    onClick={() => setShowResponseModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-600 rounded-lg hover:bg-gray-500 focus:outline-none"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={sendResponse}
                    disabled={sendingResponse}
                    className={`px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none flex items-center
                      ${sendingResponse || (!responseText.trim() && !assignedTo) ? 'bg-cyan-600/50 cursor-not-allowed' : 'bg-cyan-600 hover:bg-cyan-700'}`}
                  >
                    {sendingResponse ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Mail className="h-4 w-4 mr-2" />
                        Save & Send
                      </>
                    )}
                  </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

// PropTypes
AdminDashboard.propTypes = {
  initialSection: PropTypes.oneOf(['instructors', 'community', null, undefined])
};

// Default props
AdminDashboard.defaultProps = {
  initialSection: null
};

export default AdminDashboard;