import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { adminAuthService } from '../api/adminApiClient';

const ProtectedAdminRoute = ({ children }) => {
  const location = useLocation();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  
  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        // Check if admin is authenticated using the token
        if (adminAuthService.isAuthenticated()) {
          try {
            // Verify the token is still valid by making a call to getCurrentAdmin
            await adminAuthService.getCurrentAdmin();
            setIsAuthenticated(true);
            setHasPermission(true);
          } catch (error) {
            console.error('Admin token validation error:', error);
            // If token is invalid, clear admin data
            adminAuthService.logout();
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Admin authentication check error:', error);
        setIsAuthenticated(false);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyAdmin();
  }, []);

  if (isVerifying) {
    // Show loading indicator while verifying
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to admin login if not authenticated
    return <Navigate to="/admin-login" state={{ from: location }} replace />;
  }

  if (!hasPermission) {
    // Redirect to admin dashboard if authenticated but doesn't have permission
    return <Navigate to="/admindashboard" state={{ from: location }} replace />;
  }

  // Render the protected content
  return children;
};

export default ProtectedAdminRoute; 