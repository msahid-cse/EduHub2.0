import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { apiClient, communityAPI, promotionalVideoService } from '../api/apiClient';
import {
  Rocket,
  Users,
  BookOpen,
  GraduationCap,
  MessageCircle,
  Award,
  PlayCircle,
  BarChart,
  LifeBuoy,
  XCircle,
  ArrowRight,
  Building2,
  Briefcase,
  BellRing,
  Bookmark,
  BookText,
  Code,
  Music,
  PenTool,
  Camera,
  HeartHandshake,
  BadgeCheck,
  Shapes,
  Leaf,
  Dumbbell,
  MoveRight,
  Brain,
  Video,
  FileText,
  Search,
  Loader
} from 'lucide-react';
import Navbar from '../components/Navbar';
import EventSection from '../components/EventSection';

const Landing = () => {
  const [videoPlaying, setVideoPlaying] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="transition-opacity duration-500">
          <HomePage navigate={navigate} videoPlaying={videoPlaying} setVideoPlaying={setVideoPlaying} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="py-6 px-8 bg-black/50 backdrop-blur-md border-t border-gray-800">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <h3 className="text-xl font-bold text-white mb-2">EduHub</h3>
          <p className="text-gray-400 max-w-md text-sm">Your comprehensive education platform for academic resources, skills development, and professional growth.</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          <div>
            <h4 className="text-white font-semibold mb-3">Resources</h4>
            <ul className="space-y-2">
              <li><a href="courses" className="text-gray-400 hover:text-teal-400 text-sm">Courses</a></li>
              <li><a href="#teachers" className="text-gray-400 hover:text-teal-400 text-sm">Instructors</a></li>
              <li><a href="jobs" className="text-gray-400 hover:text-teal-400 text-sm">Jobs</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-3">Community</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-teal-400 text-sm">Forum</a></li>
              <li><a href="#events" className="text-gray-400 hover:text-teal-400 text-sm">Events</a></li>
              <li><a href="#feedback" className="text-gray-400 hover:text-teal-400 text-sm">Support</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-3">Connect</h4>
            <ul className="space-y-2">
              <li><Link to="/developers" className="text-gray-400 hover:text-teal-400 text-sm">Contact Us</Link></li>
              <li><Link to="/developers" className="text-gray-400 hover:text-teal-400 text-sm">About</Link></li>
              <li><Link to="/developers" className="text-gray-400 hover:text-teal-400 text-sm">Developers</Link></li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-800 mt-8 pt-6 container mx-auto text-center text-gray-400 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>© {new Date().getFullYear()} EduHub. All rights reserved.</div>
        <div className="flex gap-4">
          <Link to="/privacy-policy" className="font-['Source_Sans_Pro'] text-gray-300 hover:text-white transition-colors text-sm">Privacy Policy</Link>
          <Link to="/terms-of-service" className="font-['Source_Sans_Pro'] text-gray-300 hover:text-white transition-colors text-sm">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
};

const HomePage = ({ navigate, videoPlaying, setVideoPlaying }) => {
  const [academicCourses, setAcademicCourses] = useState([]);
  const [coCurricularCourses, setCoCurricularCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [notices, setNotices] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState('');
  const [universities, setUniversities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch data from backend
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Import all needed services
        const { 
          courseService, 
          instructorService, 
          universityService, 
          jobService 
        } = await import('../api/apiClient');
        
        // Fetch courses
        const coursesResponse = await courseService.getAllCourses();
        
        // Separate academic and co-curricular courses
        const academic = coursesResponse.data.filter(course => course.courseType === 'academic');
        const coCurricular = coursesResponse.data.filter(course => course.courseType === 'co-curricular');
        
        setAcademicCourses(academic);
        setCoCurricularCourses(coCurricular);
        
        // Fetch instructors
        const instructorsResponse = await instructorService.getAllInstructors();
        setInstructors(instructorsResponse.data);
        
        // Fetch universities in Bangladesh
        const universitiesResponse = await universityService.getUniversitiesByCountry('Bangladesh');
        setUniversities(universitiesResponse.data);
        
        // Fetch jobs
        const jobsResponse = await jobService.getAllJobs();
        setJobs(jobsResponse.data);
        
      } catch (error) {
        console.error('Error fetching data:', error);
        // Set some dummy data for demonstration
        setAcademicCourses([]);
        setCoCurricularCourses([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Fetch notices when university is selected
  useEffect(() => {
    if (selectedUniversity) {
      const fetchNotices = async () => {
        try {
          const { noticeService } = await import('../api/apiClient');
          const noticesResponse = await noticeService.getAllNotices({ university: selectedUniversity });
          setNotices(noticesResponse.data);
        } catch (noticeError) {
          console.error('Error fetching notices:', noticeError);
          setNotices([]);
        }
      };
      
      fetchNotices();
    } else {
      setNotices([]);
    }
  }, [selectedUniversity]);
  
  return (
    <div className="container mx-auto py-12 px-8">
      <HomeSection navigate={navigate} />
      <AcademicCoursesSection courses={academicCourses} isLoading={isLoading} />
      <CoCurricularCoursesSection courses={coCurricularCourses} isLoading={isLoading} />
      <TeacherSection instructors={instructors} universities={universities} selectedUniversity={selectedUniversity} setSelectedUniversity={setSelectedUniversity} isLoading={isLoading} />
      <NoticeSection notices={notices} selectedUniversity={selectedUniversity} />
      <JobSection jobs={jobs} isLoading={isLoading} />
      <EventSection />
      <CommunitySection />
      <VideoSection videoPlaying={videoPlaying} setVideoPlaying={setVideoPlaying} />
      <SupportSection />
      <FeedbackSection />
      <CallToActionSection navigate={navigate} />
    </div>
  );
};

const HomeSection = ({ navigate }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');
  
  useEffect(() => {
    // Check authentication status
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const role = localStorage.getItem('userRole');
    setIsLoggedIn(loggedIn);
    setUserRole(role || '');
  }, []);
  
  return (
    <section className="text-center mb-20">
      <h2 className="font-['Inter'] text-4xl sm:text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400 mb-6">
        Welcome to EduHub
      </h2>
      <p className="font-['Source_Sans_Pro'] text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto mb-10">
        Your comprehensive education platform for <span className="px-2 py-1 rounded bg-gradient-to-r from-teal-500/20 to-cyan-500/20">academic resources</span>, <span className="px-2 py-1 rounded bg-gradient-to-r from-teal-500/20 to-cyan-500/20">skills development</span>, and <span className="px-2 py-1 rounded bg-gradient-to-r from-teal-500/20 to-cyan-500/20">professional growth</span>.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        {isLoggedIn ? (
          <button 
            onClick={() => navigate(userRole === 'admin' ? '/admindashboard' : '/userdashboard')}
            className="font-['Source_Sans_Pro'] font-semibold px-8 py-3 rounded-full transition-all duration-300 flex items-center gap-2 shadow-lg border-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white border-transparent hover:from-teal-600 hover:to-cyan-600 hover:scale-105"
          >
            <Rocket className="w-5 h-5 mr-2" />
            Go to {userRole === 'admin' ? 'Admin' : 'User'} Dashboard
          </button>
        ) : (
          <>
            <NavLink 
              to="/login"
              className="font-['Source_Sans_Pro'] font-semibold px-8 py-3 rounded-full transition-all duration-300 flex items-center gap-2 shadow-lg border-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white border-transparent hover:from-teal-600 hover:to-cyan-600 hover:scale-105"
            >
              <Rocket className="w-5 h-5 mr-2" />
              Login
            </NavLink>
            <NavLink 
              to="/register"
              className="font-['Source_Sans_Pro'] font-semibold px-8 py-3 rounded-full transition-all duration-300 flex items-center gap-2 shadow-lg border-2 border-teal-500 text-teal-400 hover:bg-teal-500/10 hover:scale-105"
            >
              <Users className="w-5 h-5 mr-2" />
              Register
            </NavLink>
          </>
        )}
      </div>
    </section>
  );
};

const AcademicCoursesSection = ({ courses, isLoading }) => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  
  useEffect(() => {
    // Check authentication status
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
  }, []);
  
  // Group courses by department
  const departmentGroups = {
    'CSE': [],
    'EEE': [],
    'LAW': [],
    'BBA': [],
    'AI and DATA SCIENCE': [],
    'Others': []
  };
  
  courses.forEach(course => {
    if (departmentGroups.hasOwnProperty(course.department)) {
      departmentGroups[course.department].push(course);
    } else {
      departmentGroups['Others'].push(course);
    }
  });
  
  const handleDepartmentClick = (department) => {
    setSelectedDepartment(department);
  };
  
  const handleCourseClick = (courseId) => {
    navigate(`/course/${courseId}`);
  };
  
  return (
    <section className="mb-20 pt-16" id="academic-courses">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Academic Courses</h2>
          <p className="text-gray-400">Explore our comprehensive academic curriculum by department</p>
        </div>
        <div>
          <button 
            onClick={() => navigate('/courses')}
            className="px-5 py-2 rounded-lg bg-teal-500/10 text-teal-400 hover:bg-teal-500/20 transition-colors border border-teal-500/30"
          >
            View All
          </button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Department Navigation */}
          <div className="flex flex-wrap gap-4 mb-6 border-b border-gray-800 pb-4">
            {Object.keys(departmentGroups).map((department) => (
              <button
                key={department}
                onClick={() => handleDepartmentClick(department)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedDepartment === department
                    ? 'bg-teal-500 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {department}
              </button>
            ))}
          </div>
          
          {/* If no department is selected, show departments grid */}
          {!selectedDepartment ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {Object.keys(departmentGroups).map(department => (
                <div
                  key={department}
                  onClick={() => handleDepartmentClick(department)}
                  className="bg-gray-800/50 hover:bg-gray-800 backdrop-blur-sm p-6 rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl border border-gray-700 cursor-pointer flex flex-col items-center text-center"
                >
                  {department === 'CSE' && <Code className="h-12 w-12 text-orange-500 mb-4" />}
                  {department === 'EEE' && <Shapes className="h-12 w-12 text-amber-500 mb-4" />}
                  {department === 'LAW' && <BookOpen className="h-12 w-12 text-blue-500 mb-4" />}
                  {department === 'BBA' && <BarChart className="h-12 w-12 text-green-500 mb-4" />}
                  {department === 'AI and DATA SCIENCE' && <Brain className="h-12 w-12 text-purple-500 mb-4" />}
                  {department === 'Others' && <Shapes className="h-12 w-12 text-pink-500 mb-4" />}
                  
                  <h3 className="text-xl font-semibold text-white mb-2">{department}</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    {departmentGroups[department].length} courses available
                  </p>
                  <span className="text-teal-400 flex items-center gap-1 text-sm">
                    Browse Courses
                    <MoveRight className="h-4 w-4" />
                  </span>
                </div>
              ))}
            </div>
          ) : (
            // Show courses of selected department
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-white">{selectedDepartment} Courses</h3>
                <button 
                  onClick={() => setSelectedDepartment(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
              
              {departmentGroups[selectedDepartment].length === 0 ? (
                <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl text-center">
                  <p className="text-gray-400">No courses available in this department yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {departmentGroups[selectedDepartment].map((course) => (
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
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <GraduationCap className="h-4 w-4 text-teal-400 mr-2" />
                            <span className="text-sm text-gray-300">{course.instructor}</span>
                          </div>
                          <span className="text-xs px-2 py-1 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/30">
                            {course.skillLevel}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
};

const CoCurricularCoursesSection = ({ courses, isLoading }) => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  
  useEffect(() => {
    // Check authentication status
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
  }, []);
  
  // Group courses by activity type
  const activityGroups = {
    'Science': [],
    'Engineering': [],
    'Arts': [],
    'Sports': [],
    'Music': [],
    'Others': []
  };
  
  courses.forEach(course => {
    if (activityGroups.hasOwnProperty(course.activityType)) {
      activityGroups[course.activityType].push(course);
    } else {
      activityGroups['Others'].push(course);
    }
  });
  
  const handleActivityClick = (activity) => {
    setSelectedActivity(activity);
  };
  
  const handleCourseClick = (courseId) => {
    navigate(`/course/${courseId}`);
  };
  
  return (
    <section className="mb-20 pt-16" id="co-curricular-courses">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Co-Curricular Activities</h2>
          <p className="text-gray-400">Develop your skills beyond academics through these activities</p>
        </div>
        <div>
          <button 
            onClick={() => navigate('/courses?type=co-curricular')}
            className="px-5 py-2 rounded-lg bg-pink-500/10 text-pink-400 hover:bg-pink-500/20 transition-colors border border-pink-500/30"
          >
            View All
          </button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Activity Type Navigation */}
          <div className="flex flex-wrap gap-4 mb-6 border-b border-gray-800 pb-4">
            {Object.keys(activityGroups).map((activity) => (
              <button
                key={activity}
                onClick={() => handleActivityClick(activity)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedActivity === activity
                    ? 'bg-pink-500 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {activity}
              </button>
            ))}
          </div>
          
          {/* If no activity is selected, show activity types grid */}
          {!selectedActivity ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {Object.keys(activityGroups).map(activity => (
                <div
                  key={activity}
                  onClick={() => handleActivityClick(activity)}
                  className="bg-gray-800/50 hover:bg-gray-800 backdrop-blur-sm p-6 rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl border border-gray-700 cursor-pointer flex flex-col items-center text-center"
                >
                  {activity === 'Science' && <Leaf className="h-12 w-12 text-green-500 mb-4" />}
                  {activity === 'Engineering' && <Shapes className="h-12 w-12 text-blue-500 mb-4" />}
                  {activity === 'Arts' && <PenTool className="h-12 w-12 text-purple-500 mb-4" />}
                  {activity === 'Sports' && <Dumbbell className="h-12 w-12 text-red-500 mb-4" />}
                  {activity === 'Music' && <Music className="h-12 w-12 text-yellow-500 mb-4" />}
                  {activity === 'Others' && <BookOpen className="h-12 w-12 text-teal-500 mb-4" />}
                  
                  <h3 className="text-xl font-semibold text-white mb-2">{activity}</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    {activityGroups[activity].length} courses available
                  </p>
                  <span className="text-pink-400 flex items-center gap-1 text-sm">
                    Browse Activities
                    <MoveRight className="h-4 w-4" />
                  </span>
                </div>
              ))}
            </div>
          ) : (
            // Show courses of selected activity
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-white">{selectedActivity} Activities</h3>
                <button 
                  onClick={() => setSelectedActivity(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
              
              {activityGroups[selectedActivity].length === 0 ? (
                <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl text-center">
                  <p className="text-gray-400">No activities available in this category yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activityGroups[selectedActivity].map((course) => (
                    <div
                      key={course._id}
                      onClick={() => handleCourseClick(course._id)}
                      className="bg-gray-800/50 hover:bg-gray-800 backdrop-blur-sm rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl border border-gray-700 overflow-hidden group cursor-pointer"
                    >
                      <div className="h-40 overflow-hidden relative">
                        <img
                          src={course.thumbnail || 'https://via.placeholder.com/640x360.png?text=Activity+Image'}
                          alt={course.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"></div>
                        
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
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <GraduationCap className="h-4 w-4 text-pink-400 mr-2" />
                            <span className="text-sm text-gray-300">{course.instructor}</span>
                          </div>
                          <span className="text-xs px-2 py-1 rounded-full bg-pink-500/10 text-pink-400 border border-pink-500/30">
                            {course.skillLevel}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
};

const TeacherSection = ({ instructors, universities, selectedUniversity, setSelectedUniversity, isLoading }) => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userUniversity, setUserUniversity] = useState('');
  const [viewAll, setViewAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [departments, setDepartments] = useState([]);
  const DEFAULT_PROFILE_IMAGE = 'https://thumbs.dreamstime.com/b/teacher-instructor-colorful-icon-vector-flat-sign-presenter-symbol-logo-illustration-94324489.jpg';
  
  useEffect(() => {
    // Check authentication status
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
    
    // If logged in, get user's university
    if (loggedIn) {
      const fetchUserDetails = async () => {
        try {
          const { authService } = await import('../api/apiClient');
          const response = await authService.getCurrentUser();
          
          if (response.data && response.data.user) {
            setUserUniversity(response.data.user.university);
            setSelectedUniversity(response.data.user.university);
          }
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      };
      
      fetchUserDetails();
    }
  }, [setSelectedUniversity]);
  
  // Extract unique departments from instructors
  useEffect(() => {
    if (instructors.length > 0) {
      const uniqueDepartments = [...new Set(instructors.map(instructor => instructor.department))];
      setDepartments(uniqueDepartments.filter(Boolean));
    }
  }, [instructors]);
  
  // Filter instructors by university, search query, and department
  const filteredInstructors = instructors.filter(instructor => {
    // University filter
    const matchesUniversity = !selectedUniversity || instructor.university === selectedUniversity;
    
    // Search filter
    const matchesSearch = !searchQuery || 
      instructor.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      instructor.position?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      instructor.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      instructor.code?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Department filter
    const matchesDepartment = !filterDepartment || instructor.department === filterDepartment;
    
    return matchesUniversity && matchesSearch && matchesDepartment;
  });
  
  // Show only first 4 instructors unless viewAll is true
  const displayedInstructors = viewAll ? filteredInstructors : filteredInstructors.slice(0, 4);
  
  const handleLogin = () => {
    navigate('/login');
  };
  
  const handleViewAllToggle = () => {
    setViewAll(!viewAll);
  };
  
  return (
    <section className="mb-20 pt-16" id="teachers">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Our Instructors</h2>
          <p className="text-gray-400">Learn from experienced faculty members across universities</p>
        </div>
      </div>
      
      {isLoggedIn ? (
        <>
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
            </div>
          ) : (
            <div>
              <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 mb-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                  <h3 className="text-xl font-bold text-white mb-4 md:mb-0">Instructors from {userUniversity}</h3>
                  
                  <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                    {/* Search bar */}
                    <div className="relative">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search instructors..."
                        className="bg-gray-700 border border-gray-600 text-white rounded-lg pl-10 pr-4 py-2 w-full md:w-64 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                      />
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    </div>
                    
                    {/* Department filter */}
                    <select
                      value={filterDepartment}
                      onChange={(e) => setFilterDepartment(e.target.value)}
                      className="bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    >
                      <option value="">All Departments</option>
                      {departments.map((dept, index) => (
                        <option key={index} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {filteredInstructors.length === 0 ? (
                  <p className="text-gray-400">No instructors available based on your filters.</p>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {displayedInstructors.map((instructor, index) => (
                        <div key={index} className="bg-gray-900/80 p-5 rounded-lg border border-gray-700 transition-all duration-300 hover:shadow-lg hover:border-cyan-900">
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
                          
                          <div className="mb-3">
                            <span className="text-xs px-2 py-1 mr-2 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                              {instructor.department}
                            </span>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 text-xs text-gray-400">
                            {instructor.roomNo && (
                              <div className="flex items-center">
                                <span className="bg-gray-800 px-2 py-1 rounded">Room: {instructor.roomNo}</span>
                              </div>
                            )}
                            
                            {instructor.deskNo && (
                              <div className="flex items-center">
                                <span className="bg-gray-800 px-2 py-1 rounded">Desk: {instructor.deskNo}</span>
                              </div>
                            )}
                            
                            {instructor.email && (
                              <div className="flex items-center mt-1 w-full">
                                <span className="bg-gray-800 px-2 py-1 rounded truncate w-full" title={instructor.email}>
                                  {instructor.email}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {filteredInstructors.length > 4 && (
                      <div className="mt-8 text-center">
                        <button 
                          onClick={handleViewAllToggle}
                          className="px-5 py-2 rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 transition-colors border border-cyan-500/30"
                        >
                          {viewAll ? 'Show Less' : `View All Instructors (${filteredInstructors.length})`}
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700 text-center">
          <GraduationCap className="h-16 w-16 text-cyan-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Want to see our instructors?</h3>
          <p className="text-gray-400 mb-6">Please log in to view instructors from your university.</p>
          <button 
            onClick={handleLogin}
            className="px-6 py-2 rounded-lg bg-cyan-500 text-white hover:bg-cyan-600 transition-colors"
          >
            Log In Now
          </button>
        </div>
      )}
    </section>
  );
};

const NoticeSection = ({ notices, selectedUniversity }) => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userUniversity, setUserUniversity] = useState('');
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [userNotices, setUserNotices] = useState([]);
  
  useEffect(() => {
    // Check authentication status
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
    
    // If logged in, get user's university and corresponding notices
    if (loggedIn) {
      setIsLoadingUser(true);
      
      // First check localStorage for university (as fallback)
      const localUniversity = localStorage.getItem('userUniversity');
      if (localUniversity) {
        setUserUniversity(localUniversity);
      }
      
      const fetchUserDetails = async () => {
        try {
          const { authService, noticeService } = await import('../api/apiClient');
          const response = await authService.getCurrentUser();
          
          if (response.data && response.data.user && response.data.user.university) {
            const university = response.data.user.university;
            setUserUniversity(university);
            
            // Also update localStorage in case it was missing
            localStorage.setItem('userUniversity', university);
            
            // If selectedUniversity is not yet set, use the user's university
            if (!selectedUniversity) {
              try {
                const { noticeService } = await import('../api/apiClient');
                const noticesResponse = await noticeService.getAllNotices({ university });
                setUserNotices(noticesResponse.data);
              } catch (noticeError) {
                console.error('Error fetching notices:', noticeError);
                setUserNotices([]);
              }
            }
          } else if (localUniversity && !selectedUniversity) {
            // If API didn't return university but we have it in localStorage, use that
            try {
              const { noticeService } = await import('../api/apiClient');
              const noticesResponse = await noticeService.getAllNotices({ university: localUniversity });
              setUserNotices(noticesResponse.data);
            } catch (noticeError) {
              console.error('Error fetching notices:', noticeError);
              setUserNotices([]);
            }
          }
        } catch (error) {
          console.error('Error fetching user details:', error);
          // If API call fails but we have university in localStorage, use that
          if (localUniversity && !selectedUniversity) {
            try {
              const { noticeService } = await import('../api/apiClient');
              const noticesResponse = await noticeService.getAllNotices({ university: localUniversity });
              setUserNotices(noticesResponse.data);
            } catch (noticeError) {
              console.error('Error fetching notices:', noticeError);
              setUserNotices([]);
            }
          }
        } finally {
          setIsLoadingUser(false);
        }
      };
      
      fetchUserDetails();
    }
  }, [selectedUniversity]);
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  const handleLogin = () => {
    navigate('/login');
  };
  
  // Determine which notices to display
  const displayNotices = selectedUniversity ? notices : userNotices;
  const displayUniversity = selectedUniversity || userUniversity;
  
  return (
    <section className="mb-20 pt-16" id="notices">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">University Notices</h2>
          <p className="text-gray-400">Stay updated with the latest announcements from your university</p>
        </div>
      </div>
      
      {isLoggedIn ? (
        isLoadingUser ? (
          <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading university notices...</p>
          </div>
        ) : displayUniversity ? (
          displayNotices && displayNotices.length > 0 ? (
            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">Notices from {displayUniversity}</h3>
              <div className="space-y-4">
                {displayNotices.slice(0, 5).map((notice, index) => (
                  <div 
                    key={index} 
                    className="p-4 rounded-lg border border-gray-700 hover:border-yellow-700 transition-all duration-300 bg-gray-900/80"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-lg font-semibold text-white">{notice.title}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        notice.importance === 'urgent' ? 'bg-red-500/10 text-red-400 border border-red-500/30' :
                        notice.importance === 'important' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30' :
                        'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30'
                      }`}>
                        {notice.importance === 'urgent' ? 'Urgent' : 
                         notice.importance === 'important' ? 'Important' : 'Notice'}
                      </span>
                    </div>
                    
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">{notice.content}</p>
                    
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>{formatDate(notice.createdAt)}</span>
                      <span className="px-2 py-1 rounded-full bg-gray-800">
                        {notice.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              {displayNotices.length > 5 && (
                <div className="mt-4 text-center">
                  <button 
                    onClick={() => navigate('/notices')}
                    className="px-4 py-2 rounded-lg bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 transition-colors border border-yellow-500/30"
                  >
                    View All Notices
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700 text-center">
              <BellRing className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No Notices Available</h3>
              <p className="text-gray-400">There are no notices available for {displayUniversity} at this time.</p>
            </div>
          )
        ) : (
          <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700 text-center">
            <BellRing className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">University Information Not Found</h3>
            <p className="text-gray-400 mb-4">We couldn't find your university information in your profile.</p>
            <button 
              onClick={() => navigate('/userdashboard')}
              className="px-6 py-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 transition-colors"
            >
              Go to Profile Settings
            </button>
          </div>
        )
      ) : (
        <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700 text-center">
          <BellRing className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Stay Updated with University Notices</h3>
          <p className="text-gray-400 mb-6">Please log in to view notices from your university.</p>
          <button 
            onClick={handleLogin}
            className="px-6 py-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 transition-colors"
          >
            Log In Now
          </button>
        </div>
      )}
    </section>
  );
};

const JobSection = ({ jobs, isLoading }) => {
  const navigate = useNavigate();
  const [jobListings, setJobListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const { jobService } = await import('../api/apiClient');
        const response = await jobService.getAllJobs();
        setJobListings(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError('Failed to load job listings');
        setJobListings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);
  
  // Format date function
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format job type for display
  const formatJobType = (type) => {
    if (!type) return 'N/A';
    return type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('-');
  };

  const handleJobClick = (jobId) => {
    navigate(`/job/${jobId}`);
  };

  return (
    <section className="mb-20" id="jobs">
      <h2 className="font-['Inter'] text-3xl sm:text-4xl font-bold text-white mb-6 text-center relative">
        <Briefcase className="w-6 h-6 inline-block mr-2 text-green-400" />
        Available Job Opportunities
        <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/3 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></span>
        </h2>
      
      <p className="text-center text-gray-300 mb-12 max-w-3xl mx-auto">
        Find your dream job with our curated listings from top companies across Bangladesh. New opportunities added regularly.
      </p>
      
      {loading ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading job opportunities...</p>
        </div>
      ) : error ? (
        <div className="text-center py-10">
          <p className="text-red-400">{error}</p>
        </div>
      ) : (
        <>
          {jobListings.length === 0 ? (
            <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700 text-center mb-12">
              <Briefcase className="h-16 w-16 text-green-500/50 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Currently No Jobs Available</h3>
              <p className="text-gray-400 mb-2">Our administrators have not posted any job opportunities yet.</p>
              <p className="text-gray-400">Please check back later as new positions are added regularly.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {jobListings.slice(0, 4).map((job) => (
                <div 
                  key={job._id} 
                  className="rounded-xl p-6 bg-gradient-to-br from-gray-900/50 to-gray-900/80 border border-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
                  onClick={() => handleJobClick(job._id)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-['Inter'] text-xl text-white group-hover:text-green-400 transition-colors">{job.title}</h3>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      job.type === 'full-time' ? 'bg-green-500/20 text-green-400' :
                      job.type === 'part-time' ? 'bg-blue-500/20 text-blue-400' :
                      job.type === 'remote' ? 'bg-purple-500/20 text-purple-400' :
                      job.type === 'internship' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {formatJobType(job.type)}
                  </span>
                </div>
                
                  <div className="flex items-center mb-3 text-gray-400 text-sm">
                    <Building2 className="w-4 h-4 mr-2" /> {job.company}
                    <span className="mx-3">•</span>
                    <span>{job.location}</span>
                  </div>
                  
                  <p className="font-['Source_Sans_Pro'] text-gray-300 mb-4 line-clamp-2">{job.description}</p>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">Posted on: {formatDate(job.createdAt)}</span>
                    <button className="text-green-400 hover:text-green-300 transition-colors text-sm flex items-center">
                      View Details <ArrowRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="text-center">
                  <button
              onClick={() => navigate('/jobs')}
              className="font-['Source_Sans_Pro'] font-semibold px-6 py-3 rounded-full transition-all duration-300 flex items-center gap-2 shadow-lg border-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white border-transparent hover:from-green-600 hover:to-emerald-600 hover:scale-105 mx-auto"
            >
              Browse All Job Listings <Briefcase className="w-5 h-5 ml-2" />
                  </button>
          </div>
        </>
      )}
    </section>
  );
};

const CommunitySection = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [globalPosts, setGlobalPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
    
    // Fetch global posts for the community section
    const fetchGlobalPosts = async () => {
      setIsLoading(true);
      try {
        // If user is logged in, use the API with auth
        if (loggedIn) {
          const response = await communityAPI.getGlobalPosts();
          setGlobalPosts(response.data.slice(0, 3)); // Get only 3 posts
        } else {
          // If not logged in, make a public request (needs to be implemented on backend)
          const response = await axios.get('http://localhost:5000/api/community/public/posts');
          setGlobalPosts(response.data.slice(0, 3)); // Get only 3 posts
        }
        setError(null);
      } catch (error) {
        console.error('Error fetching community posts:', error);
        setError('Failed to load community posts');
        // Set some placeholder data if fetch fails
        setGlobalPosts([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchGlobalPosts();
  }, []);
  
  // Format date for posts
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  // Handle Join Community button click
  const handleJoinCommunity = () => {
    if (isLoggedIn) {
      // If logged in, navigate to community section in user dashboard
      navigate('/userdashboard', { state: { activeTab: 'community' } });
    } else {
      // If not logged in, go to login page with return destination
      navigate('/login', { 
        state: { 
          returnTo: '/userdashboard',
          returnToParams: { activeTab: 'community' }
        } 
      });
    }
  };
  
  return (
    <section className="mb-20">
      <h2 className="font-['Inter'] text-3xl sm:text-4xl font-bold text-white mb-6 text-center relative">
        <MessageCircle className="w-6 h-6 inline-block mr-2 text-indigo-400" />
        Join Our Community
        <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/3 h-1 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full"></span>
      </h2>
      
      <div className="bg-gradient-to-br from-indigo-900/30 to-blue-900/30 border border-indigo-800/50 rounded-xl p-6 md:p-8 shadow-xl backdrop-blur-sm max-w-5xl mx-auto">
        <div className="grid grid-cols-1 gap-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-3">Connect with Peers & Professionals</h3>
            <p className="text-gray-300 mb-6 max-w-3xl mx-auto">
              Join our thriving community of students, educators, and professionals. Share ideas, get support, and build meaningful connections that will help you grow academically and professionally.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 max-w-4xl mx-auto">
              <div className="flex items-center bg-indigo-900/30 p-3 rounded-lg border border-indigo-800/50">
                <div className="bg-indigo-500/20 p-2 rounded-lg mr-3 flex-shrink-0">
                  <MessageCircle className="w-5 h-5 text-indigo-400" />
                </div>
                <div className="text-left">
                  <h4 className="text-lg font-semibold text-white">Discussion Forums</h4>
                  <p className="text-gray-400 text-sm">Engage in topic-specific discussions.</p>
                </div>
              </div>
              
              <div className="flex items-center bg-indigo-900/30 p-3 rounded-lg border border-indigo-800/50">
                <div className="bg-indigo-500/20 p-2 rounded-lg mr-3 flex-shrink-0">
                  <Users className="w-5 h-5 text-indigo-400" />
                </div>
                <div className="text-left">
                  <h4 className="text-lg font-semibold text-white">Study Groups</h4>
                  <p className="text-gray-400 text-sm">Join or create study groups.</p>
                </div>
              </div>
              
              <div className="flex items-center bg-indigo-900/30 p-3 rounded-lg border border-indigo-800/50">
                <div className="bg-indigo-500/20 p-2 rounded-lg mr-3 flex-shrink-0">
                  <HeartHandshake className="w-5 h-5 text-indigo-400" />
                </div>
                <div className="text-left">
                  <h4 className="text-lg font-semibold text-white">Mentorship</h4>
                  <p className="text-gray-400 text-sm">Connect with mentors or become one.</p>
                </div>
              </div>
            </div>
            
            <button 
              onClick={handleJoinCommunity}
              className="font-['Source_Sans_Pro'] font-semibold px-6 py-3 rounded-full transition-all duration-300 flex items-center gap-2 shadow-lg border-2 bg-gradient-to-r from-indigo-500 to-blue-500 text-white border-transparent hover:from-indigo-600 hover:to-blue-600 hover:scale-105 mx-auto"
            >
              Join Community <Users className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
                      
        <div className="mt-8 pt-8 border-t border-indigo-800/30">
          <h3 className="text-xl font-bold text-white mb-4 text-center">What Our Community Says</h3>
          
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader className="w-8 h-8 text-indigo-400 animate-spin" />
              <span className="ml-2 text-gray-400">Loading community posts...</span>
            </div>
          ) : error ? (
            <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 text-center text-red-400">
              {error}
            </div>
          ) : globalPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {globalPosts.map((post) => (
                <div key={post._id} className="bg-gradient-to-br from-gray-900/50 to-gray-900/80 border border-gray-800 p-4 rounded-lg">
                  <p className="text-gray-300 italic text-sm line-clamp-4">
                    "{post.content}"
                  </p>
                  <div className="flex items-center mt-4">
                    <div className="h-10 w-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-white font-bold mr-3">
                      {post.userName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h5 className="text-white font-semibold">{post.userName}</h5>
                      <p className="text-gray-400 text-xs">{post.university || 'EduHub Member'} • {formatDate(post.createdAt)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-gray-900/50 to-gray-900/80 border border-gray-800 p-4 rounded-lg">
                <p className="text-gray-300 italic text-sm">
                  "The EduHub community helped me connect with mentors who guided me through my job search. I'm now working at my dream company!"
                </p>
                <div className="flex items-center mt-4">
                  <div className="h-10 w-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-white font-bold mr-3">
                    N
                  </div>
                  <div>
                    <h5 className="text-white font-semibold">Nasrin Ahmed</h5>
                    <p className="text-gray-400 text-xs">Computer Science Graduate</p>
                  </div>
                </div>
              </div>
                      
              <div className="bg-gradient-to-br from-gray-900/50 to-gray-900/80 border border-gray-800 p-4 rounded-lg">
                <p className="text-gray-300 italic text-sm">
                  "The study groups here are incredibly supportive. We've been meeting virtually for over a year now, and it's been a game-changer for my academics."
                </p>
                <div className="flex items-center mt-4">
                  <div className="h-10 w-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-white font-bold mr-3">
                    R
                  </div>
                  <div>
                    <h5 className="text-white font-semibold">Rafiq Islam</h5>
                    <p className="text-gray-400 text-xs">Engineering Student</p>
                  </div>
                </div>
              </div>
                      
              <div className="bg-gradient-to-br from-gray-900/50 to-gray-900/80 border border-gray-800 p-4 rounded-lg">
                <p className="text-gray-300 italic text-sm">
                  "I've learned so much from the discussion forums. The community is knowledgeable and always willing to help with tough problems."
                </p>
                <div className="flex items-center mt-4">
                  <div className="h-10 w-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-white font-bold mr-3">
                    A
                  </div>
                  <div>
                    <h5 className="text-white font-semibold">Amina Khan</h5>
                    <p className="text-gray-400 text-xs">Law Student</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const VideoSection = ({ videoPlaying, setVideoPlaying }) => {
  const [promotionalVideo, setPromotionalVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(false);

  useEffect(() => {
    // Fetch promotional video from backend
    const fetchPromotionalVideo = async () => {
      try {
        setLoading(true);
        const response = await promotionalVideoService.getActiveVideo();
        if (response.data && response.data.video) {
          setPromotionalVideo(response.data.video);
          
          // Automatically play video if user has scrolled to this section
          const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !videoPlaying) {
              // Check if user has interacted with the page
              if (document.documentElement.hasAttribute('data-user-interacted')) {
                setVideoPlaying(true);
                setAutoPlayEnabled(true);
              }
            }
          }, { threshold: 0.5 });
          
          // Start observing the video section
          const videoSection = document.getElementById('promo-video-section');
          if (videoSection) {
            observer.observe(videoSection);
          }
          
          return () => {
            if (videoSection) observer.unobserve(videoSection);
          };
        } else {
          setError('No promotional video available');
        }
      } catch (err) {
        console.error('Error fetching promotional video:', err);
        setError('Failed to load promotional video');
      } finally {
        setLoading(false);
      }
    };

    fetchPromotionalVideo();
    
    // Add event listener to track user interaction with the page
    const handleUserInteraction = () => {
      document.documentElement.setAttribute('data-user-interacted', 'true');
    };
    
    window.addEventListener('click', handleUserInteraction);
    window.addEventListener('keydown', handleUserInteraction);
    window.addEventListener('scroll', handleUserInteraction);
    
    return () => {
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
      window.removeEventListener('scroll', handleUserInteraction);
    };
  }, [videoPlaying, setVideoPlaying]);

  // Function to get YouTube video ID from URL
  const getYoutubeVideoId = (url) => {
    if (!url) return null;
    
    // Regular expressions to extract YouTube video ID from different URL formats
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    
    return match && match[2].length === 11 ? match[2] : null;
  };

  return (
    <section className="mb-20 relative" id="promo-video-section">
      <h2 className="font-['Inter'] text-3xl sm:text-4xl font-bold text-white mb-6 text-center relative">
        <PlayCircle className="w-6 h-6 inline-block mr-2 text-red-400" />
        Promotional Video
        <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/3 h-1 bg-gradient-to-r from-red-500 to-pink-500 rounded-full"></span>
      </h2>
      
      {promotionalVideo && (
        <>
          <p className="text-center mb-4 max-w-3xl mx-auto">
            <span className="text-xl text-white font-semibold px-6 py-2 bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-full border border-red-500/20">
              {promotionalVideo.title}
            </span>
          </p>
          
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <p className="text-gray-400 italic px-6 py-4 bg-gray-800/30 rounded-lg border-l-4 border-red-500 leading-relaxed">
              "{promotionalVideo.description}"
            </p>
          </div>
        </>
      )}
      
      {!promotionalVideo && (
        <p className="text-center text-gray-300 mb-12 max-w-3xl mx-auto">
          Watch our promotional video to learn more about EduHub and the opportunities we offer.
        </p>
      )}
      
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
        </div>
      ) : error ? (
        <div className="max-w-4xl mx-auto relative bg-gray-900/60 border border-gray-800 rounded-xl shadow-2xl p-8 text-center">
          <p className="text-gray-400">{error}</p>
        </div>
      ) : promotionalVideo ? (
        <div className="max-w-4xl mx-auto relative overflow-hidden bg-gray-900/60 border border-gray-800 rounded-xl shadow-2xl">
          {videoPlaying ? (
            <>
              <div className="relative pt-[56.25%]">
                {getYoutubeVideoId(promotionalVideo.videoUrl) ? (
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${getYoutubeVideoId(promotionalVideo.videoUrl)}?autoplay=1&mute=1`}
                    title="Promotional Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                ) : promotionalVideo.videoType === 'drive' ? (
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={`${promotionalVideo.videoUrl}?autoplay=1`}
                    title="Promotional Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                ) : (
                  <video
                    className="absolute inset-0 w-full h-full"
                    src={promotionalVideo.videoUrl}
                    controls
                    autoPlay
                    muted
                    onCanPlay={(e) => {
                      e.target.muted = false;
                      e.target.play();
                    }}
                  />
                )}
              </div>
              <button 
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 p-2 rounded-full transition-colors"
                onClick={() => setVideoPlaying(false)}
              >
                <XCircle className="w-6 h-6 text-white" />
              </button>
            </>
          ) : (
            <div 
              className="relative cursor-pointer" 
              onClick={() => {
                setVideoPlaying(true);
                // Auto-start the video when clicked
                setTimeout(() => {
                  const videoElement = document.querySelector('video');
                  if (videoElement) videoElement.play();
                }, 100);
              }}
            >
              <img 
                src={promotionalVideo.thumbnailUrl || `https://img.youtube.com/vi/${getYoutubeVideoId(promotionalVideo.videoUrl) || 'dQw4w9WgXcQ'}/maxresdefault.jpg`} 
                alt="Video thumbnail" 
                className="w-full h-auto rounded-xl"
              />
              {/* Video info overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-xl">
                <h3 className="text-xl font-bold text-white mb-2">{promotionalVideo.title}</h3>
                <p className="text-gray-300">{promotionalVideo.description}</p>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-red-600/80 rounded-full p-4 shadow-lg transform hover:scale-110 transition-transform">
                  <PlayCircle className="w-12 h-12 text-white" />
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="max-w-4xl mx-auto relative bg-gray-900/60 border border-gray-800 rounded-xl shadow-2xl p-8 text-center">
          <p className="text-gray-400">No promotional video available at the moment.</p>
        </div>
      )}
    </section>
  );
};

const StatsSection = () => {
  const stats = [
    { label: 'Students', value: '10K+', icon: <Users className="w-6 h-6 text-teal-400" /> },
    { label: 'Courses', value: '500+', icon: <BookOpen className="w-6 h-6 text-cyan-400" /> },
    { label: 'Instructors', value: '50+', icon: <GraduationCap className="w-6 h-6 text-purple-400" /> },
    { label: 'Awards', value: '10+', icon: <Award className="w-6 h-6 text-pink-400" /> },
  ];

  return (
    <section className="mb-16">
      <h2 className="font-['Inter'] text-3xl sm:text-4xl font-bold text-white mb-6 text-center relative">
        <BarChart className="w-6 h-6 inline-block mr-2 text-yellow-400" />
        Our Achievements
        <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/3 h-1 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full"></span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, index) => (
          <div key={index} className="rounded-xl p-6 bg-gradient-to-br from-gray-900/50 to-gray-900/80 border border-gray-800 shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-[1.02] flex flex-col items-center justify-center h-40">
            <div className="mb-4">{stat.icon}</div>
            <h3 className="font-['Inter'] text-2xl text-white">{stat.value}</h3>
            <p className="font-['Source_Sans_Pro'] text-gray-400">{stat.label}</p>
                      </div>
        ))}
                    </div>
    </section>
  );
};

const SupportSection = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    // Check authentication status
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
  }, []);
  
  const handleAcademicSupportClick = () => {
    if (isLoggedIn) {
      navigate('/userdashboard', { state: { activeTab: 'external' } });
    } else {
      navigate('/login', { 
        state: { 
          returnTo: '/userdashboard',
          returnToParams: { activeTab: 'external' }
        } 
      });
    }
  };
  
  const handleCareerGuidanceClick = () => {
    if (isLoggedIn) {
      navigate('/userdashboard', { state: { activeTab: 'cvbuilder' } });
    } else {
      navigate('/login', { 
        state: { 
          returnTo: '/userdashboard',
          returnToParams: { activeTab: 'cvbuilder' }
        } 
      });
    }
  };
  
  const handleTechnicalSupportClick = () => {
    if (isLoggedIn) {
      // Scroll to feedback section if on the landing page already
      const feedbackSection = document.getElementById('feedback');
      if (feedbackSection) {
        feedbackSection.scrollIntoView({ behavior: 'smooth' });
      } else {
        // Navigate to landing page feedback section
        navigate('/#feedback');
      }
    } else {
      navigate('/login', { 
        state: { 
          returnTo: '/',
          returnToParams: { scrollTo: 'feedback' }
        } 
      });
    }
  };
  
  return (
    <section className="mb-20">
      <h2 className="font-['Inter'] text-3xl sm:text-4xl font-bold text-white mb-6 text-center relative">
        <LifeBuoy className="w-6 h-6 inline-block mr-2 text-orange-400" />
        Support & Resources
        <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/3 h-1 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"></span>
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {/* Academic Support */}
        <div className="bg-gradient-to-br from-gray-900/50 to-gray-900/80 border border-gray-800 rounded-xl p-6 shadow-xl backdrop-blur-md transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
          <div className="bg-orange-500/20 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8 text-orange-400" />
              </div>
          <h3 className="text-xl font-bold text-white mb-3">Academic Support</h3>
          <p className="text-gray-300 mb-4">
            Get assistance with coursework, research projects, and academic planning from our experienced tutors and advisors.
          </p>
          <ul className="space-y-2 mb-6">
            <li className="flex items-center text-gray-300">
              <div className="bg-orange-500/20 p-1 rounded-full mr-2">
                <BadgeCheck className="w-4 h-4 text-orange-400" />
            </div>
              <span className="text-sm">One-on-one tutoring sessions</span>
            </li>
            <li className="flex items-center text-gray-300">
              <div className="bg-orange-500/20 p-1 rounded-full mr-2">
                <BadgeCheck className="w-4 h-4 text-orange-400" />
        </div>
              <span className="text-sm">Research methodology guidance</span>
            </li>
            <li className="flex items-center text-gray-300">
              <div className="bg-orange-500/20 p-1 rounded-full mr-2">
                <BadgeCheck className="w-4 h-4 text-orange-400" />
              </div>
              <span className="text-sm">Study resources and materials</span>
            </li>
            </ul>
          <button 
            onClick={handleAcademicSupportClick}
            className="text-orange-400 hover:text-orange-300 transition-colors text-sm flex items-center"
          >
            Learn More <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>
        
        {/* Career Guidance */}
        <div className="bg-gradient-to-br from-gray-900/50 to-gray-900/80 border border-gray-800 rounded-xl p-6 shadow-xl backdrop-blur-md transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
          <div className="bg-amber-500/20 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
            <Briefcase className="w-8 h-8 text-amber-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Career Guidance</h3>
          <p className="text-gray-300 mb-4">
            Navigate your career path with guidance from industry professionals, CV reviews, and interview preparation.
          </p>
          <ul className="space-y-2 mb-6">
            <li className="flex items-center text-gray-300">
              <div className="bg-amber-500/20 p-1 rounded-full mr-2">
                <BadgeCheck className="w-4 h-4 text-amber-400" />
              </div>
              <span className="text-sm">Career counseling sessions</span>
            </li>
            <li className="flex items-center text-gray-300">
              <div className="bg-amber-500/20 p-1 rounded-full mr-2">
                <BadgeCheck className="w-4 h-4 text-amber-400" />
              </div>
              <span className="text-sm">CV and cover letter reviews</span>
            </li>
            <li className="flex items-center text-gray-300">
              <div className="bg-amber-500/20 p-1 rounded-full mr-2">
                <BadgeCheck className="w-4 h-4 text-amber-400" />
              </div>
              <span className="text-sm">Mock interview practice</span>
            </li>
          </ul>
          <button 
            onClick={handleCareerGuidanceClick}
            className="text-amber-400 hover:text-amber-300 transition-colors text-sm flex items-center"
          >
            Explore Services <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>

        {/* Technical Support */}
        <div className="bg-gradient-to-br from-gray-900/50 to-gray-900/80 border border-gray-800 rounded-xl p-6 shadow-xl backdrop-blur-md transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
          <div className="bg-teal-500/20 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
            <LifeBuoy className="w-8 h-8 text-teal-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Technical Support</h3>
          <p className="text-gray-300 mb-4">
            Get help with platform navigation, account issues, and technical troubleshooting from our support team.
          </p>
          <ul className="space-y-2 mb-6">
            <li className="flex items-center text-gray-300">
              <div className="bg-teal-500/20 p-1 rounded-full mr-2">
                <BadgeCheck className="w-4 h-4 text-teal-400" />
              </div>
              <span className="text-sm">24/7 chat support</span>
            </li>
            <li className="flex items-center text-gray-300">
              <div className="bg-teal-500/20 p-1 rounded-full mr-2">
                <BadgeCheck className="w-4 h-4 text-teal-400" />
              </div>
              <span className="text-sm">Video tutorials and guides</span>
            </li>
            <li className="flex items-center text-gray-300">
              <div className="bg-teal-500/20 p-1 rounded-full mr-2">
                <BadgeCheck className="w-4 h-4 text-teal-400" />
              </div>
              <span className="text-sm">Account and access management</span>
            </li>
            </ul>
          <button 
            onClick={handleTechnicalSupportClick}
            className="text-teal-400 hover:text-teal-300 transition-colors text-sm flex items-center"
          >
            Get Support <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    </section>
  );
};

const FeedbackSection = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [feedback, setFeedback] = useState({ 
    subject: '', 
    message: '', 
    category: 'suggestion' 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    // Check authentication status
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFeedback(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!feedback.subject.trim() || !feedback.message.trim()) {
      setSubmitError('Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      // Use the API client instead of direct axios calls
      const token = localStorage.getItem('token');
      const response = await apiClient.post('/api/feedback', feedback, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setSubmitSuccess(true);
      setFeedback({ subject: '', message: '', category: 'suggestion' });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
      
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setSubmitError(error.response?.data?.message || 'Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleLogin = () => {
    navigate('/login');
  };
  
  return (
    <section className="mb-20 pt-16" id="feedback">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Send Us Feedback</h2>
          <p className="text-gray-400">We value your suggestions to improve our platform</p>
        </div>
      </div>
      
      {isLoggedIn ? (
        <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
          {submitSuccess ? (
            <div className="text-center py-8">
              <div className="bg-green-500/20 p-3 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-4">
                <BadgeCheck className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Feedback Submitted!</h3>
              <p className="text-gray-400 mb-6">Thank you for your valuable feedback. We'll review it shortly.</p>
              <button 
                onClick={() => setSubmitSuccess(false)}
                className="px-6 py-2 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors border border-green-500/30"
              >
                Submit Another Feedback
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {submitError && (
                <div className="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-3 rounded">
                  {submitError}
                </div>
              )}
              
              <div>
                <label htmlFor="subject" className="block text-white mb-2">Subject *</label>
                <input 
                  type="text" 
                  id="subject" 
                  name="subject" 
                  value={feedback.subject} 
                  onChange={handleChange} 
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  placeholder="Brief description of your feedback"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="category" className="block text-white mb-2">Category</label>
                <select 
                  id="category" 
                  name="category" 
                  value={feedback.category} 
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                >
                  <option value="suggestion">Suggestion</option>
                  <option value="bug">Bug Report</option>
                  <option value="feature">Feature Request</option>
                  <option value="complaint">Complaint</option>
                  <option value="praise">Praise</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-white mb-2">Message *</label>
                <textarea 
                  id="message" 
                  name="message" 
                  value={feedback.message} 
                  onChange={handleChange} 
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white min-h-[120px]"
                  placeholder="Please provide details about your feedback"
                  required
                ></textarea>
              </div>
              
              <div className="flex justify-end">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className={`px-6 py-2 rounded-lg ${
                    isSubmitting ? 
                    'bg-blue-500/50 text-blue-300' : 
                    'bg-blue-500 text-white hover:bg-blue-600'
                  } transition-colors`}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </div>
            </form>
          )}
        </div>
      ) : (
        <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700 text-center">
          <MessageCircle className="h-16 w-16 text-blue-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Want to share your feedback?</h3>
          <p className="text-gray-400 mb-6">Please log in to submit your suggestions and feedback.</p>
          <button 
            onClick={handleLogin}
            className="px-6 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          >
            Log In Now
          </button>
        </div>
      )}
    </section>
  );
};

const CallToActionSection = ({ navigate }) => {
  const [stats, setStats] = useState({
    courses: 0,
    instructors: 0,
    students: 0,
    jobs: 0
  });
  const [trustedUniversities, setTrustedUniversities] = useState([]);
  const [industryPartners, setIndustryPartners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        // First try to fetch all stats at once from platform stats endpoint
        const statsResponse = await axios.get('http://localhost:5000/api/platform/stats');
        if (statsResponse.data) {
          setStats({
            courses: statsResponse.data.courses || 0,
            instructors: statsResponse.data.instructors || 0,
            students: statsResponse.data.students || 0,
            jobs: statsResponse.data.jobs || 0
          });
        }

        // Fetch trusted universities
        const universitiesResponse = await axios.get('http://localhost:5000/api/partners/universities');
        if (universitiesResponse.data) {
          setTrustedUniversities(universitiesResponse.data);
        }

        // Fetch industry partners
        const partnersResponse = await axios.get('http://localhost:5000/api/partners/industry');
        if (partnersResponse.data) {
          setIndustryPartners(partnersResponse.data);
        }

        setError(null);
      } catch (err) {
        console.error('Error fetching platform data:', err);
        
        // Fallback to individual endpoints if main endpoint fails
        try {
          const coursesResponse = await axios.get('http://localhost:5000/api/platform/courses/count');
          if (coursesResponse.data && coursesResponse.data.count !== undefined) {
            setStats(prev => ({ ...prev, courses: coursesResponse.data.count }));
          }
          
          const instructorsResponse = await axios.get('http://localhost:5000/api/platform/instructors/count');
          if (instructorsResponse.data && instructorsResponse.data.count !== undefined) {
            setStats(prev => ({ ...prev, instructors: instructorsResponse.data.count }));
          }
          
          const studentsResponse = await axios.get('http://localhost:5000/api/platform/students/count');
          if (studentsResponse.data && studentsResponse.data.count !== undefined) {
            setStats(prev => ({ ...prev, students: studentsResponse.data.count }));
          }
          
          const jobsResponse = await axios.get('http://localhost:5000/api/platform/jobs/count');
          if (jobsResponse.data && jobsResponse.data.count !== undefined) {
            setStats(prev => ({ ...prev, jobs: jobsResponse.data.count }));
          }
        } catch (fallbackErr) {
          console.error('Error fetching individual stats:', fallbackErr);
          setError('Failed to load platform statistics');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Function to handle external link navigation with proper validation
  const navigateToExternalSite = (url) => {
    // Basic URL validation
    if (!url) return;
    
    // Ensure the URL has a protocol
    const hasProtocol = url.startsWith('http://') || url.startsWith('https://');
    const validUrl = hasProtocol ? url : `https://${url}`;
    
    // Open in a new tab with security attributes
    window.open(validUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="mb-16">
      <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 border border-blue-800/50 rounded-xl p-8 md:p-12 shadow-2xl backdrop-blur-lg">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
            Join Thousands of Students on EduHub Today
          </h2>
      
          {isLoading ? (
            <div className="flex justify-center py-4 mb-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              <div className="bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full text-sm font-medium">
                {stats.courses.toLocaleString()}+ Courses
              </div>
              <div className="bg-purple-500/20 text-purple-300 px-4 py-2 rounded-full text-sm font-medium">
                {stats.instructors.toLocaleString()}+ Instructors
              </div>
              <div className="bg-teal-500/20 text-teal-300 px-4 py-2 rounded-full text-sm font-medium">
                {stats.students.toLocaleString()}+ Students
              </div>
              <div className="bg-green-500/20 text-green-300 px-4 py-2 rounded-full text-sm font-medium">
                {stats.jobs.toLocaleString()}+ Job Opportunities
              </div>
            </div>
          )}
          
          <p className="text-gray-300 text-lg mb-10 max-w-2xl mx-auto">
            Unlock your potential with our comprehensive educational platform. From academic resources to career opportunities, 
            we're here to support your journey every step of the way.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
            <button 
              onClick={() => navigate('/register')}
              className="font-['Source_Sans_Pro'] font-semibold px-8 py-4 rounded-full transition-all duration-300 flex items-center gap-2 shadow-xl border-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-transparent hover:from-blue-600 hover:to-indigo-600 hover:scale-105 justify-center"
            >
              Create Free Account <Users className="w-5 h-5 ml-2" />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="font-['Source_Sans_Pro'] font-semibold px-8 py-4 rounded-full transition-all duration-300 flex items-center gap-2 shadow-xl border-2 border-white/20 text-white hover:bg-white/10 hover:scale-105 justify-center"
            >
              Login to Your Account <Rocket className="w-5 h-5 ml-2" />
            </button>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 mt-12">
            {/* Trusted Universities Section */}
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-1">Trusted by universities</p>
              <div className="flex gap-4">
                {trustedUniversities.length > 0 ? (
                  trustedUniversities.slice(0, 3).map((university) => (
                    <div key={university._id} className="flex flex-col items-center">
                      <img 
                        src={university.logoUrl ? `http://localhost:5000${university.logoUrl}` : "https://cdn-icons-png.flaticon.com/512/8074/8074804.png"} 
                        alt={university.name} 
                        className="h-10 w-auto grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer"
                        onClick={() => navigateToExternalSite(university.websiteUrl)}
                        title={university.name}
                      />
                      <span className="text-xs text-gray-500 mt-1">{university.name}</span>
                    </div>
                  ))
                ) : (
                  // Fallback if no universities are fetched
                  <>
                    <img 
                      src="https://cdn-icons-png.flaticon.com/512/8074/8074804.png" 
                      alt="University Logo" 
                      className="h-10 w-auto grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer"
                    />
                    <img 
                      src="https://cdn-icons-png.flaticon.com/512/8074/8074758.png" 
                      alt="University Logo" 
                      className="h-10 w-auto grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer"
                    />
                    <img 
                      src="https://cdn-icons-png.flaticon.com/512/8074/8074760.png" 
                      alt="University Logo" 
                      className="h-10 w-auto grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer"
                    />
                  </>
                )}
              </div>
            </div>
            
            {/* Industry Partners Section */}
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-1">Industry partners</p>
              <div className="flex gap-4">
                {industryPartners.length > 0 ? (
                  industryPartners.slice(0, 3).map((partner) => (
                    <div key={partner._id} className="flex flex-col items-center">
                      <img 
                        src={partner.logoUrl ? `http://localhost:5000${partner.logoUrl}` : "https://cdn-icons-png.flaticon.com/512/8074/8074881.png"}
                        alt={partner.name} 
                        className="h-10 w-auto grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer"
                        onClick={() => navigateToExternalSite(partner.websiteUrl)}
                        title={partner.name}
                      />
                      <span className="text-xs text-gray-500 mt-1">{partner.name}</span>
                    </div>
                  ))
                ) : (
                  // Fallback if no industry partners are fetched
                  <>
                    <img 
                      src="https://cdn-icons-png.flaticon.com/512/8074/8074881.png" 
                      alt="Industry Logo" 
                      className="h-10 w-auto grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer"
                    />
                    <img 
                      src="https://cdn-icons-png.flaticon.com/512/8074/8074969.png" 
                      alt="Industry Logo" 
                      className="h-10 w-auto grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer"
                    />
                    <img 
                      src="https://cdn-icons-png.flaticon.com/512/8074/8074924.png" 
                      alt="Industry Logo" 
                      className="h-10 w-auto grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer"
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Landing;