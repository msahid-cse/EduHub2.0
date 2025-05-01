import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, Users, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import eventService from '../api/eventService';

const EventSection = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        // Fetch only active and upcoming events, limited to 4
        const response = await eventService.getEvents({
          limit: 4,
          active: 'true',
          page: 1
        });
        setEvents(response.events);
        setError(null);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load upcoming events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <section className="py-12 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Upcoming Events</h2>
            <div className="w-16 h-1 mx-auto bg-teal-500 rounded-full"></div>
          </div>
          <div className="flex justify-center items-center h-56">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Upcoming Events</h2>
            <div className="w-16 h-1 mx-auto bg-teal-500 rounded-full"></div>
          </div>
          <div className="text-center text-gray-400">
            <p>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (events.length === 0) {
    return (
      <section className="py-12 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Upcoming Events</h2>
            <div className="w-16 h-1 mx-auto bg-teal-500 rounded-full"></div>
          </div>
          <div className="text-center text-gray-400">
            <p>No upcoming events at the moment. Check back later!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Upcoming Events</h2>
          <div className="w-16 h-1 mx-auto bg-teal-500 rounded-full mb-4"></div>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Join our community events to network, learn, and grow your skills with industry experts and fellow students.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {events.map((event) => (
            <div 
              key={event._id} 
              className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105 border border-gray-700"
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
                </div>
                
                <Link 
                  to={`/events/${event._id}`}
                  className="inline-flex items-center text-teal-400 hover:text-teal-300 text-sm font-medium"
                >
                  View Details
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Link 
            to="/events"
            className="inline-block px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-md transition-colors font-medium"
          >
            View All Events
          </Link>
        </div>
      </div>
    </section>
  );
};

export default EventSection; 