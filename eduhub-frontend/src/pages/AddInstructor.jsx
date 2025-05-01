import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Upload, 
  CheckCircle, 
  XCircle, 
  Download,
  Plus,
  Trash2,
  Search
} from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';
import { instructorService } from '../api/apiClient';

const AddInstructor = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [uploadOption, setUploadOption] = useState('file'); // 'file' or 'manual'
  
  // File upload states
  const [instructorUploadFile, setInstructorUploadFile] = useState(null);
  const [isInstructorUploading, setIsInstructorUploading] = useState(false);
  const [instructorUploadProgress, setInstructorUploadProgress] = useState(0);
  const [instructorUploadResult, setInstructorUploadResult] = useState(null);
  const fileInputRef = useRef(null);
  
  // Manual entry states
  const [manualInstructors, setManualInstructors] = useState([{ name: '', email: '', position: '', department: '' }]);
  
  // University selection states
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [universities, setUniversities] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState('');
  const [universitySearch, setUniversitySearch] = useState('');
  const [filteredUniversities, setFilteredUniversities] = useState([]);
  const [isCountriesLoading, setIsCountriesLoading] = useState(false);
  const [isUniversitiesLoading, setIsUniversitiesLoading] = useState(false);

  useEffect(() => {
    // Check authentication and role
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userRole = localStorage.getItem('userRole');
    
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    
    if (userRole !== 'admin') {
      navigate('/userdashboard');
      return;
    }
    
    // Fetch countries
    fetchCountries();
  }, [navigate]);

  // Filter universities based on search
  useEffect(() => {
    if (universitySearch.trim() === '') {
      setFilteredUniversities(universities);
    } else {
      const filtered = universities.filter(uni => 
        uni.name.toLowerCase().includes(universitySearch.toLowerCase())
      );
      setFilteredUniversities(filtered);
    }
  }, [universitySearch, universities]);

  const fetchCountries = async () => {
    try {
      setIsCountriesLoading(true);
      // In a real app, this would be an API call
      // For this example, we'll simulate a delay and return mock data
      setTimeout(() => {
        const mockCountries = [
          { code: 'US', name: 'United States' },
          { code: 'UK', name: 'United Kingdom' },
          { code: 'CA', name: 'Canada' },
          { code: 'AU', name: 'Australia' },
          { code: 'IN', name: 'India' }
        ];
        setCountries(mockCountries);
        setIsCountriesLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching countries:', error);
      setIsCountriesLoading(false);
    }
  };

  const fetchUniversities = async (countryCode) => {
    try {
      setIsUniversitiesLoading(true);
      // In a real app, this would be an API call
      // For this example, we'll simulate a delay and return mock data based on country
      setTimeout(() => {
        let mockUniversities = [];
        
        switch(countryCode) {
          case 'US':
            mockUniversities = [
              { id: 1, name: 'Harvard University' },
              { id: 2, name: 'Stanford University' },
              { id: 3, name: 'MIT' }
            ];
            break;
          case 'UK':
            mockUniversities = [
              { id: 4, name: 'Oxford University' },
              { id: 5, name: 'Cambridge University' },
              { id: 6, name: 'Imperial College London' }
            ];
            break;
          case 'IN':
            mockUniversities = [
              { id: 7, name: 'IIT Delhi' },
              { id: 8, name: 'IIT Bombay' },
              { id: 9, name: 'Delhi University' }
            ];
            break;
          default:
            mockUniversities = [
              { id: 10, name: 'University 1' },
              { id: 11, name: 'University 2' },
              { id: 12, name: 'University 3' }
            ];
        }
        
        setUniversities(mockUniversities);
        setFilteredUniversities(mockUniversities);
        setIsUniversitiesLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching universities:', error);
      setIsUniversitiesLoading(false);
    }
  };

  const handleCountryChange = (e) => {
    const countryCode = e.target.value;
    setSelectedCountry(countryCode);
    setSelectedUniversity('');
    setUniversitySearch('');
    
    if (countryCode) {
      fetchUniversities(countryCode);
    } else {
      setUniversities([]);
      setFilteredUniversities([]);
    }
  };

  const handleUniversityChange = (e) => {
    setSelectedUniversity(e.target.value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setInstructorUploadFile(file);
      setInstructorUploadResult(null); // Reset previous result
    }
  };

  const handleFileUpload = async () => {
    if (!instructorUploadFile || !selectedUniversity) return;
    
    try {
      setIsInstructorUploading(true);
      setInstructorUploadProgress(0);
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setInstructorUploadProgress(prev => {
          const newProgress = prev + 10;
          if (newProgress >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return newProgress;
        });
      }, 500);
      
      // In a real app, this would be an API call
      // Simulate API call delay
      setTimeout(() => {
        clearInterval(progressInterval);
        setInstructorUploadProgress(100);
        
        // Simulate success response
        setInstructorUploadResult({
          success: true,
          message: 'File uploaded successfully',
          data: {
            total: 15,
            imported: 12,
            errors: 3,
            errorDetails: [
              { row: 2, error: 'Invalid email format' },
              { row: 5, error: 'Missing position' },
              { row: 8, error: 'Duplicate email' }
            ]
          }
        });
        
        setIsInstructorUploading(false);
        setInstructorUploadFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }, 5000);
      
    } catch (error) {
      console.error('Error uploading file:', error);
      setIsInstructorUploading(false);
      setInstructorUploadProgress(0);
      setInstructorUploadResult({
        success: false,
        message: 'Upload failed: ' + (error.message || 'Unknown error')
      });
    }
  };

  const handleAddManualInstructor = () => {
    setManualInstructors([...manualInstructors, { name: '', email: '', position: '', department: '' }]);
  };

  const handleRemoveManualInstructor = (index) => {
    const newInstructors = [...manualInstructors];
    newInstructors.splice(index, 1);
    setManualInstructors(newInstructors);
  };

  const handleManualInstructorChange = (index, field, value) => {
    const newInstructors = [...manualInstructors];
    newInstructors[index][field] = value;
    setManualInstructors(newInstructors);
  };

  const handleManualSubmit = async () => {
    if (!selectedUniversity) return;
    
    try {
      // In a real app, this would be an API call
      console.log('Submitting manual instructors:', manualInstructors);
      
      // Simulate success message
      setInstructorUploadResult({
        success: true,
        message: 'Instructors added successfully',
        data: {
          total: manualInstructors.length,
          imported: manualInstructors.length,
          errors: 0
        }
      });
      
      // Reset form
      setManualInstructors([{ name: '', email: '', position: '', department: '' }]);
      
    } catch (error) {
      console.error('Error adding instructors:', error);
      setInstructorUploadResult({
        success: false,
        message: 'Failed to add instructors: ' + (error.message || 'Unknown error')
      });
    }
  };

  const handleDownloadTemplate = () => {
    // In a real app, this would download a CSV template
    console.log('Download template clicked');
  };

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen flex">
      {/* Sidebar */}
      <AdminSidebar 
        collapsed={sidebarCollapsed} 
        setCollapsed={setSidebarCollapsed} 
        active="instructors" 
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* Header */}
        <header className="bg-gray-800 p-4 border-b border-gray-700">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold text-cyan-400">Manage Instructors</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-300">Welcome, Admin!</span>
              <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white">
                View Site
              </button>
            </div>
          </div>
        </header>

        <div className="container mx-auto p-6">
          {/* University Selection */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 shadow-lg mb-6">
            <h2 className="text-xl font-bold text-white mb-4">Select University</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Country Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Country
                </label>
                <select
                  value={selectedCountry}
                  onChange={handleCountryChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  disabled={isCountriesLoading}
                >
                  <option value="">Select Country</option>
                  {countries.map(country => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </select>
                {isCountriesLoading && (
                  <p className="mt-2 text-sm text-gray-400">Loading countries...</p>
                )}
              </div>
              
              {/* University Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  University
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={universitySearch}
                    onChange={(e) => setUniversitySearch(e.target.value)}
                    placeholder="Search university..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    disabled={!selectedCountry || isUniversitiesLoading}
                  />
                </div>
                
                {isUniversitiesLoading ? (
                  <p className="mt-2 text-sm text-gray-400">Loading universities...</p>
                ) : (
                  <select
                    value={selectedUniversity}
                    onChange={handleUniversityChange}
                    className="w-full mt-2 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    disabled={!selectedCountry || filteredUniversities.length === 0}
                    size={filteredUniversities.length > 0 ? Math.min(5, filteredUniversities.length) : 1}
                  >
                    <option value="">Select University</option>
                    {filteredUniversities.map(uni => (
                      <option key={uni.id} value={uni.id}>
                        {uni.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          </div>

          {/* Upload Options */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 shadow-lg mb-6">
            <h2 className="text-xl font-bold text-white mb-4">Add Instructors</h2>
            
            <div className="flex flex-wrap gap-4 mb-6">
              <button
                onClick={() => setUploadOption('file')}
                className={`px-4 py-2 rounded-lg flex items-center ${
                  uploadOption === 'file' 
                    ? 'bg-cyan-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <Upload className="h-5 w-5 mr-2" />
                Bulk Upload
              </button>
              
              <button
                onClick={() => setUploadOption('manual')}
                className={`px-4 py-2 rounded-lg flex items-center ${
                  uploadOption === 'manual' 
                    ? 'bg-cyan-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <Users className="h-5 w-5 mr-2" />
                Manual Entry
              </button>
            </div>
            
            {uploadOption === 'file' ? (
              <div className="space-y-4">
                <div className="bg-gray-700/50 p-4 rounded-lg border border-dashed border-gray-500">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-gray-300">Upload CSV file with instructor details</p>
                    <button
                      onClick={handleDownloadTemplate}
                      className="text-cyan-400 hover:text-cyan-300 flex items-center"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Template
                    </button>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept=".csv"
                      className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-gray-600 file:text-white hover:file:bg-gray-500"
                    />
                    
                    <button
                      onClick={handleFileUpload}
                      disabled={!instructorUploadFile || !selectedUniversity || isInstructorUploading}
                      className={`px-4 py-2 rounded-lg ${
                        !instructorUploadFile || !selectedUniversity || isInstructorUploading
                          ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                          : 'bg-green-600 text-white hover:bg-green-500'
                      }`}
                    >
                      {isInstructorUploading ? 'Uploading...' : 'Upload'}
                    </button>
                  </div>
                  
                  {isInstructorUploading && (
                    <div className="mt-4">
                      <div className="h-2 bg-gray-600 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-cyan-500" 
                          style={{ width: `${instructorUploadProgress}%` }}
                        ></div>
                      </div>
                      <p className="text-right text-sm text-gray-400 mt-1">
                        {instructorUploadProgress}%
                      </p>
                    </div>
                  )}
                </div>
                
                {instructorUploadFile && !isInstructorUploading && (
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <p className="text-gray-300">
                      Selected file: <span className="text-white">{instructorUploadFile.name}</span>
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {manualInstructors.map((instructor, index) => (
                  <div key={index} className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-medium text-gray-200">Instructor {index + 1}</h3>
                      {index > 0 && (
                        <button
                          onClick={() => handleRemoveManualInstructor(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Name
                        </label>
                        <input
                          type="text"
                          value={instructor.name}
                          onChange={(e) => handleManualInstructorChange(index, 'name', e.target.value)}
                          className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                          placeholder="John Doe"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          value={instructor.email}
                          onChange={(e) => handleManualInstructorChange(index, 'email', e.target.value)}
                          className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                          placeholder="john.doe@example.com"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Position
                        </label>
                        <input
                          type="text"
                          value={instructor.position}
                          onChange={(e) => handleManualInstructorChange(index, 'position', e.target.value)}
                          className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                          placeholder="Professor"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Department
                        </label>
                        <input
                          type="text"
                          value={instructor.department}
                          onChange={(e) => handleManualInstructorChange(index, 'department', e.target.value)}
                          className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                          placeholder="Computer Science"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="flex justify-between">
                  <button
                    onClick={handleAddManualInstructor}
                    className="px-4 py-2 bg-gray-700 text-gray-300 hover:bg-gray-600 rounded-lg flex items-center"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Add Another
                  </button>
                  
                  <button
                    onClick={handleManualSubmit}
                    disabled={!selectedUniversity}
                    className={`px-6 py-2 rounded-lg ${
                      !selectedUniversity
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-500'
                    }`}
                  >
                    Submit
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Results Section */}
          {instructorUploadResult && (
            <div className={`bg-gray-800 rounded-lg p-6 border ${
              instructorUploadResult.success 
                ? 'border-green-500' 
                : 'border-red-500'
            } shadow-lg`}>
              <div className="flex items-start">
                {instructorUploadResult.success ? (
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                ) : (
                  <XCircle className="h-6 w-6 text-red-500 mr-3 flex-shrink-0" />
                )}
                
                <div>
                  <h3 className={`text-lg font-medium ${
                    instructorUploadResult.success ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {instructorUploadResult.message}
                  </h3>
                  
                  {instructorUploadResult.success && instructorUploadResult.data && (
                    <div className="mt-3 space-y-2">
                      <p className="text-gray-300">
                        Total records: <span className="text-white">{instructorUploadResult.data.total}</span>
                      </p>
                      <p className="text-gray-300">
                        Successfully imported: <span className="text-green-400">{instructorUploadResult.data.imported}</span>
                      </p>
                      {instructorUploadResult.data.errors > 0 && (
                        <p className="text-gray-300">
                          Errors: <span className="text-red-400">{instructorUploadResult.data.errors}</span>
                        </p>
                      )}
                      
                      {instructorUploadResult.data.errorDetails && instructorUploadResult.data.errorDetails.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-gray-300 mb-2">Error Details:</h4>
                          <ul className="space-y-1 text-sm text-red-400">
                            {instructorUploadResult.data.errorDetails.map((error, index) => (
                              <li key={index}>
                                Row {error.row}: {error.error}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AddInstructor; 