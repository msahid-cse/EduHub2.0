import Job from '../models/Job.js';

// Get all jobs
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    console.error('Error getting jobs:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get job by ID
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('postedBy', 'name email');
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    res.status(200).json(job);
  } catch (error) {
    console.error('Error getting job by ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new job
export const createJob = async (req, res) => {
  try {
    const { 
      title, 
      company, 
      location, 
      description, 
      requirements, 
      type, 
      salary, 
      contactEmail, 
      deadline 
    } = req.body;
    
    console.log('Creating job with data:', req.body);
    console.log('User from auth middleware:', req.user);
    
    // Validate required fields
    if (!title || !company || !location || !description || !contactEmail || !deadline) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    
    // Format requirements if it's a string
    let formattedRequirements = requirements;
    if (typeof requirements === 'string') {
      formattedRequirements = requirements.split('\n').filter(req => req.trim() !== '');
    }
    
    // Create new job
    const newJob = new Job({
      title,
      company,
      location,
      description,
      requirements: formattedRequirements,
      type: type || 'full-time',
      salary,
      contactEmail,
      deadline,
      // Use a special ID for admin user since it's not a real MongoDB ID
      postedBy: req.user.userId === 'admin' ? '000000000000000000000000' : req.user.userId, 
    });
    
    await newJob.save();
    
    res.status(201).json({
      message: 'Job created successfully',
      job: newJob
    });
  } catch (error) {
    console.error('Error creating job:', error);
    
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
      error: error.message,
      stack: process.env.NODE_ENV === 'production' ? null : error.stack
    });
  }
};

// Update a job
export const updateJob = async (req, res) => {
  try {
    const { 
      title, 
      company, 
      location, 
      description, 
      requirements, 
      type, 
      salary, 
      contactEmail, 
      deadline 
    } = req.body;
    
    // Format requirements if it's a string
    let formattedRequirements = requirements;
    if (typeof requirements === 'string') {
      formattedRequirements = requirements.split('\n').filter(req => req.trim() !== '');
    }
    
    // Find and update job
    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      {
        title,
        company,
        location,
        description,
        requirements: formattedRequirements,
        type,
        salary,
        contactEmail,
        deadline
      },
      { new: true }
    );
    
    if (!updatedJob) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    res.status(200).json({
      message: 'Job updated successfully',
      job: updatedJob
    });
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a job
export const deleteJob = async (req, res) => {
  try {
    const deletedJob = await Job.findByIdAndDelete(req.params.id);
    
    if (!deletedJob) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Apply for a job
export const applyForJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    // Check if user already applied
    if (job.applicants.includes(req.user.userId)) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }
    
    // Add user to applicants
    job.applicants.push(req.user.userId);
    await job.save();
    
    res.status(200).json({ message: 'Application submitted successfully' });
  } catch (error) {
    console.error('Error applying for job:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get jobs by type
export const getJobsByType = async (req, res) => {
  try {
    const jobs = await Job.find({ type: req.params.type }).sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    console.error('Error getting jobs by type:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 