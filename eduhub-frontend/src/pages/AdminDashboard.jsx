import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  AlertCircle
} from 'lucide-react';
import { apiClient } from '../api/apiClient';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    users: 0,
    courses: 0,
    jobs: 0,
    notices: 0,
    feedback: 0
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

  // Check if user is admin
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    
    if (!token || userRole !== 'admin') {
      navigate('/login', { state: { message: 'You must be logged in as admin to access this page' } });
    }
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
        
        setStats(prev => ({
          ...prev,
          jobs: jobsResponse.data.length,
          notices: noticesResponse.data.length,
          courses: coursesResponse.data.length,
          feedback: feedbackResponse.data.length
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
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
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
          
          <div className="bg-gradient-to-br from-cyan-600/20 to-cyan-800/20 p-6 rounded-lg border border-cyan-700/50 shadow-lg">
            <div className="flex items-center mb-3">
              <MessageSquare className="h-7 w-7 text-cyan-400 mr-3" />
              <h3 className="text-lg font-semibold text-gray-200">Feedback</h3>
            </div>
            <p className="text-3xl font-bold text-white">{isLoading ? '...' : stats.feedback || 0}</p>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4 text-white">Quick Actions</h2>
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
    </div>
  );
};

export default AdminDashboard;
