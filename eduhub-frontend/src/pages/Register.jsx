import React, { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();
  
  // State management for form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('user');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState('');
  const [cvFile, setCvFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [error, setError] = useState('');
  
  // State for API data
  const [countries, setCountries] = useState([]);
  const [universities, setUniversities] = useState([]);

  // Fetch all countries on component mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        const data = await response.json();
        
        const formattedCountries = data.map(country => ({
          name: country.name.common,
          code: country.cca2,
        })).sort((a, b) => a.name.localeCompare(b.name));
        
        setCountries(formattedCountries);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };
    
    fetchCountries();
  }, []);

  // Fetch universities when country changes
  useEffect(() => {
    const fetchUniversities = async () => {
      if (selectedCountry) {
        try {
          const response = await fetch(
            `http://universities.hipolabs.com/search?country=${countries.find(c => c.code === selectedCountry)?.name}`
          );
          const data = await response.json();
          
          const formattedUniversities = data.map((uni, index) => ({
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === 'application/pdf') {
        setCvFile(file);
      } else {
        setError('Please upload a PDF file for your CV');
        e.target.value = null; // Reset the file input
      }
    }
  };

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

    if (!selectedCountry || !selectedUniversity) {
      setError("Please select both country and university");
      setIsSubmitting(false);
      return;
    }
    
    const countryName = countries.find(c => c.code === selectedCountry)?.name;
    const universityName = universities.find(u => u.id === selectedUniversity)?.name;
    
    try {
      // Create form data to handle file upload
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('role', role);
      formData.append('country', countryName);
      formData.append('university', universityName);
      
      // Append CV file if it exists
      if (cvFile) {
        formData.append('cv', cvFile);
      }
      
      // Send registration data to backend
      const response = await axios.post('http://localhost:5000/api/auth/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // On successful registration
      setRegistrationSuccess(true);
      
      // Store token and user info
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userEmail', response.data.user.email);
      localStorage.setItem('userRole', response.data.user.role);
      localStorage.setItem('isLoggedIn', 'true');
      
      setTimeout(() => {
        // Redirect based on role
        if (response.data.user.role === 'admin') {
          navigate('/admindashboard');
        } else {
          navigate('/userdashboard');
        }
      }, 2000);
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCountryChange = (e) => {
    setSelectedCountry(e.target.value);
    setSelectedUniversity('');
  };

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

          {/* Role */}
          <div className="mb-4">
            <label htmlFor="role" className="block text-gray-300 text-sm font-semibold mb-2">Register As</label>
            <select
              id="role"
              name="role"
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Country */}
          <div className="mb-4">
            <label htmlFor="country" className="block text-gray-300 text-sm font-semibold mb-2">Country</label>
            <select
              id="country"
              name="country"
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              value={selectedCountry}
              onChange={handleCountryChange}
              required
            >
              <option value="">Select Country</option>
              {countries.map(country => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>

          {/* University */}
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
              {universities.map(university => (
                <option key={university.id} value={university.id}>
                  {university.name}
                </option>
              ))}
            </select>
          </div>

          {/* CV Upload (Optional) */}
          <div className="mb-6">
            <label htmlFor="cv" className="block text-gray-300 text-sm font-semibold mb-2">
              CV Upload (Optional, PDF only)
            </label>
            <div className="flex flex-col">
              <input
                type="file"
                id="cv"
                name="cv"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="cv"
                className="w-full px-4 py-2 rounded-md bg-gray-700 text-gray-100 border border-gray-600 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer flex items-center justify-center"
              >
                Choose PDF File
              </label>
              {cvFile && (
                <div className="mt-2 text-sm text-teal-400">
                  Selected: {cvFile.name}
                </div>
              )}
              <p className="text-xs text-gray-400 mt-1">
                Upload your CV in PDF format (max 5MB)
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-4 rounded-lg font-bold text-white transition-colors ${
              isSubmitting ? 'bg-teal-700 cursor-not-allowed' : 'bg-teal-500 hover:bg-teal-600'
            }`}
          >
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </button>

          {/* Login Link */}
          <p className="text-center mt-6 text-gray-400 text-sm">
            Already have an account?{' '}
            <NavLink to="/login" className="text-teal-400 hover:text-teal-300 font-semibold">
              Sign In
            </NavLink>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;