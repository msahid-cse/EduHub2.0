import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  BookOpen,
  Briefcase,
  FileText,
  Bell,
  Settings,
  Calendar,
  MessageCircle,
  GraduationCap
} from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';
import { apiClient } from '../api/apiClient';

const AdminDashboardNew = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [stats, setStats] = useState({
    users: 0,
    courses: 0,
    jobs: 0,
    notices: 0,
    feedback: 0,
    globalPosts: 0,
    instructors: 0,
    events: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [recentJobs, setRecentJobs] = useState([]);
  const [recentNotices, setRecentNotices] = useState([]);
  const [recentCourses, setRecentCourses] = useState([]);

  useEffect(() => {
    // Check authentication and role
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
    
    // Fetch dashboard data
    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setStats({
          users: 248,
          courses: 34,
          jobs: 12,
          notices: 27,
          feedback: 18,
          globalPosts: 156,
          instructors: 43,
          events: 8
        });
        
        setRecentJobs([
          { id: 1, title: 'Web Developer', company: 'TechCorp', date: '2023-09-15' },
          { id: 2, title: 'Data Scientist', company: 'DataInsights', date: '2023-09-14' }
        ]);
        
        setRecentNotices([
          { id: 1, title: 'Campus Closure', date: '2023-09-16' },
          { id: 2, title: 'Scholarship Applications', date: '2023-09-13' }
        ]);
        
        setRecentCourses([
          { id: 1, title: 'Advanced Web Development', instructor: 'John Smith', enrollments: 42 },
          { id: 2, title: 'Data Analysis with Python', instructor: 'Emily Chen', enrollments: 38 }
        ]);
        
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen flex">
      {/* Sidebar */}
      <AdminSidebar 
        collapsed={sidebarCollapsed} 
        setCollapsed={setSidebarCollapsed} 
        active="dashboard" 
      />

      {/* Main Content */}
      <main className="flex-1">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 p-6 rounded-lg border border-blue-700/50 shadow-lg">
              <div className="flex items-center mb-3">
                <Users className="h-7 w-7 text-blue-400 mr-3" />
                <h3 className="text-lg font-semibold text-gray-200">Total Users</h3>
              </div>
              <p className="text-3xl font-bold text-white">{isLoading ? '...' : stats.users}</p>
            </div>
            
            <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 p-6 rounded-lg border border-green-700/50 shadow-lg">
              <div className="flex items-center mb-3">
                <BookOpen className="h-7 w-7 text-green-400 mr-3" />
                <h3 className="text-lg font-semibold text-gray-200">Total Courses</h3>
              </div>
              <p className="text-3xl font-bold text-white">{isLoading ? '...' : stats.courses}</p>
            </div>

            <div className="bg-gradient-to-br from-amber-600/20 to-amber-800/20 p-6 rounded-lg border border-amber-700/50 shadow-lg">
              <div className="flex items-center mb-3">
                <Briefcase className="h-7 w-7 text-amber-400 mr-3" />
                <h3 className="text-lg font-semibold text-gray-200">Active Jobs</h3>
              </div>
              <p className="text-3xl font-bold text-white">{isLoading ? '...' : stats.jobs}</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 p-6 rounded-lg border border-purple-700/50 shadow-lg">
              <div className="flex items-center mb-3">
                <GraduationCap className="h-7 w-7 text-purple-400 mr-3" />
                <h3 className="text-lg font-semibold text-gray-200">Instructors</h3>
              </div>
              <p className="text-3xl font-bold text-white">{isLoading ? '...' : stats.instructors}</p>
            </div>
          </div>
          
          {/* Stats Cards - Second Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-indigo-600/20 to-indigo-800/20 p-6 rounded-lg border border-indigo-700/50 shadow-lg">
              <div className="flex items-center mb-3">
                <Bell className="h-7 w-7 text-indigo-400 mr-3" />
                <h3 className="text-lg font-semibold text-gray-200">Total Notices</h3>
              </div>
              <p className="text-3xl font-bold text-white">{isLoading ? '...' : stats.notices}</p>
            </div>
            
            <div className="bg-gradient-to-br from-pink-600/20 to-pink-800/20 p-6 rounded-lg border border-pink-700/50 shadow-lg">
              <div className="flex items-center mb-3">
                <FileText className="h-7 w-7 text-pink-400 mr-3" />
                <h3 className="text-lg font-semibold text-gray-200">Feedback Entries</h3>
              </div>
              <p className="text-3xl font-bold text-white">{isLoading ? '...' : stats.feedback}</p>
            </div>
            
            <div className="bg-gradient-to-br from-cyan-600/20 to-cyan-800/20 p-6 rounded-lg border border-cyan-700/50 shadow-lg">
              <div className="flex items-center mb-3">
                <MessageCircle className="h-7 w-7 text-cyan-400 mr-3" />
                <h3 className="text-lg font-semibold text-gray-200">Community Posts</h3>
              </div>
              <p className="text-3xl font-bold text-white">{isLoading ? '...' : stats.globalPosts}</p>
            </div>
            
            <div className="bg-gradient-to-br from-orange-600/20 to-orange-800/20 p-6 rounded-lg border border-orange-700/50 shadow-lg">
              <div className="flex items-center mb-3">
                <Calendar className="h-7 w-7 text-orange-400 mr-3" />
                <h3 className="text-lg font-semibold text-gray-200">Events Hosted</h3>
              </div>
              <p className="text-3xl font-bold text-white">{isLoading ? '...' : stats.events}</p>
            </div>
          </div>
          
          {/* Recent Activity Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Recent Jobs */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Recent Jobs</h2>
                <button onClick={() => navigate('/post-job')} className="text-sm text-blue-400 hover:text-blue-300">
                  View All
                </button>
              </div>
              {isLoading ? (
                <div className="animate-pulse space-y-3">
                  <div className="h-10 bg-gray-700 rounded"></div>
                  <div className="h-10 bg-gray-700 rounded"></div>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentJobs.map(job => (
                    <div key={job.id} className="bg-gray-700/50 p-3 rounded-lg border border-gray-600">
                      <h3 className="font-medium text-gray-200">{job.title}</h3>
                      <div className="flex justify-between text-sm text-gray-400">
                        <span>{job.company}</span>
                        <span>{formatDate(job.date)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Recent Notices */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Recent Notices</h2>
                <button onClick={() => navigate('/post-notice')} className="text-sm text-blue-400 hover:text-blue-300">
                  View All
                </button>
              </div>
              {isLoading ? (
                <div className="animate-pulse space-y-3">
                  <div className="h-10 bg-gray-700 rounded"></div>
                  <div className="h-10 bg-gray-700 rounded"></div>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentNotices.map(notice => (
                    <div key={notice.id} className="bg-gray-700/50 p-3 rounded-lg border border-gray-600">
                      <h3 className="font-medium text-gray-200">{notice.title}</h3>
                      <div className="flex justify-end text-sm text-gray-400">
                        <span>{formatDate(notice.date)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Recent Courses */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Recent Courses</h2>
                <button onClick={() => navigate('/upload-course')} className="text-sm text-blue-400 hover:text-blue-300">
                  View All
                </button>
              </div>
              {isLoading ? (
                <div className="animate-pulse space-y-3">
                  <div className="h-10 bg-gray-700 rounded"></div>
                  <div className="h-10 bg-gray-700 rounded"></div>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentCourses.map(course => (
                    <div key={course.id} className="bg-gray-700/50 p-3 rounded-lg border border-gray-600">
                      <h3 className="font-medium text-gray-200">{course.title}</h3>
                      <div className="flex justify-between text-sm text-gray-400">
                        <span>{course.instructor}</span>
                        <span>{course.enrollments} enrolled</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardNew; 