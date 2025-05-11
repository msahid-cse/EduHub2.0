import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  BookOpen,
  Briefcase,
  FileText,
  Bell,
  Settings,
  Calendar,
  Home,
  MessageCircle,
  BarChart,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
  PlusCircle,
  GraduationCap
} from 'lucide-react';

const AdminSidebar = ({ collapsed = false, setCollapsed, active = 'dashboard' }) => {
  const navigate = useNavigate();
  const [hoveredItem, setHoveredItem] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    navigate('/login');
  };

  const navItems = [
    { 
      category: 'Content Management',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: <Home size={20} />, path: '/admindashboard' },
        { id: 'courses', label: 'Courses', icon: <BookOpen size={20} />, path: '/upload-course' },
        { id: 'notices', label: 'Notices', icon: <Bell size={20} />, path: '/post-notice' },
        { id: 'jobs', label: 'Job Postings', icon: <Briefcase size={20} />, path: '/post-job' },
        { id: 'events', label: 'Events', icon: <Calendar size={20} />, path: '/add-event' },
      ]
    },
    {
      category: 'Communication',
      items: [
        { id: 'instructors', label: 'Instructors', icon: <GraduationCap size={20} />, path: '/manage-instructors' },
        { id: 'community', label: 'Community', icon: <MessageCircle size={20} />, path: '/manage-community' },
      ]
    },
    {
      category: 'Reports',
      items: [
        { id: 'analytics', label: 'Analytics', icon: <BarChart size={20} />, path: '/growth-analysis' },
        { id: 'settings', label: 'Settings', icon: <Settings size={20} />, path: '#' },
      ]
    },
  ];

  return (
    <div className={`bg-gray-900 text-white flex flex-col h-full border-r border-gray-700 transition-all duration-300 ${collapsed ? "w-20" : "w-64"}`}>
      {/* Collapse Button */}
      <div className="flex justify-end p-4">
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation Categories */}
      <div className="flex-1 overflow-y-auto">
        {navItems.map((category, idx) => (
          <div key={idx} className="mb-6">
            {!collapsed && (
              <h3 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                {category.category}
              </h3>
            )}
            <nav className="px-2 space-y-1">
              {category.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={`w-full flex items-center p-3 rounded-lg transition-all ${
                    active === item.id ? "bg-blue-900/50 border-l-4 border-blue-400" : "hover:bg-gray-800"
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`p-1 rounded-md ${active === item.id ? "text-blue-400" : "text-gray-400"}`}>
                      {item.icon}
                    </div>
                    {!collapsed && (
                      <span className="ml-3">{item.label}</span>
                    )}
                  </div>
                  {hoveredItem === item.id && collapsed && (
                    <div className="absolute left-full ml-2 px-3 py-2 bg-gray-800 text-white rounded-md shadow-lg z-50">
                      {item.label}
                    </div>
                  )}
                </button>
              ))}
            </nav>
          </div>
        ))}
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className={`flex items-center p-3 m-2 rounded-lg hover:bg-red-900/50 transition-colors ${collapsed ? "justify-center" : ""}`}
      >
        <LogOut size={20} className="text-red-400" />
        {!collapsed && (
          <span className="ml-3 text-red-400">Logout</span>
        )}
      </button>
    </div>
  );
};

export default AdminSidebar; 