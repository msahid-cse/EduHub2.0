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
    rememberMe: false,
    role: 'user' // Default role
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // Call backend API for login
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email: formData.email,
        password: formData.password
      });
      
      // Store user info in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userEmail', response.data.user.email);
      localStorage.setItem('userRole', response.data.user.role);
      localStorage.setItem('isLoggedIn', 'true');
      
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
      setError(error.response?.data?.message || 'Something went wrong. Please try again.');
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

        {/* Role Selection Field */}
        <div className="mb-5">
          <label htmlFor="role" className="block mb-2 text-sm font-medium text-slate-300">
            Login As
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200 appearance-none"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
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