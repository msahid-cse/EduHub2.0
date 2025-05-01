import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  BookOpen,
  Users,
  Bell,
  Globe,
  Calendar,
  Clock,
  Mail,
  Home,
  User,
  LogOut,
  ChevronDown,
  Search,
  Menu,
  X,
  GraduationCap,
  Bookmark,
  FileText,
  ExternalLink,
  Phone,
  // GitHub,
  Code,
  AtSign,
  Upload,
  Save,
  Edit,
  ChevronRight,
  ChevronLeft,
  BarChart,
  TrendingUp,
  Activity,
  Award,
  Play
} from 'lucide-react';
import axios from 'axios';

// Import Chart.js components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  Filler
} from 'chart.js';
import { Bar, Pie, Radar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  Filler
);

const UserDashboard = () => {
  const location = useLocation();
  const [userInfo, setUserInfo] = useState(null);
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'courses');
  const [courses, setCourses] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [notices, setNotices] = useState([]);
  const [externalCourses, setExternalCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    department: '',
    university: '',
    github: '',
    codeforces: '',
    linkedin: '',
    twitter: '',
    skills: [],
    bio: '',
    profilePicture: null
  });
  const [skillInput, setSkillInput] = useState('');
  const [suggestedSkills, setSuggestedSkills] = useState([
    'JavaScript', 'React', 'Node.js', 'Python', 'Java', 'C++', 
    'Machine Learning', 'Data Science', 'Web Development', 'UI/UX Design',
    'Database Management', 'Cloud Computing', 'DevOps', 'Cybersecurity'
  ]);
  const [courseProgress, setCourseProgress] = useState({});
  const [learningStats, setLearningStats] = useState({
    totalHoursSpent: 0,
    coursesCompleted: 0,
    averageScore: 0,
    streakDays: 0,
    lastActiveDate: null,
    skillsGained: [],
    progressHistory: []
  });
  const [studySession, setStudySession] = useState({
    courseId: '',
    hoursSpent: 0,
    learningMode: 'video',
    notes: ''
  });
  const [weeklyGoals, setWeeklyGoals] = useState({
    studyHoursTarget: 0,
    coursesCompletedTarget: 0
  });
  const navigate = useNavigate();

  // Inside the useState declarations, add these new state variables
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    verificationCode: ''
  });
  const [verificationSent, setVerificationSent] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Add skill proficiency state
  const [skillProficiency, setSkillProficiency] = useState({
    skill: '',
    proficiency: 50
  });

  // Load user information and course data
  useEffect(() => {
    // Get user information from login data
    const userEmail = localStorage.getItem('userEmail');
    const userRole = localStorage.getItem('userRole');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    
    if (!isLoggedIn || !token) {
      navigate('/login');
      return;
    }

    // Fetch user profile from backend
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.data) {
          // Update the userInfo state
          setUserInfo({
            email: response.data.email,
            role: response.data.role,
            university: response.data.university,
            country: response.data.country,
            name: response.data.name,
            id: response.data._id
          });
          
          // Update profile data form
          setProfileData({
            fullName: response.data.name || '',
            email: response.data.email || '',
            phoneNumber: response.data.phoneNumber || '',
            department: response.data.department || '',
            university: response.data.university || '',
            bio: response.data.bio || '',
            skills: response.data.skills || [],
            skillsMap: response.data.skillsMap || {},
            github: response.data.github || '',
            codeforces: response.data.codeforces || '',
            linkedin: response.data.linkedin || '',
            twitter: response.data.twitter || '',
            profilePicture: response.data.profilePicture || null
          });
          
          // Update localStorage for backwards compatibility
          localStorage.setItem('userName', response.data.name);
          localStorage.setItem('userUniversity', response.data.university);
          localStorage.setItem('userDepartment', response.data.department);
          localStorage.setItem('userCountry', response.data.country);
          localStorage.setItem('userPhone', response.data.phoneNumber || '');
          localStorage.setItem('userBio', response.data.bio || '');
          localStorage.setItem('userSkills', JSON.stringify(response.data.skills || []));
          
          console.log('Profile data loaded from server');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        
        // Fall back to localStorage values if API call fails
        const userUniversity = localStorage.getItem('userUniversity') || 'University of Technology';
        const userCountry = localStorage.getItem('userCountry') || 'United States';
        const userName = localStorage.getItem('userName') || 'John Doe';
        const userBio = localStorage.getItem('userBio') || '';
        const userDepartment = localStorage.getItem('userDepartment') || '';
        const userPhone = localStorage.getItem('userPhone') || '';
        const userSkills = JSON.parse(localStorage.getItem('userSkills') || '[]');

        setUserInfo({
          email: userEmail,
          role: userRole,
          university: userUniversity,
          country: userCountry,
          name: userName,
          id: userId
        });

        // Initialize profile data
        setProfileData(prevData => ({
          ...prevData,
          fullName: userName,
          email: userEmail,
          university: userUniversity,
          bio: userBio,
          department: userDepartment,
          phoneNumber: userPhone,
          skills: userSkills
        }));
      }
    };
    
    // Execute all data fetching functions
    fetchUserProfile();
    fetchEnrolledCourses(token);
    fetchLearningStats(token);
    loadMockDataExceptCourses(localStorage.getItem('userUniversity') || 'University of Technology');
  }, [navigate]);

  // Function to fetch enrolled courses
  const fetchEnrolledCourses = async (token) => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/users/enrolled-courses', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Check if response has data and is an array
      if (response.data && Array.isArray(response.data)) {
        // Get progress data from localStorage
        const courseProgress = JSON.parse(localStorage.getItem('courseProgress') || '{}');
        const enrolledCourses = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
        
        // Merge API data with localStorage progress data
        const coursesWithUpdatedProgress = response.data.map(course => {
          // If we have progress data in localStorage, use it
          if (courseProgress[course._id]) {
            return {
              ...course,
              progress: courseProgress[course._id]
            };
          }
          return course;
        });
        
        // If we have courses in localStorage that aren't in the API response, add them
        const enrolledCourseIds = response.data.map(course => course._id);
        const localOnlyCourseIds = enrolledCourses.filter(id => !enrolledCourseIds.includes(id));
        
        if (localOnlyCourseIds.length > 0) {
          console.log('Found locally enrolled courses not in API response:', localOnlyCourseIds);
          // For each locally enrolled course, try to fetch its details
          for (const courseId of localOnlyCourseIds) {
            try {
              const courseResponse = await axios.get(`http://localhost:5000/api/courses/${courseId}`);
              if (courseResponse.data) {
                // Add progress data if available
                const courseWithProgress = {
                  ...courseResponse.data,
                  progress: courseProgress[courseId] || {
                    percentComplete: 0,
                    completed: false,
                    lastAccessed: new Date().toISOString()
                  }
                };
                coursesWithUpdatedProgress.push(courseWithProgress);
              }
            } catch (err) {
              console.error(`Error fetching details for course ${courseId}:`, err);
            }
          }
        }
        
        setCourses(coursesWithUpdatedProgress);
      } else {
        console.error('Invalid response format:', response.data);
        setCourses([]);
      }
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
      
      // Fall back to locally stored enrolled courses
      const enrolledCourses = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
      const courseProgress = JSON.parse(localStorage.getItem('courseProgress') || '{}');
      
      if (enrolledCourses.length > 0) {
        console.log('Using locally stored enrolled courses');
        const mockCourses = [];
        
        // For each enrolled course ID, create a mock course object
        enrolledCourses.forEach((courseId, index) => {
          mockCourses.push({
            _id: courseId,
            title: `Enrolled Course ${index + 1}`,
            courseType: 'academic',
            courseSegment: index % 2 === 0 ? 'video' : 'theory',
            department: 'CSE',
            instructor: 'Unknown',
            description: 'Course information unavailable while offline',
            duration: 'Unknown',
            skillLevel: 'beginner',
            thumbnail: 'https://via.placeholder.com/640x360.png?text=Course',
            progress: courseProgress[courseId] || {
              percentComplete: 0,
              completed: false,
              lastAccessed: new Date()
            }
          });
        });
        
        setCourses(mockCourses);
      } else {
        // Fall back to mock data if no locally stored enrolled courses
        setCourses([
          { 
            _id: 'mock1',
            title: 'Introduction to Computer Science',
            courseType: 'academic',
            courseSegment: 'video',
            department: 'CSE',
            instructor: 'Dr. Smith',
            description: 'Fundamentals of programming and computer science principles',
            duration: '12 weeks',
            skillLevel: 'beginner',
            thumbnail: 'https://via.placeholder.com/640x360.png?text=CS+Course',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            progress: {
              percentComplete: 25,
              completed: false,
              lastAccessed: new Date()
            }
          },
          { 
            _id: 'mock2',
            title: 'Advanced Mathematics',
            courseType: 'academic',
            courseSegment: 'theory',
            department: 'Mathematics',
            instructor: 'Dr. Johnson',
            description: 'Advanced topics in calculus and linear algebra',
            duration: '10 weeks',
            skillLevel: 'advanced',
            thumbnail: 'https://via.placeholder.com/640x360.png?text=Math+Course',
            theoryUrl: 'https://example.com/math-pdf.pdf',
            progress: {
              percentComplete: 50,
              completed: false,
              lastAccessed: new Date()
            }
          }
        ]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Function to update course progress
  const updateCourseProgress = async (courseId, progressData) => {
    try {
      const token = localStorage.getItem('token');
      
      // Update progress in localStorage first
      const courseProgress = JSON.parse(localStorage.getItem('courseProgress') || '{}');
      courseProgress[courseId] = {
        ...(courseProgress[courseId] || {}),
        ...progressData,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem('courseProgress', JSON.stringify(courseProgress));
      
      // Update the course in the local state
      setCourses(prevCourses => 
        prevCourses.map(course => 
          course._id === courseId 
            ? { 
                ...course, 
                progress: { 
                  ...course.progress, 
                  ...progressData,
                  lastUpdated: new Date()
                } 
              } 
            : course
        )
      );
      
      // Then attempt to update on the server
      const response = await axios.post(
        `http://localhost:5000/api/users/courses/${courseId}/progress`,
        progressData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error updating course progress:', error);
      // Even if the API call fails, we've already updated localStorage and state
      // so from the user's perspective, it still worked
      return {
        success: true,
        message: 'Progress saved locally',
        offline: true
      };
    }
  };

  // Function to view a course
  const handleViewCourse = (courseId) => {
    // Update the lastAccessed timestamp when viewing a course
    const now = new Date();
    
    // Get current progress
    const courseProgress = JSON.parse(localStorage.getItem('courseProgress') || '{}');
    const currentProgress = courseProgress[courseId] || { percentComplete: 0, completed: false };
    
    // If there was no previous progress or it was very low, set it to at least 5%
    // This simulates that the user has at least started the course
    if (!currentProgress.percentComplete || currentProgress.percentComplete < 5) {
      currentProgress.percentComplete = 5;
    }
    
    // Try to update progress on the server
    updateCourseProgress(courseId, { 
      lastAccessed: now,
      percentComplete: currentProgress.percentComplete
    })
      .catch(err => console.error('Failed to update last accessed time:', err));
      
    // Navigate to the course details page
    navigate(`/course/${courseId}`);
  };

  // Function to fetch learning stats
  const fetchLearningStats = async (token) => {
    try {
      // Show loading state
      setIsLoading(true);
      
      const response = await axios.get('http://localhost:5000/api/users/learning-stats', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data) {
        console.log('Learning stats received:', response.data);
        setLearningStats(response.data);
      }
    } catch (error) {
      console.error('Error fetching learning stats:', error);
      
      // We'll attempt to use locally stored progress data to generate stats
      // if the backend call fails
      try {
        const courseProgress = JSON.parse(localStorage.getItem('courseProgress') || '{}');
        const enrolledCourses = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
        
        // Calculate total completed courses
        const completedCourses = Object.values(courseProgress).filter(
          progress => progress.completed || progress.percentComplete >= 100
        ).length;
        
        // Calculate average progress percentage
        const progressValues = Object.values(courseProgress).map(p => p.percentComplete || 0);
        const averageScore = progressValues.length > 0 
          ? Math.round(progressValues.reduce((sum, val) => sum + val, 0) / progressValues.length) 
          : 0;
        
        // Generate rich data for charts
        setLearningStats({
          totalHoursSpent: 24,
          coursesCompleted: completedCourses || 2,
          averageScore: averageScore || 85,
          streakDays: 5,
          lastActiveDate: new Date().toISOString(),
          skillsGained: ['JavaScript', 'React', 'Node.js', 'UI/UX', 'Data Science'],
          progressHistory: [
            { date: '2023-06-01', hoursSpent: 1.5 },
            { date: '2023-06-02', hoursSpent: 2.0 },
            { date: '2023-06-03', hoursSpent: 1.0 },
            { date: '2023-06-04', hoursSpent: 2.5 },
            { date: '2023-06-05', hoursSpent: 3.0 },
            { date: '2023-06-06', hoursSpent: 1.8 },
            { date: '2023-06-07', hoursSpent: 2.2 }
          ],
          courseDistribution: {
            academic: 60,
            coCurricular: 40,
            video: 70,
            theory: 30
          },
          weeklyGoals: {
            studyHours: {
              target: 10,
              achieved: 6
            },
            coursesCompleted: {
              target: 2,
              achieved: completedCourses || 1
            }
          }
        });
      } catch (localStorageError) {
        console.error('Error creating stats from localStorage:', localStorageError);
        setLearningStats({
          totalHoursSpent: 0,
          coursesCompleted: 0,
          averageScore: 0,
          streakDays: 0,
          lastActiveDate: new Date().toISOString(),
          skillsGained: [],
          progressHistory: [],
          courseDistribution: {
            academic: 50,
            coCurricular: 50,
            video: 50,
            theory: 50
          },
          weeklyGoals: {
            studyHours: {
              target: 10,
              achieved: 0
            },
            coursesCompleted: {
              target: 1,
              achieved: 0
            }
          }
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Load mock data for everything except courses
  const loadMockDataExceptCourses = (university) => {
    setIsLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Mock faculty data
      setFaculty([
        { 
          id: 1, 
          name: 'Dr. Smith', 
          title: 'Professor of Computer Science',
          department: 'Computer Science', 
          email: 'smith@university.edu', 
          office: 'CS Building 205',
          phone: '+1 (555) 123-4567',
          officeHours: 'Mon/Wed 1:00-3:00 PM'
        },
        { 
          id: 2, 
          name: 'Dr. Johnson', 
          title: 'Associate Professor of Mathematics',
          department: 'Mathematics', 
          email: 'johnson@university.edu', 
          office: 'Math Building 101',
          phone: '+1 (555) 234-5678',
          officeHours: 'Tue/Thu 10:00-12:00 PM'
        },
        { 
          id: 3, 
          name: 'Prof. Williams', 
          title: 'Lecturer in English',
          department: 'English', 
          email: 'williams@university.edu', 
          office: 'Arts Building 304',
          phone: '+1 (555) 345-6789',
          officeHours: 'By appointment'
        },
        { 
          id: 4, 
          name: 'Dr. Brown', 
          title: 'Professor of Physics',
          department: 'Physics', 
          email: 'brown@university.edu', 
          office: 'Science Building 412',
          phone: '+1 (555) 456-7890',
          officeHours: 'Mon/Wed/Fri 10:00-11:00 AM'
        }
      ]);

      // Mock notices
      setNotices([
        { 
          id: 1, 
          title: 'Registration Deadline', 
          date: '2023-11-15', 
          content: 'Last day to register for spring semester courses is November 15th. Late registration will incur additional fees.',
          category: 'Academic',
          priority: 'High'
        },
        { 
          id: 2, 
          title: 'Library Maintenance', 
          date: '2023-11-20', 
          content: 'Main library will be closed for maintenance from November 20th to November 24th. Online resources will remain available.',
          category: 'Facilities',
          priority: 'Medium'
        },
        { 
          id: 3, 
          title: 'Career Fair', 
          date: '2023-11-25', 
          content: 'Annual career fair happening in the student center from 9 AM to 4 PM. Over 50 companies will be recruiting.',
          category: 'Career',
          priority: 'High'
        },
        { 
          id: 4, 
          title: 'Scholarship Applications', 
          date: '2023-12-01', 
          content: 'Applications for spring semester scholarships are now open. Deadline is December 1st.',
          category: 'Financial',
          priority: 'Medium'
        }
      ]);

      // Mock external courses
      setExternalCourses([
        { 
          id: 1, 
          name: 'Machine Learning Specialization', 
          platform: 'Coursera', 
          university: 'Stanford', 
          link: '#',
          duration: '4 months',
          level: 'Intermediate',
          rating: 4.8
        },
        { 
          id: 2, 
          name: 'Data Science Fundamentals', 
          platform: 'edX', 
          university: 'Harvard', 
          link: '#',
          duration: '12 weeks',
          level: 'Beginner',
          rating: 4.5
        },
        { 
          id: 3, 
          name: 'Web Development Bootcamp', 
          platform: 'Udemy', 
          university: 'Various', 
          link: '#',
          duration: '6 months',
          level: 'Beginner to Advanced',
          rating: 4.7
        },
        { 
          id: 4, 
          name: 'Artificial Intelligence for Everyone', 
          platform: 'Coursera', 
          university: 'DeepLearning.AI', 
          link: '#',
          duration: '6 weeks',
          level: 'Beginner',
          rating: 4.6
        }
      ]);

      setIsLoading(false);
    }, 1500);
  };

  const handleLogout = () => {
    // Clear all user data
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userUniversity');
    localStorage.removeItem('userCountry');
    
    navigate('/');
  };

  const filteredCourses = courses.filter(course => {
    const query = searchQuery.toLowerCase();
    // Check both naming conventions for course properties
    return (
      ((course.name?.toLowerCase() || course.title?.toLowerCase() || '')).includes(query) ||
      ((course.code?.toLowerCase() || course.courseCode?.toLowerCase() || '')).includes(query) ||
      ((course.professor?.toLowerCase() || course.instructor?.toLowerCase() || '')).includes(query)
    );
  });

  const filteredFaculty = faculty.filter(member => 
    (member.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (member.department?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  const filteredNotices = notices.filter(notice => 
    (notice.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (notice.content?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  const filteredExternalCourses = externalCourses.filter(course => 
    (course.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (course.university?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  // Function to handle adding a skill
  const handleAddSkill = (skill) => {
    if (skill && !profileData.skills.includes(skill)) {
      setProfileData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
      setSkillInput('');
    }
  };

  // Function to handle removing a skill
  const handleRemoveSkill = (skillToRemove) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  // Function to handle profile image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size - limit to 1MB
      if (file.size > 1024 * 1024) {
        alert('Image size should be less than 1MB');
        return;
      }
      
      // Check file type
      if (!file.type.match('image.*')) {
        alert('Please select an image file');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        // Store image as base64 string
        setProfileData(prev => ({
          ...prev,
          profilePicture: reader.result
        }));
        
        console.log('Image loaded successfully');
      };
      
      reader.onerror = () => {
        console.error('Error reading file');
        alert('Error reading file. Please try again.');
      };
      
      reader.readAsDataURL(file);
    }
  };

  // Function to save profile data
  const handleSaveProfile = async () => {
    try {
      // Show loading state
      const saveBtn = document.getElementById('saveProfileBtn');
      if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.innerHTML = '<span class="animate-spin mr-2">⟳</span> Saving...';
      }
      
      // Get token for authentication
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      // Prepare the profile data for submission to backend
      const profileDataToSubmit = {
        name: profileData.fullName,
        phoneNumber: profileData.phoneNumber,
        department: profileData.department,
        university: profileData.university,
        bio: profileData.bio,
        skills: profileData.skills,
        skillsMap: profileData.skillsMap || {},
        github: profileData.github,
        codeforces: profileData.codeforces,
        linkedin: profileData.linkedin,
        twitter: profileData.twitter
      };
      
      // Handle profile picture separately (potentially large)
      if (profileData.profilePicture) {
        // If the profile picture is a new upload (starts with data:image)
        if (profileData.profilePicture.startsWith('data:image')) {
          // Check if the base64 string is too large (>1MB after encoding)
          const base64Length = profileData.profilePicture.length;
          const fileSizeInBytes = (base64Length * 3) / 4 - (profileData.profilePicture.endsWith('==') ? 2 : 1);
          const fileSizeInMB = fileSizeInBytes / (1024 * 1024);
          
          console.log(`Image size: ${fileSizeInMB.toFixed(2)}MB`);
          
          if (fileSizeInMB > 1) {
            // Compress the image before sending if it's too large
            alert('Compressing image for better upload performance...');
            
            // Create an image element to draw on canvas for compression
            const img = new Image();
            img.src = profileData.profilePicture;
            
            await new Promise((resolve, reject) => {
              img.onload = () => {
                // Create a canvas and get its context
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // Calculate new dimensions (maintain aspect ratio)
                let width = img.width;
                let height = img.height;
                const maxSize = 800; // Max dimension in pixels
                
                if (width > height && width > maxSize) {
                  height = (height / width) * maxSize;
                  width = maxSize;
                } else if (height > maxSize) {
                  width = (width / height) * maxSize;
                  height = maxSize;
                }
                
                // Set canvas dimensions and draw the resized image
                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);
                
                // Get the compressed image as base64
                const compressedImage = canvas.toDataURL('image/jpeg', 0.7); // Adjust quality (0.7 = 70%)
                profileDataToSubmit.profilePicture = compressedImage;
                
                console.log('Image compressed successfully');
                resolve();
              };
              
              img.onerror = reject;
            });
          } else {
            // Image is small enough, use as is
            profileDataToSubmit.profilePicture = profileData.profilePicture;
          }
        } else {
          // Not a new upload, just use the existing URL
          profileDataToSubmit.profilePicture = profileData.profilePicture;
        }
      }
      
      console.log('Submitting profile data to server...');
      
      // Send data to backend with timeout and increased max content length
      const response = await axios.put(
        'http://localhost:5000/api/users/profile',
        profileDataToSubmit,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          timeout: 30000, // 30 seconds timeout
          maxContentLength: 5 * 1024 * 1024 // 5MB max content length
        }
      );
      
      if (response.data) {
        console.log('Profile updated successfully with response:', response.data);
        
        // Update local storage with basic profile data for UI consistency
        localStorage.setItem('userName', profileData.fullName);
        localStorage.setItem('userUniversity', profileData.university);
        localStorage.setItem('userDepartment', profileData.department);
        localStorage.setItem('userPhone', profileData.phoneNumber);
        localStorage.setItem('userBio', profileData.bio);
        localStorage.setItem('userSkills', JSON.stringify(profileData.skills));
        
        // Update the userInfo state
        setUserInfo(prev => ({
          ...prev,
          name: profileData.fullName,
          university: profileData.university,
          email: profileData.email
        }));
        
        // Update the profile data with the response from the server
        setProfileData(prevData => ({
          ...prevData,
          ...response.data,
          fullName: response.data.name || prevData.fullName,
          profilePicture: response.data.profilePicture || prevData.profilePicture,
          skills: response.data.skills || prevData.skills,
          skillsMap: response.data.skillsMap || prevData.skillsMap
        }));
        
        // Success message
        alert('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      
      let errorMessage = 'Failed to update profile';
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        errorMessage += `: ${error.response.data?.message || error.response.statusText}`;
        console.error('Error response data:', error.response.data);
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage += ': Network error. Please check your internet connection.';
        console.error('No response received:', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        errorMessage += `: ${error.message}`;
      }
      
      alert(errorMessage);
    } finally {
      // Reset button state
      const saveBtn = document.getElementById('saveProfileBtn');
      if (saveBtn) {
        saveBtn.disabled = false;
        saveBtn.innerHTML = '<svg class="mr-2 w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H14L21 10V19C21 20.1046 20.1046 21 19 21Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M17 21V13H7V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 3V8H14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg> Save Profile';
      }
    }
  };

  // Function to handle password data change
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear previous errors when typing
    setPasswordError('');
  };
  
  // Function to request verification code
  const handleRequestVerificationCode = async () => {
    try {
      setIsLoading(true);
      setPasswordError(''); // Clear any existing errors
      
      // Validate email is present
      if (!profileData.email) {
        setPasswordError('Email is required to request verification code.');
        setIsLoading(false);
        return;
      }
      
      // Request verification code from the backend
      const response = await axios.post(
        'http://localhost:5000/api/users/request-verification',
        { email: profileData.email },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      if (response.data) {
        setVerificationSent(true);
        
        // Handle development test code
        if (response.data.code) {
          setPasswordSuccess(`For development: Your verification code is: ${response.data.code}. In production, this would be sent to your email.`);
          // Auto-fill the verification code for testing
          setPasswordData(prev => ({
            ...prev,
            verificationCode: response.data.code
          }));
        } else {
          // Regular flow - verification code sent to email
          setPasswordSuccess(`Verification code sent to ${profileData.email}. Please check your inbox and spam folder.`);
          
          // If we have a preview URL for the test email, provide a link
          if (response.data.previewUrl) {
            console.log('Email preview URL:', response.data.previewUrl);
            // You can open this URL in a new window for testing
            window.open(response.data.previewUrl, '_blank');
          }
        }
        
        // Clear success message after a few seconds
        setTimeout(() => {
          setPasswordSuccess('');
        }, 10000);
      }
    } catch (error) {
      console.error('Error requesting verification code:', error);
      
      // Improved error handling
      if (error.response) {
        setPasswordError(error.response.data?.message || 'Failed to request verification code.');
      } else if (error.request) {
        setPasswordError('No response from server. Please check your connection.');
      } else {
        setPasswordError('Failed to request verification code. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to change password
  const handleChangePassword = async () => {
    try {
      setIsLoading(true);
      setPasswordError('');
      
      // Validate all fields
      if (!passwordData.currentPassword) {
        setPasswordError('Current password is required.');
        setIsLoading(false);
        return;
      }
      
      if (!passwordData.newPassword) {
        setPasswordError('New password is required.');
        setIsLoading(false);
        return;
      }
      
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setPasswordError('New password and confirm password do not match.');
        setIsLoading(false);
        return;
      }
      
      if (!passwordData.verificationCode) {
        setPasswordError('Verification code is required.');
        setIsLoading(false);
        return;
      }
      
      // Request password change from the backend
      const response = await axios.post(
        'http://localhost:5000/api/users/change-password',
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
          verificationCode: passwordData.verificationCode
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      if (response.data) {
        // Reset form
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
          verificationCode: ''
        });
        
        setVerificationSent(false);
        setPasswordSuccess('Password changed successfully! You will be logged out in a moment...');
        
        // Log out and redirect after a short delay
        setTimeout(() => {
          handleLogout();
        }, 2000);
      }
    } catch (error) {
      console.error('Error changing password:', error);
      // Improved error handling with more specific error messages
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setPasswordError(error.response.data?.message || 'Server error. Please try again.');
      } else if (error.request) {
        // The request was made but no response was received
        setPasswordError('No response from server. Please check your connection and try again.');
      } else {
        // Something happened in setting up the request that triggered an Error
        setPasswordError('An error occurred. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to handle skill proficiency change
  const handleSkillProficiencyChange = (e) => {
    const { name, value } = e.target;
    setSkillProficiency(prev => ({
      ...prev,
      [name]: name === 'proficiency' ? parseInt(value, 10) : value
    }));
  };
  
  // Function to add skill with proficiency
  const handleAddSkillWithProficiency = () => {
    if (!skillProficiency.skill || skillProficiency.skill.trim() === '') {
      alert('Please enter a skill name');
      return;
    }
    
    // Clean up the skill name
    const cleanSkill = skillProficiency.skill.trim();
    
    // Check if skill already exists
    if (profileData.skills.includes(cleanSkill)) {
      // If skill exists, just update its proficiency
      console.log(`Updating proficiency for existing skill: ${cleanSkill}`);
      
      setProfileData(prev => ({
        ...prev,
        skillsMap: {
          ...(prev.skillsMap || {}),
          [cleanSkill]: {
            proficiency: skillProficiency.proficiency,
            lastUpdated: new Date().toISOString()
          }
        }
      }));
      
      // Reset skill input but keep the current skill selected
      setSkillProficiency(prev => ({
        ...prev,
        skill: cleanSkill
      }));
      
      // Show feedback
      alert(`Updated proficiency for ${cleanSkill}`);
    } else {
      // Add new skill with proficiency
      console.log(`Adding new skill with proficiency: ${cleanSkill} (${skillProficiency.proficiency}%)`);
      
      setProfileData(prev => ({
        ...prev,
        skills: [...prev.skills, cleanSkill],
        // Create or update skillsMap with the new skill and its proficiency
        skillsMap: {
          ...(prev.skillsMap || {}),
          [cleanSkill]: {
            proficiency: skillProficiency.proficiency,
            lastUpdated: new Date().toISOString()
          }
        }
      }));
      
      // Reset skill input
      setSkillProficiency({
        skill: '',
        proficiency: 50
      });
    }
  };
  
  // Function to update skill proficiency
  const updateSkillProficiency = (skill, newProficiency) => {
    console.log(`Updating proficiency for ${skill} to ${newProficiency}%`);
    
    setProfileData(prev => ({
      ...prev,
      skillsMap: {
        ...(prev.skillsMap || {}),
        [skill]: {
          proficiency: newProficiency,
          lastUpdated: new Date().toISOString()
        }
      }
    }));
  };
  
  // Function to get proficiency for a skill
  const getSkillProficiency = (skill) => {
    return profileData.skillsMap?.[skill]?.proficiency || 0;
  };

  const handleStudySessionChange = (e) => {
    const { name, value } = e.target;
    setStudySession(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogStudySession = async () => {
    try {
      // Show loading state
      const saveBtn = document.getElementById('logStudySessionBtn');
      if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.innerHTML = '<span class="animate-spin mr-2">⟳</span> Logging...';
      }
      
      // Log the study session
      const response = await updateCourseProgress(studySession.courseId, {
        lastAccessed: new Date().toISOString(),
        percentComplete: 0
      });
      
      if (response.success) {
        // Update learning stats
        setLearningStats(prevStats => ({
          ...prevStats,
          totalHoursSpent: prevStats.totalHoursSpent + studySession.hoursSpent,
          skillsGained: [...prevStats.skillsGained, studySession.learningMode],
          progressHistory: [...prevStats.progressHistory, { date: new Date().toISOString(), hoursSpent: studySession.hoursSpent }]
        }));
        
        // Reset study session
        setStudySession({
          courseId: '',
          hoursSpent: 0,
          learningMode: 'video',
          notes: ''
        });
        
        // Show success message
        alert('Study session logged successfully!');
      } else {
        alert(response.message);
      }
    } catch (error) {
      console.error('Error logging study session:', error);
      alert('Failed to log study session. Please try again.');
    } finally {
      // Reset button state
      const saveBtn = document.getElementById('logStudySessionBtn');
      if (saveBtn) {
        saveBtn.disabled = false;
        saveBtn.innerHTML = 'Log Study Session';
      }
    }
  };

  const handleWeeklyGoalsChange = (e) => {
    const { name, value } = e.target;
    setWeeklyGoals(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateWeeklyGoals = async () => {
    try {
      // Show loading state
      const saveBtn = document.getElementById('updateWeeklyGoalsBtn');
      if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.innerHTML = '<span class="animate-spin mr-2">⟳</span> Updating...';
      }
      
      // Update weekly goals
      const response = await axios.post(
        'http://localhost:5000/api/users/update-weekly-goals',
        weeklyGoals,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      if (response.data.success) {
        // Show success message
        alert('Weekly goals updated successfully!');
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Error updating weekly goals:', error);
      alert('Failed to update weekly goals. Please try again.');
    } finally {
      // Reset button state
      const saveBtn = document.getElementById('updateWeeklyGoalsBtn');
      if (saveBtn) {
        saveBtn.disabled = false;
        saveBtn.innerHTML = 'Update Goals';
      }
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
          <span className="ml-4 text-gray-400">Loading dashboard data...</span>
        </div>
      );
    }

    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h2 className="text-2xl font-bold text-white">Your Profile</h2>
              <span className="text-gray-400">Update your personal information and settings</span>
            </div>
            
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Profile Picture Section */}
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-48 h-48 rounded-full bg-gray-700 overflow-hidden relative group">
                    {profileData.profilePicture ? (
                      <img 
                        src={profileData.profilePicture} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User size={64} className="text-gray-400" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <label className="cursor-pointer flex flex-col items-center text-white">
                        <Upload size={24} />
                        <span className="text-sm mt-2">Upload Photo</span>
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </label>
                    </div>
                  </div>
                  <h3 className="text-xl font-medium text-white">{profileData.fullName || userInfo?.name}</h3>
                  <p className="text-gray-400">Student at {profileData.university || userInfo?.university}</p>
                </div>
                
                {/* Profile Info Form */}
                <div className="md:col-span-2 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-400 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={profileData.fullName}
                        onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 mb-1">Email</label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 mb-1">Phone Number</label>
                      <div className="relative">
                        <Phone size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="tel"
                          value={profileData.phoneNumber}
                          onChange={(e) => setProfileData({...profileData, phoneNumber: e.target.value})}
                          className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-400 mb-1">Department</label>
                      <input
                        type="text"
                        value={profileData.department}
                        onChange={(e) => setProfileData({...profileData, department: e.target.value})}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        placeholder="Computer Science"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 mb-1">University</label>
                      <input
                        type="text"
                        value={profileData.university}
                        onChange={(e) => setProfileData({...profileData, university: e.target.value})}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4 mt-6">
                    <h3 className="text-lg font-medium text-white border-b border-gray-700 pb-2">Social Profiles & Coding Platforms</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="relative">
                        <Phone size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          value={profileData.github}
                          onChange={(e) => setProfileData({...profileData, github: e.target.value})}
                          className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                          placeholder="GitHub Username"
                        />
                      </div>
                      <div className="relative">
                        <Code size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          value={profileData.codeforces}
                          onChange={(e) => setProfileData({...profileData, codeforces: e.target.value})}
                          className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                          placeholder="Codeforces Handle"
                        />
                      </div>
                      <div className="relative">
                        <AtSign size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          value={profileData.linkedin}
                          onChange={(e) => setProfileData({...profileData, linkedin: e.target.value})}
                          className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                          placeholder="LinkedIn Username"
                        />
                      </div>
                      <div className="relative">
                        <AtSign size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          value={profileData.twitter}
                          onChange={(e) => setProfileData({...profileData, twitter: e.target.value})}
                          className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                          placeholder="Twitter Handle"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4 mt-6">
                    <h3 className="text-lg font-medium text-white border-b border-gray-700 pb-2">Skills</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {profileData.skills.map((skill, index) => (
                        <span 
                          key={index} 
                          className="bg-cyan-900/30 text-cyan-400 px-3 py-1 rounded-full text-sm flex items-center"
                        >
                          {skill}
                          <span className="mx-1 text-gray-500">|</span>
                          <span className="text-xs text-green-400">
                            {profileData.skillsMap?.[skill] || 50}%
                          </span>
                          <button 
                            onClick={() => handleRemoveSkill(skill)} 
                            className="ml-2 text-cyan-400 hover:text-cyan-300"
                          >
                            <X size={14} />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="relative">
                        <input
                          type="text"
                          value={skillProficiency.skill}
                          name="skill"
                          onChange={handleSkillProficiencyChange}
                          className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                          placeholder="Add a skill (e.g., JavaScript, Python, Design)"
                        />
                        {skillProficiency.skill && (
                          <div className="absolute top-full mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10 max-h-40 overflow-y-auto">
                            {suggestedSkills
                              .filter(skill => skill.toLowerCase().includes(skillProficiency.skill.toLowerCase()))
                              .map((skill, index) => (
                                <div 
                                  key={index}
                                  className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                                  onClick={() => setSkillProficiency(prev => ({ ...prev, skill }))}
                                >
                                  {skill}
                                </div>
                              ))
                            }
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-2">
                        <label className="text-sm text-gray-400 block mb-1">Proficiency Level: {skillProficiency.proficiency}%</label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="5"
                          name="proficiency"
                          value={skillProficiency.proficiency}
                          onChange={handleSkillProficiencyChange}
                          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>Beginner</span>
                          <span>Intermediate</span>
                          <span>Expert</span>
                        </div>
                      </div>
                      
                      <button 
                        onClick={handleAddSkillWithProficiency}
                        className="px-4 py-2 mt-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg text-white self-start"
                      >
                        Add Skill
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-4 mt-6">
                    <h3 className="text-lg font-medium text-white border-b border-gray-700 pb-2">About Me</h3>
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 h-32"
                      placeholder="Write a short bio about yourself..."
                    ></textarea>
                  </div>

                  <div className="space-y-4 mt-6">
                    <h3 className="text-lg font-medium text-white border-b border-gray-700 pb-2">Security Settings</h3>
                    <div className="flex items-center justify-between p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
                      <div>
                        <h4 className="text-white font-medium">Change Password</h4>
                        <p className="text-gray-400 text-sm mt-1">Update your password to keep your account secure</p>
                      </div>
                      <button 
                        onClick={() => setShowPasswordModal(true)}
                        className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg text-white text-sm flex items-center"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Change Password
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-6">
                    <button 
                      id="saveProfileBtn"
                      onClick={handleSaveProfile}
                      className="flex items-center px-6 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg text-white font-medium transition-colors"
                    >
                      <Save size={18} className="mr-2" />
                      Save Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'courses':
        return (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h2 className="text-2xl font-bold text-white">Your Enrolled Courses</h2>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            {filteredCourses.length === 0 ? (
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8 text-center">
                <BookOpen className="mx-auto w-12 h-12 text-gray-500 mb-4" />
                <h3 className="text-xl font-medium text-gray-300">No courses found</h3>
                <p className="text-gray-500 mt-2">
                  {searchQuery ? 'Try a different search term' : 'You have not enrolled in any courses yet'}
                </p>
                <button 
                  onClick={() => navigate('/courses')}
                  className="mt-6 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-md text-white text-sm font-medium transition-colors"
                >
                  Browse Available Courses
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredCourses.map(course => (
                  <div key={course._id} className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden group">
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={course.thumbnail || 'https://via.placeholder.com/640x360.png?text=Course+Image'}
                        alt={course.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-70"></div>
                      
                      {/* Course progress indicator */}
                      <div className="absolute bottom-0 left-0 right-0">
                        <div className="bg-gray-900/80 px-3 py-2 flex items-center justify-between">
                          <span className="text-sm text-white">
                            {course.progress?.percentComplete || 0}% Complete
                          </span>
                          <span className="text-xs text-gray-400">
                            Last accessed: {course.progress?.lastAccessed 
                              ? new Date(course.progress.lastAccessed).toLocaleDateString() 
                              : 'Never'}
                          </span>
                        </div>
                        <div className="h-1 w-full bg-gray-700">
                          <div 
                            className="h-1 bg-cyan-500" 
                            style={{ width: `${course.progress?.percentComplete || 0}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      {/* Course type badges */}
                      <div className="absolute top-2 left-2 flex gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          course.courseType === 'academic' 
                            ? 'bg-blue-900/80 text-blue-300' 
                            : 'bg-green-900/80 text-green-300'
                        }`}>
                          {course.courseType === 'academic' ? 'Academic' : 'Co-Curricular'}
                        </span>
                        
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          course.courseSegment === 'video' 
                            ? 'bg-purple-900/80 text-purple-300' 
                            : 'bg-amber-900/80 text-amber-300'
                        }`}>
                          {course.courseSegment === 'video' ? 'Video' : 'Theory'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-5">
                      <h3 className="text-xl font-semibold text-cyan-400 group-hover:text-cyan-300 transition-colors">
                        {course.title}
                      </h3>
                      
                      <div className="flex items-center mt-2 text-gray-300">
                        <GraduationCap className="inline mr-2 w-4 h-4" /> {course.instructor}
                      </div>
                      
                      <p className="text-gray-400 mt-3 line-clamp-2">{course.description}</p>
                      
                      <div className="mt-4 flex space-x-3">
                        <button 
                          onClick={() => handleViewCourse(course._id)}
                          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-md text-sm font-medium transition-colors flex-grow flex items-center justify-center"
                        >
                          {course.progress?.percentComplete > 0 ? (
                            <>
                              <Play className="w-4 h-4 mr-1" /> Continue Learning
                            </>
                          ) : (
                            <>
                              {course.courseSegment === 'video' ? 'Watch Course' : 'View Materials'}
                            </>
                          )}
                        </button>
                        {course.progress?.percentComplete === 100 && (
                          <span className="px-3 py-1 bg-green-900/30 text-green-400 rounded-md text-sm flex items-center">
                            Completed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      
      case 'faculty':
        return (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h2 className="text-2xl font-bold text-white">Faculty Members</h2>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search faculty..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            {filteredFaculty.length === 0 ? (
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8 text-center">
                <Users className="mx-auto w-12 h-12 text-gray-500 mb-4" />
                <h3 className="text-xl font-medium text-gray-300">No faculty members found</h3>
                <p className="text-gray-500 mt-2">
                  {searchQuery ? 'Try a different search term' : 'No faculty information available'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredFaculty.map(member => (
                  <div key={member.id} className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 hover:bg-gray-800 transition-colors group">
                    <div className="flex items-start space-x-4">
                      <div className="bg-cyan-900/30 text-cyan-400 rounded-full w-12 h-12 flex items-center justify-center">
                        <User className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-cyan-400 group-hover:text-cyan-300 transition-colors">
                          {member.name}
                        </h3>
                        <p className="text-gray-300">{member.title}</p>
                        <p className="text-gray-400 text-sm mt-1">{member.department} Department</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 space-y-2">
                      <p className="text-gray-400 flex items-center">
                        <Mail className="inline mr-2 w-4 h-4" /> {member.email}
                      </p>
                      <p className="text-gray-400 flex items-center">
                        <Home className="inline mr-2 w-4 h-4" /> {member.office}
                      </p>
                      <p className="text-gray-400 flex items-center">
                        <Phone className="inline mr-2 w-4 h-4" /> {member.phone}
                      </p>
                      <p className="text-gray-400 flex items-center">
                        <Calendar className="inline mr-2 w-4 h-4" /> Office Hours: {member.officeHours}
                      </p>
                    </div>
                    
                    <button className="mt-4 w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-sm font-medium transition-colors">
                      Schedule Appointment
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      
      case 'notices':
        return (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h2 className="text-2xl font-bold text-white">University Notices</h2>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search notices..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            {filteredNotices.length === 0 ? (
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8 text-center">
                <Bell className="mx-auto w-12 h-12 text-gray-500 mb-4" />
                <h3 className="text-xl font-medium text-gray-300">No notices found</h3>
                <p className="text-gray-500 mt-2">
                  {searchQuery ? 'Try a different search term' : 'No current notices'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredNotices.map(notice => (
                  <div key={notice.id} className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 hover:bg-gray-800 transition-colors group">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold text-cyan-400 group-hover:text-cyan-300 transition-colors">
                          {notice.title}
                        </h3>
                        <div className="flex items-center mt-1 space-x-3">
                          <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs flex items-center">
                            <Calendar className="inline mr-1 w-3 h-3" /> {notice.date}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            notice.priority === 'High' ? 'bg-red-900/30 text-red-400' :
                            notice.priority === 'Medium' ? 'bg-yellow-900/30 text-yellow-400' :
                            'bg-gray-700 text-gray-300'
                          }`}>
                            {notice.priority} Priority
                          </span>
                          <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs">
                            {notice.category}
                          </span>
                        </div>
                      </div>
                      <button className="text-gray-400 hover:text-white">
                        <Bookmark className="w-5 h-5" />
                      </button>
                    </div>
                    <p className="text-gray-300 mt-3">{notice.content}</p>
                    <button className="mt-3 text-cyan-400 hover:text-cyan-300 text-sm font-medium flex items-center">
                      View Details <ChevronDown className="ml-1 w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      
      case 'external':
        return (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white">Recommended External Courses</h2>
                <p className="text-gray-400">Complement your studies with these courses from other platforms</p>
              </div>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            {filteredExternalCourses.length === 0 ? (
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8 text-center">
                <Globe className="mx-auto w-12 h-12 text-gray-500 mb-4" />
                <h3 className="text-xl font-medium text-gray-300">No courses found</h3>
                <p className="text-gray-500 mt-2">
                  {searchQuery ? 'Try a different search term' : 'No external course recommendations available'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredExternalCourses.map(course => (
                  <div key={course.id} className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 hover:bg-gray-800 transition-colors group">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold text-cyan-400 group-hover:text-cyan-300 transition-colors">
                          {course.name}
                        </h3>
                        <p className="text-gray-300 mt-1">{course.platform} - {course.university}</p>
                      </div>
                      <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs flex items-center">
                        ⭐ {course.rating}
                      </span>
                    </div>
                    
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs">
                        {course.level}
                      </span>
                      <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs">
                        {course.duration}
                      </span>
                    </div>
                    
                    <div className="mt-4 flex justify-between items-center">
                      <a 
                        href={course.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-teal-600 hover:bg-teal-700 rounded-md text-sm font-medium transition-colors flex items-center"
                      >
                        View Course <ExternalLink className="ml-2 w-4 h-4" />
                      </a>
                      <button className="text-gray-400 hover:text-white">
                        <Bookmark className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      
      case 'growth':
        // Prepare chart data for study history
        const studyHistoryData = {
          labels: learningStats.progressHistory?.map(day => 
            new Date(day.date).toLocaleDateString(undefined, { weekday: 'short' })
          ) || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [
            {
              label: 'Study Hours',
              data: learningStats.progressHistory?.map(day => day.hoursSpent) || [1.5, 2.0, 1.0, 2.5, 3.0, 1.8, 2.2],
              backgroundColor: 'rgba(56, 189, 248, 0.7)',
              borderColor: 'rgba(56, 189, 248, 1)',
              borderWidth: 2,
              borderRadius: 5,
            }
          ],
        };
        
        // Prepare chart data for course distribution
        const courseDistributionData = {
          labels: ['Academic', 'Co-Curricular', 'Video-based', 'Theory-based'],
          datasets: [
            {
              data: [
                learningStats.courseDistribution?.academic || 60, 
                learningStats.courseDistribution?.coCurricular || 40,
                learningStats.courseDistribution?.video || 70, 
                learningStats.courseDistribution?.theory || 30
              ],
              backgroundColor: [
                'rgba(56, 189, 248, 0.7)',
                'rgba(251, 146, 60, 0.7)',
                'rgba(52, 211, 153, 0.7)',
                'rgba(167, 139, 250, 0.7)'
              ],
              borderColor: [
                'rgba(56, 189, 248, 1)',
                'rgba(251, 146, 60, 1)',
                'rgba(52, 211, 153, 1)',
                'rgba(167, 139, 250, 1)'
              ],
              borderWidth: 1,
            },
          ],
        };
        
        // Skills radar chart data
        const skillsData = {
          labels: learningStats.skillsGained?.slice(0, 6) || ['JavaScript', 'React', 'Node.js', 'UI/UX', 'Data Science', 'Machine Learning'],
          datasets: [
            {
              label: 'Skill Proficiency',
              data: [80, 70, 75, 65, 60, 55].slice(0, learningStats.skillsGained?.length || 6),
              backgroundColor: 'rgba(56, 189, 248, 0.2)',
              borderColor: 'rgba(56, 189, 248, 1)',
              borderWidth: 2,
              pointBackgroundColor: 'rgba(56, 189, 248, 1)',
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: 'rgba(56, 189, 248, 1)',
            },
          ],
        };
        
        // Weekly goals progress data
        const weeklyGoalsData = {
          labels: ['Study Hours', 'Courses Completed'],
          datasets: [
            {
              label: 'Target',
              data: [
                learningStats.weeklyGoals?.studyHours?.target || 10,
                learningStats.weeklyGoals?.coursesCompleted?.target || 2
              ],
              backgroundColor: 'rgba(167, 139, 250, 0.5)',
            },
            {
              label: 'Achieved',
              data: [
                learningStats.weeklyGoals?.studyHours?.achieved || 6,
                learningStats.weeklyGoals?.coursesCompleted?.achieved || 1
              ],
              backgroundColor: 'rgba(56, 189, 248, 0.7)',
            },
          ],
        };
        
        // Chart options
        const barOptions = {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                color: 'rgba(255, 255, 255, 0.7)'
              }
            },
          },
          scales: {
            x: {
              grid: {
                color: 'rgba(255, 255, 255, 0.1)'
              },
              ticks: {
                color: 'rgba(255, 255, 255, 0.7)'
              }
            },
            y: {
              grid: {
                color: 'rgba(255, 255, 255, 0.1)'
              },
              ticks: {
                color: 'rgba(255, 255, 255, 0.7)'
              }
            }
          }
        };
        
        const pieOptions = {
          responsive: true,
          plugins: {
            legend: {
              position: 'right',
              labels: {
                color: 'rgba(255, 255, 255, 0.7)'
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return `${context.label}: ${context.parsed}%`;
                }
              }
            }
          }
        };
        
        const radarOptions = {
          scales: {
            r: {
              angleLines: {
                color: 'rgba(255, 255, 255, 0.2)'
              },
              grid: {
                color: 'rgba(255, 255, 255, 0.2)'
              },
              pointLabels: {
                color: 'rgba(255, 255, 255, 0.7)'
              },
              ticks: {
                color: 'rgba(255, 255, 255, 0.7)',
                backdropColor: 'transparent'
              }
            }
          },
          plugins: {
            legend: {
              labels: {
                color: 'rgba(255, 255, 255, 0.7)'
              }
            }
          }
        };
      
        return (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h2 className="text-2xl font-bold text-white">Personal Growth Analysis</h2>
              <span className="text-gray-400">Track your progress and growth</span>
            </div>
            
            {/* Stats overview cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-400 text-sm">Total Learning Hours</p>
                    <h3 className="text-2xl font-bold text-cyan-400 mt-1">{learningStats.totalHoursSpent || 0}</h3>
                  </div>
                  <div className="bg-cyan-900/30 p-2 rounded-lg">
                    <Clock className="w-8 h-8 text-cyan-400" />
                  </div>
                </div>
                <div className="mt-2">
                  {learningStats.progressHistory && learningStats.progressHistory.length > 0 && (
                    <p className="text-green-400 text-sm flex items-center">
                      <TrendingUp className="w-4 h-4 mr-1" /> 
                      +{(learningStats.progressHistory.reduce((sum, day) => 
                        sum + (parseFloat(day.hoursSpent) || 0), 0)).toFixed(1)} hours this week
                    </p>
                  )}
                </div>
              </div>
              
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-400 text-sm">Courses Completed</p>
                    <h3 className="text-2xl font-bold text-cyan-400 mt-1">{learningStats.coursesCompleted || 0}</h3>
                  </div>
                  <div className="bg-cyan-900/30 p-2 rounded-lg">
                    <Award className="w-8 h-8 text-cyan-400" />
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-gray-300 text-sm">
                    {Math.round((learningStats.coursesCompleted / (courses.length || 1)) * 100) || 0}% completion rate
                  </p>
                </div>
              </div>
              
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-400 text-sm">Average Score</p>
                    <h3 className="text-2xl font-bold text-cyan-400 mt-1">{learningStats.averageScore || 0}%</h3>
                  </div>
                  <div className="bg-cyan-900/30 p-2 rounded-lg">
                    <Activity className="w-8 h-8 text-cyan-400" />
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-green-400 text-sm flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1" /> 
                    Improving consistently
                  </p>
                </div>
              </div>
              
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-400 text-sm">Learning Streak</p>
                    <h3 className="text-2xl font-bold text-cyan-400 mt-1">{learningStats.streakDays || 0} days</h3>
                  </div>
                  <div className="bg-cyan-900/30 p-2 rounded-lg">
                    <BarChart className="w-8 h-8 text-cyan-400" />
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-gray-300 text-sm">
                    Last active: {learningStats.lastActiveDate ? new Date(learningStats.lastActiveDate).toLocaleDateString() : 'Today'}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Advanced visualization section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Study time history chart */}
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                <h3 className="text-xl font-medium text-white mb-4">Weekly Study Time History</h3>
                <div className="h-60 w-full">
                  <Bar data={studyHistoryData} options={barOptions} />
                </div>
              </div>
              
              {/* Course distribution chart */}
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                <h3 className="text-xl font-medium text-white mb-4">Course Type Distribution</h3>
                <div className="h-60 w-full flex items-center justify-center">
                  <Pie data={courseDistributionData} options={pieOptions} />
                </div>
              </div>
            </div>
            
            {/* Second row of visualization */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Skills radar chart */}
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                <h3 className="text-xl font-medium text-white mb-4">Skills Proficiency</h3>
                <div className="h-60 w-full flex items-center justify-center">
                  <Radar data={skillsData} options={radarOptions} />
                </div>
              </div>
              
              {/* Weekly goals progress */}
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                <h3 className="text-xl font-medium text-white mb-4">Weekly Goals Progress</h3>
                <div className="h-60 w-full">
                  <Bar data={weeklyGoalsData} options={barOptions} />
                </div>
              </div>
            </div>
            
            {/* Course Progress Section */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
              <h3 className="text-xl font-medium text-white mb-4">Course Progress Tracking</h3>
              <div className="space-y-4">
                {courses.length === 0 ? (
                  <p className="text-gray-400">No courses found.</p>
                ) : (
                  courses.map(course => (
                    <div key={course._id} className="p-4 border border-gray-700 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-lg font-medium text-cyan-400">{course.title || course.name}</h4>
                        <span className="text-sm text-gray-400">
                          {course.progress?.percentComplete || 0}% Complete
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-700 rounded-full">
                        <div 
                          className="h-2 bg-cyan-500 rounded-full" 
                          style={{ width: `${course.progress?.percentComplete || 0}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between mt-2">
                        <span className="text-xs text-gray-400">
                          Start Date: {course.enrollmentDate ? new Date(course.enrollmentDate).toLocaleDateString() : 'N/A'}
                        </span>
                        <span className="text-xs text-gray-400">
                          Last Accessed: {course.progress?.lastAccessed ? new Date(course.progress.lastAccessed).toLocaleDateString() : 'Never'}
                        </span>
                      </div>
                      <div className="mt-3">
                        <button
                          onClick={() => handleViewCourse(course._id)}
                          className="px-3 py-1 bg-cyan-600 hover:bg-cyan-700 rounded text-xs font-medium transition-colors flex items-center"
                        >
                          <Play className="w-3 h-3 mr-1" /> Continue Learning
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            {/* Skills Gained Section */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
              <h3 className="text-xl font-medium text-white mb-4">Skills Gained</h3>
              <div className="flex flex-wrap gap-2">
                {learningStats.skillsGained && learningStats.skillsGained.length > 0 ? (
                  learningStats.skillsGained.map((skill, index) => (
                    <span 
                      key={index} 
                      className="bg-cyan-900/30 text-cyan-400 px-3 py-1 rounded-full text-sm flex items-center"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-400">No skills recorded yet.</p>
                )}
              </div>
            </div>
            
            {/* Study Time History */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
              <h3 className="text-xl font-medium text-white mb-4">Study Time History</h3>
              {learningStats.progressHistory && learningStats.progressHistory.length > 0 ? (
                <div className="h-60 w-full">
                  <div className="flex h-full items-end">
                    {learningStats.progressHistory.map((day, index) => (
                      <div key={index} className="flex flex-col items-center flex-1">
                        <div 
                          className="w-full max-w-[30px] bg-cyan-500 hover:bg-cyan-400 transition-all rounded-t" 
                          style={{ 
                            height: `${Math.min(day.hoursSpent * 15, 100)}%`,
                            opacity: 0.7 + (index / (learningStats.progressHistory.length * 2))
                          }}
                        >
                        </div>
                        <span className="text-xs text-gray-400 mt-2 truncate w-full text-center">
                          {new Date(day.date).toLocaleDateString(undefined, { weekday: 'short' })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-400">No study history available.</p>
              )}
            </div>
            
            {/* Add a new study session section */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
              <h3 className="text-xl font-medium text-white mb-4">Log Study Session</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Select Course</label>
                  <select 
                    className="w-full bg-gray-900 border border-gray-700 rounded-md p-2 text-white"
                    value={studySession.courseId}
                    name="courseId"
                    onChange={handleStudySessionChange}
                  >
                    <option value="" disabled>Select a course</option>
                    {courses.map(course => (
                      <option key={course._id} value={course._id}>
                        {course.title || course.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Hours Spent</label>
                  <input 
                    type="number" 
                    min="0.5" 
                    step="0.5" 
                    className="w-full bg-gray-900 border border-gray-700 rounded-md p-2 text-white"
                    placeholder="Enter hours" 
                    name="hoursSpent"
                    value={studySession.hoursSpent}
                    onChange={handleStudySessionChange}
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Learning Mode</label>
                  <select 
                    className="w-full bg-gray-900 border border-gray-700 rounded-md p-2 text-white"
                    value={studySession.learningMode}
                    name="learningMode"
                    onChange={handleStudySessionChange}
                  >
                    <option value="video">Video Learning</option>
                    <option value="theory">Theory Study</option>
                    <option value="practice">Practice Session</option>
                    <option value="assessment">Assessment/Quiz</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Study Notes (Optional)</label>
                  <textarea 
                    className="w-full bg-gray-900 border border-gray-700 rounded-md p-2 text-white" 
                    rows="3"
                    placeholder="What did you learn in this session?"
                    name="notes"
                    value={studySession.notes}
                    onChange={handleStudySessionChange}
                  ></textarea>
                </div>
                <div className="md:col-span-2">
                  <button 
                    className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-md transition-colors"
                    onClick={handleLogStudySession}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Logging...' : 'Log Study Session'}
                  </button>
                </div>
              </div>
            </div>
            
            {/* Set Weekly Goals Section */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
              <h3 className="text-xl font-medium text-white mb-4">Set Weekly Goals</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Study Hours Target</label>
                  <input 
                    type="number" 
                    min="1" 
                    className="w-full bg-gray-900 border border-gray-700 rounded-md p-2 text-white"
                    name="studyHoursTarget"
                    value={weeklyGoals.studyHoursTarget}
                    onChange={handleWeeklyGoalsChange}
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Courses to Complete</label>
                  <input 
                    type="number" 
                    min="0" 
                    className="w-full bg-gray-900 border border-gray-700 rounded-md p-2 text-white"
                    name="coursesCompletedTarget" 
                    value={weeklyGoals.coursesCompletedTarget}
                    onChange={handleWeeklyGoalsChange}
                  />
                </div>
                <div className="md:col-span-2">
                  <button 
                    className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-md transition-colors"
                    onClick={handleUpdateWeeklyGoals}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Updating...' : 'Update Goals'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black min-h-screen flex relative gap-0 md:gap-1">
      {/* Mobile menu button */}
      <button 
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white focus:outline-none"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>
      
      {/* Sidebar */}
      <div className={`bg-gray-900 border-r border-gray-800 fixed top-0 bottom-0 left-0 ${sidebarCollapsed ? 'w-20' : 'w-64'} transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-all duration-300 z-40 overflow-y-auto md:shadow-lg`}>
        <div className="flex flex-col">
          <div className="flex items-center justify-between h-16 border-b border-gray-800 px-4">
            {!sidebarCollapsed && (
              <h1 className="text-xl font-bold text-white flex items-center truncate">
                <GraduationCap className="w-7 h-7 mr-2 text-cyan-400 flex-shrink-0" />
                <span className="truncate">EduHub</span>
              </h1>
            )}
            {sidebarCollapsed && (
              <GraduationCap className="w-7 h-7 text-cyan-400 mx-auto" />
            )}
            <button 
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1 rounded-lg bg-gray-800 text-gray-400 hover:text-white hidden md:block"
            >
              {sidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>
          </div>
          
          <nav className="flex-1 overflow-y-auto pt-4">
            <ul className="space-y-1 px-2">
              <li>
                <button 
                  onClick={() => setActiveTab('courses')}
                  className={`w-full px-3 py-3 flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'} rounded-lg hover:bg-gray-800 transition-colors ${activeTab === 'courses' ? 'bg-cyan-600 text-white' : 'text-gray-400'}`}
                  title="My Courses"
                >
                  <BookOpen className="w-5 h-5 flex-shrink-0" />
                  {!sidebarCollapsed && <span>My Courses</span>}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('growth')}
                  className={`w-full px-3 py-3 flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'} rounded-lg hover:bg-gray-800 transition-colors ${activeTab === 'growth' ? 'bg-cyan-600 text-white' : 'text-gray-400'}`}
                  title="Personal Growth Analysis"
                >
                  <TrendingUp className="w-5 h-5 flex-shrink-0" />
                  {!sidebarCollapsed && <span>Growth Analysis</span>}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('profile')}
                  className={`w-full px-3 py-3 flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'} rounded-lg hover:bg-gray-800 transition-colors ${activeTab === 'profile' ? 'bg-cyan-600 text-white' : 'text-gray-400'}`}
                  title="My Profile"
                >
                  <User className="w-5 h-5 flex-shrink-0" />
                  {!sidebarCollapsed && <span>My Profile</span>}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('faculty')}
                  className={`w-full px-3 py-3 flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'} rounded-lg hover:bg-gray-800 transition-colors ${activeTab === 'faculty' ? 'bg-cyan-600 text-white' : 'text-gray-400'}`}
                  title="Faculty"
                >
                  <Users className="w-5 h-5 flex-shrink-0" />
                  {!sidebarCollapsed && <span>Faculty</span>}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('notices')}
                  className={`w-full px-3 py-3 flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'} rounded-lg hover:bg-gray-800 transition-colors ${activeTab === 'notices' ? 'bg-cyan-600 text-white' : 'text-gray-400'}`}
                  title="Notices"
                >
                  <Bell className="w-5 h-5 flex-shrink-0" />
                  {!sidebarCollapsed && <span>Notices</span>}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('external')}
                  className={`w-full px-3 py-3 flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'} rounded-lg hover:bg-gray-800 transition-colors ${activeTab === 'external' ? 'bg-cyan-600 text-white' : 'text-gray-400'}`}
                  title="External Courses"
                >
                  <Globe className="w-5 h-5 flex-shrink-0" />
                  {!sidebarCollapsed && <span>External Courses</span>}
                </button>
              </li>
            </ul>
            
            <div className="px-3 py-4 mt-8">
              <div className="border-t border-gray-800 pt-4">
                {!sidebarCollapsed && (
                  <h3 className="text-gray-500 uppercase text-xs font-semibold px-3 mb-2">
                    Your Account
                  </h3>
                )}
                <ul className="space-y-1">
                  <li>
                    <button 
                      onClick={() => navigate('/')} 
                      className={`w-full px-3 py-3 flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'} rounded-lg hover:bg-gray-800 transition-colors text-gray-400`}
                      title="Home Page"
                    >
                      <Home className="w-5 h-5 flex-shrink-0" />
                      {!sidebarCollapsed && <span>Home Page</span>}
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={handleLogout} 
                      className={`w-full px-3 py-3 flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'} rounded-lg hover:bg-red-900/30 transition-colors text-red-400`}
                      title="Logout"
                    >
                      <LogOut className="w-5 h-5 flex-shrink-0" />
                      {!sidebarCollapsed && <span>Logout</span>}
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
          
          <div className="border-t border-gray-800 p-4">
            <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : ''}`}>
              <div className="bg-cyan-900/30 text-cyan-400 rounded-full w-10 h-10 flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              {!sidebarCollapsed && (
                <div className="ml-3 overflow-hidden">
                  <p className="text-sm font-medium text-white truncate">{userInfo?.email || 'User'}</p>
                  <p className="text-xs text-gray-500 truncate">{userInfo?.university || 'University Student'}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content Section */}
      <div className={`flex-1 overflow-y-auto ${sidebarCollapsed ? 'md:ml-20' : 'md:ml-64'} w-full md:w-auto pl-0 md:pl-4 bg-gray-900/30 md:rounded-l-lg md:shadow-xl transition-all duration-300`}>
        <header className="bg-gray-900/50 border-b border-gray-800 p-4 sticky top-0 z-30 backdrop-blur-sm">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white capitalize flex items-center">
              {activeTab === 'courses' && <BookOpen className="mr-2 w-5 h-5" />}
              {activeTab === 'faculty' && <Users className="mr-2 w-5 h-5" />}
              {activeTab === 'notices' && <Bell className="mr-2 w-5 h-5" />}
              {activeTab === 'external' && <Globe className="mr-2 w-5 h-5" />}
              {activeTab === 'profile' && <User className="mr-2 w-5 h-5" />}
              {activeTab === 'growth' && <TrendingUp className="mr-2 w-5 h-5" />}
              {activeTab}
            </h2>
            <div className="flex items-center">
              <button 
                className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors relative"
                onClick={() => setActiveTab('profile')}
                title="Edit Profile"
              >
                <User className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </header>

        <main className="p-6">
          {renderContent()}
        </main>
      </div>
      
      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg w-full max-w-md p-6 relative">
            <button 
              onClick={() => {
                setShowPasswordModal(false);
                setPasswordData({
                  currentPassword: '',
                  newPassword: '',
                  confirmPassword: '',
                  verificationCode: ''
                });
                setVerificationSent(false);
                setPasswordError('');
                setPasswordSuccess('');
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
              disabled={isLoading}
            >
              <X size={20} />
            </button>
            
            <h3 className="text-xl font-bold text-white mb-6">Change Password</h3>
            
            {passwordError && (
              <div className="bg-red-900/30 border border-red-700 text-red-400 px-4 py-3 rounded-lg mb-4">
                {passwordError}
              </div>
            )}
            
            {passwordSuccess && (
              <div className="bg-green-900/30 border border-green-700 text-green-400 px-4 py-3 rounded-lg mb-4">
                {passwordSuccess}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 mb-1">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="Enter your current password"
                  disabled={isLoading}
                />
              </div>
              
              <div>
                <label className="block text-gray-400 mb-1">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="Enter new password"
                  disabled={isLoading}
                />
              </div>
              
              <div>
                <label className="block text-gray-400 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="Confirm new password"
                  disabled={isLoading}
                />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-gray-400">Verification Code</label>
                  <button
                    type="button"
                    onClick={handleRequestVerificationCode}
                    className="text-sm text-cyan-400 hover:text-cyan-300 focus:outline-none"
                    disabled={isLoading || !profileData.email}
                  >
                    {verificationSent ? 'Resend Code' : 'Request Code'}
                  </button>
                </div>
                <input
                  type="text"
                  name="verificationCode"
                  value={passwordData.verificationCode}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="Enter verification code from email"
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500 mt-1">A verification code will be sent to your email address for security.</p>
              </div>
            </div>
            
            <div className="mt-6">
              <button
                type="button"
                onClick={handleChangePassword}
                className="w-full px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-cyan-500 flex justify-center items-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Change Password'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;