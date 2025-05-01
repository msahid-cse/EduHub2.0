import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Calendar, MapPin, Clock, Users, ArrowLeft, User,
  Heart, ExternalLink, Share2, Mail, AlertTriangle,
  CheckCircle, Tag, Info, Edit, Trash 
} from 'lucide-react';
import eventService from '../api/eventService';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userInterested, setUserInterested] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('user');
  const [interestedCount, setInterestedCount] = useState(0);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');

  useEffect(() => {
    // Check authentication status and user role
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload && payload.role) {
          setUserRole(payload.role);
        }
      } catch (err) {
        console.error('Error parsing token:', err);
      }
    }
    
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const eventData = await eventService.getEventById(id);
      setEvent(eventData);
      
      // Check if user is interested in this event
      if (eventData.interestedUsers && eventData.interestedUsers.length > 0) {
        setInterestedCount(eventData.interestedUsers.length);
        
        // Check if current user is in the interested users list
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            if (payload && payload._id) {
              const isInterested = eventData.interestedUsers.includes(payload._id);
              setUserInterested(isInterested);
            }
          } catch (err) {
            console.error('Error checking interest status:', err);
          }
        }
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching event details:', err);
      setError('Failed to load event details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleExpressInterest = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    try {
      setActionLoading(true);
      if (userInterested) {
        await eventService.removeInterest(id);
        setUserInterested(false);
        setInterestedCount(prevCount => Math.max(0, prevCount - 1));
        setActionSuccess('You have removed your interest in this event');
      } else {
        await eventService.expressInterest(id);
        setUserInterested(true);
        setInterestedCount(prevCount => prevCount + 1);
        setActionSuccess('You have expressed interest in this event');
      }
      setTimeout(() => setActionSuccess(''), 3000);
    } catch (err) {
      console.error('Error updating interest:', err);
      setError('Failed to update interest status. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteEvent = async () => {
    try {
      setActionLoading(true);
      await eventService.deleteEvent(id);
      navigate('/events', { state: { message: 'Event deleted successfully' } });
    } catch (err) {
      console.error('Error deleting event:', err);
      setError('Failed to delete event. Please try again.');
      setActionLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: `Check out this event: ${event.title}`,
        url: window.location.href
      })
      .catch(err => console.error('Error sharing:', err));
    } else {
      navigator.clipboard.writeText(window.location.href)
        .then(() => {
          setActionSuccess('Event link copied to clipboard');
          setTimeout(() => setActionSuccess(''), 3000);
        })
        .catch(() => setError('Failed to copy link'));
    }
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const isUpcoming = (date) => {
    return new Date(date) >= new Date();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg p-8 text-center">
            <AlertTriangle size={48} className="mx-auto text-red-500 mb-4" />
            <h2 className="text-2xl font-bold mb-4">Event Not Found</h2>
            <p className="text-gray-400 mb-6">{error || 'This event does not exist or has been removed.'}</p>
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
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/events')}
            className="inline-flex items-center text-gray-400 hover:text-teal-400 transition-colors"
          >
            <ArrowLeft size={18} className="mr-1" />
            Back to Events
          </button>
        </div>
        
        {actionSuccess && (
          <div className="bg-green-900/30 border border-green-500 text-green-300 p-4 mb-6 rounded-md flex items-center">
            <CheckCircle className="mr-2 text-green-400" size={18} />
            <span>{actionSuccess}</span>
          </div>
        )}
        
        {error && (
          <div className="bg-red-900/30 border border-red-500 text-red-300 p-4 mb-6 rounded-md flex items-center">
            <AlertTriangle className="mr-2 text-red-400" size={18} />
            <span>{error}</span>
          </div>
        )}
        
        <div className="max-w-5xl mx-auto">
          {/* Event Header */}
          <div className="bg-gray-800 rounded-lg overflow-hidden shadow-xl">
            {/* Event Image */}
            <div className="h-64 md:h-80 relative">
              {event.image ? (
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-teal-900 to-gray-800 flex items-center justify-center">
                  <Calendar size={64} className="text-teal-400 opacity-70" />
                </div>
              )}
              
              {/* Category Badge */}
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-teal-500 text-white text-sm font-semibold rounded-full uppercase">
                  {event.category}
                </span>
              </div>
              
              {/* Status Badge */}
              <div className="absolute top-4 right-4">
                {isUpcoming(event.date) ? (
                  <span className="px-3 py-1 bg-green-500/80 text-white text-sm font-semibold rounded-full uppercase">
                    Upcoming
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-gray-700/80 text-gray-300 text-sm font-semibold rounded-full uppercase">
                    Past Event
                  </span>
                )}
              </div>
            </div>
            
            {/* Event Title & Actions */}
            <div className="p-6 border-b border-gray-700">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-2xl md:text-3xl font-bold text-white">{event.title}</h1>
                
                <div className="flex items-center space-x-3">
                  {/* Interest Button */}
                  <button
                    onClick={handleExpressInterest}
                    disabled={actionLoading || !isUpcoming(event.date)}
                    className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                      !isUpcoming(event.date)
                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                        : userInterested
                          ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/40'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
                    }`}
                  >
                    {actionLoading ? (
                      <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
                    ) : (
                      <Heart size={18} className={`mr-2 ${userInterested ? 'fill-current' : ''}`} />
                    )}
                    {userInterested ? 'Interested' : 'Express Interest'} ({interestedCount})
                  </button>
                  
                  {/* Share Button */}
                  <button
                    onClick={handleShare}
                    className="p-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors text-gray-300"
                    title="Share Event"
                  >
                    <Share2 size={18} />
                  </button>
                  
                  {/* Admin Actions */}
                  {userRole === 'admin' && (
                    <>
                      <Link
                        to={`/edit-event/${event._id}`}
                        className="p-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors text-gray-300"
                        title="Edit Event"
                      >
                        <Edit size={18} />
                      </Link>
                      
                      <button
                        onClick={() => setShowConfirmDelete(true)}
                        className="p-2 bg-gray-700 hover:bg-red-900/50 rounded-md transition-colors text-gray-300 hover:text-red-400"
                        title="Delete Event"
                      >
                        <Trash size={18} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            {/* Delete Confirmation */}
            {showConfirmDelete && (
              <div className="p-4 bg-red-900/30 border-b border-red-500">
                <div className="flex items-center justify-between">
                  <p className="text-red-300 flex items-center">
                    <AlertTriangle size={18} className="mr-2 text-red-400" />
                    Are you sure you want to delete this event?
                  </p>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowConfirmDelete(false)}
                      className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-md"
                      disabled={actionLoading}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteEvent}
                      className="px-3 py-1 bg-red-700 hover:bg-red-800 text-white rounded-md flex items-center"
                      disabled={actionLoading}
                    >
                      {actionLoading ? (
                        <>
                          <div className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full mr-1"></div>
                          Deleting...
                        </>
                      ) : (
                        'Delete'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Event Details */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Left Column - Event Info */}
              <div className="md:col-span-2 space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4 text-white flex items-center">
                    <Info className="mr-2 text-teal-500" size={20} />
                    About This Event
                  </h2>
                  <div className="text-gray-300 space-y-4 whitespace-pre-line">
                    {event.description}
                  </div>
                </div>
                
                {/* Organizer */}
                <div>
                  <h2 className="text-xl font-semibold mb-4 text-white flex items-center">
                    <User className="mr-2 text-teal-500" size={20} />
                    Organizer
                  </h2>
                  <div className="bg-gray-750 rounded-lg p-4 border border-gray-700">
                    <p className="text-gray-300">{event.organizer}</p>
                  </div>
                </div>
                
                {/* Registration Info (conditional) */}
                {event.registrationRequired && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4 text-white flex items-center">
                      <Users className="mr-2 text-teal-500" size={20} />
                      Registration
                    </h2>
                    <div className="bg-gray-750 rounded-lg p-4 border border-gray-700">
                      <p className="text-gray-300 mb-3">Registration is required to attend this event.</p>
                      <a 
                        href={event.registrationLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-teal-600 hover:bg-teal-700 rounded-md text-white transition-colors"
                      >
                        Register Now
                        <ExternalLink size={16} className="ml-2" />
                      </a>
                    </div>
                  </div>
                )}
                
                {/* Admin Actions */}
                {userRole === 'admin' && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4 text-white flex items-center">
                      <Mail className="mr-2 text-teal-500" size={20} />
                      Admin Actions
                    </h2>
                    <div className="flex flex-wrap gap-3">
                      <Link
                        to={`/events/${event._id}/send-invitations`}
                        className="inline-flex items-center px-4 py-2 bg-teal-600 hover:bg-teal-700 rounded-md text-white transition-colors"
                      >
                        <Mail size={16} className="mr-2" />
                        Send Invitations
                      </Link>
                      
                      <Link
                        to={`/edit-event/${event._id}`}
                        className="inline-flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-white transition-colors"
                      >
                        <Edit size={16} className="mr-2" />
                        Edit Event
                      </Link>
                      
                      <button
                        onClick={() => setShowConfirmDelete(true)}
                        className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-white transition-colors"
                      >
                        <Trash size={16} className="mr-2" />
                        Delete Event
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Right Column - Event Details Card */}
              <div>
                <div className="bg-gray-750 rounded-lg overflow-hidden border border-gray-700 sticky top-6">
                  <div className="p-5 bg-gray-750 border-b border-gray-700">
                    <h3 className="font-semibold text-white mb-1">Event Details</h3>
                  </div>
                  
                  <div className="p-5 space-y-4">
                    {/* Date */}
                    <div className="flex items-start">
                      <Calendar className="w-5 h-5 mr-3 text-teal-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-gray-300 font-medium">Date</p>
                        <p className="text-gray-400">{formatDate(event.date)}</p>
                      </div>
                    </div>
                    
                    {/* Time */}
                    <div className="flex items-start">
                      <Clock className="w-5 h-5 mr-3 text-teal-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-gray-300 font-medium">Time</p>
                        <p className="text-gray-400">{event.time}</p>
                      </div>
                    </div>
                    
                    {/* Location */}
                    <div className="flex items-start">
                      <MapPin className="w-5 h-5 mr-3 text-teal-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-gray-300 font-medium">Location</p>
                        <p className="text-gray-400">{event.location}</p>
                      </div>
                    </div>
                    
                    {/* Category */}
                    <div className="flex items-start">
                      <Tag className="w-5 h-5 mr-3 text-teal-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-gray-300 font-medium">Category</p>
                        <p className="text-gray-400 capitalize">{event.category}</p>
                      </div>
                    </div>
                    
                    {/* Interested Count */}
                    <div className="flex items-start">
                      <Heart className="w-5 h-5 mr-3 text-teal-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-gray-300 font-medium">Interested</p>
                        <p className="text-gray-400">{interestedCount} people</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* CTA */}
                  {isUpcoming(event.date) && (
                    <div className="p-5 bg-gray-800/50 border-t border-gray-700">
                      {isAuthenticated ? (
                        <button
                          onClick={handleExpressInterest}
                          disabled={actionLoading}
                          className={`w-full py-2 rounded-md transition-colors flex items-center justify-center ${
                            userInterested
                              ? 'bg-red-600 hover:bg-red-700 text-white'
                              : 'bg-teal-600 hover:bg-teal-700 text-white'
                          }`}
                        >
                          {actionLoading ? (
                            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                          ) : (
                            <>
                              <Heart size={18} className={`mr-2 ${userInterested ? 'fill-current' : ''}`} />
                              {userInterested ? 'Remove Interest' : 'Express Interest'}
                            </>
                          )}
                        </button>
                      ) : (
                        <button
                          onClick={() => navigate('/login')}
                          className="w-full py-2 bg-teal-600 hover:bg-teal-700 rounded-md text-white transition-colors flex items-center justify-center"
                        >
                          <User size={18} className="mr-2" />
                          Login to Express Interest
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail; 