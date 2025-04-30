import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Briefcase,
  Building2,
  MapPin,
  Calendar,
  Clock,
  Search,
  Filter,
  ArrowRight,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

function ViewJobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 6;

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/jobs');
        setJobs(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError('Failed to load job listings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format job type for display
  const formatJobType = (type) => {
    if (!type) return 'N/A';
    return type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('-');
  };

  // Filter jobs
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = 
      filter === 'all' || 
      job.type === filter;

    return matchesSearch && matchesFilter;
  });

  // Pagination
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  const handleJobClick = (jobId) => {
    navigate(`/job/${jobId}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Job Opportunities</h1>
            <p className="text-gray-400">
              Explore the latest job opportunities across Bangladesh
            </p>
          </div>
          <button 
            onClick={() => navigate('/')} 
            className="flex items-center text-teal-400 hover:text-teal-300"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back to Home
          </button>
        </div>

        {/* Search and Filter */}
        <div className="bg-gray-800 p-6 rounded-lg mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-1 md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search jobs by title, company, or location..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none cursor-pointer"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="full-time">Full-Time</option>
                  <option value="part-time">Part-Time</option>
                  <option value="remote">Remote</option>
                  <option value="internship">Internship</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Job Listings */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-500 mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading job listings...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-400 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
            >
              Try Again
            </button>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-20 bg-gray-800 rounded-lg">
            <Briefcase className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">No job listings found</h3>
            <p className="text-gray-400 mb-6">Try adjusting your search or filter criteria</p>
            <button 
              onClick={() => {
                setSearchQuery('');
                setFilter('all');
              }} 
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {currentJobs.map((job) => (
                <div 
                  key={job._id} 
                  className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-teal-500 transition-all duration-300 cursor-pointer group"
                  onClick={() => handleJobClick(job._id)}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-white group-hover:text-teal-400 transition-colors">
                        {job.title}
                      </h3>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full 
                        ${job.type === 'full-time' ? 'bg-green-500/20 text-green-400' : 
                        job.type === 'part-time' ? 'bg-blue-500/20 text-blue-400' : 
                        job.type === 'remote' ? 'bg-purple-500/20 text-purple-400' : 
                        job.type === 'internship' ? 'bg-amber-500/20 text-amber-400' : 
                        'bg-gray-500/20 text-gray-400'}`}
                      >
                        {formatJobType(job.type)}
                      </span>
                    </div>
                    
                    <div className="flex items-center mb-3 text-gray-400 text-sm">
                      <Building2 className="w-4 h-4 mr-1" /> 
                      <span>{job.company}</span>
                    </div>
                    
                    <div className="flex items-center mb-3 text-gray-400 text-sm">
                      <MapPin className="w-4 h-4 mr-1" /> 
                      <span>{job.location}</span>
                    </div>
                    
                    <p className="text-gray-300 mb-4 line-clamp-3">{job.description}</p>
                    
                    <div className="flex items-center justify-between pt-2 border-t border-gray-700">
                      <div className="flex items-center text-gray-400 text-xs">
                        <Calendar className="w-3 h-3 mr-1" /> 
                        <span>Posted: {formatDate(job.createdAt)}</span>
                      </div>
                      <button className="text-teal-400 hover:text-teal-300 transition-colors text-sm flex items-center">
                        Details <ArrowRight className="w-4 h-4 ml-1" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-10 mb-4">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-full ${currentPage === 1 ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 hover:bg-gray-800'}`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <div className="flex items-center space-x-1">
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`px-3 py-1 rounded-md ${currentPage === index + 1 ? 'bg-teal-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
                
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-full ${currentPage === totalPages ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 hover:bg-gray-800'}`}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ViewJobs;
  