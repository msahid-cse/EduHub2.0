import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Briefcase,
  Building2,
  MapPin,
  Mail,
  Calendar,
  Clock,
  ChevronLeft,
  Check,
  ExternalLink,
  Share2,
  ArrowRight
} from 'lucide-react';

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    // Check if user is logged in
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const role = localStorage.getItem('userRole');
    setIsLoggedIn(loggedIn);
    setUserRole(role || '');
    
    // Fetch job details
    const fetchJobDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/api/jobs/${id}`);
        setJob(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching job details:', err);
        
        if (err.response?.status === 404) {
          setError('Job not found. It may have been removed or the URL is incorrect.');
        } else {
          setError('Failed to load job details. Please try again later.');
        }
        
        setJob(null);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id]);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format job type
  const formatJobType = (type) => {
    if (!type) return 'N/A';
    return type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('-');
  };

  // Handle job application
  const handleApply = async () => {
    if (!isLoggedIn) {
      navigate('/login', { state: { from: `/job/${id}` } });
      return;
    }

    // This would typically make an API call to apply for the job
    // For now, we'll just redirect to login if not logged in
    if (isLoggedIn) {
      alert('Application functionality will be implemented soon!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white py-10 px-4">
        <div className="max-w-4xl mx-auto bg-gray-800 rounded-xl p-8 text-center">
          <Briefcase className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Job Not Found</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={() => navigate('/jobs')}
              className="px-6 py-3 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
            >
              Browse Job Listings
            </button>
            <button 
              onClick={() => navigate('/')}
              className="px-6 py-3 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate('/jobs')} 
          className="flex items-center text-teal-400 hover:text-teal-300 mb-6"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to Job Listings
        </button>
        
        <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
          {/* Job header */}
          <div className="p-6 md:p-8 border-b border-gray-700">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{job.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-gray-300">
                  <div className="flex items-center">
                    <Building2 className="w-5 h-5 mr-2 text-teal-400" />
                    <span>{job.company}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-teal-400" />
                    <span>{job.location}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-end">
                <span className={`px-3 py-1 rounded-full text-sm font-medium mb-2 ${
                  job.type === 'full-time' ? 'bg-green-500/20 text-green-400' :
                  job.type === 'part-time' ? 'bg-blue-500/20 text-blue-400' :
                  job.type === 'remote' ? 'bg-purple-500/20 text-purple-400' :
                  job.type === 'internship' ? 'bg-amber-500/20 text-amber-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {formatJobType(job.type)}
                </span>
                <div className="flex items-center text-gray-400 text-sm">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>Posted: {formatDate(job.createdAt)}</span>
                </div>
              </div>
            </div>
            
            {/* Application section */}
            <div className="bg-gray-900/50 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <p className="text-gray-300 mb-1">
                  <Clock className="w-4 h-4 inline-block mr-2 text-teal-400" />
                  Apply before: <span className="text-white">{formatDate(job.deadline)}</span>
                </p>
                <p className="text-gray-300">
                  <Mail className="w-4 h-4 inline-block mr-2 text-teal-400" />
                  Contact: <span className="text-white">{job.contactEmail}</span>
                </p>
              </div>
              
              <button 
                onClick={handleApply}
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-teal-500 to-green-500 text-white font-medium hover:from-teal-600 hover:to-green-600 transition-colors flex items-center"
              >
                Apply Now <ExternalLink className="w-4 h-4 ml-2" />
              </button>
            </div>
            
            {/* Applicant count */}
            <div className="mt-4 text-sm text-gray-400 flex justify-between items-center">
              <span>{job.applicants?.length || 0} people have applied to this position</span>
              <button className="text-teal-400 hover:text-teal-300 flex items-center">
                <Share2 className="w-4 h-4 mr-1" /> Share
              </button>
            </div>
          </div>
          
          {/* Job description */}
          <div className="p-6 md:p-8">
            <div className="mb-8">
              <h2 className="text-xl font-bold text-white mb-4">Job Description</h2>
              <div className="text-gray-300 space-y-4 whitespace-pre-line">
                {job.description}
              </div>
            </div>
            
            {job.requirements && job.requirements.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-white mb-4">Requirements</h2>
                <ul className="text-gray-300 space-y-2">
                  {job.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="w-5 h-5 text-teal-400 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{requirement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {job.salary && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-white mb-4">Salary</h2>
                <p className="text-gray-300">{job.salary}</p>
              </div>
            )}
            
            {/* Application CTA */}
            <div className="mt-10 pt-6 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-gray-300">
                <p>Interested in this job?</p>
                <p className="text-sm text-gray-400">Apply before {formatDate(job.deadline)}</p>
              </div>
              
              <button 
                onClick={handleApply}
                className="px-8 py-3 rounded-lg bg-gradient-to-r from-teal-500 to-green-500 text-white font-medium hover:from-teal-600 hover:to-green-600 transition-colors flex items-center"
              >
                Apply Now <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Admin Actions */}
        {isLoggedIn && userRole === 'admin' && (
          <div className="mt-8 bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4">Admin Actions</h2>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => navigate(`/edit-job/${id}`)}
                className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                Edit Job
              </button>
              <button 
                className="px-6 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                Delete Job
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default JobDetails; 