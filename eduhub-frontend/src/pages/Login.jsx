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
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState('');

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
        // Check if there's a specific return path with params stored in location state
        if (location.state?.returnTo) {
          // Handle navigation with parameters
          navigate(location.state.returnTo, { 
            state: location.state.returnToParams 
          });
        } else {
          // Default redirect
          const from = location.state?.from?.pathname || '/userdashboard';
          navigate(from);
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      
      if (error.response?.data?.needsVerification) {
        console.log('Email needs verification:', error.response.data);
        setNeedsVerification(true);
        setVerificationEmail(error.response.data.email || formData.email);
        
        // If in development mode and verification code is included in the response, auto-populate it
        if (process.env.NODE_ENV === 'development' && error.response.data.verificationCode) {
          console.log('Development mode - setting verification code:', error.response.data.verificationCode);
          setVerificationCode(error.response.data.verificationCode);
          localStorage.setItem('dev_verification_code', error.response.data.verificationCode);
        }
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
    setError('');
    setVerificationSuccess('');
    try {
      await authService.resendVerification(verificationEmail);
      setVerificationSuccess('Verification code resent. Please check your email.');
    } catch (error) {
      setError('Failed to resend verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    if (!verificationCode) {
      setError('Please enter the verification code');
      return;
    }
    
    setIsVerifying(true);
    setError('');
    setVerificationSuccess('');
    
    try {
      const verificationData = {
        email: verificationEmail,
        verificationCode: verificationCode
      };
      
      // Use authService to verify email
      await authService.verifyEmail(verificationData);
      
      setVerificationSuccess('Email verified successfully! You can now login.');
      
      // Clear verification state and allow user to log in again
      setTimeout(() => {
        setNeedsVerification(false);
        setVerificationEmail('');
        setVerificationCode('');
        setVerificationSuccess('');
      }, 2000);
      
    } catch (error) {
      console.error('Verification error:', error);
      let errorMessage = 'Verification failed. Please try again.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsVerifying(false);
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

      {verificationSuccess && (
        <div className="bg-green-500/20 border border-green-500 text-green-200 px-4 py-3 rounded mb-4">
          {verificationSuccess}
        </div>
      )}

      {needsVerification ? (
        <div className="mb-6">
          <div className="bg-amber-500/20 border border-amber-500 text-amber-200 px-4 py-3 rounded mb-4">
            <p>Your email is not verified. Please enter the verification code sent to your email.</p>
          </div>
          
          {/* Development mode display */}
          {process.env.NODE_ENV === 'development' && localStorage.getItem('dev_verification_code') && (
            <div className="bg-yellow-500/20 border border-yellow-500 text-yellow-200 px-4 py-3 rounded mb-4">
              <p>Development mode detected</p>
              <p>Verification code: <strong>{localStorage.getItem('dev_verification_code')}</strong></p>
              <p className="text-xs mt-1">(This message only appears in development environment)</p>
            </div>
          )}
          
          <form onSubmit={handleVerifyEmail}>
            <div className="mb-5">
              <label htmlFor="verificationCode" className="block mb-2 text-sm font-medium text-slate-300">
                Verification Code
              </label>
              <input
                type="text"
                id="verificationCode"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter 6-digit code"
                required
                className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg placeholder-slate-500 text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200 text-center text-xl tracking-widest"
                maxLength={6}
              />
            </div>
            
            <button
              type="submit"
              disabled={isVerifying}
              className={`w-full ${isVerifying ? 'bg-teal-700' : 'bg-teal-500 hover:bg-teal-600'} text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-teal-500 transition duration-200 shadow-md hover:shadow-lg flex justify-center items-center mb-4`}
            >
              {isVerifying ? 'Verifying...' : 'Verify Email'}
            </button>
            
            <div className="text-center">
              <button 
                type="button"
                onClick={handleResendVerification}
                disabled={isLoading}
                className="text-sm text-teal-400 hover:text-teal-300 underline"
              >
                {isLoading ? 'Sending...' : 'Resend verification code'}
              </button>
            </div>
          </form>
        </div>
      ) : (
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
                <path d="M1 1h22v22H1z" fill="none" />
              </svg>
              Google
            </button>
            <button
              type="button"
              onClick={handleGitHubLogin}
              className="flex-1 py-2.5 px-4 bg-slate-700 text-white rounded-lg flex justify-center items-center font-medium hover:bg-slate-600 transition duration-200"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.341-3.369-1.341-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.268 2.75 1.026A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.026 2.747-1.026.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"
                />
              </svg>
              GitHub
            </button>
          </div>

          <div className="text-center text-sm text-slate-400 hover:text-slate-300 cursor-pointer" onClick={handleUseAdminCredentials}>
            Use admin credentials
          </div>
        </form>
      )}

      <hr className="my-6 border-slate-700" />

      <div className="text-center text-slate-400 text-sm">
        Don't have an account?{' '}
        <NavLink to="/register" className="text-teal-400 hover:text-teal-300 transition duration-200">
          Sign Up
        </NavLink>
      </div>
    </div>
  );
}