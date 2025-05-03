import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Users, 
  UserPlus, 
  Trash2, 
  Edit, 
  RefreshCw, 
  ChevronLeft, 
  Check, 
  X, 
  AlertTriangle,
  Eye,
  EyeOff
} from 'lucide-react';
import { adminService, adminAuthService } from '../api/adminApiClient';

const AdminManagement = () => {
  const navigate = useNavigate();
  
  // State for admin list
  const [adminList, setAdminList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // State for adding new admin
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    permissions: {
      manageUsers: true,
      manageContent: true,
      manageCourses: true,
      manageJobs: true,
      manageNotices: true
    }
  });
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State for edit modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [editData, setEditData] = useState({
    name: '',
    email: '',
    permissions: {
      manageUsers: true,
      manageContent: true,
      manageCourses: true,
      manageJobs: true,
      manageNotices: true
    }
  });
  
  // State for delete confirmation
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Fetch admins on component mount
  useEffect(() => {
    fetchAdmins();
  }, []);
  
  // Fetch admin list
  const fetchAdmins = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await adminService.getAllAdmins();
      setAdminList(response.data.admins);
    } catch (err) {
      console.error('Error fetching admins:', err);
      setError('Failed to load admin accounts. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle form input change for new admin
  const handleNewAdminChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      // Handle nested properties (for permissions)
      const [parent, child] = name.split('.');
      setNewAdmin(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: e.target.type === 'checkbox' ? e.target.checked : value
        }
      }));
    } else {
      // Handle top-level properties
      setNewAdmin(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  // Handle form input change for edit admin
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      // Handle nested properties (for permissions)
      const [parent, child] = name.split('.');
      setEditData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: e.target.type === 'checkbox' ? e.target.checked : value
        }
      }));
    } else {
      // Handle top-level properties
      setEditData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  // Submit new admin
  const handleSubmitNewAdmin = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setIsSubmitting(true);
    
    // Validate form
    if (!newAdmin.name || !newAdmin.email || !newAdmin.password) {
      setSubmitError('Please fill all required fields.');
      setIsSubmitting(false);
      return;
    }
    
    if (newAdmin.password !== newAdmin.confirmPassword) {
      setSubmitError('Passwords do not match.');
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Submit to API
      await adminService.createAdmin({
        name: newAdmin.name,
        email: newAdmin.email,
        password: newAdmin.password,
        permissions: newAdmin.permissions
      });
      
      // Reset form and close modal
      setNewAdmin({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        permissions: {
          manageUsers: true,
          manageContent: true,
          manageCourses: true,
          manageJobs: true,
          manageNotices: true
        }
      });
      setShowAddModal(false);
      
      // Refresh admin list
      fetchAdmins();
    } catch (err) {
      console.error('Error creating admin:', err);
      setSubmitError(err.response?.data?.message || 'Failed to create admin account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Open edit modal with admin data
  const handleEditAdmin = (admin) => {
    setSelectedAdmin(admin);
    setEditData({
      name: admin.name,
      email: admin.email,
      permissions: admin.permissions || {
        manageUsers: true,
        manageContent: true,
        manageCourses: true,
        manageJobs: true,
        manageNotices: true
      }
    });
    setShowEditModal(true);
  };
  
  // Submit edit admin changes
  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setIsSubmitting(true);
    
    // Validate form
    if (!editData.name || !editData.email) {
      setSubmitError('Please fill all required fields.');
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Submit to API
      await adminService.updateAdmin(selectedAdmin.id, {
        name: editData.name,
        email: editData.email,
        permissions: editData.permissions
      });
      
      // Close modal and refresh list
      setShowEditModal(false);
      fetchAdmins();
    } catch (err) {
      console.error('Error updating admin:', err);
      setSubmitError(err.response?.data?.message || 'Failed to update admin account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Open delete confirmation modal
  const handleDeleteClick = (admin) => {
    setAdminToDelete(admin);
    setShowDeleteModal(true);
  };
  
  // Confirm delete admin
  const confirmDeleteAdmin = async () => {
    if (!adminToDelete) return;
    
    setIsDeleting(true);
    setSubmitError('');
    
    try {
      await adminService.deleteAdmin(adminToDelete.id);
      setShowDeleteModal(false);
      fetchAdmins();
    } catch (err) {
      console.error('Error deleting admin:', err);
      setSubmitError(err.response?.data?.message || 'Failed to delete admin account. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };
  
  // Format date to readable string
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  return (
    <div className="min-h-screen bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        {/* Header with back button */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/admindashboard')}
              className="mr-4 p-2 text-gray-400 hover:text-blue-400 rounded-full hover:bg-gray-800 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <h1 className="text-3xl font-bold flex items-center">
              <Shield className="mr-2" size={28} />
              Admin Account Management
            </h1>
          </div>
          
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
          >
            <UserPlus size={18} className="mr-2" />
            Add New Admin
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-900/20 border border-red-500/40 p-4 rounded-lg mb-6">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
              <div>
                <p className="text-red-400 font-medium">{error}</p>
                <button 
                  onClick={fetchAdmins}
                  className="mt-2 px-3 py-1 bg-red-900/30 text-red-400 hover:bg-red-900/50 rounded text-sm flex items-center"
                >
                  <RefreshCw className="h-3 w-3 mr-2" />
                  Retry Loading Admins
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Admin list */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-800/80 border-b border-gray-700">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Permissions</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Last Login</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Created At</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {isLoading ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-6 text-center text-gray-400">
                      <div className="flex flex-col items-center">
                        <RefreshCw className="animate-spin h-8 w-8 mb-2" />
                        <p>Loading admin accounts...</p>
                      </div>
                    </td>
                  </tr>
                ) : adminList.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-6 text-center text-gray-400">
                      <div className="flex flex-col items-center">
                        <Users className="h-8 w-8 mb-2" />
                        <p>No admin accounts found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  adminList.map(admin => (
                    <tr key={admin.id} className="hover:bg-gray-800/40 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-200">{admin.name || 'N/A'}</td>
                      <td className="px-4 py-3 text-sm text-gray-200">{admin.email}</td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex flex-wrap gap-1">
                          {admin.permissions && Object.entries(admin.permissions)
                            .filter(([_, value]) => value)
                            .map(([key]) => (
                              <span 
                                key={key} 
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30"
                              >
                                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                              </span>
                            ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-300">
                        {admin.lastLoginAt ? formatDate(admin.lastLoginAt) : 'Never'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-300">
                        {formatDate(admin.createdAt)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEditAdmin(admin)}
                            className="p-1 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 rounded"
                            title="Edit Admin"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(admin)}
                            className="p-1 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded"
                            title="Delete Admin"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Admin Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-lg w-full max-w-md">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <UserPlus size={20} className="mr-2 text-blue-400" />
                Add New Admin
              </h3>
              
              {submitError && (
                <div className="mb-4 p-3 bg-red-900/30 border border-red-500/30 rounded-md text-red-400 flex items-start">
                  <AlertTriangle size={18} className="mr-2 flex-shrink-0 mt-0.5" />
                  <span>{submitError}</span>
                </div>
              )}
              
              <form onSubmit={handleSubmitNewAdmin}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={newAdmin.name}
                    onChange={handleNewAdminChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={newAdmin.email}
                    onChange={handleNewAdminChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={newAdmin.password}
                      onChange={handleNewAdminChange}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff size={18} className="text-gray-400" />
                      ) : (
                        <Eye size={18} className="text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={newAdmin.confirmPassword}
                    onChange={handleNewAdminChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <p className="block text-sm font-medium text-gray-300 mb-2">
                    Permissions
                  </p>
                  <div className="space-y-2 bg-gray-700/50 p-3 rounded-md border border-gray-600">
                    {Object.entries(newAdmin.permissions).map(([key, value]) => (
                      <div key={key} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`permission-${key}`}
                          name={`permissions.${key}`}
                          checked={value}
                          onChange={handleNewAdminChange}
                          className="h-4 w-4 rounded border-gray-600 text-blue-600 focus:ring-blue-500 bg-gray-700"
                        />
                        <label
                          htmlFor={`permission-${key}`}
                          className="ml-2 block text-sm text-gray-300"
                        >
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-4 py-2 rounded-md text-white flex items-center ${
                      isSubmitting ? 'bg-blue-700/70 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw size={18} className="mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Check size={18} className="mr-2" />
                        Create Admin
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Admin Modal */}
      {showEditModal && selectedAdmin && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-lg w-full max-w-md">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Edit size={20} className="mr-2 text-blue-400" />
                Edit Admin: {selectedAdmin.name}
              </h3>
              
              {submitError && (
                <div className="mb-4 p-3 bg-red-900/30 border border-red-500/30 rounded-md text-red-400 flex items-start">
                  <AlertTriangle size={18} className="mr-2 flex-shrink-0 mt-0.5" />
                  <span>{submitError}</span>
                </div>
              )}
              
              <form onSubmit={handleSubmitEdit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={editData.name}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={editData.email}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <p className="block text-sm font-medium text-gray-300 mb-2">
                    Permissions
                  </p>
                  <div className="space-y-2 bg-gray-700/50 p-3 rounded-md border border-gray-600">
                    {Object.entries(editData.permissions || {}).map(([key, value]) => (
                      <div key={key} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`edit-permission-${key}`}
                          name={`permissions.${key}`}
                          checked={value}
                          onChange={handleEditChange}
                          className="h-4 w-4 rounded border-gray-600 text-blue-600 focus:ring-blue-500 bg-gray-700"
                        />
                        <label
                          htmlFor={`edit-permission-${key}`}
                          className="ml-2 block text-sm text-gray-300"
                        >
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-4 py-2 rounded-md text-white flex items-center ${
                      isSubmitting ? 'bg-blue-700/70 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw size={18} className="mr-2 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Check size={18} className="mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && adminToDelete && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-lg w-full max-w-md">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center text-red-400">
                <AlertTriangle size={20} className="mr-2" />
                Confirm Delete
              </h3>
              
              <p className="text-gray-300 mb-4">
                Are you sure you want to delete the admin account for <strong>{adminToDelete.name}</strong>?
                This action cannot be undone.
              </p>
              
              {submitError && (
                <div className="mb-4 p-3 bg-red-900/30 border border-red-500/30 rounded-md text-red-400 flex items-start">
                  <AlertTriangle size={18} className="mr-2 flex-shrink-0 mt-0.5" />
                  <span>{submitError}</span>
                </div>
              )}
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteAdmin}
                  disabled={isDeleting}
                  className={`px-4 py-2 rounded-md text-white flex items-center ${
                    isDeleting ? 'bg-red-700/70 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {isDeleting ? (
                    <>
                      <RefreshCw size={18} className="mr-2 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 size={18} className="mr-2" />
                      Delete Admin
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManagement; 