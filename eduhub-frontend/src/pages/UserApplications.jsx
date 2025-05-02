import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Briefcase,
  ChevronLeft,
  Calendar,
  Clock,
  Building2,
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  FileText,
  MessageSquare,
  FileBox,
  Download,
  Copy
} from 'lucide-react';

const UserApplications = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showCoverLetterModal, setShowCoverLetterModal] = useState(false);
  const [selectedCoverLetter, setSelectedCoverLetter] = useState('');

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      navigate('/login', { state: { from: '/applications' } });
      return;
    }

    // Fetch user's job applications
    const fetchApplications = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        
        // Get applications
        const response = await axios.get(
          'http://localhost:5000/api/jobs/user/applications',
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        
        setApplications(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching job applications:', err);
        setError('Failed to load your applications. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, [navigate]);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status badge color
  const getStatusColor = (status) => {
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
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      case 'reviewing':
        return <Eye className="w-4 h-4" />;
      default: // pending
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  // Open application details
  const viewApplicationDetails = (application) => {
    setSelectedApplication(application);
  };

  // Close application details
  const closeApplicationDetails = () => {
    setSelectedApplication(null);
  };

  // Open cover letter modal
  const openCoverLetterModal = (application) => {
    setSelectedCoverLetter(application.coverLetter || 'No cover letter provided.');
    setSelectedApplication(application);
    setShowCoverLetterModal(true);
  };

  // Copy cover letter to clipboard
  const copyCoverLetterToClipboard = () => {
    navigator.clipboard.writeText(selectedCoverLetter);
    alert('Cover letter copied to clipboard!');
  };

  // Handle download cover letter
  const handleDownloadCoverLetter = async (application) => {
    try {
      const token = localStorage.getItem('token');
      
      // Check if cover letter PDF exists
      if (!application.coverLetterPdfPath) {
        alert('No PDF cover letter available for this application.');
        return;
      }
      
      // Get cover letter PDF
      const response = await axios.get(
        `http://localhost:5000/api/jobs/applications/${application._id}/cover-letter`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob'
        }
      );
      
      // Create download link
      const fileName = `cover-letter-${application.job.title.replace(/\s+/g, '-')}.pdf`;
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
      console.error('Error downloading cover letter:', error);
      alert('Failed to download cover letter. Please try again.');
    }
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-500 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/userdashboard')}
            className="flex items-center text-teal-400 hover:text-teal-300 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back to Dashboard
          </button>
          
          <button
            onClick={() => navigate('/jobs')}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md text-sm transition-colors flex items-center"
          >
            <Briefcase className="w-4 h-4 mr-2" />
            Browse Jobs
          </button>
        </div>
        
        <h1 className="text-2xl font-bold mb-8">My Job Applications</h1>
        
        {error && (
          <div className="bg-red-900/30 border border-red-800 rounded-lg p-4 mb-6 text-red-300">
            {error}
          </div>
        )}
        
        {applications.length === 0 ? (
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-12 text-center">
            <Briefcase className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">No Applications Yet</h2>
            <p className="text-gray-400 mb-6">You haven't applied to any jobs yet.</p>
            <button
              onClick={() => navigate('/jobs')}
              className="px-6 py-3 bg-gradient-to-r from-teal-500 to-green-500 rounded-lg text-white hover:from-teal-600 hover:to-green-600 transition-colors"
            >
              Browse Available Jobs
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {applications.map((application) => (
              <div
                key={application._id}
                className="bg-gray-800 border border-gray-700 hover:border-teal-500 rounded-xl overflow-hidden transition-all duration-300"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-white">{application.job.title}</h3>
                    <div className={`px-3 py-1 rounded-full border text-sm inline-flex items-center ${getStatusColor(application.status)}`}>
                      {getStatusIcon(application.status)}
                      <span className="ml-1 capitalize">{application.status}</span>
                    </div>
                  </div>
                  
                  <div className="text-gray-400 mb-4">
                    <div className="flex items-center mb-1">
                      <Building2 className="w-4 h-4 mr-2 text-gray-500" />
                      {application.job.company}
                    </div>
                    <div className="flex items-center mb-1">
                      <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                      {application.job.location}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-gray-500" />
                      Applied on {formatDate(application.appliedAt)}
                    </div>
                  </div>
                  
                  {application.adminFeedback && (
                    <div className="bg-gray-900/50 p-3 rounded-md mb-4">
                      <div className="flex items-center text-teal-400 text-sm font-medium mb-1">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Feedback from Employer
                      </div>
                      <p className="text-gray-300 text-sm">{application.adminFeedback}</p>
                    </div>
                  )}
                  
                  <div className="border-t border-gray-700 pt-4 mt-2 mb-4">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleDownloadCV(application)}
                        className="px-3 py-1 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 text-sm transition-colors flex items-center"
                      >
                        <FileText className="w-4 h-4 mr-1" />
                        CV
                      </button>
                      
                      <button
                        onClick={() => openCoverLetterModal(application)}
                        className="px-3 py-1 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 text-sm transition-colors flex items-center"
                      >
                        <FileBox className="w-4 h-4 mr-1" />
                        Cover Letter
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => viewApplicationDetails(application)}
                      className="px-3 py-1.5 bg-teal-900/30 text-teal-400 rounded-md hover:bg-teal-900/50 text-sm transition-colors flex items-center"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Details
                    </button>
                    
                    <button
                      onClick={() => navigate(`/job/${application.job._id}`)}
                      className="px-3 py-1.5 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 text-sm transition-colors"
                    >
                      View Job
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Application Details Modal */}
      {selectedApplication && !showCoverLetterModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gray-800 p-4 border-b border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-bold">{selectedApplication.job.title}</h3>
              <button
                onClick={closeApplicationDetails}
                className="p-1 hover:bg-gray-700 rounded-full"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="text-xl text-teal-400 font-bold mb-1">
                    {selectedApplication.job.company}
                  </div>
                  <div className="flex items-center text-gray-400">
                    <MapPin className="w-4 h-4 mr-1" />
                    {selectedApplication.job.location}
                  </div>
                </div>
                
                <div className={`px-4 py-2 rounded-lg border inline-flex items-center ${getStatusColor(selectedApplication.status)}`}>
                  {getStatusIcon(selectedApplication.status)}
                  <span className="ml-2 capitalize font-medium">{selectedApplication.status}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="text-sm uppercase text-gray-500 font-medium mb-2">Application Details</h4>
                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <div className="mb-3">
                      <div className="text-sm text-gray-400">Applied On</div>
                      <div className="text-white flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-teal-400" />
                        {formatDate(selectedApplication.appliedAt)}
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <div className="text-sm text-gray-400">Application Status</div>
                      <div className="text-white capitalize">
                        {selectedApplication.status}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-gray-400">Application Documents</div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <button
                          onClick={() => handleDownloadCV(selectedApplication)}
                          className="px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-500 text-sm transition-colors flex items-center"
                        >
                          <FileText className="w-4 h-4 mr-1" />
                          Download CV
                        </button>
                        
                        {selectedApplication.coverLetterPdfPath && (
                          <button
                            onClick={() => handleDownloadCoverLetter(selectedApplication)}
                            className="px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-500 text-sm transition-colors flex items-center"
                          >
                            <FileBox className="w-4 h-4 mr-1" />
                            Cover Letter PDF
                          </button>
                        )}
                        
                        <button
                          onClick={() => openCoverLetterModal(selectedApplication)}
                          className="px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-500 text-sm transition-colors flex items-center"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View Cover Letter
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm uppercase text-gray-500 font-medium mb-2">Employer Feedback</h4>
                  <div className="bg-gray-700/50 rounded-lg p-4 h-[calc(100%-28px)]">
                    {selectedApplication.adminFeedback ? (
                      <div className="text-white">
                        <MessageSquare className="w-5 h-5 text-teal-400 mb-2" />
                        <p>{selectedApplication.adminFeedback}</p>
                      </div>
                    ) : (
                      <div className="text-gray-400 h-full flex items-center justify-center text-center">
                        <p>No feedback provided yet</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-700 pt-6 mt-4 flex justify-between items-center">
                <span className="text-gray-400">
                  Job application ID: {selectedApplication._id.substring(0, 8)}...
                </span>
                
                <button
                  onClick={() => navigate(`/job/${selectedApplication.job._id}`)}
                  className="px-6 py-2 bg-teal-600 hover:bg-teal-700 rounded-lg text-white transition-colors"
                >
                  View Job Posting
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Cover Letter Modal */}
      {showCoverLetterModal && selectedApplication && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-lg w-full max-w-xl max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-bold">
                Cover Letter - {selectedApplication.job.title}
              </h3>
              <button
                onClick={() => setShowCoverLetterModal(false)}
                className="p-1 hover:bg-gray-700 rounded-md"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <pre className="whitespace-pre-wrap font-sans text-gray-200">
                {selectedCoverLetter}
              </pre>
            </div>
            
            <div className="p-4 border-t border-gray-700 flex justify-between">
              <button
                onClick={copyCoverLetterToClipboard}
                className="px-4 py-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition-colors flex items-center"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Text
              </button>
              
              {selectedApplication.coverLetterPdfPath && (
                <button
                  onClick={() => handleDownloadCoverLetter(selectedApplication)}
                  className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors flex items-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserApplications; 