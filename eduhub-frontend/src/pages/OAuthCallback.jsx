import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function OAuthCallback() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const processOAuthLogin = async () => {
      try {
        // Get the query parameters from the URL
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get('token');
        const userId = queryParams.get('userId');
        const role = queryParams.get('role');
        const email = queryParams.get('email');
        const error = queryParams.get('error');

        if (error) {
          setError('Authentication failed. Please try again.');
          setLoading(false);
          return;
        }

        if (!token || !userId || !role || !email) {
          setError('Missing authentication data. Please try logging in again.');
          setLoading(false);
          return;
        }

        // Store the token and user data in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);
        localStorage.setItem('userRole', role);
        localStorage.setItem('userEmail', email);
        localStorage.setItem('isLoggedIn', 'true');

        // Store basic user info
        localStorage.setItem('userInfo', JSON.stringify({
          email,
          role,
          userId
        }));

        // Redirect to the appropriate dashboard
        const redirectPath = role === 'admin' ? '/admindashboard' : '/userdashboard';
        navigate(redirectPath);
      } catch (error) {
        console.error('OAuth callback error:', error);
        setError('An error occurred while processing your login. Please try again.');
        setLoading(false);
      }
    };

    processOAuthLogin();
  }, [location, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 mx-auto"></div>
          <p className="mt-4 text-lg text-slate-200">Completing login...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="text-center p-8 bg-slate-800 rounded-lg max-w-md">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-slate-200 mb-4">Login Error</h2>
          <p className="text-slate-300 mb-6">{error}</p>
          <button 
            onClick={() => navigate('/login')}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-md transition duration-200"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return null;
}

export default OAuthCallback; 