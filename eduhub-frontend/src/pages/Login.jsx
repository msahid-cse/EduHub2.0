import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');
    setNeedsVerification(false);
    
    try {
      // Call backend API for login
      console.log('Attempting login with:', { email: formData.email });
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email: formData.email,
        password: formData.password
      });
      
      console.log('Login successful:', response.data);
      
      // Store user info in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userEmail', response.data.user.email);
      localStorage.setItem('userRole', response.data.user.role);
      localStorage.setItem('isLoggedIn', 'true');
      
      // Store additional user info if available
      if (response.data.user._id) {
        localStorage.setItem('userId', response.data.user._id);
      }
      if (response.data.user.university) {
        localStorage.setItem('userUniversity', response.data.user.university);
      }
      if (response.data.user.country) {
        localStorage.setItem('userCountry', response.data.user.country);
      }
      if (response.data.user.department) {
        localStorage.setItem('userDepartment', response.data.user.department);
      }
      
      // Redirect based on user role
      if (response.data.user.role === 'admin') {
        navigate('/admindashboard');
      } else {
        // Check if we were redirected from another page
        const from = location.state?.from?.pathname || '/userdashboard';
        navigate(from);
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Check if email needs verification
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
      await axios.post('http://localhost:5000/api/auth/resend-verification', {
        email: verificationEmail
      });
      setError('Verification code resent. Please check your email.');
      setNeedsVerification(false);
    } catch (error) {
      setError('Failed to resend verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
        {/* Email Input Field */}
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

        {/* Password Input Field */}
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

        {/* Remember Me Checkbox */}
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

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full ${isLoading ? 'bg-teal-700' : 'bg-teal-500 hover:bg-teal-600'} text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-teal-500 transition duration-200 shadow-md hover:shadow-lg flex justify-center items-center`}
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>

        {/* Admin Shortcut */}
        <div className="text-center mt-4">
          <button
            type="button"
            onClick={handleUseAdminCredentials}
            className="text-xs text-slate-400 hover:text-teal-400 transition duration-200"
          >
            Use admin credentials
          </button>
        </div>

        {/* Sign Up Link */}
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