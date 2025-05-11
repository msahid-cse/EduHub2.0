import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Mail, Building, Phone, Globe, Info, ArrowLeft, Save, Upload, User, BookOpen, X, Download } from 'lucide-react';
import { apiClient, instructorService, universityService, departmentService } from '../api/apiClient';
import axios from 'axios';

const AddNewInstructor = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    university: '',
    specialization: '',
    courses: [],
    bio: '',
    website: '',
    isActive: true
  });
  
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentCourse, setCurrentCourse] = useState('');
  
  // For country and university selection
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [universities, setUniversities] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUniversities, setFilteredUniversities] = useState([]);
  const [isLoadingUniversities, setIsLoadingUniversities] = useState(false);
  const [showUniversityDropdown, setShowUniversityDropdown] = useState(false);
  
  // For department selection
  const [departments, setDepartments] = useState([]);
  const [departmentSearch, setDepartmentSearch] = useState('');
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);
  
  // For file upload
  const [csvFile, setCsvFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadOption, setUploadOption] = useState('manual'); // 'manual' or 'csv'
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState(null);

  // Add state for token
  const [token, setToken] = useState('');

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    console.log('Initial check - Authentication token available:', !!token);
    
    if (!token) {
      console.log('No token found, redirecting to login');
      navigate('/login');
      return;
    }
    
    // Set token in state
    setToken(token);
    
    // Ensure we have a userId in localStorage
    let userId = localStorage.getItem('userId');
    if (!userId) {
      console.log('No userId found in localStorage, using fallback');
      // Try to get userId from userInfo
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo) {
        try {
          const parsedUserInfo = JSON.parse(userInfo);
          if (parsedUserInfo.userId) {
            userId = parsedUserInfo.userId;
            localStorage.setItem('userId', userId);
          }
        } catch (e) {
          console.error('Error parsing userInfo:', e);
        }
      }
      
      // If still no userId, set a temporary one and warn user
      if (!userId) {
        userId = 'temp_' + Date.now();
        localStorage.setItem('userId', userId);
        console.warn('Using temporary userId:', userId);
        setError('Warning: User ID not found. Some features may not work correctly.');
      }
    }
    
    console.log('Using userId:', userId);
    
    // Verify API client setup
    console.log('API base URL:', import.meta.env?.VITE_API_URL || 'http://localhost:5000');
    
    // Log verification headers
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    console.log('API headers:', headers);
    
    // Fetch initial data
    fetchCountries();
    fetchDepartments();
  }, [navigate]);
  
  // Filter universities when search query or universities change
  useEffect(() => {
    if (universities.length > 0) {
      if (searchQuery.trim()) {
        const filtered = universities.filter(uni => 
          uni.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredUniversities(filtered.slice(0, 10)); // Limit to 10 results
        setShowUniversityDropdown(filtered.length > 0);
      } else {
        // If universities exist but no search query, show empty dropdown
        setFilteredUniversities([]);
        setShowUniversityDropdown(false);
      }
    } else {
      // No universities available
      setFilteredUniversities([]);
      setShowUniversityDropdown(false);
    }
  }, [searchQuery, universities]);
  
  // Filter departments when search term changes
  useEffect(() => {
    if (departmentSearch.trim()) {
      const filtered = departments.filter(dept => 
        dept.name.toLowerCase().includes(departmentSearch.toLowerCase())
      );
      setFilteredDepartments(filtered.slice(0, 10)); // Limit to 10 results
    } else {
      setFilteredDepartments([]);
    }
  }, [departmentSearch, departments]);

  const fetchCountries = async () => {
    try {
      // Comprehensive list of countries
      const allCountries = [
        { name: 'Afghanistan', code: 'AF' },
        { name: 'Albania', code: 'AL' },
        { name: 'Algeria', code: 'DZ' },
        { name: 'Andorra', code: 'AD' },
        { name: 'Angola', code: 'AO' },
        { name: 'Antigua and Barbuda', code: 'AG' },
        { name: 'Argentina', code: 'AR' },
        { name: 'Armenia', code: 'AM' },
        { name: 'Australia', code: 'AU' },
        { name: 'Austria', code: 'AT' },
        { name: 'Azerbaijan', code: 'AZ' },
        { name: 'Bahamas', code: 'BS' },
        { name: 'Bahrain', code: 'BH' },
        { name: 'Bangladesh', code: 'BD' },
        { name: 'Barbados', code: 'BB' },
        { name: 'Belarus', code: 'BY' },
        { name: 'Belgium', code: 'BE' },
        { name: 'Belize', code: 'BZ' },
        { name: 'Benin', code: 'BJ' },
        { name: 'Bhutan', code: 'BT' },
        { name: 'Bolivia', code: 'BO' },
        { name: 'Bosnia and Herzegovina', code: 'BA' },
        { name: 'Botswana', code: 'BW' },
        { name: 'Brazil', code: 'BR' },
        { name: 'Brunei', code: 'BN' },
        { name: 'Bulgaria', code: 'BG' },
        { name: 'Burkina Faso', code: 'BF' },
        { name: 'Burundi', code: 'BI' },
        { name: 'Cabo Verde', code: 'CV' },
        { name: 'Cambodia', code: 'KH' },
        { name: 'Cameroon', code: 'CM' },
        { name: 'Canada', code: 'CA' },
        { name: 'Central African Republic', code: 'CF' },
        { name: 'Chad', code: 'TD' },
        { name: 'Chile', code: 'CL' },
        { name: 'China', code: 'CN' },
        { name: 'Colombia', code: 'CO' },
        { name: 'Comoros', code: 'KM' },
        { name: 'Congo', code: 'CG' },
        { name: 'Costa Rica', code: 'CR' },
        { name: 'Cote d\'Ivoire', code: 'CI' },
        { name: 'Croatia', code: 'HR' },
        { name: 'Cuba', code: 'CU' },
        { name: 'Cyprus', code: 'CY' },
        { name: 'Czech Republic', code: 'CZ' },
        { name: 'Denmark', code: 'DK' },
        { name: 'Djibouti', code: 'DJ' },
        { name: 'Dominica', code: 'DM' },
        { name: 'Dominican Republic', code: 'DO' },
        { name: 'Ecuador', code: 'EC' },
        { name: 'Egypt', code: 'EG' },
        { name: 'El Salvador', code: 'SV' },
        { name: 'Equatorial Guinea', code: 'GQ' },
        { name: 'Eritrea', code: 'ER' },
        { name: 'Estonia', code: 'EE' },
        { name: 'Eswatini', code: 'SZ' },
        { name: 'Ethiopia', code: 'ET' },
        { name: 'Fiji', code: 'FJ' },
        { name: 'Finland', code: 'FI' },
        { name: 'France', code: 'FR' },
        { name: 'Gabon', code: 'GA' },
        { name: 'Gambia', code: 'GM' },
        { name: 'Georgia', code: 'GE' },
        { name: 'Germany', code: 'DE' },
        { name: 'Ghana', code: 'GH' },
        { name: 'Greece', code: 'GR' },
        { name: 'Grenada', code: 'GD' },
        { name: 'Guatemala', code: 'GT' },
        { name: 'Guinea', code: 'GN' },
        { name: 'Guinea-Bissau', code: 'GW' },
        { name: 'Guyana', code: 'GY' },
        { name: 'Haiti', code: 'HT' },
        { name: 'Honduras', code: 'HN' },
        { name: 'Hungary', code: 'HU' },
        { name: 'Iceland', code: 'IS' },
        { name: 'India', code: 'IN' },
        { name: 'Indonesia', code: 'ID' },
        { name: 'Iran', code: 'IR' },
        { name: 'Iraq', code: 'IQ' },
        { name: 'Ireland', code: 'IE' },
        { name: 'Israel', code: 'IL' },
        { name: 'Italy', code: 'IT' },
        { name: 'Jamaica', code: 'JM' },
        { name: 'Japan', code: 'JP' },
        { name: 'Jordan', code: 'JO' },
        { name: 'Kazakhstan', code: 'KZ' },
        { name: 'Kenya', code: 'KE' },
        { name: 'Kiribati', code: 'KI' },
        { name: 'Korea, North', code: 'KP' },
        { name: 'Korea, South', code: 'KR' },
        { name: 'Kosovo', code: 'XK' },
        { name: 'Kuwait', code: 'KW' },
        { name: 'Kyrgyzstan', code: 'KG' },
        { name: 'Laos', code: 'LA' },
        { name: 'Latvia', code: 'LV' },
        { name: 'Lebanon', code: 'LB' },
        { name: 'Lesotho', code: 'LS' },
        { name: 'Liberia', code: 'LR' },
        { name: 'Libya', code: 'LY' },
        { name: 'Liechtenstein', code: 'LI' },
        { name: 'Lithuania', code: 'LT' },
        { name: 'Luxembourg', code: 'LU' },
        { name: 'Madagascar', code: 'MG' },
        { name: 'Malawi', code: 'MW' },
        { name: 'Malaysia', code: 'MY' },
        { name: 'Maldives', code: 'MV' },
        { name: 'Mali', code: 'ML' },
        { name: 'Malta', code: 'MT' },
        { name: 'Marshall Islands', code: 'MH' },
        { name: 'Mauritania', code: 'MR' },
        { name: 'Mauritius', code: 'MU' },
        { name: 'Mexico', code: 'MX' },
        { name: 'Micronesia', code: 'FM' },
        { name: 'Moldova', code: 'MD' },
        { name: 'Monaco', code: 'MC' },
        { name: 'Mongolia', code: 'MN' },
        { name: 'Montenegro', code: 'ME' },
        { name: 'Morocco', code: 'MA' },
        { name: 'Mozambique', code: 'MZ' },
        { name: 'Myanmar', code: 'MM' },
        { name: 'Namibia', code: 'NA' },
        { name: 'Nauru', code: 'NR' },
        { name: 'Nepal', code: 'NP' },
        { name: 'Netherlands', code: 'NL' },
        { name: 'New Zealand', code: 'NZ' },
        { name: 'Nicaragua', code: 'NI' },
        { name: 'Niger', code: 'NE' },
        { name: 'Nigeria', code: 'NG' },
        { name: 'North Macedonia', code: 'MK' },
        { name: 'Norway', code: 'NO' },
        { name: 'Oman', code: 'OM' },
        { name: 'Pakistan', code: 'PK' },
        { name: 'Palau', code: 'PW' },
        { name: 'Palestine', code: 'PS' },
        { name: 'Panama', code: 'PA' },
        { name: 'Papua New Guinea', code: 'PG' },
        { name: 'Paraguay', code: 'PY' },
        { name: 'Peru', code: 'PE' },
        { name: 'Philippines', code: 'PH' },
        { name: 'Poland', code: 'PL' },
        { name: 'Portugal', code: 'PT' },
        { name: 'Qatar', code: 'QA' },
        { name: 'Romania', code: 'RO' },
        { name: 'Russia', code: 'RU' },
        { name: 'Rwanda', code: 'RW' },
        { name: 'Saint Kitts and Nevis', code: 'KN' },
        { name: 'Saint Lucia', code: 'LC' },
        { name: 'Saint Vincent and the Grenadines', code: 'VC' },
        { name: 'Samoa', code: 'WS' },
        { name: 'San Marino', code: 'SM' },
        { name: 'Sao Tome and Principe', code: 'ST' },
        { name: 'Saudi Arabia', code: 'SA' },
        { name: 'Senegal', code: 'SN' },
        { name: 'Serbia', code: 'RS' },
        { name: 'Seychelles', code: 'SC' },
        { name: 'Sierra Leone', code: 'SL' },
        { name: 'Singapore', code: 'SG' },
        { name: 'Slovakia', code: 'SK' },
        { name: 'Slovenia', code: 'SI' },
        { name: 'Solomon Islands', code: 'SB' },
        { name: 'Somalia', code: 'SO' },
        { name: 'South Africa', code: 'ZA' },
        { name: 'South Sudan', code: 'SS' },
        { name: 'Spain', code: 'ES' },
        { name: 'Sri Lanka', code: 'LK' },
        { name: 'Sudan', code: 'SD' },
        { name: 'Suriname', code: 'SR' },
        { name: 'Sweden', code: 'SE' },
        { name: 'Switzerland', code: 'CH' },
        { name: 'Syria', code: 'SY' },
        { name: 'Taiwan', code: 'TW' },
        { name: 'Tajikistan', code: 'TJ' },
        { name: 'Tanzania', code: 'TZ' },
        { name: 'Thailand', code: 'TH' },
        { name: 'Timor-Leste', code: 'TL' },
        { name: 'Togo', code: 'TG' },
        { name: 'Tonga', code: 'TO' },
        { name: 'Trinidad and Tobago', code: 'TT' },
        { name: 'Tunisia', code: 'TN' },
        { name: 'Turkey', code: 'TR' },
        { name: 'Turkmenistan', code: 'TM' },
        { name: 'Tuvalu', code: 'TV' },
        { name: 'Uganda', code: 'UG' },
        { name: 'Ukraine', code: 'UA' },
        { name: 'United Arab Emirates', code: 'AE' },
        { name: 'United Kingdom', code: 'GB' },
        { name: 'United States', code: 'US' },
        { name: 'Uruguay', code: 'UY' },
        { name: 'Uzbekistan', code: 'UZ' },
        { name: 'Vanuatu', code: 'VU' },
        { name: 'Vatican City', code: 'VA' },
        { name: 'Venezuela', code: 'VE' },
        { name: 'Vietnam', code: 'VN' },
        { name: 'Yemen', code: 'YE' },
        { name: 'Zambia', code: 'ZM' },
        { name: 'Zimbabwe', code: 'ZW' }
      ];
      
      // Sort countries alphabetically
      allCountries.sort((a, b) => a.name.localeCompare(b.name));
      
      setCountries(allCountries);
    } catch (err) {
      console.error('Error setting countries:', err);
      setCountries([]);
    }
  };

  const fetchUniversities = async (countryName) => {
    try {
      setIsLoadingUniversities(true);
      // Use universities.hipolabs.com API directly
      const response = await axios.get(
        `http://universities.hipolabs.com/search?country=${encodeURIComponent(countryName)}`
      );
      
      if (response.data && Array.isArray(response.data)) {
        // Format the data to match our expected format
        const formattedUniversities = response.data.map((uni, index) => ({
          id: `uni_${index}`,
          name: uni.name
        }));
        
        // Remove duplicates
        const uniqueUniversities = formattedUniversities.filter(
          (uni, index, self) => index === self.findIndex(u => u.name === uni.name)
        );
        
        setUniversities(uniqueUniversities);
      } else {
        setUniversities([]);
      }
    } catch (err) {
      console.error('Error fetching universities:', err);
      setUniversities([]);
    } finally {
      setIsLoadingUniversities(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await departmentService.getAllDepartments();
      setDepartments(response.data || []);
    } catch (err) {
      console.error('Error fetching departments:', err);
      setDepartments([]);
    }
  };

  const handleCountryChange = (e) => {
    const country = e.target.value;
    setSelectedCountry(country);
    
    if (country) {
      const countryName = countries.find(c => c.code === country)?.name;
      if (countryName) {
        fetchUniversities(countryName);
      }
    } else {
      setUniversities([]);
      setFilteredUniversities([]);
    }
    
    // Reset university selection
    setFormData({
      ...formData,
      university: ''
    });
    setSearchQuery('');
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUniversitySelect = (university) => {
    setFormData({
      ...formData,
      university: university.name
    });
    setSearchQuery(university.name);
    setShowUniversityDropdown(false);
    // Show a brief success indicator when a selection is made
    const selectedElement = document.getElementById('university-input');
    if (selectedElement) {
      selectedElement.classList.add('border-green-500');
      setTimeout(() => {
        selectedElement.classList.remove('border-green-500');
      }, 1000);
    }
  };

  const handleDepartmentSelect = (department) => {
    setFormData({
      ...formData,
      department: department.name
    });
    setDepartmentSearch(department.name);
    setShowDepartmentDropdown(false);
  };

  const handleAddCourse = () => {
    if (currentCourse.trim() && !formData.courses.includes(currentCourse.trim())) {
      setFormData({
        ...formData,
        courses: [...formData.courses, currentCourse.trim()]
      });
      setCurrentCourse('');
    }
  };

  const handleRemoveCourse = (course) => {
    setFormData({
      ...formData,
      courses: formData.courses.filter(c => c !== course)
    });
  };

  const handleCsvFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCsvFile(file);
      setUploadResult(null);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const response = await instructorService.getCSVTemplate();
      
      // Create a download link and trigger it
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'instructor-template.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading template:', error);
      setError('Failed to download template. Please try again later.');
    }
  };

  const handleCsvUpload = async () => {
    if (!csvFile || !formData.university) {
      setError('Please select a CSV file and specify university');
      return;
    }
    
    let progressInterval;
    
    try {
      // Check if user is authenticated
      const token = localStorage.getItem('token');
      console.log('CSV Upload - Authentication token available:', !!token);
      
      if (!token) {
        setError('You must be logged in to upload instructors');
        setTimeout(() => navigate('/login'), 2000);
        return;
      }
      
      setIsUploading(true);
      setUploadProgress(0);
      setError('');
      
      // Simulate progress updates (in a real app this would come from the actual upload)
      progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev < 90) return prev + 10;
          return prev;
        });
      }, 300);
      
      const formDataObj = new FormData();
      
      // Add university directly, not as JSON
      formDataObj.append('university', formData.university);
      
      // Add the CSV file
      formDataObj.append('instructorData', csvFile);
      
      console.log('CSV Upload - File info:', {
        name: csvFile.name,
        size: csvFile.size,
        type: csvFile.type,
        university: formData.university
      });
      
      // Get API URL with fallback
      const apiUrl = import.meta.env?.VITE_API_URL || 'http://localhost:5000';
      console.log('CSV Upload - Using API URL:', apiUrl);
      
      // Use the standard endpoint
      const response = await axios({
        method: 'post',
        url: `${apiUrl}/api/instructors/upload`,
        data: formDataObj,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log('CSV Upload - Success response:', response.status, response.data);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Check for specific success data structure
      if (response.data) {
        setUploadResult({
          success: true,
          message: 'Instructors uploaded successfully',
          data: {
            total: response.data.total || (response.data.success + response.data.failed) || 0,
            success: response.data.success || response.data.imported || 0,
            failed: response.data.failed || 0,
            errorDetails: response.data.errors || []
          }
        });
        
        setCsvFile(null);
        setTimeout(() => {
          navigate('/admindashboard');
        }, 3000);
      } else {
        throw new Error('Invalid response format from server');
      }
      
    } catch (error) {
      console.error('Error uploading instructors:', error);
      console.log('CSV Upload - Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        message: error.response?.data?.message,
        errorObj: error.toString()
      });
      
      // Clear the progress timer if it exists
      if (progressInterval) {
        clearInterval(progressInterval);
      }
      setUploadProgress(0);
      
      // Handle authentication errors
      if (error.response?.status === 401) {
        setError('Authentication failed. Please log in again.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else if (error.response?.status === 403) {
        setError('You do not have permission to upload instructors.');
      } else if (error.response?.status === 404) {
        setError('API endpoint not found. Please check server configuration.');
      } else {
        setError(error.response?.data?.message || 'Failed to upload instructors. Please try again.');
        setUploadResult({
          success: false,
          message: 'Failed to upload instructors',
          error: error.response?.data?.message || error.message || 'Unknown error'
        });
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // If CSV upload option is selected, handle it differently
    if (uploadOption === 'csv') {
      handleCsvUpload();
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Check if user is authenticated
      const token = localStorage.getItem('token');
      console.log('Authentication token available:', !!token);
      
      if (!token) {
        setError('You must be logged in to add an instructor');
        setLoading(false);
        setTimeout(() => navigate('/login'), 2000);
        return;
      }
      
      // Validate form
      if (!formData.name || !formData.email || !formData.department || !formData.university) {
        setError('Please fill in all required fields (name, email, department, and university)');
        setLoading(false);
        return;
      }
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('Please enter a valid email address');
        setLoading(false);
        return;
      }
      
      // Create FormData object for the request
      const formDataToSend = new FormData();
      
      // Add all basic form fields (individually, not as JSON)
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('university', formData.university);
      formDataToSend.append('department', formData.department);
      
      // Add optional fields if they exist
      if (formData.position) formDataToSend.append('position', formData.position);
      if (formData.bio) formDataToSend.append('bio', formData.bio);
      
      // Handle specializations
      if (formData.specialization) {
        formDataToSend.append('specializations', JSON.stringify([formData.specialization]));
      }
      
      // Handle courses
      if (formData.courses && formData.courses.length > 0) {
        formDataToSend.append('courses', JSON.stringify(formData.courses));
      }
      
      // Create contact info object
      const contactInfo = {};
      if (formData.phone) contactInfo.phone = formData.phone;
      if (formData.website) contactInfo.website = formData.website;
      
      // Only append contactInfo if we have contact information
      if (Object.keys(contactInfo).length > 0) {
        formDataToSend.append('contactInfo', JSON.stringify(contactInfo));
      }
      
      // Add profile image if one is selected
      if (profileImage) {
        formDataToSend.append('profilePicture', profileImage);
      }
      
      // Log the FormData entries for debugging
      console.log('Prepared form data entries:');
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0], pair[1]);
      }
      
      // Get API URL with fallback
      const apiUrl = import.meta.env?.VITE_API_URL || 'http://localhost:5000';
      console.log('Using API URL:', apiUrl);
      
      // Use the standard endpoint with explicit headers
      const response = await axios({
        method: 'post',
        url: `${apiUrl}/api/instructors`,
        data: formDataToSend,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log('Success response:', response.status, response.data);
      
      setSuccess('Instructor added successfully!');
      setTimeout(() => {
        navigate('/admindashboard');
      }, 2000);
    } catch (error) {
      console.error('Error adding instructor:', error);
      console.log('Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        message: error.response?.data?.message,
        errorObj: error.toString()
      });
      
      let errorMessage = 'Failed to add instructor. Please try again.';
      
      // Authentication errors
      if (error.response?.status === 401) {
        errorMessage = 'Authentication failed. Please log in again.';
        setTimeout(() => navigate('/login'), 2000);
      } else if (error.response?.status === 403) {
        errorMessage = 'You do not have permission to add instructors.';
      } else if (error.response?.status === 404) {
        errorMessage = 'API endpoint not found. Please check server configuration.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const clearUniversitySelection = () => {
    setFormData({
      ...formData,
      university: ''
    });
    setSearchQuery('');
    setFilteredUniversities([]);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-indigo-800 to-purple-900">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold flex items-center">
                <GraduationCap className="mr-2" size={24} />
                Add New Instructor
              </h1>
              <button
                onClick={() => navigate('/admindashboard')}
                className="px-3 py-1.5 bg-indigo-700/40 hover:bg-indigo-700/60 rounded-md text-sm transition-colors flex items-center"
              >
                <ArrowLeft size={16} className="mr-1" />
                Back to Dashboard
              </button>
            </div>
            <p className="text-indigo-200 mt-2">Add a new instructor to the EduHub platform</p>
          </div>
          
          {error && (
            <div className="bg-red-900/30 border border-red-500 text-red-300 p-4 m-6 rounded-md flex items-start">
              <Info className="mr-2 mt-0.5 text-red-400 shrink-0" size={18} />
              <span>{error}</span>
            </div>
          )}
          
          {success && (
            <div className="bg-green-900/30 border border-green-500 text-green-300 p-4 m-6 rounded-md flex items-start">
              <Info className="mr-2 mt-0.5 text-green-400 shrink-0" size={18} />
              <span>{success}</span>
            </div>
          )}
          
          {/* Upload option selector */}
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center space-x-4 mb-4">
              <span className="text-gray-300">Choose input method:</span>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setUploadOption('manual')}
                  className={`px-3 py-1.5 rounded-md transition-colors ${
                    uploadOption === 'manual' 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Manual Entry
                </button>
                <button
                  type="button"
                  onClick={() => setUploadOption('csv')}
                  className={`px-3 py-1.5 rounded-md transition-colors flex items-center ${
                    uploadOption === 'csv' 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <Upload size={16} className="mr-1" />
                  CSV Upload
                </button>
              </div>
            </div>
          </div>
          
          {uploadOption === 'csv' ? (
            <div className="p-6 space-y-6">
              <div className="bg-gray-700/50 p-6 rounded-lg border border-dashed border-gray-600">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-white">Upload Instructor Data</h3>
                  <button
                    type="button"
                    onClick={handleDownloadTemplate}
                    className="text-indigo-400 hover:text-indigo-300 flex items-center text-sm"
                  >
                    <Download size={16} className="mr-1" />
                    Download Template
                  </button>
                </div>
                
                <div className="space-y-4">
                  {/* Country Selection */}
                  <div>
                    <label className="block text-gray-300 mb-2">
                      Country <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={selectedCountry}
                      onChange={handleCountryChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:border-indigo-500"
                    >
                      <option value="">Select Country</option>
                      {countries.map(country => (
                        <option key={country.code} value={country.code}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* University Selection */}
                  <div>
                    <label className="block text-gray-300 mb-2">
                      University <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
                      <input
                        id="university-input"
                        type="text"
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          if (e.target.value === '') {
                            setFilteredUniversities([]);
                          } else if (universities.length > 0) {
                            const filtered = universities.filter(uni => 
                              uni.name.toLowerCase().includes(e.target.value.toLowerCase())
                            );
                            setFilteredUniversities(filtered.slice(0, 10));
                          }
                          setFormData({
                            ...formData,
                            university: e.target.value
                          });
                        }}
                        placeholder="Search for university"
                        className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:border-indigo-500"
                        onFocus={() => {
                          if (universities.length > 0 && searchQuery) {
                            setShowUniversityDropdown(true);
                          }
                        }}
                        onBlur={() => setTimeout(() => setShowUniversityDropdown(false), 200)}
                      />
                      
                      {/* Loading indicator */}
                      {isLoadingUniversities && (
                        <div className="absolute inset-y-0 right-3 flex items-center">
                          <svg className="animate-spin h-5 w-5 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        </div>
                      )}
                      
                      {/* Clear button */}
                      {searchQuery && !isLoadingUniversities && (
                        <button
                          type="button"
                          onClick={clearUniversitySelection}
                          className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-300"
                        >
                          <X size={16} />
                        </button>
                      )}
                      
                      {/* Dropdown menu */}
                      {showUniversityDropdown && filteredUniversities.length > 0 && (
                        <div className="absolute z-10 mt-1 w-full bg-gray-700 border border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
                          {filteredUniversities.map((university) => (
                            <div
                              key={university.id}
                              className="px-4 py-2 hover:bg-gray-600 cursor-pointer text-sm text-white"
                              onClick={() => handleUniversitySelect(university)}
                            >
                              {university.name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {/* Helper text */}
                    {selectedCountry && universities.length > 0 && (
                      <p className="text-xs text-gray-400 mt-1">
                        {universities.length} universities available. Type to search.
                      </p>
                    )}
                    {selectedCountry && universities.length === 0 && !isLoadingUniversities && (
                      <p className="text-xs text-gray-400 mt-1">
                        No universities found for this country. You can enter manually.
                      </p>
                    )}
                  </div>
                  
                  {/* File Upload */}
                  <div>
                    <label className="block text-gray-300 mb-2">
                      CSV File <span className="text-red-400">*</span>
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="file"
                        accept=".csv,.xlsx,.xls"
                        onChange={handleCsvFileChange}
                        className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-indigo-600 file:text-white hover:file:bg-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={handleCsvUpload}
                        disabled={!csvFile || !formData.university || isUploading}
                        className={`px-4 py-2 rounded-md flex items-center ${
                          !csvFile || !formData.university || isUploading
                            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                        }`}
                      >
                        {isUploading ? 'Uploading...' : 'Upload'}
                      </button>
                    </div>
                  </div>
                  
                  {/* Upload Progress */}
                  {isUploading && (
                    <div className="mt-4">
                      <div className="h-2 bg-gray-600 rounded-full">
                        <div 
                          className="h-full bg-indigo-500 rounded-full"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                      <p className="text-right text-xs text-gray-400 mt-1">{uploadProgress}%</p>
                    </div>
                  )}
                  
                  {/* File Selected */}
                  {csvFile && !isUploading && (
                    <div className="text-gray-300 text-sm">
                      Selected file: <span className="text-white">{csvFile.name}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Upload Result */}
              {uploadResult && (
                <div className={`p-4 rounded-lg ${
                  uploadResult.success ? 'bg-green-900/30 border border-green-500' : 'bg-red-900/30 border border-red-500'
                }`}>
                  <h3 className={`font-medium ${uploadResult.success ? 'text-green-300' : 'text-red-300'}`}>
                    {uploadResult.message}
                  </h3>
                  {uploadResult.data && (
                    <div className="mt-2 text-sm">
                      <p>Total: {uploadResult.data.total}</p>
                      <p>Successful: {uploadResult.data.success || uploadResult.data.imported}</p>
                      <p>Failed: {uploadResult.data.failed}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Profile Image Upload */}
                <div className="md:col-span-1">
                  <label className="block text-gray-300 mb-2">
                    Profile Image
                  </label>
                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-600 rounded-lg p-6 bg-gray-700/50 h-48">
                    {profileImagePreview ? (
                      <div className="relative w-32 h-32 rounded-full overflow-hidden">
                        <img
                          src={profileImagePreview}
                          alt="Profile preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setProfileImage(null);
                            setProfileImagePreview(null);
                          }}
                          className="absolute top-1 right-1 bg-red-500 rounded-full p-1 text-white"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <User className="mx-auto h-12 w-12 text-gray-500" />
                        <p className="mt-2 text-xs text-gray-400">
                          Upload a profile image
                        </p>
                        <input
                          type="file"
                          name="profileImage"
                          accept="image/*"
                          onChange={handleProfileImageChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Basic Info */}
                <div className="md:col-span-2 space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2">
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter instructor name"
                      className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:border-indigo-500"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 mb-2">
                        Email <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Enter email address"
                          className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:border-indigo-500"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-gray-300 mb-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="Enter phone number"
                          className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Country & University */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-300 mb-2">
                    Country
                  </label>
                  <select
                    value={selectedCountry}
                    onChange={handleCountryChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="">Select Country</option>
                    {countries.map(country => (
                      <option key={country.code} value={country.code}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">
                    University
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
                    <input
                      id="university-input"
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        if (e.target.value === '') {
                          setFilteredUniversities([]);
                        } else if (universities.length > 0) {
                          const filtered = universities.filter(uni => 
                            uni.name.toLowerCase().includes(e.target.value.toLowerCase())
                          );
                          setFilteredUniversities(filtered.slice(0, 10));
                        }
                        setFormData({
                          ...formData,
                          university: e.target.value
                        });
                      }}
                      placeholder="Search for university"
                      className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:border-indigo-500"
                      onFocus={() => {
                        if (universities.length > 0 && searchQuery) {
                          setShowUniversityDropdown(true);
                        }
                      }}
                      onBlur={() => setTimeout(() => setShowUniversityDropdown(false), 200)}
                    />
                    
                    {/* Loading indicator */}
                    {isLoadingUniversities && (
                      <div className="absolute inset-y-0 right-3 flex items-center">
                        <svg className="animate-spin h-5 w-5 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </div>
                    )}
                    
                    {/* Clear button */}
                    {searchQuery && !isLoadingUniversities && (
                      <button
                        type="button"
                        onClick={clearUniversitySelection}
                        className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-300"
                      >
                        <X size={16} />
                      </button>
                    )}
                    
                    {/* Dropdown menu */}
                    {showUniversityDropdown && filteredUniversities.length > 0 && (
                      <div className="absolute z-10 mt-1 w-full bg-gray-700 border border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
                        {filteredUniversities.map((university) => (
                          <div
                            key={university.id}
                            className="px-4 py-2 hover:bg-gray-600 cursor-pointer text-sm text-white"
                            onClick={() => handleUniversitySelect(university)}
                          >
                            {university.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Helper text */}
                  {selectedCountry && universities.length > 0 && (
                    <p className="text-xs text-gray-400 mt-1">
                      {universities.length} universities available. Type to search.
                    </p>
                  )}
                  {selectedCountry && universities.length === 0 && !isLoadingUniversities && (
                    <p className="text-xs text-gray-400 mt-1">
                      No universities found for this country. You can enter manually.
                    </p>
                  )}
                </div>
              </div>
              
              {/* Position & Department */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-300 mb-2">
                    Position
                  </label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    placeholder="e.g. Professor, Assistant Professor"
                    className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">
                    Department <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={departmentSearch}
                      onChange={(e) => {
                        setDepartmentSearch(e.target.value);
                        setFormData({
                          ...formData,
                          department: e.target.value
                        });
                        setShowDepartmentDropdown(true);
                      }}
                      placeholder="Search for department"
                      className="w-full py-2 px-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:border-indigo-500"
                      onFocus={() => setShowDepartmentDropdown(true)}
                      onBlur={() => setTimeout(() => setShowDepartmentDropdown(false), 200)}
                      required
                    />
                    {showDepartmentDropdown && filteredDepartments.length > 0 && (
                      <div className="absolute z-10 mt-1 w-full bg-gray-700 border border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
                        {filteredDepartments.map((department) => (
                          <div
                            key={department._id}
                            className="px-4 py-2 hover:bg-gray-600 cursor-pointer"
                            onClick={() => handleDepartmentSelect(department)}
                          >
                            {department.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Specialization */}
              <div>
                <label className="block text-gray-300 mb-2">
                  Specialization
                </label>
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  placeholder="e.g. Machine Learning, Organic Chemistry"
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:border-indigo-500"
                />
              </div>
              
              {/* Courses */}
              <div>
                <label className="block text-gray-300 mb-2">
                  Courses
                </label>
                <div className="flex mb-2">
                  <div className="relative flex-grow">
                    <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
                    <input
                      type="text"
                      value={currentCourse}
                      onChange={(e) => setCurrentCourse(e.target.value)}
                      placeholder="Enter course name"
                      className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-l-md focus:outline-none focus:border-indigo-500"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCourse())}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddCourse}
                    className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-r-md"
                  >
                    Add
                  </button>
                </div>
                {formData.courses.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.courses.map((course, index) => (
                      <span
                        key={index}
                        className="bg-indigo-900/30 text-indigo-300 px-2 py-1 rounded-md text-sm flex items-center"
                      >
                        {course}
                        <button
                          type="button"
                          onClick={() => handleRemoveCourse(course)}
                          className="ml-2 text-indigo-300 hover:text-indigo-100"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Bio */}
              <div>
                <label className="block text-gray-300 mb-2">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Enter instructor bio"
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:border-indigo-500 min-h-[120px]"
                ></textarea>
              </div>
              
              {/* Website */}
              <div>
                <label className="block text-gray-300 mb-2">
                  Website
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="e.g. https://example.com"
                    className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
              
              {/* Active Status */}
              <div>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-500 rounded focus:ring-2 focus:ring-indigo-500 bg-gray-700 border-gray-600"
                  />
                  <span className="text-gray-300">Instructor is active</span>
                </label>
              </div>
              
              {/* Submit Button */}
              <div className="flex justify-end space-x-4 mt-8">
                <button
                  type="button"
                  onClick={() => navigate('/admindashboard')}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md font-medium transition-colors flex items-center ${
                    loading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2" size={18} />
                      Add Instructor
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddNewInstructor; 