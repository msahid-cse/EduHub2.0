import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Clock, Users, ChevronRight, Filter, Search, Calendar as CalendarIcon, Edit, Trash, Eye, Heart, X, AlertTriangle, Check, ExternalLink, Mail, ArrowLeft } from 'lucide-react';
import eventService from '../api/eventService';
import InterestedUsersModal from '../components/InterestedUsersModal';

const ViewEvents = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({
    category: 'all',
    active: true,
    search: '',
    interestMin: '' // Minimum number of interested users
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 8,
    total: 0,
    pages: 1
  });
  const [showConfirmDelete, setShowConfirmDelete] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [userRole, setUserRole] = useState('user'); // Default to user, will be updated from token
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [interestedUsers, setInterestedUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  
  useEffect(() => {
    // Get user role from token
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload && payload.role) {
          setUserRole(payload.role);
        }
      } catch (err) {
        console.error('Error parsing token:', err);
      }
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [pagination.page, filter]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      
      const params = {
        page: pagination.page,
        limit: pagination.limit
      };
      
      if (filter.category !== 'all') {
        params.category = filter.category;
      }
      
      if (filter.active) {
        params.active = true;
      }
      
      const response = await eventService.getEvents(params);
      
      // If search filter is active, filter locally
      let filteredEvents = response.events;
      if (filter.search.trim()) {
        const searchTerm = filter.search.toLowerCase();
        filteredEvents = filteredEvents.filter(event => 
          event.title.toLowerCase().includes(searchTerm) ||
          event.description.toLowerCase().includes(searchTerm) ||
          event.location.toLowerCase().includes(searchTerm) ||
          event.organizer.toLowerCase().includes(searchTerm)
        );
      }
      
      // Filter by minimum number of interested users if specified
      if (filter.interestMin && !isNaN(parseInt(filter.interestMin))) {
        const minInterested = parseInt(filter.interestMin);
        filteredEvents = filteredEvents.filter(event => 
          event.interestedUsers && event.interestedUsers.length >= minInterested
        );
      }
      
      setEvents(filteredEvents);
      setPagination({
        ...pagination,
        total: response.pagination.total,
        pages: response.pagination.pages
      });
      
      setError(null);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load events. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (key, value) => {
    setFilter({
      ...filter,
      [key]: value
    });
    
    // Reset to first page when filter changes
    setPagination({
      ...pagination,
      page: 1
    });
  };

  const handleSearchChange = (e) => {
    setFilter({
      ...filter,
      search: e.target.value
    });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchEvents();
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.pages) {
      setPagination({
        ...pagination,
        page: newPage
      });
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!eventId) return;
    
    try {
      setActionLoading(true);
      await eventService.deleteEvent(eventId);
      
      // Remove the deleted event from the list
      setEvents(events.filter(event => event._id !== eventId));
      setShowConfirmDelete(null);
      
      // Show success message (you could add a toast notification here)
    } catch (err) {
      console.error('Error deleting event:', err);
      setError('Failed to delete event. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleViewInterestedUsers = async (event) => {
    setSelectedEvent(event);
    setLoadingUsers(true);
    
    try {
      const response = await eventService.getInterestedUsers(event._id);
      setInterestedUsers(response.users || []);
    } catch (err) {
      console.error('Error fetching interested users:', err);
      setInterestedUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  const closeInterestedUsersModal = () => {
    setSelectedEvent(null);
    setInterestedUsers([]);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const isUpcoming = (date) => {
    return new Date(date) >= new Date();
  };

  if (loading && events.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Events</h1>
            {userRole === 'admin' && (
              <Link
                to="/add-event"
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 rounded-md font-medium transition-colors flex items-center"
              >
                <Calendar className="mr-2" size={18} />
                Add New Event
              </Link>
            )}
          </div>
          
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            {userRole === 'admin' && (
              <button
                onClick={() => navigate('/admin')}
                className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-md text-sm flex items-center"
              >
                <ArrowLeft size={16} className="mr-1" />
                Back to Dashboard
              </button>
            )}
            <h1 className="text-3xl font-bold">Events</h1>
          </div>
          {userRole === 'admin' && (
            <Link
              to="/add-event"
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 rounded-md font-medium transition-colors flex items-center"
            >
              <Calendar className="mr-2" size={18} />
              Add New Event
            </Link>
          )}
        </div>
        
        {error && (
          <div className="bg-red-900/30 border border-red-500 text-red-300 p-4 mb-6 rounded-md flex items-center">
            <AlertTriangle className="mr-2 text-red-400" size={18} />
            <span>{error}</span>
          </div>
        )}
        
        {/* Filters */}
        <div className="bg-gray-800 rounded-lg p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="w-full md:w-auto">
              <form onSubmit={handleSearchSubmit} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={filter.search}
                  onChange={handleSearchChange}
                  className="w-full md:w-64 pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:border-teal-500"
                />
              </form>
            </div>
            
            <div className="flex items-center gap-2 text-sm w-full md:w-auto flex-wrap">
              <label className="text-gray-400 flex items-center mr-2">
                <Filter size={16} className="mr-1" />
                Filter:
              </label>
              
              <select
                value={filter.category}
                onChange={(e) => handleFilter('category', e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded-md px-3 py-1.5 focus:outline-none focus:border-teal-500"
              >
                <option value="all">All Categories</option>
                <option value="academic">Academic</option>
                <option value="career">Career</option>
                <option value="workshop">Workshop</option>
                <option value="seminar">Seminar</option>
                <option value="conference">Conference</option>
                <option value="other">Other</option>
              </select>
              
              <div className="flex items-center ml-4">
                <input
                  type="checkbox"
                  id="active-filter"
                  checked={filter.active}
                  onChange={(e) => handleFilter('active', e.target.checked)}
                  className="h-4 w-4 text-teal-500 rounded focus:ring-2 focus:ring-teal-500 bg-gray-700 border-gray-600"
                />
                <label htmlFor="active-filter" className="ml-2 text-gray-300">
                  Show only upcoming
                </label>
              </div>
              
              {userRole === 'admin' && (
                <div className="ml-4 flex items-center">
                  <label htmlFor="interest-min" className="text-gray-300 mr-2">
                    Min. Interest:
                  </label>
                  <input 
                    type="number"
                    id="interest-min"
                    min="0"
                    value={filter.interestMin}
                    onChange={(e) => handleFilter('interestMin', e.target.value)}
                    className="w-16 bg-gray-700 border border-gray-600 rounded-md px-2 py-1 focus:outline-none focus:border-teal-500"
                    placeholder="#"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Events Grid */}
        {events.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-12 text-center">
            <CalendarIcon size={48} className="mx-auto text-gray-600 mb-4" />
            <h3 className="text-xl font-medium text-gray-300 mb-2">No events found</h3>
            <p className="text-gray-400">
              {filter.search || filter.category !== 'all' || filter.interestMin
                ? 'Try adjusting your search or filters' 
                : 'There are no events available at the moment'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {events.map((event) => (
              <div 
                key={event._id} 
                className={`bg-gray-800 rounded-lg overflow-hidden shadow-lg border transition-all hover:shadow-xl ${
                  isUpcoming(event.date) ? 'border-gray-700' : 'border-gray-700/50 opacity-75'
                }`}
              >
                <div className="h-48 overflow-hidden relative">
                  {event.image ? (
                    <img 
                      src={event.image} 
                      alt={event.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-teal-900 to-gray-800 flex items-center justify-center">
                      <CalendarIcon size={48} className="text-teal-400 opacity-70" />
                    </div>
                  )}
                  <div className="absolute top-0 left-0 m-3 px-3 py-1 bg-teal-500 text-white text-xs font-semibold rounded-full uppercase">
                    {event.category}
                  </div>
                  {!isUpcoming(event.date) && (
                    <div className="absolute top-0 right-0 m-3 px-3 py-1 bg-gray-800 text-gray-300 text-xs font-semibold rounded-full uppercase">
                      Past Event
                    </div>
                  )}
                </div>
                
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1">
                    {event.title}
                  </h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-400 text-sm">
                      <Calendar className="w-4 h-4 mr-2 text-teal-500" />
                      {formatDate(event.date)}
                    </div>
                    
                    <div className="flex items-center text-gray-400 text-sm">
                      <Clock className="w-4 h-4 mr-2 text-teal-500" />
                      {event.time}
                    </div>
                    
                    <div className="flex items-start text-gray-400 text-sm">
                      <MapPin className="w-4 h-4 mr-2 text-teal-500 mt-0.5" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-400 text-sm">
                      <Users className="w-4 h-4 mr-2 text-teal-500" />
                      <span>Organizer: {event.organizer}</span>
                    </div>
                    
                    {userRole === 'admin' && (
                      <div className="flex items-center text-gray-400 text-sm">
                        <Heart className="w-4 h-4 mr-2 text-teal-500" />
                        <span>Interested: {event.interestedUsers ? event.interestedUsers.length : 0}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center mt-4">
                    <Link 
                      to={`/events/${event._id}`}
                      className="inline-flex items-center text-teal-400 hover:text-teal-300 text-sm font-medium"
                    >
                      View Details
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                    
                    {userRole === 'admin' && (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewInterestedUsers(event)}
                          className="p-1.5 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors text-gray-300 hover:text-white"
                          title="View Interested Users"
                        >
                          <Heart size={16} />
                        </button>
                        
                        <Link
                          to={`/events/${event._id}/send-invitations`}
                          className="p-1.5 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors text-gray-300 hover:text-white"
                          title="Send Invitations"
                        >
                          <Mail size={16} />
                        </Link>
                        
                        <button
                          onClick={() => navigate(`/edit-event/${event._id}`)}
                          className="p-1.5 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors text-gray-300 hover:text-white"
                          title="Edit Event"
                        >
                          <Edit size={16} />
                        </button>
                        
                        <button
                          onClick={() => setShowConfirmDelete(event._id)}
                          className="p-1.5 bg-gray-700 hover:bg-red-900 rounded-md transition-colors text-gray-300 hover:text-red-300"
                          title="Delete Event"
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {showConfirmDelete === event._id && (
                    <div className="mt-4 p-3 bg-red-900/30 border border-red-700 rounded-md">
                      <p className="text-sm text-red-300 mb-2">Are you sure you want to delete this event?</p>
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => setShowConfirmDelete(null)}
                          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-xs rounded-md"
                          disabled={actionLoading}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event._id)}
                          className="px-3 py-1 bg-red-700 hover:bg-red-800 text-white text-xs rounded-md flex items-center"
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
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-center mt-8">
            <nav className="inline-flex rounded-md shadow">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className={`px-3 py-1 rounded-l-md border border-gray-700 ${
                  pagination.page === 1
                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                Previous
              </button>
              
              {[...Array(pagination.pages)].map((_, index) => {
                const pageNumber = index + 1;
                // Only show a few page numbers around the current page
                if (
                  pageNumber === 1 ||
                  pageNumber === pagination.pages ||
                  (pageNumber >= pagination.page - 1 && pageNumber <= pagination.page + 1)
                ) {
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`px-3 py-1 border-t border-b border-gray-700 ${
                        pagination.page === pageNumber
                          ? 'bg-teal-700 text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                } else if (
                  (pageNumber === pagination.page - 2 && pageNumber > 1) ||
                  (pageNumber === pagination.page + 2 && pageNumber < pagination.pages)
                ) {
                  return (
                    <span
                      key={pageNumber}
                      className="px-3 py-1 border-t border-b border-gray-700 bg-gray-800 text-gray-500"
                    >
                      ...
                    </span>
                  );
                }
                return null;
              })}
              
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className={`px-3 py-1 rounded-r-md border border-gray-700 ${
                  pagination.page === pagination.pages
                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                Next
              </button>
            </nav>
          </div>
        )}
        
        {/* Interested Users Modal */}
        {selectedEvent && (
          <InterestedUsersModal 
            event={selectedEvent}
            interestedUsers={interestedUsers}
            onClose={closeInterestedUsersModal}
          />
        )}
      </div>
    </div>
  );
};

export default ViewEvents; 