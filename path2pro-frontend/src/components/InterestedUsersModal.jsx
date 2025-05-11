import React, { useState, useEffect } from 'react';
import { X, Search, Mail, Check, Filter, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const InterestedUsersModal = ({ event, onClose, interestedUsers = [] }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    setFilteredUsers(interestedUsers);
  }, [interestedUsers]);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (!term.trim()) {
      setFilteredUsers(interestedUsers);
      return;
    }
    
    const filtered = interestedUsers.filter(user => 
      user.name.toLowerCase().includes(term) || 
      user.email.toLowerCase().includes(term) ||
      (user.university && user.university.toLowerCase().includes(term)) ||
      (user.department && user.department.toLowerCase().includes(term))
    );
    setFilteredUsers(filtered);
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user._id));
    }
  };

  const handleSelectUser = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleSendInvitations = () => {
    navigate(`/events/${event._id}/send-invitations`, {
      state: { 
        selectedUserIds: selectedUsers
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg w-full max-w-3xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">
            Interested Users - {event?.title}
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Search & Filters */}
        <div className="p-4 border-b border-gray-700 bg-gray-750">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:border-teal-500"
              />
            </div>
            
            <button
              onClick={handleSelectAll}
              className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-md text-sm flex items-center"
            >
              <Check size={16} className="mr-1" />
              {selectedUsers.length === filteredUsers.length && filteredUsers.length > 0 
                ? 'Deselect All' 
                : 'Select All'}
            </button>
            
            <button
              onClick={handleSendInvitations}
              disabled={interestedUsers.length === 0}
              className={`px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-md text-sm flex items-center ${
                interestedUsers.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Mail size={16} className="mr-1" />
              Send Invitations
              {selectedUsers.length > 0 && ` (${selectedUsers.length})`}
            </button>
          </div>
        </div>
        
        {/* User List */}
        <div className="overflow-y-auto flex-grow">
          {filteredUsers.length === 0 ? (
            <div className="py-8 text-center text-gray-400">
              {interestedUsers.length === 0 ? (
                <div className="flex flex-col items-center">
                  <AlertTriangle size={32} className="mb-2 text-yellow-500" />
                  <p>No users have expressed interest in this event yet.</p>
                </div>
              ) : (
                <p>No users match your search criteria.</p>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-700">
              {filteredUsers.map((user) => (
                <div 
                  key={user._id} 
                  className="p-4 hover:bg-gray-750 flex items-center space-x-3"
                >
                  <input
                    type="checkbox"
                    id={`user-${user._id}`}
                    checked={selectedUsers.includes(user._id)}
                    onChange={() => handleSelectUser(user._id)}
                    className="h-4 w-4 text-teal-500 focus:ring-2 focus:ring-teal-500 bg-gray-700 border-gray-600 rounded"
                  />
                  
                  <div className="flex-grow">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-white">{user.name}</h4>
                        <p className="text-gray-400 text-sm">{user.email}</p>
                      </div>
                      {user.university && (
                        <span className="text-xs bg-gray-700 px-2 py-1 rounded text-gray-300">
                          {user.university}
                        </span>
                      )}
                    </div>
                    
                    {user.department && (
                      <p className="text-gray-400 text-xs mt-1">Department: {user.department}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-gray-700 bg-gray-750 flex justify-between items-center">
          <div className="text-sm text-gray-400">
            {selectedUsers.length > 0 
              ? `${selectedUsers.length} of ${filteredUsers.length} users selected` 
              : `${interestedUsers.length} interested users total`}
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-md text-sm"
            >
              Close
            </button>
            
            <button
              onClick={handleSendInvitations}
              disabled={interestedUsers.length === 0}
              className={`px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-md text-sm flex items-center ${
                interestedUsers.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Mail size={16} className="mr-1" />
              Send Invitations
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterestedUsersModal; 