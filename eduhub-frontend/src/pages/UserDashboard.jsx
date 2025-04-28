


// import { useEffect, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import Sidebar from "../components/Sidebar";
// import ResourceLibrary from "../pages/ResourceLibrary";
// import SkillDevelopment from "../pages/SkillDevelopment";
// import CVBuilder from "../pages/CVBuilder";
// import GrowthAnalysis from "../pages/GrowthAnalysis";

// function UserDashboard() {
//   const [username, setUsername] = useState("");
//   const [activePage, setActivePage] = useState("home");
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     // Simulate data loading
//     const timer = setTimeout(() => {
//       setUsername(localStorage.getItem("username") || "User");
//       setIsLoading(false);
//     }, 800);
    
//     return () => clearTimeout(timer);
//   }, []);

//   const renderPage = () => {
//     const pageComponents = {
//       home: (
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           exit={{ opacity: 0 }}
//           className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-xl shadow-lg border border-gray-100"
//         >
//           <h2 className="text-4xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-500">
//             Welcome back, {username} <span className="animate-waving-hand">👋</span>
//           </h2>
//           <p className="text-gray-600 text-lg mb-8">
//             Your personalized career development hub is ready. Where would you like to start today?
//           </p>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <DashboardCard 
//               title="Skill Development"
//               description="Enhance your professional skills"
//               icon="📊"
//               onClick={() => setActivePage("skill")}
//             />
//             <DashboardCard 
//               title="Resource Library"
//               description="Access learning materials"
//               icon="📚"
//               onClick={() => setActivePage("library")}
//             />
//             <DashboardCard 
//               title="CV Builder"
//               description="Create a standout resume"
//               icon="📝"
//               onClick={() => setActivePage("cvbuilder")}
//             />
//             <DashboardCard 
//               title="Growth Analysis"
//               description="Track your progress"
//               icon="📈"
//               onClick={() => setActivePage("growth")}
//             />
//           </div>
//         </motion.div>
//       ),
//       skill: <SkillDevelopment />,
//       library: <ResourceLibrary />,
//       cvbuilder: <CVBuilder />,
//       growth: <GrowthAnalysis />,
//     };

//     return pageComponents[activePage] || null;
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       {/* Enhanced Sidebar */}
//       <Sidebar activePage={activePage} setActivePage={setActivePage} />
      
//       {/* Main Content Area */}
//       <main className="flex-1 p-6 lg:p-10 overflow-auto">
//         {isLoading ? (
//           <div className="flex items-center justify-center h-full">
//             <div className="flex flex-col items-center">
//               <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
//               <p className="mt-4 text-gray-600">Loading your dashboard...</p>
//             </div>
//           </div>
//         ) : (
//           <AnimatePresence mode="wait">
//             <motion.div
//               key={activePage}
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               transition={{ duration: 0.25 }}
//             >
//               {renderPage()}
//             </motion.div>
//           </AnimatePresence>
//         )}
//       </main>
//     </div>
//   );
// }

// // Reusable Dashboard Card Component
// const DashboardCard = ({ title, description, icon, onClick }) => (
//   <motion.div 
//     whileHover={{ y: -5 }}
//     whileTap={{ scale: 0.98 }}
//     onClick={onClick}
//     className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-200 hover:border-blue-200"
//   >
//     <div className="text-4xl mb-4">{icon}</div>
//     <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
//     <p className="text-gray-500">{description}</p>
//   </motion.div>
// );

// export default UserDashboard;

















////new

// import { useEffect, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import Sidebar from "../components/Sidebar";
// import ResourceLibrary from "../pages/ResourceLibrary";
// import SkillDevelopment from "../pages/SkillDevelopment";
// import CVBuilder from "../pages/CVBuilder";
// import GrowthAnalysis from "../pages/GrowthAnalysis";

// function UserDashboard() {
//   const [username, setUsername] = useState("");
//   const [activePage, setActivePage] = useState("home");
//   const [isLoading, setIsLoading] = useState(true);
//   const [collapsed, setCollapsed] = useState(false);  // Track sidebar state

//   useEffect(() => {
//     // Simulate data loading
//     const timer = setTimeout(() => {
//       setUsername(localStorage.getItem("username") || "User");
//       setIsLoading(false);
//     }, 800);
    
//     return () => clearTimeout(timer);
//   }, []);

//   const renderPage = () => {
//     const pageComponents = {
//       home: (
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           exit={{ opacity: 0 }}
//           className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-xl shadow-lg border border-gray-100"
//         >
//           <h2 className="text-4xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-500">
//             Welcome back, {username} <span className="animate-waving-hand text-yellow-300">👋</span>
//           </h2>
//           <p className="text-gray-600 text-lg mb-8">
//             Your personalized career development hub is ready. Where would you like to start today?
//           </p>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <DashboardCard 
//               title="Skill Development"
//               description="Enhance your professional skills"
//               icon="📊"
//               onClick={() => setActivePage("skill")}
//             />
//             <DashboardCard 
//               title="Resource Library"
//               description="Access learning materials"
//               icon="📚"
//               onClick={() => setActivePage("library")}
//             />
//             <DashboardCard 
//               title="CV Builder"
//               description="Create a standout resume"
//               icon="📝"
//               onClick={() => setActivePage("cvbuilder")}
//             />
//             <DashboardCard 
//               title="Growth Analysis"
//               description="Track your progress"
//               icon="📈"
//               onClick={() => setActivePage("growth")}
//             />
//           </div>
//         </motion.div>
//       ),
//       skill: <SkillDevelopment />,
//       library: <ResourceLibrary />,
//       cvbuilder: <CVBuilder />,
//       growth: <GrowthAnalysis />,
//     };

//     return pageComponents[activePage] || null;
//   };

//   return (
//     // <div className="flex min-h-screen bg-gray-50">
//     <div className="flex h-min-screen">
//       {/* Sidebar with dynamic state for collapse */}
//       <div className="w-[25%]"><Sidebar activePage={activePage} setActivePage={setActivePage} collapsed={collapsed} setCollapsed={setCollapsed} /></div>
      
//       {/* Main Content Area */}
//       <main className={`w-[400%] `}>
//         {isLoading ? (
//           <div className="">
//             <div className="">
//               <div className=""></div>
//               <p className="">Loading your dashboard...</p>
//             </div>
//           </div>
//         ) : (
//           <AnimatePresence mode="wait">
//             <motion.div
//               key={activePage}
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               transition={{ duration: 0.25 }}
//             >
//               {renderPage()}
//             </motion.div>
//           </AnimatePresence>
//         )}
//       </main>
//     </div>
//   );
// }

// // Reusable Dashboard Card Component
// const DashboardCard = ({ title, description, icon, onClick }) => (
//   <motion.div 
//     whileHover={{ y: -5 }}
//     whileTap={{ scale: 0.98 }}
//     onClick={onClick}
//     className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-200 hover:border-blue-200"
//   >
//     <div className="text-4xl mb-4">{icon}</div>
//     <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
//     <p className="text-gray-500">{description}</p>
//   </motion.div>
// );

// export default UserDashboard;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  ExternalLink
} from 'lucide-react';

const UserDashboard = () => {
  const [userPreferences, setUserPreferences] = useState(null);
  const [activeTab, setActiveTab] = useState('courses');
  const [courses, setCourses] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [notices, setNotices] = useState([]);
  const [externalCourses, setExternalCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Load user preferences and mock data
  useEffect(() => {
    const preferences = JSON.parse(localStorage.getItem('userPreferences'));
    if (!preferences?.country || !preferences?.university) {
      navigate('/');
      return;
    }

    setUserPreferences(preferences);
    loadMockData(preferences.university);
  }, [navigate]);

  const loadMockData = (university) => {
    setIsLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Mock course data based on university
      setCourses([
        { 
          id: 1, 
          code: 'CS101', 
          name: 'Introduction to Computer Science', 
          professor: 'Dr. Smith', 
          schedule: 'Mon/Wed 10:00-11:30',
          credits: 3,
          room: 'CSB-205',
          description: 'Fundamentals of programming and computer science principles'
        },
        { 
          id: 2, 
          code: 'MATH201', 
          name: 'Advanced Mathematics', 
          professor: 'Dr. Johnson', 
          schedule: 'Tue/Thu 13:00-14:30',
          credits: 4,
          room: 'MATH-101',
          description: 'Advanced topics in calculus and linear algebra'
        },
        { 
          id: 3, 
          code: 'ENG105', 
          name: 'Academic Writing', 
          professor: 'Prof. Williams', 
          schedule: 'Fri 9:00-12:00',
          credits: 3,
          room: 'ARTS-304',
          description: 'Developing academic writing skills for university-level work'
        },
        { 
          id: 4, 
          code: 'PHY301', 
          name: 'Quantum Physics', 
          professor: 'Dr. Brown', 
          schedule: 'Mon/Wed/Fri 14:00-15:00',
          credits: 4,
          room: 'SCI-412',
          description: 'Introduction to quantum mechanics and its applications'
        }
      ]);

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
    localStorage.removeItem('userPreferences');
    navigate('/');
  };

  const filteredCourses = courses.filter(course => 
    course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.professor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFaculty = faculty.filter(member => 
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredNotices = notices.filter(notice => 
    notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    notice.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredExternalCourses = externalCourses.filter(course => 
    course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.university.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      case 'courses':
        return (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h2 className="text-2xl font-bold text-white">Your Courses at {userPreferences?.university}</h2>
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
                  {searchQuery ? 'Try a different search term' : 'No courses available for the current semester'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredCourses.map(course => (
                  <div key={course.id} className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 hover:bg-gray-800 transition-colors group">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold text-cyan-400 group-hover:text-cyan-300 transition-colors">
                          {course.code}: {course.name}
                        </h3>
                        <p className="text-gray-300 mt-1 flex items-center">
                          <Users className="inline mr-2 w-4 h-4" /> {course.professor}
                        </p>
                      </div>
                      <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs">
                        {course.credits} credits
                      </span>
                    </div>
                    
                    <div className="mt-3 space-y-2">
                      <p className="text-gray-400 flex items-center">
                        <Clock className="inline mr-2 w-4 h-4" /> {course.schedule}
                      </p>
                      <p className="text-gray-400 flex items-center">
                        <Home className="inline mr-2 w-4 h-4" /> {course.room}
                      </p>
                    </div>
                    
                    <p className="text-gray-400 mt-3 text-sm">{course.description}</p>
                    
                    <div className="mt-4 flex space-x-3">
                      <button className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-md text-sm font-medium transition-colors">
                        View Syllabus
                      </button>
                      <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-sm font-medium transition-colors">
                        Resources
                      </button>
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
      
      default:
        return null;
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black min-h-screen flex">
      {/* Mobile menu button */}
      <button 
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white focus:outline-none"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <div className={`${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:static inset-y-0 left-0 w-64 bg-gray-900/80 border-r border-gray-800 flex flex-col z-40 transition-transform duration-300 ease-in-out`}>
        <div className="p-4 border-b border-gray-800">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">
              EduHub Global
            </h1>
            <button 
              className="md:hidden p-1 text-gray-400 hover:text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="mt-2 text-gray-400 text-sm">
            {userPreferences?.university && (
              <>
                <p className="font-medium text-white flex items-center">
                  <GraduationCap className="inline mr-2 w-4 h-4" /> {userPreferences.university}
                </p>
                <p className="flex items-center">
                  <Globe className="inline mr-2 w-4 h-4" /> {userPreferences.country}
                </p>
              </>
            )}
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <button
            onClick={() => {
              setActiveTab('courses');
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'courses' ? 'bg-cyan-600/20 text-cyan-400 border border-cyan-400/30' : 'text-gray-400 hover:bg-gray-800'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span>My Courses</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('faculty');
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'faculty' ? 'bg-cyan-600/20 text-cyan-400 border border-cyan-400/30' : 'text-gray-400 hover:bg-gray-800'
            }`}
          >
            <Users className="w-5 h-5" />
            <span>Faculty</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('notices');
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'notices' ? 'bg-cyan-600/20 text-cyan-400 border border-cyan-400/30' : 'text-gray-400 hover:bg-gray-800'
            }`}
          >
            <Bell className="w-5 h-5" />
            <span>Notices</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('external');
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'external' ? 'bg-cyan-600/20 text-cyan-400 border border-cyan-400/30' : 'text-gray-400 hover:bg-gray-800'
            }`}
          >
            <Globe className="w-5 h-5" />
            <span>External Courses</span>
          </button>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <header className="bg-gray-900/50 border-b border-gray-800 p-4 sticky top-0 z-30 backdrop-blur-sm">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white capitalize flex items-center">
              {activeTab === 'courses' && <BookOpen className="mr-2 w-5 h-5" />}
              {activeTab === 'faculty' && <Users className="mr-2 w-5 h-5" />}
              {activeTab === 'notices' && <Bell className="mr-2 w-5 h-5" />}
              {activeTab === 'external' && <Globe className="mr-2 w-5 h-5" />}
              {activeTab}
            </h2>
            <div className="flex items-center space-x-4">
              <div className="hidden md:block relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors relative">
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
    </div>
  );
};

export default UserDashboard;