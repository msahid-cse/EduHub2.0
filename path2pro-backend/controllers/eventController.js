import Event from '../models/Event.js';
import EventHit from '../models/EventHit.js';
import User from '../models/User.js';
import nodemailer from 'nodemailer';

// Get all events
export const getEvents = async (req, res) => {
  try {
    const { limit = 10, page = 1, category, active } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const query = {};
    
    if (category) {
      query.category = category;
    }
    
    if (active === 'true') {
      query.isActive = true;
      // Only show future events when active filter is applied
      query.date = { $gte: new Date() };
    }
    
    const events = await Event.find(query)
      .sort({ date: 1 }) // Sort by date ascending (upcoming first)
      .limit(parseInt(limit))
      .skip(skip);
      
    const total = await Event.countDocuments(query);
    
    res.status(200).json({
      events,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Error fetching events', error: error.message });
  }
};

// Get event count (total number of events)
export const getEventCount = async (req, res) => {
  try {
    const count = await Event.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    console.error('Error counting events:', error);
    res.status(500).json({ message: 'Error counting events', error: error.message });
  }
};

// Get single event by ID
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Record a view if user is authenticated
    if (req.user) {
      await EventHit.create({
        event: event._id,
        user: req.user._id,
        action: 'view',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        referrer: req.headers.referer || req.headers.referrer
      });
    }
    
    res.status(200).json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ message: 'Error fetching event', error: error.message });
  }
};

// Create new event
export const createEvent = async (req, res) => {
  try {
    console.log('Creating event with data:', req.body);
    console.log('User data from auth:', req.user);
    
    const {
      title,
      description,
      date,
      time,
      location,
      organizer,
      category,
      image,
      isGlobal,
      registrationRequired,
      registrationLink
    } = req.body;
    
    // Validation
    if (!title || !description || !date || !time || !location || !organizer) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Attempt to parse the date properly
    let eventDate;
    try {
      // Try to parse date in multiple formats
      eventDate = new Date(date);
      
      // Check if the date is valid
      if (isNaN(eventDate.getTime())) {
        return res.status(400).json({ message: 'Invalid date format' });
      }
    } catch (dateError) {
      console.error('Error parsing date:', dateError);
      return res.status(400).json({ message: 'Invalid date format' });
    }
    
    if (!req.user) {
      console.error('Authentication error: User not authenticated');
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    // Handle multiple potential user ID formats
    const userId = req.user.userId || req.user.id || req.user._id;
    
    if (!userId) {
      console.error('Authentication error: User ID missing', req.user);
      return res.status(401).json({ message: 'Invalid authentication: User ID missing' });
    }
    
    console.log('Creating event with user ID:', userId);
    
    const event = new Event({
      title,
      description,
      date: eventDate,
      time,
      location,
      organizer,
      category: category || 'other',
      image,
      isGlobal: isGlobal !== undefined ? isGlobal : true,
      registrationRequired: registrationRequired || false,
      registrationLink,
      createdBy: userId
    });
    
    await event.save();
    console.log('Event saved successfully:', event._id);
    
    res.status(201).json({ message: 'Event created successfully', event });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: 'Error creating event', error: error.message, stack: error.stack });
  }
};

// Update event
export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Check if the user is the creator or admin
    if (req.user.role !== 'admin' && event.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this event' });
    }
    
    Object.keys(req.body).forEach(key => {
      if (key !== '_id' && key !== 'createdBy' && key !== 'createdAt') {
        event[key] = req.body[key];
      }
    });
    
    await event.save();
    
    res.status(200).json({ message: 'Event updated successfully', event });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ message: 'Error updating event', error: error.message });
  }
};

// Delete event
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Check if the user is the creator or admin
    if (req.user.role !== 'admin' && event.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this event' });
    }
    
    await Event.deleteOne({ _id: req.params.id });
    
    // Delete associated event hits
    await EventHit.deleteMany({ event: req.params.id });
    
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: 'Error deleting event', error: error.message });
  }
};

// Express interest in event
export const expressInterest = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    const userId = req.user._id;
    
    // Check if user already expressed interest
    if (event.interestedUsers.includes(userId)) {
      return res.status(400).json({ message: 'You have already expressed interest in this event' });
    }
    
    // Add user to interested users
    event.interestedUsers.push(userId);
    await event.save();
    
    // Record interest action
    await EventHit.create({
      event: event._id,
      user: userId,
      action: 'interest',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      referrer: req.headers.referer || req.headers.referrer
    });
    
    res.status(200).json({ message: 'Interest expressed successfully', event });
  } catch (error) {
    console.error('Error expressing interest:', error);
    res.status(500).json({ message: 'Error expressing interest', error: error.message });
  }
};

// Remove interest in event
export const removeInterest = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    const userId = req.user._id;
    
    // Remove user from interested users
    event.interestedUsers = event.interestedUsers.filter(id => id.toString() !== userId.toString());
    await event.save();
    
    res.status(200).json({ message: 'Interest removed successfully', event });
  } catch (error) {
    console.error('Error removing interest:', error);
    res.status(500).json({ message: 'Error removing interest', error: error.message });
  }
};

// Get interested users for an event
export const getInterestedUsers = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('interestedUsers', 'name email university department');
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Check if user is creator or admin
    if (req.user.role !== 'admin' && event.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view interested users' });
    }
    
    res.status(200).json({
      total: event.interestedUsers.length,
      users: event.interestedUsers
    });
  } catch (error) {
    console.error('Error fetching interested users:', error);
    res.status(500).json({ message: 'Error fetching interested users', error: error.message });
  }
};

// Get event hits count
export const getEventHitsCount = async (req, res) => {
  try {
    const count = await EventHit.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    console.error('Error counting event hits:', error);
    res.status(500).json({ message: 'Error counting event hits', error: error.message });
  }
};

// Send invitation emails to interested users
export const sendInvitations = async (req, res) => {
  try {
    const { subject, message, invitationType, emails, selectedUserIds } = req.body;
    const eventId = req.params.id;
    
    if (!subject || !message) {
      return res.status(400).json({ message: 'Subject and message are required' });
    }
    
    const event = await Event.findById(eventId);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Check if user is creator or admin
    if (req.user.role !== 'admin' && event.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to send invitations' });
    }
    
    let recipients = [];
    
    if (invitationType === 'interested') {
      // Get only interested users
      const users = await User.find({ _id: { $in: event.interestedUsers } }, 'email name');
      recipients = users;
    } else if (invitationType === 'all') {
      // Get all users
      const users = await User.find({}, 'email name');
      recipients = users;
    } else if (invitationType === 'specific') {
      // First try to use the selectedUserIds if provided
      if (selectedUserIds && Array.isArray(selectedUserIds) && selectedUserIds.length > 0) {
        const users = await User.find({ _id: { $in: selectedUserIds } }, 'email name');
        recipients = users;
      } 
      // Then check manually entered emails
      else if (emails && Array.isArray(emails) && emails.length > 0) {
        // For manually entered emails, create simple user objects
        const usersFromDB = await User.find({ email: { $in: emails } }, 'email name');
        
        // Add any users that weren't found in the database as basic objects
        const existingEmails = usersFromDB.map(user => user.email);
        const manualUsers = emails
          .filter(email => !existingEmails.includes(email))
          .map(email => ({ email, name: email.split('@')[0] }));
        
        recipients = [...usersFromDB, ...manualUsers];
      } else {
        return res.status(400).json({ message: 'No recipients specified for specific invitation type' });
      }
    } else {
      return res.status(400).json({ message: 'Invalid invitation type' });
    }
    
    if (recipients.length === 0) {
      return res.status(400).json({ message: 'No recipients found' });
    }
    
    // Format event date for display
    const formattedDate = new Date(event.date).toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // Configure email transporter
    const transporter = nodemailer.createTransport({
      // Configure your email provider here
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    
    console.log(`Attempting to send invitations to ${recipients.length} recipients`);
    
    // Start sending emails
    let successCount = 0;
    let failureCount = 0;
    
    for (const user of recipients) {
      try {
        // Create personalized content
        const personalizedMessage = message
          .replace(/{{name}}/g, user.name || 'there')
          .replace(/{{eventTitle}}/g, event.title)
          .replace(/{{eventDate}}/g, formattedDate)
          .replace(/{{eventTime}}/g, event.time)
          .replace(/{{eventLocation}}/g, event.location);
          
        // Send the email
        await transporter.sendMail({
          from: `"EduHub Events" <${process.env.EMAIL_USER}>`,
          to: user.email,
          subject: subject,
          html: personalizedMessage,
          // Add text alternative for email clients that don't support HTML
          text: personalizedMessage.replace(/<[^>]*>/g, '')
        });
        
        console.log(`Successfully sent invitation to ${user.email}`);
        successCount++;
      } catch (emailError) {
        console.error(`Failed to send email to ${user.email}:`, emailError);
        failureCount++;
      }
    }
    
    // Save a record of the invitation sent
    await EventHit.create({
      event: event._id,
      user: req.user._id,
      action: 'invitation-sent',
      details: {
        recipients: recipients.length,
        success: successCount,
        failed: failureCount
      }
    });
    
    res.status(200).json({
      message: 'Invitations sent',
      stats: {
        total: recipients.length,
        success: successCount,
        failed: failureCount
      }
    });
  } catch (error) {
    console.error('Error sending invitations:', error);
    res.status(500).json({ message: 'Error sending invitations', error: error.message });
  }
}; 