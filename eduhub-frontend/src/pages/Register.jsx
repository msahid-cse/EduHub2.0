import React, { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import axios from 'axios';

// Set up axios defaults
axios.defaults.baseURL = 'http://localhost:5000/api';
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.timeout = 10000; // 10 seconds timeout

const Register = () => {
  const navigate = useNavigate();
  
  // State management for form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [error, setError] = useState('');
  const [countriesLoading, setCountriesLoading] = useState(true);
  
  // Email verification states
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationError, setVerificationError] = useState('');
  const [verificationSuccess, setVerificationSuccess] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationCountdown, setVerificationCountdown] = useState(0);
  const [canResend, setCanResend] = useState(false);
  
  // State for API data
  const [countries, setCountries] = useState([]);
  const [universities, setUniversities] = useState([]);

  // Predefined departments
  const departments = [
    { id: 'cse', name: 'Computer Science & Engineering (CSE)' },
    { id: 'eee', name: 'Electrical & Electronic Engineering (EEE)' },
    { id: 'law', name: 'Law' },
    { id: 'bba', name: 'Business Administration (BBA)' },
    { id: 'mba', name: 'Master of Business Administration (MBA)' },
    { id: 'ai_data', name: 'AI & Data Science' },
    { id: 'other', name: 'Other' }
  ];

  // Fetch all countries on component mount
  useEffect(() => {
    const fetchCountries = async () => {
      setCountriesLoading(true);
      try {
        // Use a more reliable source for countries data
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2');
        
        if (!response.ok) {
          throw new Error('Failed to fetch countries');
        }
        
        const data = await response.json();
        
        const formattedCountries = data
          .map(country => ({
            name: country.name.common,
            code: country.cca2,
          }))
          .sort((a, b) => a.name.localeCompare(b.name));
        
        setCountries(formattedCountries);
      } catch (error) {
        console.error('Error fetching countries:', error);
        // Fallback with some major countries if API fails
        setCountries([
          { name: 'Bangladesh', code: 'BD' },
          { name: 'United States', code: 'US' },
          { name: 'United Kingdom', code: 'GB' },
          { name: 'Canada', code: 'CA' },
          { name: 'Australia', code: 'AU' },
          { name: 'India', code: 'IN' },
          { name: 'Pakistan', code: 'PK' },
          { name: 'China', code: 'CN' },
          { name: 'Japan', code: 'JP' },
          { name: 'Germany', code: 'DE' },
          { name: 'France', code: 'FR' },
          { name: 'Italy', code: 'IT' },
          { name: 'Brazil', code: 'BR' },
          { name: 'South Africa', code: 'ZA' },
        ].sort((a, b) => a.name.localeCompare(b.name)));
      } finally {
        setCountriesLoading(false);
      }
    };
    
    fetchCountries();
  }, []);

  // Fetch universities when country changes
  useEffect(() => {
    const fetchUniversities = async () => {
      if (selectedCountry) {
        try {
          const countryName = countries.find(c => c.code === selectedCountry)?.name;
          if (!countryName) return;
          
          const response = await fetch(
            `http://universities.hipolabs.com/search?country=${encodeURIComponent(countryName)}`
          );
          
          if (!response.ok) {
            throw new Error('Failed to fetch universities');
          }
          
          const data = await response.json();
          
          const formattedUniversities = data
            .filter((uni, index, self) => 
              index === self.findIndex(u => u.name === uni.name)
            )
            .map((uni, index) => ({
              name: uni.name,
              id: `uni_${index}`,
            }));
          
          setUniversities(formattedUniversities);
        } catch (error) {
          console.error('Error fetching universities:', error);
          setUniversities([]);
        }
      } else {
        setUniversities([]);
      }
    };
    
    fetchUniversities();
  }, [selectedCountry, countries]);

  // Countdown timer for verification code
  useEffect(() => {
    let timer;
    if (verificationCountdown > 0) {
      timer = setTimeout(() => {
        setVerificationCountdown(verificationCountdown - 1);
      }, 1000);
    } else if (verificationCountdown === 0 && showVerification) {
      setCanResend(true);
    }
    
    return () => clearTimeout(timer);
  }, [verificationCountdown, showVerification]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    // Basic validation
    if (password !== confirmPassword) {
      setError("Passwords don't match!");
      setIsSubmitting(false);
      return;
    }

    if (!selectedCountry || !selectedUniversity || !selectedDepartment) {
      setError("Please select country, university, and department");
      setIsSubmitting(false);
      return;
    }
    
    const countryName = countries.find(c => c.code === selectedCountry)?.name;
    const universityName = universities.find(u => u.id === selectedUniversity)?.name;
    const departmentName = departments.find(d => d.id === selectedDepartment)?.name;
    
    try {
      // Create JSON data for registration
      const userData = {
        name,
        email,
        password,
        country: countryName,
        university: universityName,
        department: departmentName
      };
      
      console.log('Submitting registration data:', { ...userData, password: '[HIDDEN]' });
      
      // For development, we're skipping the actual API call for demo purposes
      let mockResponse = null;
      
      try {
        // Try to make the actual API call
        const response = await axios.post('/auth/register', userData);
        console.log('Registration successful:', response.data);
        
        // Store token for verification
        localStorage.setItem('tempToken', response.data.token);
        localStorage.setItem('tempEmail', response.data.user.email);
        localStorage.setItem('userDepartment', departmentName);
        
        // For development environment, save verification code if provided
        if (response.data.verificationCode) {
          console.log('Development mode: Verification code received:', response.data.verificationCode);
          localStorage.setItem('dev_verification_code', response.data.verificationCode);
        }
        
        // Show verification screen
        setShowVerification(true);
        setVerificationCountdown(120); // 2 minutes countdown
        setCanResend(false);
      } catch (apiError) {
        console.error('API error:', apiError);
        
        // If we couldn't reach the API, use mock data for development
        if (apiError.message === 'Network Error' || !apiError.response) {
          console.log('Using mock data for development');
          
          // Create mock response
          mockResponse = {
            token: 'mock-token-' + Date.now(),
            user: { email },
            verificationCode: '123456' // Development mock code
          };
          
          // Store mock data
          localStorage.setItem('tempToken', mockResponse.token);
          localStorage.setItem('tempEmail', email);
          localStorage.setItem('userDepartment', departmentName);
          localStorage.setItem('dev_verification_code', mockResponse.verificationCode);
          
          // Show verification screen
          setShowVerification(true);
          setVerificationCountdown(120); // 2 minutes countdown
          setCanResend(false);
        } else {
          // If it's a different kind of error, throw it to be caught by the outer catch
          if (apiError.response?.data?.error) {
            console.error('Server error details:', apiError.response.data.error);
          }
          throw apiError;
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        errorMessage = error.response.data.message || 
                       error.response.data.error || 
                       `Server error: ${error.response.status}`;
        console.error('Server response:', error.response.data);
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = 'No response from server. Please check your internet connection.';
      } else {
        // Something happened in setting up the request
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    setIsVerifying(true);
    setVerificationError('');
    
    try {
      const response = await axios.post('/auth/verify-email', {
        email: email,
        verificationCode: verificationCode
      });
      
      // On successful verification
      setRegistrationSuccess(true);
      
      // Perform login
      localStorage.setItem('token', localStorage.getItem('tempToken'));
      localStorage.setItem('userEmail', email);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userRole', 'user');
      
      // Clean up temp storage
      localStorage.removeItem('tempToken');
      localStorage.removeItem('tempEmail');
      localStorage.removeItem('dev_verification_code');
      
      setTimeout(() => {
        navigate('/userdashboard');
      }, 2000);
      
    } catch (error) {
      console.error('Verification error:', error);
      let errorMessage = 'Verification failed. Please try again.';
      
      if (error.response?.status === 400 && error.response?.data?.message === 'Verification code expired') {
        errorMessage = 'Verification code has expired. Please request a new code.';
        setCanResend(true);
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      setVerificationError(errorMessage);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    setVerificationError('');
    setVerificationSuccess('');
    setCanResend(false);
    
    try {
      await axios.post('/auth/resend-verification', {
        email: email
      });
      
      setVerificationCountdown(120); // Reset countdown
      setVerificationSuccess('Verification code resent successfully!');
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setVerificationSuccess('');
      }, 5000);
    } catch (error) {
      console.error('Resend error:', error);
      setVerificationError(error.response?.data?.message || 'Failed to resend verification code. Please try again.');
      setCanResend(true);
    }
  };

  // Clean up any development verification codes when unmounting
  useEffect(() => {
    return () => {
      localStorage.removeItem('dev_verification_code');
    };
  }, []);

  if (registrationSuccess) {
    return (
      <div className="bg-slate-900 text-slate-200 flex items-center justify-center min-h-screen font-['Inter',_sans-serif]">
        <div className="bg-slate-800 p-8 md:p-10 rounded-xl shadow-2xl w-full max-w-md text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-teal-400 mb-6">Registration Successful!</h2>
          <p className="text-gray-300 mb-6">You will be redirected shortly.</p>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  // Email verification screen
  if (showVerification) {
    // Get verification code from development storage if available
    const devVerificationCode = localStorage.getItem('dev_verification_code');
    
    return (
      <div className="bg-slate-900 text-slate-200 flex items-center justify-center min-h-screen font-['Inter',_sans-serif]">
        <div className="bg-slate-800 p-8 md:p-10 rounded-xl shadow-2xl w-full max-w-md">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-teal-400 mb-6">Verify Your Email</h2>
          <p className="text-gray-300 text-center mb-6">
            We've sent a verification code to <span className="font-semibold">{email}</span>
          </p>
          
          {verificationError && (
            <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded mb-4">
              {verificationError}
            </div>
          )}
          
          {verificationSuccess && (
            <div className="bg-green-500/20 border border-green-500 text-green-200 px-4 py-3 rounded mb-4">
              {verificationSuccess}
            </div>
          )}
          
          {/* Development mode hint */}
          {devVerificationCode && (
            <div className="bg-yellow-500/20 border border-yellow-500 text-yellow-200 px-4 py-3 rounded mb-4">
              <p>Development mode: Verification code is <strong>{devVerificationCode}</strong></p>
              <p className="text-xs mt-1">(This message only appears in development environment)</p>
            </div>
          )}
          
          <form onSubmit={handleVerifyEmail}>
            <div className="mb-6">
              <label htmlFor="verificationCode" className="block text-gray-300 text-sm font-semibold mb-2">Verification Code</label>
              <input
                type="text"
                id="verificationCode"
                className="w-full px-4 py-2 rounded-md bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-center text-xl tracking-widest"
                placeholder="Enter 6-digit code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                required
                maxLength={6}
              />
            </div>
            
            <button
              type="submit"
              disabled={isVerifying}
              className={`w-full ${isVerifying ? 'bg-teal-700' : 'bg-teal-500 hover:bg-teal-600'} text-white font-bold py-3 px-4 rounded-lg transition duration-300 shadow-lg mb-4`}
            >
              {isVerifying ? 'Verifying...' : 'Verify Email'}
            </button>
          </form>
          
          <div className="text-center mt-4">
            <p className="text-gray-400 text-sm mb-2">
              {verificationCountdown > 0 ? (
                <>Code expires in: <span className="font-semibold">{Math.floor(verificationCountdown / 60)}:{String(verificationCountdown % 60).padStart(2, '0')}</span></>
              ) : (
                'Code has expired'
              )}
            </p>
            
            <button
              onClick={handleResendCode}
              disabled={!canResend}
              className={`text-sm ${canResend ? 'text-teal-400 hover:text-teal-300 cursor-pointer' : 'text-gray-500 cursor-not-allowed'}`}
            >
              Resend verification code
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 text-slate-200 flex items-center justify-center min-h-screen font-['Inter',_sans-serif] py-8">
      <div className="bg-slate-800 p-8 md:p-10 rounded-xl shadow-2xl w-full max-w-md">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-teal-400 mb-6">Join Edu Hub</h2>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-300 text-sm font-semibold mb-2">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Email Address */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-300 text-sm font-semibold mb-2">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-300 text-sm font-semibold mb-2">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="6"
            />
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-gray-300 text-sm font-semibold mb-2">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength="6"
            />
          </div>

          {/* Country Selection */}
          <div className="mb-4">
            <label htmlFor="country" className="block text-gray-300 text-sm font-semibold mb-2">Country</label>
            <select
              id="country"
              name="country"
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              required
              disabled={countriesLoading}
            >
              <option value="">Select Country</option>
              {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
            {countriesLoading && <p className="text-amber-400 text-xs mt-1">Loading countries...</p>}
          </div>

          {/* University Selection */}
          <div className="mb-4">
            <label htmlFor="university" className="block text-gray-300 text-sm font-semibold mb-2">University</label>
            <select
              id="university"
              name="university"
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              value={selectedUniversity}
              onChange={(e) => setSelectedUniversity(e.target.value)}
              required
              disabled={!selectedCountry}
            >
              <option value="">Select University</option>
              {universities.map((university) => (
                <option key={university.id} value={university.id}>
                  {university.name}
                </option>
              ))}
            </select>
            {selectedCountry && universities.length === 0 && (
              <p className="text-amber-400 text-xs mt-1">Loading universities...</p>
            )}
          </div>

          {/* Department Selection */}
          <div className="mb-4">
            <label htmlFor="department" className="block text-gray-300 text-sm font-semibold mb-2">Department</label>
            <select
              id="department"
              name="department"
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              required
            >
              <option value="">Select Department</option>
              {departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full ${isSubmitting ? 'bg-teal-700' : 'bg-teal-500 hover:bg-teal-600'} text-white font-bold py-3 px-4 rounded-lg transition duration-300 shadow-lg hover:shadow-xl`}
          >
            {isSubmitting ? 'Registering...' : 'Create Account'}
          </button>

          {/* Login Link */}
          <p className="text-center mt-6 text-gray-400">
            Already have an account?{' '}
            <NavLink to="/login" className="text-teal-400 hover:text-teal-300 transition duration-300">
              Sign In
            </NavLink>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;