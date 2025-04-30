import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Search, 
  Filter, 
  GraduationCap, 
  Clock, 
  BookOpen,
  Video,
  FileText,
  XCircle,
  ArrowLeft
} from 'lucide-react';
import Navbar from '../components/Navbar';

function ViewCourses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    courseType: '',
    department: '',
    activityType: '',
    courseSegment: '',
    skillLevel: ''
  });
  
  // Fetch all courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get('http://localhost:5000/api/courses');
        setCourses(response.data);
        setFilteredCourses(response.data);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to load courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourses();
  }, []);
  
  // Filter courses based on search term and filters
  useEffect(() => {
    if (!courses.length) return;
    
    let result = [...courses];
    
    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(course => 
        course.title.toLowerCase().includes(term) || 
        course.description.toLowerCase().includes(term) ||
        course.instructor.toLowerCase().includes(term)
      );
    }
    
    // Apply category filters
    if (filters.courseType) {
      result = result.filter(course => course.courseType === filters.courseType);
    }
    
    if (filters.department && filters.courseType === 'academic') {
      result = result.filter(course => course.department === filters.department);
    }
    
    if (filters.activityType && filters.courseType === 'co-curricular') {
      result = result.filter(course => course.activityType === filters.activityType);
    }
    
    if (filters.courseSegment) {
      result = result.filter(course => course.courseSegment === filters.courseSegment);
    }
    
    if (filters.skillLevel) {
      result = result.filter(course => course.skillLevel === filters.skillLevel);
    }
    
    setFilteredCourses(result);
  }, [courses, searchTerm, filters]);
  
  const handleCourseClick = (courseId) => {
    navigate(`/course/${courseId}`);
  };
  
  const resetFilters = () => {
    setSearchTerm('');
    setFilters({
      courseType: '',
      department: '',
      activityType: '',
      courseSegment: '',
      skillLevel: ''
    });
  };
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    
    // Reset dependent filters when changing courseType
    if (name === 'courseType') {
      setFilters({
        ...filters,
        [name]: value,
        department: '',
        activityType: ''
      });
    } else {
      setFilters({
        ...filters,
        [name]: value
      });
    }
  };
  
  return (
    <div className="bg-gradient-to-br from-gray-900 to-black min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto py-12 px-8 flex-grow">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <button 
              onClick={() => navigate('/')} 
              className="mb-4 inline-flex items-center text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </button>
            <h1 className="text-3xl font-bold text-white">All Courses</h1>
            <p className="text-gray-400 mt-1">Browse and discover all available courses</p>
          </div>
          
          {/* Search input */}
          <div className="relative w-full sm:w-64 md:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search courses..."
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>
        
        {/* Filters */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center">
              <Filter className="h-5 w-5 mr-2 text-teal-400" />
              Filter Courses
            </h2>
            <button 
              onClick={resetFilters}
              className="text-gray-400 hover:text-white text-sm"
            >
              Reset Filters
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Course Type Filter */}
            <div>
              <label className="block text-gray-400 text-sm mb-1">Course Type</label>
              <select
                name="courseType"
                value={filters.courseType}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">All Types</option>
                <option value="academic">Academic</option>
                <option value="co-curricular">Co-Curricular</option>
              </select>
            </div>
            
            {/* Department Filter (only for academic courses) */}
            {filters.courseType === 'academic' && (
              <div>
                <label className="block text-gray-400 text-sm mb-1">Department</label>
                <select
                  name="department"
                  value={filters.department}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">All Departments</option>
                  <option value="CSE">Computer Science</option>
                  <option value="EEE">Electrical Engineering</option>
                  <option value="LAW">Law</option>
                  <option value="BBA">Business Admin</option>
                  <option value="AI and DATA SCIENCE">AI & Data Science</option>
                  <option value="Others">Others</option>
                </select>
              </div>
            )}
            
            {/* Activity Type Filter (only for co-curricular courses) */}
            {filters.courseType === 'co-curricular' && (
              <div>
                <label className="block text-gray-400 text-sm mb-1">Activity Type</label>
                <select
                  name="activityType"
                  value={filters.activityType}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">All Activities</option>
                  <option value="Science">Science</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Arts">Arts</option>
                  <option value="Sports">Sports</option>
                  <option value="Music">Music</option>
                  <option value="Others">Others</option>
                </select>
              </div>
            )}
            
            {/* Course Segment Filter */}
            <div>
              <label className="block text-gray-400 text-sm mb-1">Course Format</label>
              <select
                name="courseSegment"
                value={filters.courseSegment}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">All Formats</option>
                <option value="video">Video</option>
                <option value="theory">Theory</option>
              </select>
            </div>
            
            {/* Skill Level Filter */}
            <div>
              <label className="block text-gray-400 text-sm mb-1">Skill Level</label>
              <select
                name="skillLevel"
                value={filters.skillLevel}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Course Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-6 rounded-xl">
            <h2 className="text-xl font-bold mb-2">Error</h2>
            <p>{error}</p>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl text-center">
            <XCircle className="h-12 w-12 mx-auto text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No courses found</h3>
            <p className="text-gray-400">Try adjusting your filters or search term</p>
            <button
              onClick={resetFilters}
              className="mt-4 px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div
                key={course._id}
                onClick={() => handleCourseClick(course._id)}
                className="bg-gray-800/50 hover:bg-gray-800 backdrop-blur-sm rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl border border-gray-700 overflow-hidden group cursor-pointer"
              >
                <div className="h-40 overflow-hidden relative">
                  <img
                    src={course.thumbnail || 'https://via.placeholder.com/640x360.png?text=Course+Image'}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"></div>
                  
                  {/* Course type badge */}
                  <div className="absolute top-2 left-2 bg-gray-900/80 text-xs px-2 py-1 rounded-full">
                    {course.courseType === 'academic' ? (
                      <span className="text-blue-400">Academic</span>
                    ) : (
                      <span className="text-green-400">Co-Curricular</span>
                    )}
                  </div>
                  
                  {/* Course segment badge */}
                  {course.courseSegment === 'video' && (
                    <div className="absolute top-2 right-2 bg-blue-500/80 text-white text-xs px-2 py-1 rounded-full flex items-center">
                      <Video className="w-3 h-3 mr-1" />
                      Video
                    </div>
                  )}
                  
                  {course.courseSegment === 'theory' && (
                    <div className="absolute top-2 right-2 bg-green-500/80 text-white text-xs px-2 py-1 rounded-full flex items-center">
                      <FileText className="w-3 h-3 mr-1" />
                      Theory
                    </div>
                  )}
                </div>
                
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1">{course.title}</h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{course.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {course.courseType === 'academic' && (
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30">
                        {course.department}
                      </span>
                    )}
                    
                    {course.courseType === 'co-curricular' && (
                      <span className="text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/30">
                        {course.activityType}
                      </span>
                    )}
                    
                    <span className="text-xs px-2 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30 capitalize">
                      {course.skillLevel}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <GraduationCap className="h-4 w-4 text-teal-400 mr-2" />
                      <span className="text-sm text-gray-300">{course.instructor}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-teal-400 mr-2" />
                      <span className="text-sm text-gray-300">{course.duration}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewCourses;
  