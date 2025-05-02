import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  FilePlus2,
  Copy
} from 'lucide-react';

const JobApplications = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCoverLetterModal, setShowCoverLetterModal] = useState(false);
  const [selectedCoverLetter, setSelectedCoverLetter] = useState('');

  useEffect(() => {
    // Check if user is admin
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'admin') {
      navigate('/login', { state: { message: 'Admin access required' } });
      return;
    }

    // Fetch job details and applications
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        
        // Fetch job details
        const jobResponse = await axios.get(
          `http://localhost:5000/api/jobs/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        
        setJob(jobResponse.data);
        
        // Fetch job applications
        const applicationsResponse = await axios.get(
          `http://localhost:5000/api/jobs/${id}/applications`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        
        setApplications(applicationsResponse.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching job applications:', err);
        setError('Failed to load job applications. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

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
      const fileName = `cover-letter-${application.applicant.name.replace(/\s+/g, '-')}.pdf`;
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

  if (isLoading) {
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="bg-gray-800 rounded-xl p-8">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Error</h2>
            <p className="text-gray-400 mb-6">{error}</p>
            <button
              onClick={() => navigate('/admin')}
              className="px-6 py-2 bg-purple-600 rounded-md text-white hover:bg-purple-700 transition-colors"
            >
              Back to Admin Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(`/job/${id}`)}
            className="flex items-center text-purple-400 hover:text-purple-300 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back to Job Details
          </button>
          
          <button
            onClick={() => navigate('/admin')}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md text-sm transition-colors"
          >
            Admin Dashboard
          </button>
        </div>
        
        {/* Job title and applications count */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8 border border-gray-700">
          <h1 className="text-2xl font-bold text-white">
            Applications for {job?.title}
          </h1>
          <div className="flex items-center mt-2 text-gray-400">
            <span className="mr-6">{job?.company}</span>
            <span className="flex items-center">
              <User className="w-4 h-4 mr-1" />
              {applications.length} {applications.length === 1 ? 'Applicant' : 'Applicants'}
            </span>
          </div>
        </div>
        
        {/* Applications list */}
        <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
          {applications.length === 0 ? (
            <div className="py-20 text-center text-gray-400">
              <User className="w-16 h-16 mx-auto text-gray-600 mb-4" />
              <p className="text-lg">No applications received yet</p>
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
                      Applied On
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Documents
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Status
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
                            {application.applicant.name}
                          </div>
                          <div className="flex items-center text-sm text-gray-400">
                            <Mail className="w-3 h-3 mr-1" />
                            {application.applicant.email}
                          </div>
                          <div className="flex items-center text-sm text-gray-400">
                            <School className="w-3 h-3 mr-1" />
                            {application.applicant.university}
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-gray-300">
                          <Clock className="w-4 h-4 mr-2 text-gray-500" />
                          {formatDate(application.appliedAt)}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col space-y-2">
                          <button
                            onClick={() => handleDownloadCV(application)}
                            className="px-3 py-1 bg-purple-900/30 text-purple-400 rounded-full flex items-center text-sm hover:bg-purple-900/50 transition-colors"
                          >
                            <FileText className="w-4 h-4 mr-1" />
                            Download CV
                          </button>
                          
                          <button
                            onClick={() => openCoverLetterModal(application)}
                            className="px-3 py-1 bg-blue-900/30 text-blue-400 rounded-full flex items-center text-sm hover:bg-blue-900/50 transition-colors"
                          >
                            <FilePlus2 className="w-4 h-4 mr-1" />
                            View Cover Letter
                          </button>
                          
                          {application.coverLetterPdfPath && (
                            <button
                              onClick={() => handleDownloadCoverLetter(application)}
                              className="px-3 py-1 bg-teal-900/30 text-teal-400 rounded-full flex items-center text-sm hover:bg-teal-900/50 transition-colors"
                            >
                              <FileBox className="w-4 h-4 mr-1" />
                              Download Cover PDF
                            </button>
                          )}
                        </div>
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
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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
                Applicant: <span className="text-white">{selectedApplication.applicant.name}</span>
              </p>
              
              <div className="mb-4">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Feedback Message (Optional)
                </label>
                <textarea
                  rows="4"
                  className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Provide feedback for this applicant..."
                  disabled={isSubmitting}
                />
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
                    Accept
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => updateApplicationStatus(selectedApplication._id, 'rejected')}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center"
                    disabled={isSubmitting}
                  >
                    <XCircle className="w-4 h-4 mr-1" />
                    Reject
                  </button>
                </div>
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
                Cover Letter - {selectedApplication.applicant.name}
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
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center"
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

export default JobApplications; 