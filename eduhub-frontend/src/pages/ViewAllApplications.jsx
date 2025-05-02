import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  ChevronLeft,
  User,
  Mail,
  School,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Download,
  MessageSquare,
  FileBox,
  Search,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Filter,
  Briefcase
} from 'lucide-react';

const ViewAllApplications = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applications, setApplications] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0
  });
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Filter and search state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState('appliedAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Check if user is admin
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'admin') {
      navigate('/login', { state: { message: 'Admin access required' } });
      return;
    }

    fetchApplications();
  }, [navigate, pagination.currentPage, statusFilter, sortField, sortDirection]);

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // Construct query parameters, only include non-empty values
      const queryParams = new URLSearchParams();
      queryParams.append('page', pagination.currentPage);
      queryParams.append('limit', 20);
      
      if (statusFilter !== 'all') {
        queryParams.append('status', statusFilter);
      }
      
      queryParams.append('sort', sortField);
      queryParams.append('direction', sortDirection);
      
      if (searchQuery.trim()) {
        queryParams.append('search', searchQuery);
      }
      
      // Fetch applications
      const response = await axios.get(
        `http://localhost:5000/api/jobs/applications/all?${queryParams}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      console.log('API response:', response.data);
      
      // Check if response has the expected shape
      if (response.data && response.data.applications) {
        setApplications(response.data.applications);
        setPagination(response.data.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalCount: response.data.applications.length
        });
      } else {
        // If response doesn't have expected shape, try to handle it
        console.error('Unexpected API response format:', response.data);
        setApplications(Array.isArray(response.data) ? response.data : []);
        setError('Received unexpected data format from server');
      }
    } catch (err) {
      console.error('Error fetching job applications:', err);
      setError('Failed to load job applications. Please try again.');
      setApplications([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Handle application status update
  const updateApplicationStatus = async (applicationId, status) => {
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('token');
      
      // Update application status
      await axios.put(
        `http://localhost:5000/api/jobs/applications/${applicationId}`,
        {
          status,
          adminFeedback: feedbackText
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      // Update local state
      setApplications(prevApplications => 
        prevApplications.map(app => 
          app._id === applicationId 
            ? { ...app, status, adminFeedback: feedbackText } 
            : app
        )
      );
      
      // Close feedback modal if open
      setShowFeedbackModal(false);
      setFeedbackText('');
    } catch (error) {
      console.error('Error updating application status:', error);
      alert('Failed to update application status. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open feedback modal
  const openFeedbackModal = (application) => {
    setSelectedApplication(application);
    setFeedbackText(application.adminFeedback || '');
    setShowFeedbackModal(true);
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    fetchApplications();
  };

  // Handle download CV
  const handleDownloadCV = async (application) => {
    try {
      const token = localStorage.getItem('token');
      
      // Extract filename from path
      const fileName = application.cvPath.split('/').pop();
      
      // Get CV file
      const response = await axios.get(
        `http://localhost:5000/${application.cvPath}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob'
        }
      );
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading CV:', error);
      alert('Failed to download CV. Please try again.');
    }
  };

  // Handle pagination
  const changePage = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, currentPage: newPage }));
    }
  };

  // Get status color class
  const getStatusColorClass = (status) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-500/20 text-green-400 border-green-500';
      case 'rejected':
        return 'bg-red-500/20 text-red-400 border-red-500';
      case 'reviewing':
        return 'bg-blue-500/20 text-blue-400 border-blue-500';
      default: // pending
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500';
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="w-5 h-5" />;
      case 'rejected':
        return <XCircle className="w-5 h-5" />;
      case 'reviewing':
        return <Eye className="w-5 h-5" />;
      default: // pending
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  // Toggle sort direction
  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Get sort icon
  const getSortIcon = (field) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />;
  };

  if (isLoading && applications.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/admindashboard')}
            className="flex items-center text-purple-400 hover:text-purple-300 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back to Admin Dashboard
          </button>
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-6">All Job Applications</h1>
        
        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-800 rounded-lg text-red-300">
            {error}
          </div>
        )}
        
        {/* Search and filters */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 mb-6">
          <div className="flex justify-between items-center">
            <form onSubmit={handleSearch} className="flex w-full max-w-md">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search by applicant name, email, or job title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-l-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button 
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-r-md"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </form>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="ml-4 px-3 py-2 flex items-center text-sm bg-gray-700 hover:bg-gray-600 rounded-md"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
              {showFilters ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
            </button>
          </div>
          
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-700 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="reviewing">Reviewing</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">Sort By</label>
                <select
                  value={sortField}
                  onChange={(e) => toggleSort(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                >
                  <option value="appliedAt">Applied Date</option>
                  <option value="status">Status</option>
                  <option value="applicant.name">Applicant Name</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">Direction</label>
                <select
                  value={sortDirection}
                  onChange={(e) => setSortDirection(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                >
                  <option value="desc">Newest First</option>
                  <option value="asc">Oldest First</option>
                </select>
              </div>
            </div>
          )}
        </div>
        
        {/* Applications list */}
        <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 mb-6">
          {applications.length === 0 ? (
            <div className="py-20 text-center text-gray-400">
              <User className="w-16 h-16 mx-auto text-gray-600 mb-4" />
              <p className="text-lg">No applications found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Applicant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      <button 
                        onClick={() => toggleSort('job.title')}
                        className="flex items-center focus:outline-none"
                      >
                        Job {getSortIcon('job.title')}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      <button 
                        onClick={() => toggleSort('appliedAt')}
                        className="flex items-center focus:outline-none"
                      >
                        Applied On {getSortIcon('appliedAt')}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Documents
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      <button 
                        onClick={() => toggleSort('status')}
                        className="flex items-center focus:outline-none"
                      >
                        Status {getSortIcon('status')}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                
                <tbody className="divide-y divide-gray-700">
                  {applications.map((application) => (
                    <tr key={application._id} className="hover:bg-gray-700/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="font-medium text-white">
                            {application.applicant?.name || 'Unknown'}
                          </div>
                          <div className="flex items-center text-sm text-gray-400">
                            <Mail className="w-3 h-3 mr-1" />
                            {application.applicant?.email || 'No email'}
                          </div>
                          <div className="flex items-center text-sm text-gray-400">
                            <School className="w-3 h-3 mr-1" />
                            {application.applicant?.university || 'No university'}
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="font-medium text-white">
                            {application.job?.title || 'Unknown Job'}
                          </div>
                          <div className="text-sm text-gray-400">
                            {application.job?.company || 'Unknown Company'}
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-gray-300">
                          <Clock className="w-4 h-4 mr-2 text-gray-500" />
                          {formatDate(application.appliedAt || application.createdAt)}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleDownloadCV(application)}
                          className="px-3 py-1 bg-purple-900/30 text-purple-400 rounded-full flex items-center text-sm hover:bg-purple-900/50 transition-colors"
                        >
                          <FileText className="w-4 h-4 mr-1" />
                          Download CV
                        </button>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`px-3 py-1 rounded-full border text-sm inline-flex items-center ${getStatusColorClass(application.status)}`}>
                          {getStatusIcon(application.status)}
                          <span className="ml-1 capitalize">{application.status}</span>
                        </div>
                        
                        {application.adminFeedback && (
                          <div className="mt-1 text-xs text-gray-400 flex items-center">
                            <MessageSquare className="w-3 h-3 mr-1" />
                            Feedback provided
                          </div>
                        )}
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => updateApplicationStatus(application._id, 'reviewing')}
                            className="p-1.5 bg-blue-900/30 text-blue-400 rounded hover:bg-blue-900/50 transition-colors"
                            title="Mark as Reviewing"
                            disabled={application.status === 'reviewing'}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => updateApplicationStatus(application._id, 'accepted')}
                            className="p-1.5 bg-green-900/30 text-green-400 rounded hover:bg-green-900/50 transition-colors"
                            title="Accept Application"
                            disabled={application.status === 'accepted'}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => updateApplicationStatus(application._id, 'rejected')}
                            className="p-1.5 bg-red-900/30 text-red-400 rounded hover:bg-red-900/50 transition-colors"
                            title="Reject Application"
                            disabled={application.status === 'rejected'}
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => openFeedbackModal(application)}
                            className="p-1.5 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors"
                            title="Provide Feedback"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => navigate(`/job-applications/${application.job?._id}`)}
                            className="p-1.5 bg-amber-900/30 text-amber-400 rounded hover:bg-amber-900/50 transition-colors"
                            title="View All Applications for This Job"
                          >
                            <Briefcase className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {/* Pagination */}
        <div className="flex justify-between items-center">
          <div className="text-gray-400">
            Showing applications {(pagination.currentPage - 1) * 20 + 1} to {Math.min(pagination.currentPage * 20, pagination.totalCount)} of {pagination.totalCount}
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => changePage(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className={`p-2 rounded-md ${
                pagination.currentPage === 1 
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            {Array.from({ length: Math.min(5, pagination.totalPages) }).map((_, i) => {
              const pageNumber = i + 1;
              return (
                <button
                  key={pageNumber}
                  onClick={() => changePage(pageNumber)}
                  className={`px-3 py-1 rounded-md ${
                    pagination.currentPage === pageNumber
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}
            
            <button
              onClick={() => changePage(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages || pagination.totalPages === 0}
              className={`p-2 rounded-md ${
                pagination.currentPage === pagination.totalPages || pagination.totalPages === 0
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Feedback Modal */}
      {showFeedbackModal && selectedApplication && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-lg w-full max-w-md">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">
                Provide Feedback
              </h3>
              
              <p className="text-gray-400 mb-2">
                Applicant: <span className="text-white">{selectedApplication.applicant?.name || 'Unknown'}</span>
              </p>
              
              <p className="text-gray-400 mb-4">
                Job: <span className="text-white">{selectedApplication.job?.title || 'Unknown Job'}</span>
              </p>
              
              <div className="mb-4">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Feedback Message
                </label>
                <div className="text-xs text-teal-400 mb-2 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  This feedback will be sent via email to the applicant and saved in the database.
                </div>
                <textarea
                  rows="4"
                  className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Provide feedback for this applicant..."
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="bg-gray-900/60 p-3 rounded-md mb-4">
                <h4 className="text-sm font-medium text-teal-400 mb-2">Job Details (Will be included in email)</h4>
                <div className="text-sm text-gray-300">
                  <div><strong>Position:</strong> {selectedApplication.job?.title}</div>
                  <div><strong>Company:</strong> {selectedApplication.job?.company}</div>
                  <div><strong>Location:</strong> {selectedApplication.job?.location}</div>
                  <div><strong>Type:</strong> {selectedApplication.job?.type}</div>
                  {selectedApplication.job?.salary && (
                    <div><strong>Salary:</strong> {selectedApplication.job?.salary}</div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-between border-t border-gray-700 pt-4">
                <button
                  type="button"
                  onClick={() => setShowFeedbackModal(false)}
                  className="px-4 py-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => updateApplicationStatus(selectedApplication._id, 'accepted')}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center"
                    disabled={isSubmitting}
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Accept & Notify
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => updateApplicationStatus(selectedApplication._id, 'rejected')}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center"
                    disabled={isSubmitting}
                  >
                    <XCircle className="w-4 h-4 mr-1" />
                    Reject & Notify
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewAllApplications; 