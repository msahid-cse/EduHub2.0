const Event = require('../models/Event');
const EventHit = require('../models/EventHit');
const User = require('../models/User');
const nodemailer = require('nodemailer');

// Get all events
exports.getEvents = async (req, res) => {
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

// Get single event by ID
exports.getEventById = async (req, res) => {
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
exports.createEvent = async (req, res) => {
  try {
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
    
    const event = new Event({
      title,
      description,
      date,
      time,
      location,
      organizer,
      category: category || 'other',
      image,
      isGlobal: isGlobal !== undefined ? isGlobal : true,
      registrationRequired: registrationRequired || false,
      registrationLink,
      createdBy: req.user._id
    });
    
    await event.save();
    
    res.status(201).json({ message: 'Event created successfully', event });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: 'Error creating event', error: error.message });
  }
};

// Update event
exports.updateEvent = async (req, res) => {
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
exports.deleteEvent = async (req, res) => {
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
exports.expressInterest = async (req, res) => {
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
exports.removeInterest = async (req, res) => {
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
exports.getInterestedUsers = async (req, res) => {
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
exports.getEventHitsCount = async (req, res) => {
  try {
    const count = await EventHit.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    console.error('Error counting event hits:', error);
    res.status(500).json({ message: 'Error counting event hits', error: error.message });
  }
};

// Send invitation emails to interested users
exports.sendInvitations = async (req, res) => {
  try {
    const { subject, message, invitationType } = req.body;
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
    } else if (invitationType === 'specific' && req.body.emails && Array.isArray(req.body.emails)) {
      // Specific emails
      const emails = req.body.emails;
      const users = await User.find({ email: { $in: emails } }, 'email name');
      recipients = users;
    } else {
      return res.status(400).json({ message: 'Invalid invitation type or missing emails' });
    }
    
    if (recipients.length === 0) {
      return res.status(400).json({ message: 'No recipients found' });
    }
    
    // Configure email transporter
    const transporter = nodemailer.createTransport({
      // Configure your email provider here
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
    
    // Start sending emails
    let successCount = 0;
    let failureCount = 0;
    
    for (const user of recipients) {
      try {
        // Create personalized content
        const personalizedMessage = message
          .replace('{{name}}', user.name || 'there')
          .replace('{{eventTitle}}', event.title)
          .replace('{{eventDate}}', new Date(event.date).toLocaleDateString())
          .replace('{{eventTime}}', event.time)
          .replace('{{eventLocation}}', event.location);
          
        await transporter.sendMail({
          from: `"EduHub Events" <${process.env.EMAIL_USER}>`,
          to: user.email,
          subject: subject,
          html: personalizedMessage
        });
        
        successCount++;
      } catch (emailError) {
        console.error(`Failed to send email to ${user.email}:`, emailError);
        failureCount++;
      }
    }
    
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