import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Edit,
  Upload,
  Globe,
  Building2,
  GraduationCap,
  Search,
  X,
  Check,
  AlertCircle,
  ExternalLink,
  Image as ImageIcon
} from 'lucide-react';

const PartnerManagement = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  // State variables
  const [universities, setUniversities] = useState([]);
  const [industryPartners, setIndustryPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('universities');
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [uploadedLogo, setUploadedLogo] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    type: 'university',
    websiteUrl: '',
    description: '',
    logoUrl: '',
    country: '',
    category: '',
    ranking: 0,
    isActive: true
  });
  
  // Fetch all partners
  const fetchPartners = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get universities
      const universitiesResponse = await axios.get('http://localhost:5000/api/partners/universities');
      if (universitiesResponse.data) {
        setUniversities(universitiesResponse.data);
      }
      
      // Get industry partners
      const partnersResponse = await axios.get('http://localhost:5000/api/partners/industry');
      if (partnersResponse.data) {
        setIndustryPartners(partnersResponse.data);
      }
      
    } catch (err) {
      console.error('Error fetching partners:', err);
      setError('Failed to load partners. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  // Handle logo upload
  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // File type validation
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a valid image file (JPEG, PNG, or GIF)');
      return;
    }
    
    // File size validation (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size should be less than 5MB');
      return;
    }
    
    const formData = new FormData();
    formData.append('logo', file);
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        'http://localhost:5000/api/partners/upload/logo',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          }
        }
      );
      
      if (response.data && response.data.logoUrl) {
        setUploadedLogo(response.data.logoUrl);
        setFormData(prev => ({
          ...prev,
          logoUrl: response.data.logoUrl
        }));
        setError(null);
      }
    } catch (err) {
      console.error('Error uploading logo:', err);
      setError('Failed to upload logo. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };
  
  // Submit the form to add/edit a partner
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.websiteUrl) {
      setError('Name and website URL are required');
      return;
    }
    
    // Basic URL validation
    if (!formData.websiteUrl.match(/^(http:\/\/|https:\/\/)/) && !formData.websiteUrl.startsWith('www.')) {
      setFormData(prev => ({
        ...prev,
        websiteUrl: `https://${formData.websiteUrl}`
      }));
    }
    
    try {
      const token = localStorage.getItem('token');
      
      // Prepare data for submission
      const dataToSubmit = {
        ...formData,
        type: activeTab === 'universities' ? 'university' : 'industry'
      };
      
      if (isEditing && editId) {
        // Update existing partner
        await axios.put(`http://localhost:5000/api/partners/${editId}`, dataToSubmit, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } else {
        // Create new partner
        await axios.post('http://localhost:5000/api/partners', dataToSubmit, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
      
      // Reset form and fetch updated data
      setShowForm(false);
      setFormData({
        name: '',
        type: activeTab === 'universities' ? 'university' : 'industry',
        websiteUrl: '',
        description: '',
        logoUrl: '',
        country: '',
        category: '',
        ranking: 0,
        isActive: true
      });
      setUploadedLogo(null);
      
      // Fetch updated partners list
      const universitiesResponse = await axios.get('http://localhost:5000/api/partners/universities');
      if (universitiesResponse.data) {
        setUniversities(universitiesResponse.data);
      }
      
      const partnersResponse = await axios.get('http://localhost:5000/api/partners/industry');
      if (partnersResponse.data) {
        setIndustryPartners(partnersResponse.data);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error saving partner:', err);
      setError('Failed to save partner. Please try again.');
    }
  };
  
  // Handle partner deletion
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this partner? This action cannot be undone.')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      
      await axios.delete(`http://localhost:5000/api/partners/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      // Fetch updated partners list
      const universitiesResponse = await axios.get('http://localhost:5000/api/partners/universities');
      if (universitiesResponse.data) {
        setUniversities(universitiesResponse.data);
      }
      
      const partnersResponse = await axios.get('http://localhost:5000/api/partners/industry');
      if (partnersResponse.data) {
        setIndustryPartners(partnersResponse.data);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error deleting partner:', err);
      setError('Failed to delete partner. Please try again.');
    }
  };
  
  // Edit a partner
  const handleEdit = (partner) => {
    setIsEditing(true);
    setEditId(partner._id);
    setFormData({
      name: partner.name,
      type: partner.type,
      websiteUrl: partner.websiteUrl,
      description: partner.description || '',
      logoUrl: partner.logoUrl || '',
      country: partner.country || '',
      category: partner.category || '',
      ranking: partner.ranking || 0,
      isActive: partner.isActive
    });
    setUploadedLogo(partner.logoUrl);
    setShowForm(true);
  };
  
  // Load data on component mount
  useEffect(() => {
    fetchPartners();
  }, []);
  
  // Filter displayed partners based on search query
  const filteredUniversities = universities.filter(university => 
    university.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    university.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
    university.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredIndustryPartners = industryPartners.filter(partner => 
    partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    partner.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
    partner.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="bg-gradient-to-b from-gray-900 to-black min-h-screen text-white">
      {/* Header */}
      <header className="bg-gray-800 p-4 shadow-md">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button 
                onClick={() => navigate('/admindashboard')}
                className="text-gray-300 hover:text-white mr-4"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <h1 className="text-2xl font-bold text-white">Partner Management</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search partners..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              <button
                onClick={() => {
                  setShowForm(true);
                  setIsEditing(false);
                  setEditId(null);
                  setFormData({
                    name: '',
                    type: activeTab === 'universities' ? 'university' : 'industry',
                    websiteUrl: '',
                    description: '',
                    logoUrl: '',
                    country: '',
                    category: '',
                    ranking: 0,
                    isActive: true
                  });
                  setUploadedLogo(null);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
              >
                <Plus size={18} className="mr-2" />
                Add New {activeTab === 'universities' ? 'University' : 'Industry Partner'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-6">
        {/* Tabs */}
        <div className="flex mb-6 bg-gray-800 rounded-lg p-1 w-fit">
          <button
            onClick={() => setActiveTab('universities')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'universities'
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:text-white'
            } flex items-center`}
          >
            <GraduationCap size={18} className="mr-2" />
            Universities
          </button>
          <button
            onClick={() => setActiveTab('industry')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'industry'
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:text-white'
            } flex items-center`}
          >
            <Building2 size={18} className="mr-2" />
            Industry Partners
          </button>
        </div>

        {/* Error display */}
        {error && (
          <div className="bg-red-900/30 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-6 flex items-start">
            <AlertCircle size={20} className="mr-2 flex-shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        {/* Content */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : activeTab === 'universities' ? (
            // Universities tab content
            <>
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <GraduationCap className="mr-2" /> 
                University Partners ({filteredUniversities.length})
              </h2>
              
              {filteredUniversities.length === 0 ? (
                <div className="text-center py-12 bg-gray-900/50 rounded-lg">
                  <GraduationCap size={48} className="mx-auto text-gray-600 mb-4" />
                  {searchQuery ? (
                    <p className="text-gray-400">No universities match your search</p>
                  ) : (
                    <div>
                      <p className="text-gray-400 mb-4">No universities added yet</p>
                      <button
                        onClick={() => {
                          setShowForm(true);
                          setFormData({...formData, type: 'university'});
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-flex items-center"
                      >
                        <Plus size={18} className="mr-2" />
                        Add University Partner
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredUniversities.map((university) => (
                    <div key={university._id} className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden hover:border-blue-500/50 transition-colors">
                      <div className="h-40 bg-gray-800 flex items-center justify-center p-4">
                        {university.logoUrl ? (
                          <img 
                            src={`http://localhost:5000${university.logoUrl}`} 
                            alt={university.name}
                            className="max-h-full max-w-full object-contain"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://placehold.co/300x200?text=Logo+Not+Available';
                            }}
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-gray-500">
                            <GraduationCap size={48} />
                            <p className="mt-2 text-sm">No Logo</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-lg text-white">{university.name}</h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${university.isActive ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                            {university.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        
                        {university.country && (
                          <p className="text-gray-400 text-sm mb-2">{university.country}</p>
                        )}
                        
                        {university.category && (
                          <div className="mb-3">
                            <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-xs">
                              {university.category}
                            </span>
                          </div>
                        )}
                        
                        <div className="flex items-center text-gray-400 text-sm mb-4">
                          <Globe size={14} className="mr-1" />
                          <a 
                            href={university.websiteUrl} 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 truncate flex items-center"
                          >
                            {university.websiteUrl.replace(/^https?:\/\//, '').replace(/^www\./, '')}
                            <ExternalLink size={12} className="ml-1 flex-shrink-0" />
                          </a>
                        </div>
                        
                        {university.description && (
                          <p className="text-gray-300 text-sm mb-4 line-clamp-2">{university.description}</p>
                        )}
                        
                        <div className="flex justify-between">
                          <button
                            onClick={() => handleEdit(university)}
                            className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 px-3 py-1 rounded flex items-center text-sm"
                          >
                            <Edit size={14} className="mr-1" />
                            Edit
                          </button>
                          
                          <button
                            onClick={() => handleDelete(university._id)}
                            className="bg-red-500/20 text-red-400 hover:bg-red-500/30 px-3 py-1 rounded flex items-center text-sm"
                          >
                            <Trash2 size={14} className="mr-1" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            // Industry partners tab content
            <>
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <Building2 className="mr-2" /> 
                Industry Partners ({filteredIndustryPartners.length})
              </h2>
              
              {filteredIndustryPartners.length === 0 ? (
                <div className="text-center py-12 bg-gray-900/50 rounded-lg">
                  <Building2 size={48} className="mx-auto text-gray-600 mb-4" />
                  {searchQuery ? (
                    <p className="text-gray-400">No industry partners match your search</p>
                  ) : (
                    <div>
                      <p className="text-gray-400 mb-4">No industry partners added yet</p>
                      <button
                        onClick={() => {
                          setShowForm(true);
                          setFormData({...formData, type: 'industry'});
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-flex items-center"
                      >
                        <Plus size={18} className="mr-2" />
                        Add Industry Partner
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredIndustryPartners.map((partner) => (
                    <div key={partner._id} className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden hover:border-purple-500/50 transition-colors">
                      <div className="h-40 bg-gray-800 flex items-center justify-center p-4">
                        {partner.logoUrl ? (
                          <img 
                            src={`http://localhost:5000${partner.logoUrl}`} 
                            alt={partner.name}
                            className="max-h-full max-w-full object-contain"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://placehold.co/300x200?text=Logo+Not+Available';
                            }}
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-gray-500">
                            <Building2 size={48} />
                            <p className="mt-2 text-sm">No Logo</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-lg text-white">{partner.name}</h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${partner.isActive ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                            {partner.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        
                        {partner.country && (
                          <p className="text-gray-400 text-sm mb-2">{partner.country}</p>
                        )}
                        
                        {partner.category && (
                          <div className="mb-3">
                            <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full text-xs">
                              {partner.category}
                            </span>
                          </div>
                        )}
                        
                        <div className="flex items-center text-gray-400 text-sm mb-4">
                          <Globe size={14} className="mr-1" />
                          <a 
                            href={partner.websiteUrl} 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 truncate flex items-center"
                          >
                            {partner.websiteUrl.replace(/^https?:\/\//, '').replace(/^www\./, '')}
                            <ExternalLink size={12} className="ml-1 flex-shrink-0" />
                          </a>
                        </div>
                        
                        {partner.description && (
                          <p className="text-gray-300 text-sm mb-4 line-clamp-2">{partner.description}</p>
                        )}
                        
                        <div className="flex justify-between">
                          <button
                            onClick={() => handleEdit(partner)}
                            className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 px-3 py-1 rounded flex items-center text-sm"
                          >
                            <Edit size={14} className="mr-1" />
                            Edit
                          </button>
                          
                          <button
                            onClick={() => handleDelete(partner._id)}
                            className="bg-red-500/20 text-red-400 hover:bg-red-500/30 px-3 py-1 rounded flex items-center text-sm"
                          >
                            <Trash2 size={14} className="mr-1" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
      
      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-auto">
            {/* Modal Header */}
            <div className="bg-gray-700 p-4 flex justify-between items-center sticky top-0">
              <h2 className="text-xl font-bold text-white">
                {isEditing ? 'Edit Partner' : 'Add New Partner'}
              </h2>
              <button 
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div>
                  {/* Partner Name */}
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 text-white rounded-lg p-2.5 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  {/* Partner Type */}
                  <div className="mb-4">
                    <label htmlFor="type" className="block text-sm font-medium text-gray-400 mb-1">
                      Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 text-white rounded-lg p-2.5 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="university">University</option>
                      <option value="industry">Industry</option>
                    </select>
                  </div>
                  
                  {/* Website URL */}
                  <div className="mb-4">
                    <label htmlFor="websiteUrl" className="block text-sm font-medium text-gray-400 mb-1">
                      Website URL <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="text"
                        id="websiteUrl"
                        name="websiteUrl"
                        value={formData.websiteUrl}
                        onChange={handleInputChange}
                        className="w-full bg-gray-700 text-white rounded-lg p-2.5 pl-10 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                        placeholder="https://example.com"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Include https:// for external links
                    </p>
                  </div>
                  
                  {/* Country */}
                  <div className="mb-4">
                    <label htmlFor="country" className="block text-sm font-medium text-gray-400 mb-1">
                      Country
                    </label>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 text-white rounded-lg p-2.5 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                {/* Right Column */}
                <div>
                  {/* Logo Upload */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Logo
                    </label>
                    <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center">
                      {uploadedLogo || formData.logoUrl ? (
                        <div className="relative">
                          <img
                            src={`http://localhost:5000${uploadedLogo || formData.logoUrl}`}
                            alt="Partner logo"
                            className="max-h-40 mx-auto object-contain"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://placehold.co/300x200?text=Preview+Not+Available';
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setUploadedLogo(null);
                              setFormData({...formData, logoUrl: ''});
                            }}
                            className="absolute top-0 right-0 bg-red-500/80 text-white rounded-full p-1 transform translate-x-1/3 -translate-y-1/3"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <>
                          <ImageIcon className="h-12 w-12 text-gray-500 mx-auto mb-2" />
                          <p className="text-sm text-gray-400 mb-2">
                            Drag and drop or click to upload
                          </p>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, or GIF (max. 5MB)
                          </p>
                        </>
                      )}
                      
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleLogoUpload}
                        accept="image/png, image/jpeg, image/gif"
                        className="hidden"
                      />
                      
                      {!uploadedLogo && !formData.logoUrl && (
                        <button
                          type="button"
                          onClick={() => fileInputRef.current.click()}
                          className="mt-4 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center mx-auto"
                          disabled={isUploading}
                        >
                          {isUploading ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                              Uploading {uploadProgress}%
                            </>
                          ) : (
                            <>
                              <Upload size={16} className="mr-2" />
                              Upload Logo
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Category */}
                  <div className="mb-4">
                    <label htmlFor="category" className="block text-sm font-medium text-gray-400 mb-1">
                      Category
                    </label>
                    <input
                      type="text"
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 text-white rounded-lg p-2.5 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder={formData.type === 'university' ? "e.g. Public, Private, Research" : "e.g. Tech, Finance, Healthcare"}
                    />
                  </div>
                  
                  {/* Ranking */}
                  <div className="mb-4">
                    <label htmlFor="ranking" className="block text-sm font-medium text-gray-400 mb-1">
                      Display Ranking (Higher = Appears first)
                    </label>
                    <input
                      type="number"
                      id="ranking"
                      name="ranking"
                      value={formData.ranking}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full bg-gray-700 text-white rounded-lg p-2.5 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  {/* Active Status */}
                  <div className="mb-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-400 ml-2">
                        Active (displayed on website)
                      </span>
                    </label>
                  </div>
                </div>
              </div>
              
              {/* Description Textarea - Full Width */}
              <div className="mb-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-400 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full bg-gray-700 text-white rounded-lg p-2.5 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
              </div>
              
              {/* Form Actions */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-700 text-white px-6 py-2.5 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg flex items-center transition-colors"
                >
                  <Check size={18} className="mr-2" />
                  {isEditing ? 'Update Partner' : 'Add Partner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnerManagement;
