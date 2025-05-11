import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Search, 
  Trash2, 
  Mail, 
  Shield, 
  AlertTriangle, 
  ArrowLeft, 
  ChevronUp, 
  ChevronDown,
  ChevronLeft,
  ChevronRight, 
  X, 
  CheckCircle, 
  RefreshCw,
  UserX, 
  Filter,
  Eye,
  SortAsc,
  SortDesc
} from 'lucide-react';
import userService from '../api/userService';

const UserControl = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const usersPerPage = 10;
  const [emailData, setEmailData] = useState({
    subject: '',
    message: '',
    templateType: 'violation' // 'violation' or 'custom'
  });
  const [modalSuccess, setModalSuccess] = useState('');
  const [modalError, setModalError] = useState('');
  const [userRole, setUserRole] = useState('user');

  // Email templates
  const emailTemplates = {
    violation: {
      subject: 'Community Guidelines Violation Notice',
      message: `Dear [USERNAME],

We are writing to inform you that your account has been flagged for a potential violation of our community guidelines. 

Specifically, we have noted:
- Violation of community guidelines
- Inappropriate behavior

Please be aware that continued violations may result in temporary suspension or permanent removal of your account.

If you believe this is in error, please reply to this email with your explanation.

Best regards,
EduHub Administration Team`
    },
    custom: {
      subject: '',
      message: ''
    }
  };

  useEffect(() => {
    // Check if user is admin
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        if (decodedToken.role === 'admin') {
          setUserRole('admin');
          fetchUsers();
        } else {
          // Redirect non-admin users
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await userService.getAllUsers(
        currentPage, 
        usersPerPage, 
        sortField, 
        sortDirection
      );
      
      if (response.users) {
        setUsers(response.users);
        setFilteredUsers(response.users);
        setTotalPages(Math.ceil(response.total / usersPerPage));
      } else {
        setUsers([]);
        setFilteredUsers([]);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userRole === 'admin') {
      fetchUsers();
    }
  }, [currentPage, sortField, sortDirection, userRole]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(
        user => 
          user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
          user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const openEmailModal = (user) => {
    setSelectedUser(user);
    setEmailData({
      ...emailData,
      subject: emailTemplates.violation.subject,
      message: emailTemplates.violation.message.replace('[USERNAME]', user.name || 'User')
    });
    setModalError('');
    setModalSuccess('');
    setShowEmailModal(true);
  };

  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setModalError('');
    setModalSuccess('');
    setShowDeleteModal(true);
  };

  const closeEmailModal = () => {
    setShowEmailModal(false);
    setSelectedUser(null);
    setEmailData({
      subject: '',
      message: '',
      templateType: 'violation'
    });
    setModalError('');
    setModalSuccess('');
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedUser(null);
    setModalError('');
    setModalSuccess('');
  };

  const handleEmailChange = (e) => {
    const { name, value } = e.target;
    setEmailData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTemplateChange = (e) => {
    const templateType = e.target.value;
    setEmailData({
      ...emailData,
      templateType,
      subject: emailTemplates[templateType].subject,
      message: templateType === 'violation' 
        ? emailTemplates.violation.message.replace('[USERNAME]', selectedUser?.name || 'User')
        : emailTemplates.custom.message
    });
  };

  const sendViolationEmail = async () => {
    if (!selectedUser) return;
    
    setIsSending(true);
    setModalError('');
    setModalSuccess('');
    
    try {
      // Validate form
      if (!emailData.subject || !emailData.message) {
        setModalError('Please provide both subject and message');
        setIsSending(false);
        return;
      }

      const response = await userService.sendViolationEmail(selectedUser._id, {
        subject: emailData.subject,
        message: emailData.message
      });

      setModalSuccess('Email sent successfully');
      
      // Wait 2 seconds and close the modal
      setTimeout(() => {
        closeEmailModal();
      }, 2000);
      
    } catch (err) {
      console.error('Error sending violation email:', err);
      setModalError('Failed to send email. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const deleteUser = async () => {
    if (!selectedUser) return;
    
    setIsDeleting(true);
    setModalError('');
    setModalSuccess('');
    
    try {
      await userService.deleteUser(selectedUser._id);
      
      setModalSuccess('User deleted successfully');
      
      // Wait 1 second, close modal and refresh list
      setTimeout(() => {
        closeDeleteModal();
        fetchUsers();
      }, 1000);
      
    } catch (err) {
      console.error('Error deleting user:', err);
      setModalError('Failed to delete user. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <SortAsc size={14} /> : <SortDesc size={14} />;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        {/* Header with back button */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/admin')}
              className="mr-4 p-2 text-gray-400 hover:text-blue-400 rounded-full hover:bg-gray-800 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-3xl font-bold flex items-center">
              <Shield className="mr-2" size={28} />
              User Control Panel
            </h1>
          </div>
        </div>

        {/* Search and filters */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search users by name or email..."
                className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => fetchUsers()}
                className="p-2 bg-blue-600/30 hover:bg-blue-600/50 rounded-lg transition-colors flex items-center"
              >
                <RefreshCw size={18} className="mr-2" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-900/20 border border-red-500/40 p-4 rounded-lg mb-6">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
              <div>
                <p className="text-red-400 font-medium">{error}</p>
                <button 
                  onClick={fetchUsers}
                  className="mt-2 px-3 py-1 bg-red-900/30 text-red-400 hover:bg-red-900/50 rounded text-sm flex items-center"
                >
                  <RefreshCw className="h-3 w-3 mr-2" />
                  Retry Loading Users
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Users table */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-800/80 border-b border-gray-700">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                    <button 
                      className="flex items-center focus:outline-none" 
                      onClick={() => handleSort('name')}
                    >
                      Name {getSortIcon('name')}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                    <button 
                      className="flex items-center focus:outline-none" 
                      onClick={() => handleSort('email')}
                    >
                      Email {getSortIcon('email')}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                    <button 
                      className="flex items-center focus:outline-none" 
                      onClick={() => handleSort('university')}
                    >
                      University {getSortIcon('university')}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                    <button 
                      className="flex items-center focus:outline-none" 
                      onClick={() => handleSort('role')}
                    >
                      Role {getSortIcon('role')}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                    <button 
                      className="flex items-center focus:outline-none" 
                      onClick={() => handleSort('createdAt')}
                    >
                      Joined {getSortIcon('createdAt')}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-6 text-center text-gray-400">
                      <div className="flex flex-col items-center">
                        <RefreshCw className="animate-spin h-8 w-8 mb-2" />
                        <p>Loading users...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-6 text-center text-gray-400">
                      <div className="flex flex-col items-center">
                        <UserX className="h-8 w-8 mb-2" />
                        <p>No users found{searchTerm ? ` matching "${searchTerm}"` : ''}</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map(user => (
                    <tr key={user._id} className="hover:bg-gray-800/40 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-200">{user.name || 'N/A'}</td>
                      <td className="px-4 py-3 text-sm text-gray-200">{user.email}</td>
                      <td className="px-4 py-3 text-sm text-gray-200">{user.university || 'N/A'}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          user.role === 'admin' 
                            ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
                            : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        }`}>
                          {user.role || 'user'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-200">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEmailModal(user)}
                            className="p-1 text-gray-400 hover:text-amber-400 hover:bg-amber-400/10 rounded"
                            title="Send Warning Email"
                          >
                            <Mail size={18} />
                          </button>
                          <button
                            onClick={() => openDeleteModal(user)}
                            className="p-1 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded"
                            title="Delete User"
                            disabled={user.role === 'admin'}
                          >
                            <Trash2 size={18} className={user.role === 'admin' ? 'opacity-50 cursor-not-allowed' : ''} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!loading && filteredUsers.length > 0 && (
            <div className="px-4 py-3 flex items-center justify-between border-t border-gray-700 sm:px-6">
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-400">
                    Showing <span className="font-medium">{(currentPage - 1) * usersPerPage + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * usersPerPage, filteredUsers.length + (currentPage - 1) * usersPerPage)}
                    </span>{' '}
                    of <span className="font-medium">{filteredUsers.length + (currentPage - 1) * usersPerPage}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-700 bg-gray-800 text-sm font-medium text-gray-400 hover:bg-gray-700 ${
                        currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                    </button>
                    
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => handlePageChange(i + 1)}
                        className={`relative inline-flex items-center px-4 py-2 border ${
                          currentPage === i + 1
                            ? 'z-10 bg-blue-900/50 border-blue-500 text-blue-300'
                            : 'border-gray-700 bg-gray-800 text-gray-400 hover:bg-gray-700'
                        } text-sm font-medium`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-700 bg-gray-800 text-sm font-medium text-gray-400 hover:bg-gray-700 ${
                        currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <span className="sr-only">Next</span>
                      <ChevronRight className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Email Modal */}
      {showEmailModal && selectedUser && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <Mail className="mr-2" size={20} />
                  Send Warning Email
                </h2>
                <button 
                  onClick={closeEmailModal}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="mb-4">
                <p className="text-gray-300 mb-2">
                  Sending email to: <span className="font-semibold">{selectedUser.name} ({selectedUser.email})</span>
                </p>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Template Type
                  </label>
                  <select
                    name="templateType"
                    value={emailData.templateType}
                    onChange={handleTemplateChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                  >
                    <option value="violation">Violation Warning</option>
                    <option value="custom">Custom Message</option>
                  </select>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={emailData.subject}
                    onChange={handleEmailChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                    placeholder="Email subject"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={emailData.message}
                    onChange={handleEmailChange}
                    rows={10}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white font-mono text-sm"
                    placeholder="Email message"
                  ></textarea>
                </div>
              </div>
              
              {/* Modal success/error messages */}
              {modalSuccess && (
                <div className="mb-4 p-3 bg-green-900/30 border border-green-500/30 rounded-md text-green-400 flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span>{modalSuccess}</span>
                </div>
              )}
              
              {modalError && (
                <div className="mb-4 p-3 bg-red-900/30 border border-red-500/30 rounded-md text-red-400 flex items-start">
                  <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span>{modalError}</span>
                </div>
              )}
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={closeEmailModal}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={sendViolationEmail}
                  disabled={isSending}
                  className={`px-4 py-2 bg-amber-600 hover:bg-amber-500 rounded-md text-white flex items-center ${
                    isSending ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                >
                  {isSending ? (
                    <>
                      <RefreshCw className="animate-spin h-4 w-4 mr-2" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="h-4 w-4 mr-2" />
                      Send Email
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-lg w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <AlertTriangle className="mr-2 text-red-500" size={20} />
                  Confirm User Deletion
                </h2>
                <button 
                  onClick={closeDeleteModal}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-300 mb-4">
                  Are you sure you want to permanently delete the following user?
                </p>
                <div className="bg-gray-900/50 border border-gray-700 rounded-md p-3">
                  <p className="font-medium text-white">{selectedUser.name}</p>
                  <p className="text-gray-400">{selectedUser.email}</p>
                  <p className="text-gray-400 text-sm mt-1">Role: {selectedUser.role || 'user'}</p>
                </div>
                <p className="mt-4 text-red-400 text-sm">
                  This action cannot be undone. All user data will be permanently removed.
                </p>
              </div>
              
              {/* Modal success/error messages */}
              {modalSuccess && (
                <div className="mb-4 p-3 bg-green-900/30 border border-green-500/30 rounded-md text-green-400 flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span>{modalSuccess}</span>
                </div>
              )}
              
              {modalError && (
                <div className="mb-4 p-3 bg-red-900/30 border border-red-500/30 rounded-md text-red-400 flex items-start">
                  <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span>{modalError}</span>
                </div>
              )}
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={closeDeleteModal}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteUser}
                  disabled={isDeleting}
                  className={`px-4 py-2 bg-red-600 hover:bg-red-500 rounded-md text-white flex items-center ${
                    isDeleting ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                >
                  {isDeleting ? (
                    <>
                      <RefreshCw className="animate-spin h-4 w-4 mr-2" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete User
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

export default UserControl; 