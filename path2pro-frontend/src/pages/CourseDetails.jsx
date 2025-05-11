import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  ArrowLeft, 
  Clock, 
  GraduationCap, 
  BookOpen, 
  Tag,
  Video,
  FileText,
  Link as LinkIcon,
  ExternalLink
} from 'lucide-react';
import Navbar from '../components/Navbar';

function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [enrollmentError, setEnrollmentError] = useState(null);
  const [enrollmentSuccess, setEnrollmentSuccess] = useState(false);
  const [courseProgress, setCourseProgress] = useState(0);
  
  // Check auth status
  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
  }, []);
  
  // Get current progress
  useEffect(() => {
    if (id && isEnrolled) {
      const progressData = JSON.parse(localStorage.getItem('courseProgress') || '{}');
      const currentProgress = progressData[id] || { percentComplete: 0 };
      setCourseProgress(currentProgress.percentComplete || 0);
    }
  }, [id, isEnrolled]);
  
  // Function to update progress
  const updateProgress = (newProgress) => {
    const progressData = JSON.parse(localStorage.getItem('courseProgress') || '{}');
    const currentProgress = progressData[id] || { percentComplete: 0, completed: false };
    
    // Update progress value
    currentProgress.percentComplete = newProgress;
    currentProgress.completed = newProgress >= 100;
    currentProgress.lastAccessed = new Date().toISOString();
    
    // Save to localStorage
    progressData[id] = currentProgress;
    localStorage.setItem('courseProgress', JSON.stringify(progressData));
    
    // Update state to refresh UI
    setCourseProgress(newProgress);
  };
  
  // Fetch course details
  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/courses/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        
        setCourse(response.data);
      } catch (err) {
        console.error('Error fetching course details:', err);
        setError('Failed to load course details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchCourseDetails();
    }
  }, [id]);
  
  // Check if user is already enrolled
  useEffect(() => {
    if (course && isLoggedIn) {
      const userId = localStorage.getItem('userId');
      // Check both API data and localStorage
      const enrolledViaAPI = course.enrolledStudents.includes(userId);
      const enrolledInLocalStorage = JSON.parse(localStorage.getItem('enrolledCourses') || '[]').includes(course._id);
      
      setIsEnrolled(enrolledViaAPI || enrolledInLocalStorage);
    }
  }, [course, isLoggedIn]);
  
  // Function to get YouTube video ID from URL
  const getYoutubeVideoId = (url) => {
    if (!url) return null;
    
    // Regular expressions for different YouTube URL formats
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleEnroll = async () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    
    try {
      setEnrolling(true);
      setEnrollmentError(null);
      
      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        `http://localhost:5000/api/courses/${id}/enroll`, 
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setIsEnrolled(true);
      setEnrollmentSuccess(true);
      
      // Update the course object to reflect enrollment
      setCourse(prev => ({
        ...prev,
        enrolledStudents: [...prev.enrolledStudents, localStorage.getItem('userId')]
      }));
      
      // Store enrollment in localStorage to persist on page refresh
      const enrolledCourses = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
      enrolledCourses.push(id);
      localStorage.setItem('enrolledCourses', JSON.stringify(enrolledCourses));
      
      // Initialize progress
      updateProgress(0);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setEnrollmentSuccess(false);
      }, 3000);
      
    } catch (err) {
      console.error('Error enrolling in course:', err);
      
      if (err.response && err.response.status === 400 && err.response.data.message === 'You are already enrolled in this course') {
        setIsEnrolled(true);
        
        // Store enrollment in localStorage if not already there
        const enrolledCourses = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
        if (!enrolledCourses.includes(id)) {
          enrolledCourses.push(id);
          localStorage.setItem('enrolledCourses', JSON.stringify(enrolledCourses));
        }
      } else {
        setEnrollmentError(
          err.response?.data?.message || 
          'Failed to enroll in this course. Please try again.'
        );
      }
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-gray-900 to-black min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto py-20 px-8 flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
        </div>
      </div>
    );
  }
  
  if (error || !course) {
    return (
      <div className="bg-gradient-to-br from-gray-900 to-black min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto py-20 px-8 flex-grow">
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-6 rounded-xl max-w-2xl mx-auto">
            <h2 className="text-xl font-bold mb-2">Error</h2>
            <p>{error || 'Course not found.'}</p>
            <button 
              onClick={() => navigate('/')}
              className="mt-4 inline-flex items-center text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-gradient-to-br from-gray-900 to-black min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto py-12 px-8 flex-grow">
        <button 
          onClick={() => navigate('/')}
          className="mb-6 inline-flex items-center text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Courses
        </button>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
              {/* Course content display based on type */}
              {course.courseSegment === 'video' ? (
                <div className="aspect-video bg-black">
                  {getYoutubeVideoId(course.videoUrl) ? (
                    <iframe 
                      src={`https://www.youtube.com/embed/${getYoutubeVideoId(course.videoUrl)}`}
                      title={course.title}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      onLoad={() => {
                        // If user is enrolled, update progress when video loads
                        if (isEnrolled) {
                          const courseProgress = JSON.parse(localStorage.getItem('courseProgress') || '{}');
                          const currentProgress = courseProgress[id] || { percentComplete: 0, completed: false };
                          
                          // If this is the first time, set to at least 5%
                          let newProgress = currentProgress.percentComplete || 0;
                          if (newProgress < 5) {
                            newProgress = 5;
                          }
                          
                          // Update progress using the function
                          updateProgress(newProgress);
                        }
                      }}
                    ></iframe>
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <p className="text-gray-400">Video URL is not valid or supported</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-video bg-gray-900 flex items-center justify-center p-8 text-center">
                  <div>
                    <FileText className="w-16 h-16 mx-auto text-teal-500 mb-4" />
                    <h3 className="text-xl font-bold text-white mb-4">Theory Course Content</h3>
                    <a 
                      href={course.theoryUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg transition-colors"
                      onClick={() => {
                        // If user is enrolled, update progress when opening the theory content
                        if (isEnrolled) {
                          const courseProgress = JSON.parse(localStorage.getItem('courseProgress') || '{}');
                          const currentProgress = courseProgress[id] || { percentComplete: 0, completed: false };
                          
                          // If this is the first time, set to at least 5%
                          let newProgress = currentProgress.percentComplete || 0;
                          if (newProgress < 5) {
                            newProgress = 5;
                          } else if (newProgress < 20) {
                            // Increment progress a bit each time they access the theory content
                            newProgress += 5;
                          }
                          
                          // Update progress using the function
                          updateProgress(newProgress);
                        }
                      }}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Course Material
                    </a>
                  </div>
                </div>
              )}
              
              {isLoggedIn && isEnrolled && course.courseSegment === 'video' && (
                <div className="bg-gray-800/80 border-t border-gray-700 p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-white font-medium">Track Your Progress</h3>
                      <p className="text-gray-400 text-sm">Update your progress after watching the video</p>
                    </div>
                    <button
                      onClick={() => {
                        const courseProgress = JSON.parse(localStorage.getItem('courseProgress') || '{}');
                        const currentProgress = courseProgress[id] || { percentComplete: 0, completed: false };
                        
                        // Increment progress by 25% each time they click
                        let newProgress = (currentProgress.percentComplete || 0) + 25;
                        if (newProgress > 100) newProgress = 100;
                        
                        // Update progress using the function
                        updateProgress(newProgress);
                        
                        // Show an alert
                        alert(`Progress updated to ${newProgress}%`);
                      }}
                      className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Mark Progress (+25%)
                    </button>
                  </div>
                </div>
              )}
              
              <div className="p-6">
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">{course.title}</h1>
                <p className="text-gray-400 mb-6">{course.description}</p>
                
                <div className="border-t border-gray-700 pt-6 mt-6">
                  <h2 className="text-xl font-bold text-white mb-4">Course Content</h2>
                  <div className="prose prose-invert max-w-none text-gray-400">
                    {course.content.split('\n').map((paragraph, index) => (
                      <p key={index} className="mb-4 text-gray-400">{paragraph}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Course Info Card */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
              <h2 className="text-xl font-bold text-white mb-4">Course Information</h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <GraduationCap className="w-5 h-5 text-teal-400 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm text-gray-400">Instructor</h3>
                    <p className="text-white">{course.instructor}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock className="w-5 h-5 text-teal-400 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm text-gray-400">Duration</h3>
                    <p className="text-white">{course.duration}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <BookOpen className="w-5 h-5 text-teal-400 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm text-gray-400">Level</h3>
                    <p className="text-white capitalize">{course.skillLevel}</p>
                  </div>
                </div>
                
                {course.courseType === 'academic' && (
                  <div className="flex items-start">
                    <BookOpen className="w-5 h-5 text-teal-400 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="text-sm text-gray-400">Department</h3>
                      <p className="text-white">{course.department}</p>
                    </div>
                  </div>
                )}
                
                {course.courseType === 'co-curricular' && (
                  <div className="flex items-start">
                    <BookOpen className="w-5 h-5 text-teal-400 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="text-sm text-gray-400">Activity Type</h3>
                      <p className="text-white">{course.activityType}</p>
                    </div>
                  </div>
                )}
                
                {course.courseSegment === 'video' ? (
                  <div className="flex items-start">
                    <Video className="w-5 h-5 text-teal-400 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="text-sm text-gray-400">Course Type</h3>
                      <p className="text-white">Video Lecture</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start">
                    <FileText className="w-5 h-5 text-teal-400 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="text-sm text-gray-400">Course Type</h3>
                      <p className="text-white">Theory Content</p>
                    </div>
                  </div>
                )}
              </div>
              
              {course.tags && course.tags.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm text-gray-400 mb-2 flex items-center">
                    <Tag className="w-4 h-4 mr-1" />
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {course.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/30 text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {isLoggedIn && !isEnrolled && (
                <>
                  {enrollmentError && (
                    <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                      {enrollmentError}
                    </div>
                  )}
                  
                  {enrollmentSuccess && (
                    <div className="mt-4 p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
                      Successfully enrolled in this course!
                    </div>
                  )}
                  
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className={`mt-6 w-full ${
                      enrolling 
                        ? 'bg-gray-600 cursor-not-allowed' 
                        : 'bg-teal-500 hover:bg-teal-600'
                    } text-white py-3 rounded-lg transition-colors font-medium`}
                  >
                    {enrolling ? 'Enrolling...' : 'Enroll Now'}
                  </button>
                </>
              )}
              
              {isLoggedIn && isEnrolled && (
                <div className="mt-6">
                  <div className="p-3 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-400 text-sm mb-4">
                    You are enrolled in this course
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mt-2 mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Your Progress</span>
                      <span className="text-white">
                        {Math.round(courseProgress)}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-teal-500"
                        style={{ width: `${courseProgress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => {
                        // Update progress when continuing learning
                        const courseProgress = JSON.parse(localStorage.getItem('courseProgress') || '{}');
                        const currentProgress = courseProgress[id] || { percentComplete: 0, completed: false };
                        
                        // If this is the first time, set to at least 5%
                        let newProgress = currentProgress.percentComplete || 0;
                        if (newProgress < 5) {
                          newProgress = 5;
                        }
                        
                        // Update progress using the function
                        updateProgress(newProgress);
                        
                        // For video courses, stay on this page; for theory courses, open the material
                        if (course.courseSegment === 'video') {
                          // For video course, just scroll to the video section
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        } else if (course.theoryUrl) {
                          // For theory course, open the external link in a new tab
                          window.open(course.theoryUrl, '_blank');
                        }
                      }}
                      className="flex-1 bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-lg transition-colors font-medium"
                    >
                      Continue Learning
                    </button>
                    <button
                      onClick={() => navigate('/userdashboard', { state: { activeTab: 'growth' } })}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg transition-colors font-medium"
                    >
                      Track Progress
                    </button>
                  </div>
                </div>
              )}
              
              {!isLoggedIn && (
                <div className="mt-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                  <p className="text-blue-400 text-sm">
                    Sign in to enroll in this course and track your progress.
                  </p>
                  <button
                    onClick={() => navigate('/login')}
                    className="mt-2 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition-colors"
                  >
                    Sign In
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseDetails; 