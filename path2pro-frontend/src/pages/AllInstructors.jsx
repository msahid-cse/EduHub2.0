import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, Filter, GraduationCap, User, ChevronLeft, ChevronRight, Grid, List } from 'lucide-react';
import Navbar from '../components/Navbar';
import { instructorService } from '../api/apiClient';

const AllInstructors = () => {
  const navigate = useNavigate();
  const [instructors, setInstructors] = useState([]);
  const [filteredInstructors, setFilteredInstructors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [universities, setUniversities] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const instructorsPerPage = 8;
  
  const DEFAULT_PROFILE_IMAGE = 'https://thumbs.dreamstime.com/b/teacher-instructor-colorful-icon-vector-flat-sign-presenter-symbol-logo-illustration-94324489.jpg';

  // Fetch instructors
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await instructorService.getAllInstructors();
        if (response.data) {
          setInstructors(response.data);
          setFilteredInstructors(response.data);
          
          // Extract unique universities
          const uniqueUniversities = [...new Set(response.data.map(instructor => instructor.university))];
          setUniversities(uniqueUniversities.filter(Boolean));
          
          // Extract unique departments
          const uniqueDepartments = [...new Set(response.data.map(instructor => instructor.department))];
          setDepartments(uniqueDepartments.filter(Boolean));
        }
      } catch (error) {
        console.error('Error fetching instructors:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Filter and sort instructors
  useEffect(() => {
    if (!instructors.length) return;
    
    let result = [...instructors];
    
    // Apply filters
    if (selectedUniversity) {
      result = result.filter(instructor => instructor.university === selectedUniversity);
    }
    
    if (filterDepartment) {
      result = result.filter(instructor => instructor.department === filterDepartment);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(instructor => 
        instructor.name?.toLowerCase().includes(query) ||
        instructor.position?.toLowerCase().includes(query) ||
        instructor.email?.toLowerCase().includes(query) ||
        instructor.department?.toLowerCase().includes(query) ||
        instructor.code?.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'name':
        result.sort((a, b) => a.name?.localeCompare(b.name));
        break;
      case 'department':
        result.sort((a, b) => a.department?.localeCompare(b.department));
        break;
      case 'position':
        result.sort((a, b) => a.position?.localeCompare(b.position));
        break;
      default:
        break;
    }
    
    setFilteredInstructors(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [instructors, selectedUniversity, filterDepartment, searchQuery, sortBy]);

  // Calculate pagination
  const indexOfLastInstructor = currentPage * instructorsPerPage;
  const indexOfFirstInstructor = indexOfLastInstructor - instructorsPerPage;
  const currentInstructors = filteredInstructors.slice(indexOfFirstInstructor, indexOfLastInstructor);
  const totalPages = Math.ceil(filteredInstructors.length / instructorsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Reset filters
  const resetFilters = () => {
    setSelectedUniversity('');
    setFilterDepartment('');
    setSearchQuery('');
    setSortBy('name');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      
      <div className="container mx-auto py-12 px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Our Instructors</h1>
            <p className="text-gray-400">Find and connect with experienced faculty members</p>
          </div>
          
          <button
            onClick={() => navigate(-1)}
            className="flex items-center px-4 py-2 bg-cyan-500/10 text-cyan-400 rounded-lg border border-cyan-500/30 hover:bg-cyan-500/20"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </button>
        </div>
        
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <div className="relative flex-grow max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search instructors..."
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center px-3 py-2 rounded-lg ${
                  showFilters ? 'bg-cyan-500 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </button>
              
              <div className="bg-gray-800 rounded-lg flex p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-gray-700 text-cyan-400' : 'text-gray-400'}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-gray-700 text-cyan-400' : 'text-gray-400'}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
          
          {showFilters && (
            <div className="bg-gray-800 rounded-lg p-4 mb-4 border border-gray-700 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">University</label>
                <select
                  value={selectedUniversity}
                  onChange={(e) => setSelectedUniversity(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2"
                >
                  <option value="">All Universities</option>
                  {universities.map((uni, index) => (
                    <option key={index} value={uni}>{uni}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Department</label>
                <select
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2"
                >
                  <option value="">All Departments</option>
                  {departments.map((dept, index) => (
                    <option key={index} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2"
                >
                  <option value="name">Name</option>
                  <option value="department">Department</option>
                  <option value="position">Position</option>
                </select>
              </div>
              
              <div className="md:col-span-3">
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 text-sm bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg border border-red-500/30"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <p className="text-gray-400 text-sm">
              Showing {filteredInstructors.length > 0 ? indexOfFirstInstructor + 1 : 0} - {Math.min(indexOfLastInstructor, filteredInstructors.length)} of {filteredInstructors.length} instructors
            </p>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
          </div>
        ) : filteredInstructors.length === 0 ? (
          <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
            <User className="h-16 w-16 mx-auto text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No instructors found</h3>
            <p className="text-gray-400 mb-4">Try adjusting your search criteria or filters</p>
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600"
            >
              Reset Filters
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {currentInstructors.map((instructor, index) => (
              <div key={index} className="bg-gray-800 p-5 rounded-lg border border-gray-700 transition-all duration-300 hover:shadow-lg hover:border-cyan-900">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden mr-4 border-2 border-cyan-500/30">
                    <img 
                      src={instructor.profilePicture || DEFAULT_PROFILE_IMAGE} 
                      alt={instructor.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = DEFAULT_PROFILE_IMAGE;
                      }}
                    />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white">{instructor.name}</h4>
                    <p className="text-cyan-400 text-sm">{instructor.position}</p>
                    {instructor.code && (
                      <p className="text-gray-400 text-xs">Code: {instructor.code}</p>
                    )}
                  </div>
                </div>
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">{instructor.bio || 'Experienced instructor specializing in various academic subjects.'}</p>
                
                <div className="mb-3 flex flex-wrap gap-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                    {instructor.department}
                  </span>
                  
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30">
                    {instructor.university}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-2 text-xs text-gray-400">
                  {instructor.roomNo && (
                    <div className="flex items-center">
                      <span className="bg-gray-700 px-2 py-1 rounded">Room: {instructor.roomNo}</span>
                    </div>
                  )}
                  
                  {instructor.deskNo && (
                    <div className="flex items-center">
                      <span className="bg-gray-700 px-2 py-1 rounded">Desk: {instructor.deskNo}</span>
                    </div>
                  )}
                  
                  {instructor.email && (
                    <div className="flex items-center mt-1 w-full">
                      <span className="bg-gray-700 px-2 py-1 rounded truncate w-full" title={instructor.email}>
                        {instructor.email}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Instructor</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Department</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Position</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">University</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Contact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {currentInstructors.map((instructor, index) => (
                  <tr key={index} className="hover:bg-gray-700/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full overflow-hidden mr-3 border border-cyan-500/30">
                          <img 
                            src={instructor.profilePicture || DEFAULT_PROFILE_IMAGE} 
                            alt={instructor.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = DEFAULT_PROFILE_IMAGE;
                            }}
                          />
                        </div>
                        <div>
                          <p className="font-medium text-white">{instructor.name}</p>
                          {instructor.code && <p className="text-xs text-gray-400">Code: {instructor.code}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-300">{instructor.department}</td>
                    <td className="py-3 px-4 text-sm text-gray-300">{instructor.position}</td>
                    <td className="py-3 px-4 text-sm text-gray-300">{instructor.university}</td>
                    <td className="py-3 px-4 text-sm">
                      <div className="space-y-1">
                        <p className="text-gray-300 text-xs">{instructor.email}</p>
                        {instructor.roomNo && <p className="text-gray-400 text-xs">Room: {instructor.roomNo}</p>}
                        {instructor.deskNo && <p className="text-gray-400 text-xs">Desk: {instructor.deskNo}</p>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <div className="flex space-x-1">
              <button
                onClick={() => paginate(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md ${
                  currentPage === 1 
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                    : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                }`}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(page => {
                  // Show current page, first and last page, and pages around current
                  return page === 1 || 
                         page === totalPages || 
                         (page >= currentPage - 1 && page <= currentPage + 1);
                })
                .map((page, index, array) => {
                  // Add ellipsis where there are gaps
                  const prevPage = array[index - 1];
                  const showEllipsis = prevPage && page - prevPage > 1;
                  
                  return (
                    <React.Fragment key={page}>
                      {showEllipsis && (
                        <span className="px-3 py-1 bg-gray-800 text-gray-400 rounded-md">...</span>
                      )}
                      <button
                        onClick={() => paginate(page)}
                        className={`px-3 py-1 rounded-md ${
                          currentPage === page 
                            ? 'bg-cyan-500 text-white' 
                            : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                        }`}
                      >
                        {page}
                      </button>
                    </React.Fragment>
                  );
                })
              }
              
              <button
                onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md ${
                  currentPage === totalPages 
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                    : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                }`}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllInstructors; 