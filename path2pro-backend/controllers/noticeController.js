import Notice from '../models/Notice.js';

// Get all notices
export const getAllNotices = async (req, res) => {
  try {
    const { university } = req.query;
    let query = {};
    
    // Filter by university if provided
    if (university) {
      query.targetUniversity = university;
    }
    
    const notices = await Notice.find(query)
      .sort({ createdAt: -1 })
      .populate('postedBy', 'name');
      
    res.status(200).json(notices);
  } catch (error) {
    console.error('Error getting notices:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get notice by ID
export const getNoticeById = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id)
      .populate('postedBy', 'name');
    
    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }
    
    res.status(200).json(notice);
  } catch (error) {
    console.error('Error getting notice by ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new notice
export const createNotice = async (req, res) => {
  try {
    const { 
      title, 
      content, 
      category, 
      importance, 
      targetUniversity, 
      attachment,
      pdfAttachment 
    } = req.body;
    
    console.log('Creating notice with data:', req.body);
    console.log('User from auth middleware:', req.user);
    
    // Validate required fields
    if (!title || !content || !targetUniversity) {
      return res.status(400).json({ message: 'Please provide all required fields (title, content, targetUniversity)' });
    }
    
    // Create new notice
    const newNotice = new Notice({
      title,
      content,
      category: category || 'general',
      importance: importance || 'normal',
      targetUniversity,
      attachment,
      pdfAttachment
    });
    
    // Add postedBy field only if req.user.userId exists
    if (req.user && req.user.userId) {
      newNotice.postedBy = req.user.userId === 'admin' ? '000000000000000000000000' : req.user.userId;
    }
    
    await newNotice.save();
    
    res.status(201).json({
      message: 'Notice created successfully',
      notice: newNotice
    });
  } catch (error) {
    console.error('Error creating notice:', error);
    
    // Send more detailed error information
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: 'Validation error', 
        errors,
        details: error.message
      });
    }
    
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message
    });
  }
};

// Update a notice
export const updateNotice = async (req, res) => {
  try {
    const { 
      title, 
      content, 
      category, 
      importance, 
      targetUniversity, 
      attachment,
      pdfAttachment 
    } = req.body;
    
    // Find and update notice
    const updatedNotice = await Notice.findByIdAndUpdate(
      req.params.id,
      {
        title,
        content,
        category,
        importance,
        targetUniversity,
        attachment,
        pdfAttachment
      },
      { new: true }
    );
    
    if (!updatedNotice) {
      return res.status(404).json({ message: 'Notice not found' });
    }
    
    res.status(200).json({
      message: 'Notice updated successfully',
      notice: updatedNotice
    });
  } catch (error) {
    console.error('Error updating notice:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a notice
export const deleteNotice = async (req, res) => {
  try {
    const deletedNotice = await Notice.findByIdAndDelete(req.params.id);
    
    if (!deletedNotice) {
      return res.status(404).json({ message: 'Notice not found' });
    }
    
    res.status(200).json({ message: 'Notice deleted successfully' });
  } catch (error) {
    console.error('Error deleting notice:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get notices by university
export const getNoticesByUniversity = async (req, res) => {
  try {
    const { university } = req.params;
    
    const notices = await Notice.find({ targetUniversity: university })
      .sort({ createdAt: -1 })
      .populate('postedBy', 'name');
      
    res.status(200).json(notices);
  } catch (error) {
    console.error('Error getting notices by university:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 