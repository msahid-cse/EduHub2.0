import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Mail, User, Users, Send, Info, AlertTriangle, CheckCircle, AtSign, MessageSquare, ArrowLeft } from 'lucide-react';
import eventService from '../api/eventService';

const SendEventInvitations = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [interestedUsers, setInterestedUsers] = useState([]);
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    invitationType: 'interested',
    emails: []
  });
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [emailInput, setEmailInput] = useState('');

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      // Fetch event details
      const eventData = await eventService.getEventById(id);
      setEvent(eventData);
      
      // Set default subject and message with event details
      setFormData({
        ...formData,
        subject: `Invitation: ${eventData.title}`,
        message: `
          <p>Hello {{name}},</p>
          <p>We're excited to invite you to our upcoming event:</p>
          <h2 style="color:#0d9488;margin-top:16px;margin-bottom:8px;">{{eventTitle}}</h2>
          <p><strong>Date:</strong> {{eventDate}}</p>
          <p><strong>Time:</strong> {{eventTime}}</p>
          <p><strong>Location:</strong> {{eventLocation}}</p>
          <p style="margin-top:16px;">This event is perfect for anyone interested in ${eventData.category}. We hope to see you there!</p>
          <p style="margin-top:24px;">Best regards,<br>The EduHub Team</p>
        `
      });
      
      // Fetch interested users
      try {
        const usersResponse = await eventService.getInterestedUsers(id);
        setInterestedUsers(usersResponse.users || []);
      } catch (usersError) {
        console.error('Error fetching interested users:', usersError);
        // Don't fail completely, just show empty list
        setInterestedUsers([]);
      }
      
    } catch (err) {
      console.error('Error fetching event details:', err);
      setError('Failed to load event details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleAddEmail = () => {
    if (emailInput && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput)) {
      setFormData({
        ...formData,
        emails: [...formData.emails, emailInput]
      });
      setEmailInput('');
    }
  };

  const handleRemoveEmail = (email) => {
    setFormData({
      ...formData,
      emails: formData.emails.filter(e => e !== email)
    });
  };

  const handleSelectAllUsers = () => {
    if (selectedUsers.length === interestedUsers.length) {
      // Deselect all
      setSelectedUsers([]);
    } else {
      // Select all
      setSelectedUsers(interestedUsers.map(user => user._id));
    }
  };

  const handleToggleUser = (userId) => {
    if (selectedUsers.includes(userId)) {
      // Remove user
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      // Add user
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setError('');
    setSuccess('');
    
    try {
      // Validate form
      if (!formData.subject || !formData.message) {
        setError('Please provide both subject and message');
        setIsSending(false);
        return;
      }
      
      let invitationData = {
        subject: formData.subject,
        message: formData.message,
        invitationType: formData.invitationType
      };
      
      // If specific users are selected, add their emails
      if (formData.invitationType === 'specific') {
        if (formData.emails.length === 0 && selectedUsers.length === 0) {
          setError('Please add at least one email address or select users from the list');
          setIsSending(false);
          return;
        }
        
        // Extract emails from selected users and combine with manual emails
        const selectedUserEmails = interestedUsers
          .filter(user => selectedUsers.includes(user._id))
          .map(user => user.email);
          
        const combinedEmails = [...new Set([...selectedUserEmails, ...formData.emails])];
        
        invitationData.emails = combinedEmails;
      }
      
      // Send invitations
      const response = await eventService.sendInvitations(id, invitationData);
      
      setSuccess(`Invitations sent successfully to ${response.stats.success} recipients`);
      
      // Reset form after successful send
      if (formData.invitationType === 'specific') {
        setFormData({
          ...formData,
          emails: []
        });
        setSelectedUsers([]);
      }
      
    } catch (err) {
      console.error('Error sending invitations:', err);
      setError(err.response?.data?.message || 'Failed to send invitations. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-gray-800 rounded-lg p-8 text-center">
            <AlertTriangle size={48} className="mx-auto text-red-500 mb-4" />
            <h2 className="text-2xl font-bold mb-4">Event Not Found</h2>
            <p className="text-gray-400 mb-6">The event you're looking for does not exist or you don't have permission to access it.</p>
            <button
              onClick={() => navigate('/events')}
              className="px-6 py-2 bg-teal-600 hover:bg-teal-700 rounded-md font-medium transition-colors inline-flex items-center"
            >
              <ArrowLeft size={18} className="mr-2" />
              Back to Events
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-teal-800 to-teal-900">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold flex items-center">
                <Mail className="mr-2" size={24} />
                Send Event Invitations
              </h1>
              <button
                onClick={() => navigate(`/events/${id}`)}
                className="px-3 py-1.5 bg-teal-700/40 hover:bg-teal-700/60 rounded-md text-sm transition-colors flex items-center"
              >
                <ArrowLeft size={16} className="mr-1" />
                Back to Event
              </button>
            </div>
            <p className="text-teal-200 mt-2">Send invitation emails for: {event.title}</p>
          </div>
          
          {error && (
            <div className="bg-red-900/30 border border-red-500 text-red-300 p-4 m-6 rounded-md flex items-start">
              <AlertTriangle className="mr-2 mt-0.5 text-red-400 shrink-0" size={18} />
              <span>{error}</span>
            </div>
          )}
          
          {success && (
            <div className="bg-green-900/30 border border-green-500 text-green-300 p-4 m-6 rounded-md flex items-start">
              <CheckCircle className="mr-2 mt-0.5 text-green-400 shrink-0" size={18} />
              <span>{success}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Recipient Selection */}
            <div>
              <label className="block text-gray-300 mb-2">
                Select Recipients
              </label>
              <div className="space-y-3">
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="invitationType"
                      value="interested"
                      checked={formData.invitationType === 'interested'}
                      onChange={handleChange}
                      className="h-4 w-4 text-teal-500 focus:ring-2 focus:ring-teal-500 bg-gray-700 border-gray-600"
                    />
                    <span className="text-gray-300 flex items-center">
                      <Heart size={16} className="mr-1 text-gray-500" />
                      Interested Users ({interestedUsers.length})
                    </span>
                  </label>
                  
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="invitationType"
                      value="all"
                      checked={formData.invitationType === 'all'}
                      onChange={handleChange}
                      className="h-4 w-4 text-teal-500 focus:ring-2 focus:ring-teal-500 bg-gray-700 border-gray-600"
                    />
                    <span className="text-gray-300 flex items-center">
                      <Users size={16} className="mr-1 text-gray-500" />
                      All Platform Users
                    </span>
                  </label>
                  
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="invitationType"
                      value="specific"
                      checked={formData.invitationType === 'specific'}
                      onChange={handleChange}
                      className="h-4 w-4 text-teal-500 focus:ring-2 focus:ring-teal-500 bg-gray-700 border-gray-600"
                    />
                    <span className="text-gray-300 flex items-center">
                      <AtSign size={16} className="mr-1 text-gray-500" />
                      Specific Recipients
                    </span>
                  </label>
                </div>
                
                {formData.invitationType === 'specific' && (
                  <div className="mt-4 space-y-4">
                    <div>
                      <div className="flex items-center">
                        <input
                          type="email"
                          value={emailInput}
                          onChange={(e) => setEmailInput(e.target.value)}
                          placeholder="Enter email address"
                          className="flex-grow bg-gray-700 border border-gray-600 rounded-l-md py-2 px-3 focus:outline-none focus:border-teal-500"
                        />
                        <button
                          type="button"
                          onClick={handleAddEmail}
                          className="bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded-r-md"
                        >
                          Add
                        </button>
                      </div>
                      
                      {formData.emails.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {formData.emails.map((email, index) => (
                            <span
                              key={index}
                              className="bg-gray-700 text-gray-300 px-2 py-1 rounded-md text-sm flex items-center"
                            >
                              {email}
                              <button
                                type="button"
                                onClick={() => handleRemoveEmail(email)}
                                className="ml-2 text-gray-400 hover:text-red-400"
                              >
                                <X size={14} />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {interestedUsers.length > 0 && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-sm font-medium text-gray-300">
                            Or select from interested users:
                          </h3>
                          <button
                            type="button"
                            onClick={handleSelectAllUsers}
                            className="text-xs text-teal-400 hover:text-teal-300"
                          >
                            {selectedUsers.length === interestedUsers.length
                              ? 'Deselect All'
                              : 'Select All'}
                          </button>
                        </div>
                        
                        <div className="max-h-40 overflow-y-auto bg-gray-700/50 rounded-md p-2">
                          {interestedUsers.map((user) => (
                            <div
                              key={user._id}
                              className="flex items-center justify-between py-1.5 px-2 hover:bg-gray-700 rounded-md"
                            >
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={selectedUsers.includes(user._id)}
                                  onChange={() => handleToggleUser(user._id)}
                                  className="h-4 w-4 text-teal-500 focus:ring-2 focus:ring-teal-500 bg-gray-700 border-gray-600 mr-2"
                                />
                                <span className="text-gray-300 text-sm">{user.name}</span>
                              </div>
                              <span className="text-gray-400 text-xs">{user.email}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            {/* Subject */}
            <div>
              <label className="block text-gray-300 mb-2">
                Email Subject <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Enter email subject"
                className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:border-teal-500"
                required
              />
            </div>
            
            {/* Message */}
            <div>
              <label className="block text-gray-300 mb-2">
                Email Message <span className="text-red-400">*</span>
              </label>
              <div className="mb-2 text-xs text-gray-400">
                <p>You can use the following placeholders in your message:</p>
                <ul className="list-disc pl-5 mt-1 grid grid-cols-2">
                  <li>{"{{name}}"} - Recipient's name</li>
                  <li>{"{{eventTitle}}"} - Event title</li>
                  <li>{"{{eventDate}}"} - Event date</li>
                  <li>{"{{eventTime}}"} - Event time</li>
                  <li>{"{{eventLocation}}"} - Event location</li>
                </ul>
              </div>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Enter your message"
                className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:border-teal-500 min-h-[200px] font-mono text-sm"
                required
              ></textarea>
            </div>
            
            {/* Submit Button */}
            <div className="flex justify-end space-x-4 mt-8">
              <button
                type="button"
                onClick={() => navigate(`/events/${id}`)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSending}
                className={`px-6 py-2 bg-teal-600 hover:bg-teal-700 rounded-md font-medium transition-colors flex items-center ${
                  isSending ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isSending ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={18} className="mr-2" />
                    Send Invitations
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SendEventInvitations; 