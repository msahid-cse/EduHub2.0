import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  Bell, 
  ArrowLeft, 
  AlertCircle, 
  Check, 
  BookOpen, 
  Calendar, 
  MessageCircle, 
  Megaphone,
  Upload,
  Paperclip,
  X,
  FileText
} from "lucide-react";

function PostNotice() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [form, setForm] = useState({
    title: "",
    content: "",
    category: "general",
    importance: "normal",
    targetUniversity: "",
    attachment: ""
  });

  // Countries and universities state
  const [countries, setCountries] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [countriesLoading, setCountriesLoading] = useState(true);
  const [universitiesLoading, setUniversitiesLoading] = useState(false);

  // PDF file upload state
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfFileName, setPdfFileName] = useState("");
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  // Validation state
  const [errors, setErrors] = useState({});

  // Check if user is admin
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    
    if (!token || userRole !== 'admin') {
      navigate('/login', { state: { message: 'You must be logged in as admin to access this page' } });
    }
  }, [navigate]);

  // Fetch countries on component mount
  useEffect(() => {
    const fetchCountries = async () => {
      setCountriesLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/universities/countries');
        setCountries(response.data);
      } catch (error) {
        console.error('Error fetching countries:', error);
        setMessage({
          text: "Failed to load countries. Please refresh the page.",
          type: "error"
        });
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
        setUniversitiesLoading(true);
        try {
          const countryName = countries.find(c => c.code === selectedCountry)?.name;
          if (!countryName) return;
          
          // Try direct API first for more comprehensive results
          try {
            console.log(`Fetching universities for ${countryName}`);
            const directResponse = await axios.get(
              `http://universities.hipolabs.com/search?country=${encodeURIComponent(countryName)}`,
              { timeout: 8000 } // 8 second timeout
            );
            
            if (directResponse.data && Array.isArray(directResponse.data) && directResponse.data.length > 0) {
              console.log(`Found ${directResponse.data.length} universities from direct API`);
              const formattedUniversities = directResponse.data
                .filter((uni, index, self) => 
                  index === self.findIndex(u => u.name === uni.name)
                )
                .map((uni, index) => ({
                  name: uni.name,
                  id: `uni_${index}`,
                }))
                .sort((a, b) => a.name.localeCompare(b.name));
              
              setUniversities(formattedUniversities);
              setForm(prev => ({ ...prev, targetUniversity: "" }));
              setMessage({ text: "", type: "" }); // Clear any previous error
              setUniversitiesLoading(false);
              return;
            } else {
              console.log('Empty response from direct API, trying backend');
            }
          } catch (directApiError) {
            console.error('Direct API university fetch failed:', directApiError);
            // Fall back to backend if direct API fails
          }
          
          // Fall back to backend endpoint if direct API fails
          try {
            const response = await axios.get(
              `http://localhost:5000/api/universities?country=${encodeURIComponent(countryName)}`
            );
            
            if (response.data && Array.isArray(response.data) && response.data.length > 0) {
              console.log(`Found ${response.data.length} universities from backend`);
              setUniversities(response.data);
              setForm(prev => ({ ...prev, targetUniversity: "" }));
              setMessage({ text: "", type: "" }); // Clear any previous error
            } else {
              throw new Error('Empty response from backend');
            }
          } catch (backendError) {
            console.error('Backend university fetch failed:', backendError);
            
            // Use fallback universities for this country if both APIs fail
            const fallbackUniversities = getFallbackUniversities(countryName);
            console.log(`Using ${fallbackUniversities.length} fallback universities`);
            setUniversities(fallbackUniversities);
            setForm(prev => ({ ...prev, targetUniversity: "" }));
          }
        } catch (error) {
          console.error('Error fetching universities:', error);
          setMessage({
            text: "Failed to load universities. Using fallback list.",
            type: "error"
          });
          
          // Use generic fallback universities in case of any error
          const countryName = countries.find(c => c.code === selectedCountry)?.name || '';
          const fallbackUniversities = getFallbackUniversities(countryName);
          setUniversities(fallbackUniversities);
        } finally {
          setUniversitiesLoading(false);
        }
      } else {
        setUniversities([]);
      }
    };
    
    fetchUniversities();
  }, [selectedCountry, countries]);

  // Helper function to get fallback universities by country
  const getFallbackUniversities = (countryName) => {
    // Common universities fallback by country
    const fallbackMap = {
      'Bangladesh': [
        { name: 'University of Dhaka', id: 'uni_bd_1' },
        { name: 'Bangladesh University of Engineering and Technology', id: 'uni_bd_2' },
        { name: 'North South University', id: 'uni_bd_3' },
        { name: 'BRAC University', id: 'uni_bd_4' },
        { name: 'Dhaka Medical College', id: 'uni_bd_5' },
        { name: 'Jahangirnagar University', id: 'uni_bd_6' },
        { name: 'East West University', id: 'uni_bd_7' },
        { name: 'United International University', id: 'uni_bd_8' },
        { name: 'Chittagong University', id: 'uni_bd_9' },
        { name: 'Rajshahi University', id: 'uni_bd_10' },
        { name: 'Khulna University', id: 'uni_bd_11' },
        { name: 'American International University-Bangladesh', id: 'uni_bd_12' }
      ],
      'United States': [
        { name: 'Harvard University', id: 'uni_us_1' },
        { name: 'Massachusetts Institute of Technology', id: 'uni_us_2' },
        { name: 'Stanford University', id: 'uni_us_3' },
        { name: 'University of California, Berkeley', id: 'uni_us_4' },
        { name: 'Yale University', id: 'uni_us_5' },
        { name: 'Princeton University', id: 'uni_us_6' },
        { name: 'Columbia University', id: 'uni_us_7' },
        { name: 'University of Chicago', id: 'uni_us_8' },
        { name: 'New York University', id: 'uni_us_9' },
        { name: 'University of Michigan', id: 'uni_us_10' }
      ],
      'United Kingdom': [
        { name: 'University of Oxford', id: 'uni_uk_1' },
        { name: 'University of Cambridge', id: 'uni_uk_2' },
        { name: 'Imperial College London', id: 'uni_uk_3' },
        { name: 'University College London', id: 'uni_uk_4' },
        { name: 'University of Edinburgh', id: 'uni_uk_5' },
        { name: 'King\'s College London', id: 'uni_uk_6' },
        { name: 'London School of Economics', id: 'uni_uk_7' },
        { name: 'University of Manchester', id: 'uni_uk_8' }
      ],
      'India': [
        { name: 'Indian Institute of Technology Bombay', id: 'uni_in_1' },
        { name: 'Indian Institute of Science', id: 'uni_in_2' },
        { name: 'University of Delhi', id: 'uni_in_3' },
        { name: 'Jawaharlal Nehru University', id: 'uni_in_4' },
        { name: 'Tata Institute of Fundamental Research', id: 'uni_in_5' },
        { name: 'Indian Institute of Technology Delhi', id: 'uni_in_6' },
        { name: 'Indian Institute of Technology Madras', id: 'uni_in_7' },
        { name: 'University of Mumbai', id: 'uni_in_8' }
      ]
    };
    
    // Return fallback for selected country or default generic list
    return fallbackMap[countryName] || [
      { name: 'National University', id: 'uni_default_1' },
      { name: 'Technical University', id: 'uni_default_2' },
      { name: 'Regional University', id: 'uni_default_3' },
      { name: 'Central University', id: 'uni_default_4' },
      { name: 'International University', id: 'uni_default_5' }
    ];
  };

  // Clean up PDF preview URL on unmount
  useEffect(() => {
    return () => {
      if (pdfPreviewUrl) {
        URL.revokeObjectURL(pdfPreviewUrl);
      }
    };
  }, [pdfPreviewUrl]);

  const validateForm = () => {
    const newErrors = {};
    
    // Required fields
    if (!form.title.trim()) newErrors.title = "Notice title is required";
    if (!form.content.trim()) newErrors.content = "Notice content is required";
    if (!form.targetUniversity.trim()) newErrors.targetUniversity = "Target university is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePdfChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type
    if (file.type !== 'application/pdf') {
      setMessage({
        text: "Only PDF files are allowed",
        type: "error"
      });
      return;
    }
    
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({
        text: "File too large. Maximum size is 5MB",
        type: "error"
      });
      return;
    }
    
    // Clear any previous error
    if (message.type === "error") {
      setMessage({ text: "", type: "" });
    }
    
    setPdfFile(file);
    setPdfFileName(file.name);
    
    // Create a preview URL
    const previewUrl = URL.createObjectURL(file);
    setPdfPreviewUrl(previewUrl);
  };

  const uploadPdf = async () => {
    if (!pdfFile) return null;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      const token = localStorage.getItem('token');
      
      const formData = new FormData();
      formData.append('pdfFile', pdfFile);
      
      const response = await axios.post(
        'http://localhost:5000/api/notices/upload-pdf',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(progress);
          }
        }
      );
      
      setIsUploading(false);
      return response.data.filePath;
    } catch (error) {
      console.error("Error uploading PDF:", error);
      
      let errorMessage = "Failed to upload PDF file";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      setMessage({
        text: errorMessage,
        type: "error"
      });
      
      setIsUploading(false);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setMessage({
        text: "Please fix the errors in the form",
        type: "error"
      });
      return;
    }
    
    setIsSubmitting(true);
    setMessage({ text: "", type: "" });
    
    try {
      // Upload PDF file if selected
      let pdfPath = null;
      if (pdfFile) {
        pdfPath = await uploadPdf();
        if (!pdfPath) {
          setIsSubmitting(false);
          return; // Error occurred during upload
        }
      }
      
      const token = localStorage.getItem('token');
      
      // Prepare notice data with PDF path if available
      const noticeData = {
        ...form,
        pdfAttachment: pdfPath // Changed from attachment to pdfAttachment to match backend model
      };
      
      console.log('Sending notice data:', noticeData); // Debug log
      
      const response = await axios.post(
        'http://localhost:5000/api/notices',
        noticeData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      setMessage({
        text: "Notice posted successfully!",
        type: "success"
      });
      
      // Reset form
      setForm({
        title: "",
        content: "",
        category: "general",
        importance: "normal",
        targetUniversity: "",
        attachment: ""
      });
      setSelectedCountry("");
      setPdfFile(null);
      setPdfFileName("");
      if (pdfPreviewUrl) {
        URL.revokeObjectURL(pdfPreviewUrl);
        setPdfPreviewUrl("");
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/admin');
      }, 2000);
      
    } catch (error) {
      console.error("Error posting notice:", error);
      let errorMessage = "Failed to post notice. Please try again.";
      
      if (error.response) {
        // Log detailed error information
        console.error("Response error details:", error.response.data);
        
        errorMessage = error.response.data.message || error.response.data.error || errorMessage;
        
        // Show validation errors if available
        if (error.response.data.errors && Array.isArray(error.response.data.errors)) {
          errorMessage = "Validation error: " + error.response.data.errors.join(", ");
        }
        
        if (error.response.status === 401) {
          errorMessage = "Authentication failed. Please login again.";
          setTimeout(() => {
            localStorage.removeItem('token');
            localStorage.removeItem('isLoggedIn');
            navigate('/login');
          }, 2000);
        }
      } else if (error.request) {
        errorMessage = "No response from server. Please check your connection.";
      }
      
      setMessage({
        text: errorMessage,
        type: "error"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleCountryChange = (e) => {
    setSelectedCountry(e.target.value);
  };

  const removePdf = () => {
    setPdfFile(null);
    setPdfFileName("");
    if (pdfPreviewUrl) {
      URL.revokeObjectURL(pdfPreviewUrl);
      setPdfPreviewUrl("");
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6">
      <div className="max-w-3xl mx-auto bg-gray-800 p-8 rounded-xl shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-amber-400">
              <Bell className="w-8 h-8 inline-block mr-2 text-amber-400" />
              Post New Notice
            </h1>
            <p className="text-gray-400 mt-1">Create a new notice for students and faculty</p>
          </div>
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Dashboard
          </button>
        </div>
        
        {message.text && (
          <div className={`p-4 mb-6 rounded-md ${message.type === "success" ? "bg-green-600/20 text-green-400 border border-green-500" : "bg-red-600/20 text-red-400 border border-red-500"}`}>
            {message.type === "success" ? (
              <Check className="w-5 h-5 inline-block mr-2" />
            ) : (
              <AlertCircle className="w-5 h-5 inline-block mr-2" />
            )}
            {message.text}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Notice Title*
            </label>
            <input
              type="text"
              name="title"
              className={`w-full px-4 py-2 rounded-md bg-gray-700 text-white border ${errors.title ? "border-red-500" : "border-gray-600"} focus:outline-none focus:ring-2 focus:ring-amber-500`}
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Final Exam Schedule Update"
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Country*
              </label>
              <select
                className={`w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500`}
                value={selectedCountry}
                onChange={handleCountryChange}
                disabled={countriesLoading}
                required
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
            
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                University*
              </label>
              <select
                name="targetUniversity"
                className={`w-full px-4 py-2 rounded-md bg-gray-700 text-white border ${errors.targetUniversity ? "border-red-500" : "border-gray-600"} focus:outline-none focus:ring-2 focus:ring-amber-500`}
                value={form.targetUniversity}
                onChange={handleChange}
                disabled={!selectedCountry || universitiesLoading}
                required
              >
                <option value="">Select University</option>
                {universities.map((university) => (
                  <option key={university.id} value={university.name}>
                    {university.name}
                  </option>
                ))}
              </select>
              {universitiesLoading && <p className="text-amber-400 text-xs mt-1">Loading universities...</p>}
              {errors.targetUniversity && <p className="text-red-500 text-xs mt-1">{errors.targetUniversity}</p>}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Notice Category
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: "general", label: "General", icon: <MessageCircle className="w-4 h-4 mr-1" /> },
                  { value: "academic", label: "Academic", icon: <BookOpen className="w-4 h-4 mr-1" /> },
                  { value: "event", label: "Event", icon: <Calendar className="w-4 h-4 mr-1" /> },
                  { value: "announcement", label: "Announcement", icon: <Megaphone className="w-4 h-4 mr-1" /> }
                ].map(category => (
                  <label
                    key={category.value}
                    className={`flex items-center px-3 py-2 rounded-full transition-colors cursor-pointer ${
                      form.category === category.value
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500"
                        : "bg-gray-700 text-gray-300 border border-gray-600 hover:bg-gray-600"
                    }`}
                  >
                    <input
                      type="radio"
                      name="category"
                      value={category.value}
                      checked={form.category === category.value}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    {category.icon}
                    {category.label}
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Importance Level
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: "normal", label: "Normal", color: "text-blue-300 border-blue-500 bg-blue-500/10" },
                  { value: "important", label: "Important", color: "text-amber-300 border-amber-500 bg-amber-500/10" },
                  { value: "urgent", label: "Urgent", color: "text-red-300 border-red-500 bg-red-500/10" }
                ].map(level => (
                  <label
                    key={level.value}
                    className={`flex items-center px-3 py-2 rounded-full transition-colors cursor-pointer ${
                      form.importance === level.value
                        ? level.color
                        : "bg-gray-700 text-gray-300 border border-gray-600 hover:bg-gray-600"
                    }`}
                  >
                    <input
                      type="radio"
                      name="importance"
                      value={level.value}
                      checked={form.importance === level.value}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    {level.label}
                  </label>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Notice Content*
            </label>
            <textarea
              name="content"
              rows="8"
              className={`w-full px-4 py-2 rounded-md bg-gray-700 text-white border ${errors.content ? "border-red-500" : "border-gray-600"} focus:outline-none focus:ring-2 focus:ring-amber-500`}
              value={form.content}
              onChange={handleChange}
              placeholder="Enter the detailed content of your notice here..."
            />
            {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content}</p>}
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Attachment URL (Optional)
            </label>
            <input
              type="text"
              name="attachment"
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
              value={form.attachment}
              onChange={handleChange}
              placeholder="e.g. https://example.com/document.pdf"
            />
            <p className="text-gray-400 text-xs mt-1">Enter a URL for any external document or file attachment</p>
          </div>
          
          <div className="mb-8">
            <label className="block text-gray-300 text-sm font-medium mb-2 flex items-center">
              <FileText className="w-4 h-4 mr-1" />
              PDF Attachment (Optional)
            </label>
            
            {!pdfFile ? (
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-600 rounded-md hover:border-amber-500 transition-colors">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-400">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md font-medium text-amber-400 hover:text-amber-300 focus-within:outline-none"
                    >
                      <span>Upload a PDF file</span>
                      <input 
                        id="file-upload" 
                        name="file-upload" 
                        type="file" 
                        className="sr-only"
                        accept="application/pdf"
                        onChange={handlePdfChange}
                        ref={fileInputRef} 
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-400">
                    PDF up to 5MB
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-1 p-4 border border-gray-600 rounded-md bg-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="w-10 h-10 text-amber-400 mr-3" />
                    <div>
                      <p className="text-white font-medium truncate max-w-xs">{pdfFileName}</p>
                      <p className="text-gray-400 text-xs">
                        {(pdfFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <a 
                      href={pdfPreviewUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-amber-400 hover:text-amber-300 mr-4"
                    >
                      Preview
                    </a>
                    <button
                      type="button"
                      onClick={removePdf}
                      className="text-red-400 hover:text-red-300"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                {isUploading && (
                  <div className="mt-2">
                    <div className="h-2 bg-gray-600 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-amber-500 transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-gray-400 text-xs mt-1 text-right">{uploadProgress}% uploaded</p>
                  </div>
                )}
              </div>
            )}
            <p className="text-gray-400 text-xs mt-2">
              Attach a PDF document for more detailed information (schedule, guidelines, etc.)
            </p>
          </div>
          
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="px-6 py-2 rounded-md bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className={`px-8 py-3 rounded-md bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-medium hover:from-amber-600 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors ${(isSubmitting || isUploading) ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Posting...' : 'Post Notice'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PostNotice;
