import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  ChevronsLeftRight,
  LogIn,
  UserPlus,
  User,
  LogOut,
} from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    // Check authentication status on component mount and localStorage changes
    const checkAuthStatus = () => {
      const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
      const role = localStorage.getItem('userRole');
      setIsLoggedIn(loggedIn);
      setUserRole(role || '');
    };

    checkAuthStatus();
    
    // Listen for storage events (for multi-tab scenarios)
    window.addEventListener('storage', checkAuthStatus);
    
    return () => {
      window.removeEventListener('storage', checkAuthStatus);
    };
  }, []);

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    localStorage.removeItem('isLoggedIn');
    
    // Update state
    setIsLoggedIn(false);
    setUserRole('');
    
    // Redirect to home
    navigate('/');
  };

  const goToDashboard = () => {
    if (isLoggedIn) {
      if (userRole === 'admin') {
        navigate('/admindashboard');
      } else {
        navigate('/userdashboard');
      }
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <header className="py-4 px-6 bg-gray-950 backdrop-blur-md border-b border-gray-800">
      <div className="container mx-auto flex items-center justify-between">
        <h1 
          className="font-['Inter'] text-2xl font-bold text-white flex items-center gap-2 cursor-pointer"
          onClick={goToDashboard}
        >
          <ChevronsLeftRight className="w-10 h-10 text-teal-400" />
          EduHub
        </h1>

        <nav>
          <ul className="flex items-center gap-6">
            {!isLoggedIn ? (
              <>
                <li>
                  <NavLink to="/login">
                    <button className="font-['Source_Sans_Pro'] text-gray-300 hover:text-white transition-colors flex items-center">
                      <LogIn className="w-4 h-4 mr-1" />
                      Login
                    </button>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/register">
                    <button className="font-['Source_Sans_Pro'] text-gray-300 hover:text-white transition-colors flex items-center">
                      <UserPlus className="w-4 h-4 mr-1" />
                      Register
                    </button>
                  </NavLink>
                </li>
              </>
            ) : (
              <>
                <li>
                  <NavLink to={userRole === 'admin' ? '/admindashboard' : '/userdashboard'}>
                    <button className="font-['Source_Sans_Pro'] text-gray-300 hover:text-white transition-colors flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      Profile
                    </button>
                  </NavLink>
                </li>
                <li>
                  <button 
                    className="font-['Source_Sans_Pro'] text-gray-300 hover:text-white transition-colors flex items-center"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-1" />
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;