import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../api/apiClient';

export default function App() {
  return (
    <div className="bg-slate-900 text-slate-200 flex items-center justify-center min-h-screen font-['Inter',_sans-serif]">
      <LoginPage />
    </div>
  );
}

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [needsVerification, setNeedsVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');

  // Check for OAuth error in URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const oauthError = searchParams.get('error');
    
    if (oauthError === 'oauth_failed') {
      setError('OAuth authentication failed. Please try again or use email/password.');
    }
  }, [location]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');
    setNeedsVerification(false);
    
    try {
      console.log('Attempting login with:', { email: formData.email });
      const response = await authService.login(formData.email, formData.password);
      
      console.log('Login successful:', response.data);
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userEmail', response.data.user.email);
      localStorage.setItem('userRole', response.data.user.role);
      localStorage.setItem('isLoggedIn', 'true');
      
      // Store user ID from any available field
      if (response.data.user.userId) {
        localStorage.setItem('userId', response.data.user.userId);
      } else if (response.data.user._id) {
        localStorage.setItem('userId', response.data.user._id);
      } else if (response.data.user.id) {
        localStorage.setItem('userId', response.data.user.id);
      }

      // Store user info object for convenience
      localStorage.setItem('userInfo', JSON.stringify({
        name: response.data.user.name,
        email: response.data.user.email,
        role: response.data.user.role,
        university: response.data.user.university,
        department: response.data.user.department,
        userId: localStorage.getItem('userId')
      }));
      
      if (response.data.user.university) {
        localStorage.setItem('userUniversity', response.data.user.university);
      }
      if (response.data.user.country) {
        localStorage.setItem('userCountry', response.data.user.country);
      }
      if (response.data.user.department) {
        localStorage.setItem('userDepartment', response.data.user.department);
      }
      
      if (response.data.user.role === 'admin') {
        navigate('/admindashboard');
      } else {
        const from = location.state?.from?.pathname || '/userdashboard';
        navigate(from);
      }
    } catch (error) {
      console.error('Login error:', error);
      
      if (error.response?.data?.needsVerification) {
        console.log('Email needs verification:', error.response.data);
        setNeedsVerification(true);
        setVerificationEmail(error.response.data.email || formData.email);
      } else {
        let errorMessage = 'Something went wrong. Please try again.';
        
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.message === 'Network Error') {
          errorMessage = 'Unable to connect to the server. Please check your internet connection.';
        }
        
        console.log('Setting error message:', errorMessage);
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleUseAdminCredentials = () => {
    setFormData({
      email: 'admin@eduhub.com',
      password: 'admin123',
      rememberMe: false
    });
  };

  const handleResendVerification = async () => {
    setIsLoading(true);
    try {
      await authService.resendVerification(verificationEmail);
      setError('Verification code resent. Please check your email.');
      setNeedsVerification(false);
    } catch (error) {
      setError('Failed to resend verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OAuth login
  const handleGoogleLogin = () => {
    window.location.href = authService.getGoogleAuthUrl();
  };

  const handleGitHubLogin = () => {
    window.location.href = authService.getGithubAuthUrl();
  };

  return (
    <div className="bg-slate-800 p-8 md:p-10 rounded-xl shadow-2xl w-full max-w-md">
      <h1 className="text-2xl md:text-3xl font-bold text-center text-teal-400 mb-6">
        Edu Hub Login
      </h1>
      <p className="text-center text-slate-400 mb-8 text-sm">
        Welcome back! Please enter your details.
      </p>

      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {needsVerification && (
        <div className="bg-amber-500/20 border border-amber-500 text-amber-200 px-4 py-3 rounded mb-4">
          <p>Your email is not verified. Please check your email for the verification code.</p>
          <button 
            onClick={handleResendVerification}
            className="mt-2 text-sm text-amber-300 hover:text-amber-200 underline"
          >
            Resend verification code
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-5">
          <label htmlFor="email" className="block mb-2 text-sm font-medium text-slate-300">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
            className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg placeholder-slate-500 text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
          />
        </div>

        <div className="mb-5">
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="password" className="block text-sm font-medium text-slate-300">
              Password
            </label>
            <a href="#" className="text-xs text-teal-400 hover:text-teal-300 transition duration-200">
              Forgot Password?
            </a>
          </div>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
            className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg placeholder-slate-500 text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
          />
        </div>

        <div className="flex items-center mb-6">
          <input
            id="remember-me"
            name="rememberMe"
            type="checkbox"
            checked={formData.rememberMe}
            onChange={handleChange}
            className="h-4 w-4 rounded border-slate-500 text-teal-500 focus:ring-teal-500 bg-slate-700 focus:ring-offset-slate-800"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-400">
            Remember me
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full ${isLoading ? 'bg-teal-700' : 'bg-teal-500 hover:bg-teal-600'} text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-teal-500 transition duration-200 shadow-md hover:shadow-lg flex justify-center items-center`}
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>

        <div className="my-6 flex items-center">
          <div className="flex-1 border-t border-slate-600"></div>
          <span className="px-3 text-sm text-slate-400">Or continue with</span>
          <div className="flex-1 border-t border-slate-600"></div>
        </div>

        <div className="flex gap-3 mb-4">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="flex-1 py-2.5 px-4 bg-white text-slate-800 rounded-lg flex justify-center items-center font-medium hover:bg-gray-100 transition duration-200"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Google
          </button>
          
          <button
            type="button"
            onClick={handleGitHubLogin}
            className="flex-1 py-2.5 px-4 bg-slate-900 text-white rounded-lg flex justify-center items-center font-medium hover:bg-slate-700 transition duration-200 border border-slate-600"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"
              />
            </svg>
            GitHub
          </button>
        </div>

        <div className="text-center mt-4">
          <button
            type="button"
            onClick={handleUseAdminCredentials}
            className="text-xs text-slate-400 hover:text-teal-400 transition duration-200"
          >
            Use admin credentials
          </button>
        </div>

        <p className="text-center text-sm text-slate-400 mt-8">
          Don't have an account?{' '}
          <NavLink to="/register" className="font-medium text-teal-400 hover:text-teal-300 transition duration-200">
            Sign Up
          </NavLink>
        </p>
      </form>
    </div>
  );
}