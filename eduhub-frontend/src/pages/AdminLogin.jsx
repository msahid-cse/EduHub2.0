import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, AlertCircle } from 'lucide-react';
import { adminAuthService } from '../api/adminApiClient';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Check if admin is already logged in
  useEffect(() => {
    if (adminAuthService.isAuthenticated()) {
      navigate('/admindashboard');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // Call admin login service
      const response = await adminAuthService.login(formData.email, formData.password);
      
      if (response.data && response.data.token) {
        // Store admin-specific token and information
        localStorage.setItem('adminToken', response.data.token);
        localStorage.setItem('adminEmail', response.data.admin.email);
        localStorage.setItem('adminName', response.data.admin.name);
        localStorage.setItem('isAdminLoggedIn', 'true');
        
        // Save admin permissions
        if (response.data.admin.permissions) {
          localStorage.setItem('adminPermissions', JSON.stringify(response.data.admin.permissions));
        }
        
        // Navigate to admin dashboard
        navigate('/admindashboard');
      } else {
        setError('Invalid response from server. Please try again.');
      }
    } catch (err) {
      console.error('Admin login error:', err);
      
      let errorMessage = 'Failed to login. Please check your credentials.';
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message === 'Network Error') {
        errorMessage = 'Unable to connect to the server. Please check your internet connection.';
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-xl overflow-hidden">
        <div className="px-6 py-8 md:px-8">
          <div className="flex justify-center mb-6">
            <Shield className="h-12 w-12 text-blue-500" />
          </div>
          
          <h2 className="text-2xl font-bold text-center text-white mb-2">
            Admin Portal
          </h2>
          
          <p className="text-center text-gray-400 text-sm mb-8">
            Secure login for EduHub administrators
          </p>
          
          {error && (
            <div className="mb-6 p-3 bg-red-900/30 border border-red-500/50 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-red-400 text-sm">{error}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label 
                className="block text-gray-300 text-sm font-medium mb-2" 
                htmlFor="email"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="admin@eduhub.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="mb-6">
              <label 
                className="block text-gray-300 text-sm font-medium mb-2" 
                htmlFor="password"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2 px-4 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isLoading 
                  ? 'bg-blue-700 text-gray-300 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <button 
              onClick={() => navigate('/login')}
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              Return to User Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin; 