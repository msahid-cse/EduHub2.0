import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  
  // State management for form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [selectedCountryCode, setSelectedCountryCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [presentAddress, setPresentAddress] = useState('');
  const [permanentAddress, setPermanentAddress] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [cvFile, setCvFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  
  // State for API data
  const [countries, setCountries] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [departments, setDepartments] = useState([
    { name: 'Computer Science', id: 'cs' },
    { name: 'Electrical Engineering', id: 'ee' },
    { name: 'Mechanical Engineering', id: 'me' },
    { name: 'Business Administration', id: 'ba' },
    { name: 'Mathematics', id: 'math' },
  ]);

  // Fetch all countries on component mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        const data = await response.json();
        
        const formattedCountries = data.map(country => ({
          name: country.name.common,
          code: country.cca2,
          phoneCode: country.idd.root + (country.idd.suffixes ? country.idd.suffixes[0] : ''),
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
            domains: uni.domains,
            webPages: uni.web_pages,
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Basic validation
    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      setIsSubmitting(false);
      return;
    }
    
    // Create form data to handle file upload
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('age', age);
    formData.append('gender', gender);
    formData.append('phoneNumber', `${selectedCountryCode}${phoneNumber}`);
    formData.append('presentAddress', presentAddress);
    formData.append('permanentAddress', permanentAddress);
    formData.append('country', selectedCountry);
    formData.append('university', selectedUniversity);
    formData.append('department', selectedDepartment);
    if (cvFile) {
      formData.append('cv', cvFile);
    }
    
    try {
      // In a real app, you would send this to your backend API
      console.log('Form data:', Object.fromEntries(formData));
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // On successful registration
      setRegistrationSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCountryChange = (e) => {
    setSelectedCountry(e.target.value);
    setSelectedUniversity('');
    setSelectedDepartment('');
  };

  const handleUniversityChange = (e) => {
    setSelectedUniversity(e.target.value);
    setSelectedDepartment('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setCvFile(file);
    } else {
      alert('Please upload a PDF file');
      e.target.value = ''; // Reset the file input
    }
  };

  if (registrationSuccess) {
    return (
      <div className="bg-slate-900 text-slate-200 flex items-center justify-center min-h-screen font-['Inter',_sans-serif]">
        <div className="bg-slate-800 p-8 md:p-10 rounded-xl shadow-2xl w-full max-w-md text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-teal-400 mb-6">Registration Successful!</h2>
          <p className="text-gray-300 mb-6">You will be redirected to the login page shortly.</p>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 text-slate-200 flex items-center justify-center min-h-screen font-['Inter',_sans-serif]">
      <div className="bg-slate-800 p-8 md:p-10 rounded-xl shadow-2xl w-full max-w-md">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-teal-400 mb-6">Join Edu Hub</h2>

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
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="6"
            />
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <label htmlFor="confirm-password" className="block text-gray-300 text-sm font-semibold mb-2">Confirm Password</label>
            <input
              type="password"
              id="confirm-password"
              name="confirm-password"
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength="6"
            />
          </div>

          {/* Age */}
          <div className="mb-4">
            <label htmlFor="age" className="block text-gray-300 text-sm font-semibold mb-2">Age</label>
            <input
              type="number"
              id="age"
              name="age"
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder="Enter your age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              min="16"
              max="100"
            />
          </div>

          {/* Gender */}
          <div className="mb-4">
            <label htmlFor="gender" className="block text-gray-300 text-sm font-semibold mb-2">Gender</label>
            <select
              id="gender"
              name="gender"
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
          </div>

          {/* Phone Number with Country Code */}
          <div className="mb-4">
            <label htmlFor="phone" className="block text-gray-300 text-sm font-semibold mb-2">Phone Number</label>
            <div className="flex items-center gap-x-2">
              {/* Country Code Dropdown */}
              <select
                id="country-code"
                name="country-code"
                className="w-1/4 px-4 py-2 rounded-md bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                value={selectedCountryCode}
                onChange={(e) => setSelectedCountryCode(e.target.value)}
                required
              >
                <option value="">Code</option>
                {countries.map(country => (
                  <option key={country.code} value={country.phoneCode}>
                    {country.phoneCode}
                  </option>
                ))}
              </select>
              {/* Phone Number Input */}
              <input
                type="tel"
                id="phone"
                name="phone"
                className="w-3/4 px-4 py-2 rounded-md bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="555 123 4567"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Present Address */}
          <div className="mb-4">
            <label htmlFor="present-address" className="block text-gray-300 text-sm font-semibold mb-2">Present Address</label>
            <textarea
              id="present-address"
              name="present-address"
              rows="3"
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder="Enter your present address"
              value={presentAddress}
              onChange={(e) => setPresentAddress(e.target.value)}
              required
            ></textarea>
          </div>

          {/* Permanent Address */}
          <div className="mb-4">
            <label htmlFor="permanent-address" className="block text-gray-300 text-sm font-semibold mb-2">Permanent Address</label>
            <textarea
              id="permanent-address"
              name="permanent-address"
              rows="3"
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder="Enter your permanent address"
              value={permanentAddress}
              onChange={(e) => setPermanentAddress(e.target.value)}
            ></textarea>
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

          {/* University Name (Conditional) */}
          {selectedCountry && (
            <div className="mb-4">
              <label htmlFor="university" className="block text-gray-300 text-sm font-semibold mb-2">University Name</label>
              <select
                id="university"
                name="university"
                className="w-full px-4 py-2 rounded-md bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                value={selectedUniversity}
                onChange={handleUniversityChange}
                disabled={universities.length === 0}
                required
              >
                <option value="">Select University</option>
                {universities.map(university => (
                  <option key={university.id} value={university.name}>
                    {university.name}
                  </option>
                ))}
              </select>
              {universities.length === 0 && (
                <p className="text-xs text-gray-400 mt-1">Loading universities...</p>
              )}
            </div>
          )}

          {/* Department (Conditional) */}
          {selectedUniversity && (
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
                {departments.map(department => (
                  <option key={department.id} value={department.id}>
                    {department.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* CV Upload */}
          <div className="mb-6">
            <label htmlFor="cv" className="block text-gray-300 text-sm font-semibold mb-2">Upload CV (PDF only)</label>
            <div className="flex items-center justify-between">
              <input
                type="file"
                id="cv"
                name="cv"
                className="hidden"
                accept=".pdf"
                onChange={handleFileChange}
              />
              <label
                htmlFor="cv"
                className="px-4 py-2 rounded-md bg-gray-700 text-gray-100 border border-gray-600 hover:bg-gray-600 cursor-pointer transition duration-200"
              >
                Choose File
              </label>
              <span className="text-gray-400 text-sm ml-2 truncate max-w-xs">
                {cvFile ? cvFile.name : 'No file chosen'}
              </span>
            </div>
            {cvFile && (
              <p className="text-xs text-gray-400 mt-1">PDF file selected</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-teal-500 transition duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Registering...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">Already have an account? <a href="/login" className="text-cyan-400 hover:underline">Login</a></p>
        </div>
      </div>
    </div>
  );
};

export default Register;