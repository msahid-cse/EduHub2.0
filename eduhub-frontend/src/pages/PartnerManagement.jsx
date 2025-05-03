import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Building2, Briefcase, Trash2, Edit, Plus, ArrowLeft, Upload, Globe, School, Search, X, Image as ImageIcon } from 'lucide-react';

const PartnerManagement = () => {
  const navigate = useNavigate();
  const [partners, setPartners] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    type: 'university', // 'university' or 'industry'
    websiteUrl: '',
    description: '',
    logoUrl: ''
  });
  
  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  
  // Filter/search state
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  
  // Check authentication
  useEffect(() => {
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
    
    fetchData();
  }, [navigate]);
  
  // Main data fetching function
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch universities
      const universitiesResponse = await axios.get('http://localhost:5000/api/partners/universities');
      setUniversities(universitiesResponse.data);
      
      // Fetch industry partners
      const partnersResponse = await axios.get('http://localhost:5000/api/partners/industry');
      setPartners(partnersResponse.data);
      
      setLoading(false);
      setError(null);
    } catch (err) {
      setError('Failed to load partners data. Please try again.');
      setLoading(false);
      console.error('Error fetching partners:', err);
    }
  };
  
  // Handle file selection for logo upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Upload logo to server
  const uploadLogo = async () => {
    if (!selectedFile) return null;
    
    try {
      setIsUploading(true);
      
      const formData = new FormData();
      formData.append('logo', selectedFile);
      
      const response = await axios.post('http://localhost:5000/api/upload/logo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });
      
      setIsUploading(false);
      setUploadProgress(0);
      
      return response.data.logoUrl;
    } catch (error) {
      console.error('Error uploading logo:', error);
      setIsUploading(false);
      setUploadProgress(0);
      return null;
    }
  };
  
  // Form validation
  const validateForm = () => {
    if (!formData.name.trim()) {
      alert('Name is required');
      return false;
    }
    
    if (!formData.websiteUrl.trim()) {
      alert('Website URL is required');
      return false;
    }
    
    // Basic URL validation
    if (!formData.websiteUrl.startsWith('http://') && !formData.websiteUrl.startsWith('https://')) {
      setFormData({
        ...formData,
        websiteUrl: `https://${formData.websiteUrl}`
      });
    }
    
    return true;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      
      // Upload logo if a new file was selected
      let logoUrl = formData.logoUrl;
      if (selectedFile) {
        logoUrl = await uploadLogo();
        if (!logoUrl) {
          alert('Failed to upload logo. Please try again.');
          setLoading(false);
          return;
        }
      }
      
      const dataToSubmit = {
        ...formData,
        logoUrl
      };
      
      if (isEditing) {
        // Update existing partner
        await axios.put(`http://localhost:5000/api/partners/${editId}`, dataToSubmit);
      } else {
        // Create new partner
        await axios.post('http://localhost:5000/api/partners', dataToSubmit);
      }
      
      // Reset form and refresh data
      resetForm();
      
      // Refresh data
      const fetchData = async () => {
        try {
          // Fetch universities
          const universitiesResponse = await axios.get('http://localhost:5000/api/partners/universities');
          setUniversities(universitiesResponse.data);
          
          // Fetch industry partners
          const partnersResponse = await axios.get('http://localhost:5000/api/partners/industry');
          setPartners(partnersResponse.data);
          
          setLoading(false);
          setError(null);
        } catch (err) {
          setError('Failed to refresh partners data.');
          setLoading(false);
          console.error('Error refreshing partners:', err);
        }
      };
      
      fetchData();
    } catch (err) {
      setLoading(false);
      setError('Failed to save partner data. Please try again.');
      console.error('Error saving partner:', err);
    }
  };
  
  // Handle edit button click
  const handleEdit = (item) => {
    setFormData({
      name: item.name,
      type: item.type,
      websiteUrl: item.websiteUrl,
      description: item.description || '',
      logoUrl: item.logoUrl || ''
    });
    
    setFilePreview(item.logoUrl);
    setIsEditing(true);
    setEditId(item._id);
    
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Handle delete button click
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this partner? This action cannot be undone.')) {
      return;
    }
    
    try {
      setLoading(true);
      
      await axios.delete(`http://localhost:5000/api/partners/${id}`);
      
      // Refresh data
      // Fetch universities
      const universitiesResponse = await axios.get('http://localhost:5000/api/partners/universities');
      setUniversities(universitiesResponse.data);
      
      // Fetch industry partners
      const partnersResponse = await axios.get('http://localhost:5000/api/partners/industry');
      setPartners(partnersResponse.data);
      
      setLoading(false);
      setError(null);
    } catch (err) {
      setLoading(false);
      setError('Failed to delete partner. Please try again.');
      console.error('Error deleting partner:', err);
    }
  };
  
  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      type: 'university',
      websiteUrl: '',
      description: '',
      logoUrl: ''
    });
    
    setSelectedFile(null);
    setFilePreview(null);
    setIsEditing(false);
    setEditId(null);
  };
  
  // Filter partners and universities based on search and type filter
  const filteredData = [...universities, ...partners].filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    
    return matchesSearch && matchesType;
  });
  
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <button 
              onClick={() => navigate('/admindashboard')}
              className="flex items-center text-gray-400 hover:text-white mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold text-white">Manage Partners & Universities</h1>
            <p className="text-gray-400 mt-2">
              Add, edit or remove partner organizations and trusted universities that appear on the landing page.
            </p>
          </div>
        </div>
        
        {/* Form Section */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8 border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            {isEditing ? (
              <>
                <Edit className="w-5 h-5 mr-2 text-blue-400" />
                Edit Partner
              </>
            ) : (
              <>
                <Plus className="w-5 h-5 mr-2 text-green-400" />
                Add New Partner
              </>
            )}
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="mb-4">
                  <label className="block text-gray-300 mb-2">Partner Type</label>
                  <div className="flex space-x-4">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="type"
                        value="university"
                        checked={formData.type === 'university'}
                        onChange={() => setFormData({...formData, type: 'university'})}
                        className="mr-2"
                      />
                      <School className="w-5 h-5 mr-2 text-blue-400" />
                      University
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="type"
                        value="industry"
                        checked={formData.type === 'industry'}
                        onChange={() => setFormData({...formData, type: 'industry'})}
                        className="mr-2"
                      />
                      <Briefcase className="w-5 h-5 mr-2 text-amber-400" />
                      Industry Partner
                    </label>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="name" className="block text-gray-300 mb-2">Name *</label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Organization or University Name"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="websiteUrl" className="block text-gray-300 mb-2">Website URL *</label>
                  <input
                    type="text"
                    id="websiteUrl"
                    value={formData.websiteUrl}
                    onChange={(e) => setFormData({...formData, websiteUrl: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="description" className="block text-gray-300 mb-2">Description</label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Brief description about the organization"
                    rows="3"
                  ></textarea>
                </div>
              </div>
              
              <div>
                <div className="mb-4">
                  <label className="block text-gray-300 mb-2">Logo Upload</label>
                  <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
                    {filePreview ? (
                      <div className="relative">
                        <img 
                          src={filePreview} 
                          alt="Logo Preview" 
                          className="max-h-40 mx-auto mb-4 object-contain"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setFilePreview(null);
                            setSelectedFile(null);
                            if (isEditing) {
                              setFormData({...formData, logoUrl: ''});
                            }
                          }}
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <ImageIcon className="h-12 w-12 text-gray-500 mx-auto mb-2" />
                        <p className="text-gray-400 mb-2">Drag and drop a logo image or click to browse</p>
                      </>
                    )}
                    
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="logo-upload"
                    />
                    <label
                      htmlFor="logo-upload"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer inline-block hover:bg-blue-700 transition-colors"
                    >
                      <Upload className="w-4 h-4 inline-block mr-2" />
                      Select Logo
                    </label>
                    
                    {isUploading && (
                      <div className="mt-4">
                        <div className="w-full bg-gray-700 rounded-full h-2.5">
                          <div 
                            className="bg-blue-600 h-2.5 rounded-full" 
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                        <p className="text-gray-400 mt-1">Uploading: {uploadProgress}%</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end mt-6 space-x-4">
              {isEditing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={loading}
                className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {isEditing ? 'Updating...' : 'Saving...'}
                  </>
                ) : (
                  <>
                    {isEditing ? 'Update Partner' : 'Add Partner'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
        
        {/* Search and Filter Section */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search partners..."
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-4 py-2 rounded-lg ${typeFilter === 'all' ? 'bg-gray-700 text-white' : 'bg-gray-800 text-gray-400'}`}
            >
              All
            </button>
            <button
              onClick={() => setTypeFilter('university')}
              className={`px-4 py-2 rounded-lg flex items-center ${typeFilter === 'university' ? 'bg-blue-600/30 text-blue-400 border border-blue-500/50' : 'bg-gray-800 text-gray-400'}`}
            >
              <School className="w-4 h-4 mr-2" />
              Universities
            </button>
            <button
              onClick={() => setTypeFilter('industry')}
              className={`px-4 py-2 rounded-lg flex items-center ${typeFilter === 'industry' ? 'bg-amber-600/30 text-amber-400 border border-amber-500/50' : 'bg-gray-800 text-gray-400'}`}
            >
              <Briefcase className="w-4 h-4 mr-2" />
              Industry
            </button>
          </div>
        </div>
        
        {/* Partners/Universities List */}
        {error && (
          <div className="bg-red-900/30 border border-red-700 text-red-400 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}
        
        {loading && filteredData.length === 0 ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading partners data...</p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="bg-gray-800 rounded-xl p-12 text-center border border-gray-700">
            <Building2 className="h-16 w-16 text-gray-600 mb-4 mx-auto" />
            <h3 className="text-xl font-semibold text-white mb-2">No Partners Found</h3>
            <p className="text-gray-400 mb-6">
              {searchTerm || typeFilter !== 'all' ? 
                'No partners match your search criteria. Try adjusting your filters.' : 
                'Start by adding a university or industry partner using the form above.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredData.map((item) => (
              <div 
                key={item._id}
                className={`bg-gray-800 rounded-xl p-6 border ${item.type === 'university' ? 'border-blue-700/50' : 'border-amber-700/50'} transition-all hover:shadow-lg`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`px-2 py-1 text-xs rounded-full ${
                    item.type === 'university' ? 
                      'bg-blue-600/20 text-blue-400 border border-blue-500/50' : 
                      'bg-amber-600/20 text-amber-400 border border-amber-500/50'
                  }`}>
                    {item.type === 'university' ? 'University' : 'Industry Partner'}
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-1 text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center mb-4">
                  {item.logoUrl ? (
                    <img 
                      src={item.logoUrl} 
                      alt={`${item.name} logo`}
                      className="h-16 w-16 object-contain p-1 mr-4 bg-white rounded"
                    />
                  ) : item.type === 'university' ? (
                    <div className="h-16 w-16 flex items-center justify-center bg-blue-600/20 text-blue-400 rounded mr-4">
                      <School className="h-8 w-8" />
                    </div>
                  ) : (
                    <div className="h-16 w-16 flex items-center justify-center bg-amber-600/20 text-amber-400 rounded mr-4">
                      <Building2 className="h-8 w-8" />
                    </div>
                  )}
                  
                  <div>
                    <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                    <a 
                      href={item.websiteUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm flex items-center text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      <Globe className="h-3 w-3 mr-1" />
                      {item.websiteUrl.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                </div>
                
                {item.description && (
                  <p className="text-gray-400 text-sm mt-2 line-clamp-2">{item.description}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PartnerManagement; 