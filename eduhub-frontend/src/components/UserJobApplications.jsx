import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  AlertCircle,
  Building2,
  MapPin,
  Calendar,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Download,
  RefreshCw
} from 'lucide-react';
import { jobService, apiClient, checkServerConnection } from '../api/apiClient';

const UserJobApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedApp, setExpandedApp] = useState(null);
  const [filter, setFilter] = useState('all');
  const [serverStatus, setServerStatus] = useState({ checked: false, online: false });

  useEffect(() => {
    const checkServerAndFetchApplications = async () => {
      try {
        setLoading(true);
        
        // First check server connection
        const connection = await checkServerConnection();
        setServerStatus({ checked: true, online: connection.success });
        
        if (!connection.success) {
          setError('Server is currently unavailable. Please try again later.');
          setLoading(false);
          return;
        }
        
        // Get token from localStorage
        const token = localStorage.getItem('token');
        
        // Debug token information without exposing full token
        const debugTokenInfo = token ? {
          length: token.length,
          firstChars: token.substring(0, 10) + '...',
          lastChars: '...' + token.substring(token.length - 10),
          format: token.includes('.') ? 'Appears to be JWT format' : 'Not JWT format'
        } : 'No token found';
        
        console.log('Token info:', debugTokenInfo);
        
        // Check if token exists
        if (!token) {
          console.error('No authentication token found');
          setError('Authentication required. Please log in again.');
          setLoading(false);
          return;
        }
        
        console.log('Fetching job applications...');
        
        // Use jobService to fetch applications
        const response = await jobService.getUserApplications();
        
        console.log('Applications data received:', response.data);
        
        // Check if response contains data
        if (response.data) {
          setApplications(response.data);
          setError(null);
        } else {
          console.error('Empty response received');
          setError('No application data received from server');
        }
      } catch (err) {
        console.error('Error fetching applications:', err);
        
        // More detailed error handling
        if (err.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error('Error response:', err.response.status, err.response.data);
          
          if (err.response.status === 401) {
            setError('Your session has expired. Please log in again.');
          } else if (err.response.status === 404) {
            setError('No applications found for your account.');
          } else {
            setError(`Server error: ${err.response.status}. ${err.response.data.message || 'Please try again later.'}`);
          }
        } else if (err.request) {
          // The request was made but no response was received
          console.error('No response received:', err.request);
          setError('No response from server. Please check your internet connection.');
        } else {
          // Something happened in setting up the request
          setError('Failed to load your applications. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    checkServerAndFetchApplications();
  }, []);

  // Function to retry fetching applications
  const handleRetry = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Check server connection first
      const connection = await checkServerConnection();
      setServerStatus({ checked: true, online: connection.success });
      
      if (connection.success) {
        // If server is online, fetch applications
        const response = await jobService.getUserApplications();
        setApplications(response.data);
      } else {
        setError('Server is still unavailable. Please try again later.');
      }
    } catch (error) {
      console.error('Retry failed:', error);
      setError('Failed to reconnect. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id) => {
    if (expandedApp === id) {
      setExpandedApp(null);
    } else {
      setExpandedApp(id);
    }
  };

  const handleDownloadCV = (cvPath) => {
    window.open(`http://localhost:5000/${cvPath}`, '_blank');
  };

  const handleDownloadCoverLetter = async (applicationId) => {
    try {
      const response = await jobService.downloadCoverLetter(applicationId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `cover-letter-${applicationId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading cover letter:', error);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Filter applications
  const filteredApplications = applications.filter(app => {
    if (filter === 'all') return true;
    return app.status === filter;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span className="flex items-center text-yellow-400 bg-yellow-400/10 px-2.5 py-0.5 rounded-full text-xs font-medium">
            <Clock className="w-3 h-3 mr-1" /> Pending
          </span>
        );
      case 'reviewing':
        return (
          <span className="flex items-center text-blue-400 bg-blue-400/10 px-2.5 py-0.5 rounded-full text-xs font-medium">
            <Eye className="w-3 h-3 mr-1" /> Under Review
          </span>
        );
      case 'accepted':
        return (
          <span className="flex items-center text-green-400 bg-green-400/10 px-2.5 py-0.5 rounded-full text-xs font-medium">
            <CheckCircle className="w-3 h-3 mr-1" /> Accepted
          </span>
        );
      case 'rejected':
        return (
          <span className="flex items-center text-red-400 bg-red-400/10 px-2.5 py-0.5 rounded-full text-xs font-medium">
            <XCircle className="w-3 h-3 mr-1" /> Rejected
          </span>
        );
      default:
        return (
          <span className="flex items-center text-gray-400 bg-gray-400/10 px-2.5 py-0.5 rounded-full text-xs font-medium">
            <AlertCircle className="w-3 h-3 mr-1" /> Unknown
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-800 rounded-xl">
        <div className="flex justify-center items-center h-60">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-800 rounded-xl">
        <div className="text-center py-10">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-white mb-2">Error Loading Applications</h3>
          <p className="text-gray-400 mb-6">{error}</p>
          
          <div className="flex flex-col items-center gap-3">
            <button
              onClick={handleRetry}
              className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </button>
            
            <Link 
              to="/jobs"
              className="inline-flex items-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              <Briefcase className="w-4 h-4 mr-2" />
              Browse Available Jobs
            </Link>
          </div>
          
          {!serverStatus.online && (
            <div className="mt-6 p-3 bg-gray-700 rounded-lg text-left">
              <h4 className="font-medium text-amber-400 mb-2 flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                Server Connection Issue
              </h4>
              <p className="text-sm text-gray-300 mb-2">
                We couldn't connect to the server. This could be due to:
              </p>
              <ul className="list-disc list-inside text-sm text-gray-400 space-y-1 ml-2 mb-2">
                <li>Your internet connection is down</li>
                <li>The server is currently offline or under maintenance</li>
                <li>Your network might be blocking the connection</li>
              </ul>
              <p className="text-sm text-gray-300">
                Please try again later or contact support if the issue persists.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="p-6 bg-gray-800 rounded-xl">
        <div className="text-center py-10">
          <Briefcase className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-white mb-2">No Applications Found</h3>
          <p className="text-gray-400 mb-6">You haven't applied to any jobs yet.</p>
          <Link 
            to="/jobs"
            className="inline-block px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            Browse Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">My Job Applications</h2>
        <div className="relative">
          <select
            className="bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            value={filter}
            onChange={e => setFilter(e.target.value)}
          >
            <option value="all">All Applications</option>
            <option value="pending">Pending</option>
            <option value="reviewing">Under Review</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredApplications.map((app) => (
          <div 
            key={app._id} 
            className="bg-gray-700 rounded-lg border border-gray-600 overflow-hidden hover:border-teal-500 transition-all"
          >
            <div 
              className="p-4 cursor-pointer"
              onClick={() => toggleExpand(app._id)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {app.job?.title || 'Unknown Position'}
                  </h3>
                  <div className="flex items-center text-gray-400 text-sm mb-1">
                    <Building2 className="w-4 h-4 mr-1" /> 
                    <span>{app.job?.company || 'Unknown Company'}</span>
                  </div>
                  <div className="flex items-center text-gray-400 text-sm">
                    <MapPin className="w-4 h-4 mr-1" /> 
                    <span>{app.job?.location || 'Unknown Location'}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  {getStatusBadge(app.status)}
                  <span className="text-xs text-gray-400 mt-2">
                    Applied: {formatDate(app.appliedAt)}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center mt-4">
                <Link 
                  to={`/job/${app.job?._id}`}
                  className="text-teal-400 text-sm flex items-center hover:text-teal-300"
                  onClick={(e) => e.stopPropagation()}
                >
                  View Job Details
                  <ExternalLink className="w-3 h-3 ml-1" />
                </Link>
                <button className="text-gray-400 hover:text-white">
                  {expandedApp === app._id ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {expandedApp === app._id && (
              <div className="p-4 pt-0 border-t border-gray-600 mt-4">
                {(app.status === 'accepted' || app.status === 'rejected') && app.adminFeedback && (
                  <div className="mb-4 p-3 rounded-lg bg-gray-800">
                    <h4 className="font-medium text-white mb-2">Feedback from Employer:</h4>
                    <p className="text-gray-300 text-sm">{app.adminFeedback}</p>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 mt-4">
                  <button
                    onClick={() => handleDownloadCV(app.cvPath)}
                    className="flex items-center px-3 py-1.5 bg-gray-600 hover:bg-gray-500 rounded-lg text-sm transition-colors"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download CV
                  </button>
                  
                  {app.coverLetterPdfPath && (
                    <button
                      onClick={() => handleDownloadCoverLetter(app._id)}
                      className="flex items-center px-3 py-1.5 bg-gray-600 hover:bg-gray-500 rounded-lg text-sm transition-colors"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download Cover Letter
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserJobApplications; 