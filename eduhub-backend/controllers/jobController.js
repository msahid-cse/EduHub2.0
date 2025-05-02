import Job from '../models/Job.js';
import JobApplication from '../models/JobApplication.js';
import User from '../models/User.js';
import { generateCoverLetterPDF } from '../utils/pdfGenerator.js';
import path from 'path';
import fs from 'fs';

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
      neededSkills,
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
    
    // Format neededSkills if it's a string
    let formattedSkills = neededSkills;
    if (typeof neededSkills === 'string') {
      formattedSkills = neededSkills.split('\n').filter(skill => skill.trim() !== '');
    }
    
    // Create new job
    const newJob = new Job({
      title,
      company,
      location,
      description,
      requirements: formattedRequirements,
      neededSkills: formattedSkills,
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
      neededSkills,
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
    
    // Format neededSkills if it's a string
    let formattedSkills = neededSkills;
    if (typeof neededSkills === 'string') {
      formattedSkills = neededSkills.split('\n').filter(skill => skill.trim() !== '');
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
        neededSkills: formattedSkills,
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
    const existingApplication = await JobApplication.findOne({
      job: req.params.id,
      applicant: req.user.userId
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }
    
    // Get CV path from request (uploaded by multer middleware)
    const cvPath = req.file ? req.file.path : null;
    
    if (!cvPath) {
      return res.status(400).json({ message: 'CV is required' });
    }
    
    // Get the user data for cover letter generation
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Generate automatic cover letter if not provided
    let coverLetter = req.body.coverLetter || '';
    
    if (!coverLetter || coverLetter.trim() === '') {
      // Auto-generate a cover letter based on user profile and job details
      coverLetter = generateAutoCoverLetter(user, job);
    }
    
    // Generate PDF version of cover letter
    let coverLetterPdfPath = null;
    try {
      coverLetterPdfPath = await generateCoverLetterPDF(
        coverLetter, 
        job.title, 
        user.name
      );
      // Convert to relative path
      coverLetterPdfPath = coverLetterPdfPath.replace(/^\.\//, '');
    } catch (pdfError) {
      console.error('Error generating cover letter PDF:', pdfError);
      // Continue with application even if PDF generation fails
    }
    
    // Create job application
    const jobApplication = new JobApplication({
      job: job._id,
      applicant: req.user.userId,
      cvPath,
      coverLetter,
      coverLetterPdfPath
    });
    
    // Save job application
    await jobApplication.save();
    
    // Add user to job applicants
    if (!job.applicants.includes(req.user.userId)) {
      job.applicants.push(req.user.userId);
      await job.save();
    }
    
    // Add job to user's applied jobs
    if (!user.jobsApplied.includes(job._id)) {
      user.jobsApplied.push(job._id);
      await user.save();
    }
    
    res.status(201).json({ 
      message: 'Application submitted successfully',
      application: jobApplication
    });
  } catch (error) {
    console.error('Error applying for job:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Helper function to generate an automatic cover letter
const generateAutoCoverLetter = (user, job) => {
  // Get current date
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // User information
  const { name, email, university, department, skills } = user;
  
  // Format skills as a comma-separated list if available
  const skillsList = Array.isArray(skills) && skills.length > 0 
    ? skills.join(', ') 
    : 'relevant skills';
  
  // Job information
  const { title, company, requirements } = job;
  
  // Generate cover letter
  return `${currentDate}

Dear Hiring Manager at ${company},

I am writing to express my interest in the ${title} position at ${company}. As a student from ${university} in the ${department || 'relevant'} department, I believe my academic background and skills make me a strong candidate for this role.

I possess experience in ${skillsList} which aligns well with the requirements of this position. I am particularly excited about the opportunity to contribute to ${company} and apply my knowledge in a professional setting.

My academic background has equipped me with both theoretical knowledge and practical skills necessary for success in this role. I am confident that my enthusiasm, dedication, and ability to learn quickly will allow me to make valuable contributions to your team.

I have attached my CV which provides more details about my qualifications and experience. I would welcome the opportunity to discuss how my background, skills, and interests could benefit your organization.

Thank you for considering my application. I look forward to the possibility of working with ${company}.

Sincerely,
${name}
${email}
${university}`;
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

// Get all applications for a job (admin only)
export const getJobApplications = async (req, res) => {
  try {
    const jobId = req.params.id;
    
    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    // Get all applications for the job
    const applications = await JobApplication.find({ job: jobId })
      .populate('applicant', 'name email university department')
      .sort({ appliedAt: -1 });
    
    res.status(200).json(applications);
  } catch (error) {
    console.error('Error getting job applications:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update application status (admin only)
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status, adminFeedback } = req.body;
    
    // Validate status
    const validStatuses = ['pending', 'reviewing', 'accepted', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    // Update application
    const application = await JobApplication.findById(req.params.applicationId);
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    application.status = status;
    if (adminFeedback) {
      application.adminFeedback = adminFeedback;
    }
    
    await application.save();
    
    res.status(200).json({
      message: 'Application status updated successfully',
      application
    });
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all applications for a user
export const getUserApplications = async (req, res) => {
  try {
    const applications = await JobApplication.find({ applicant: req.user.userId })
      .populate('job', 'title company location type deadline')
      .sort({ appliedAt: -1 });
    
    res.status(200).json(applications);
  } catch (error) {
    console.error('Error getting user applications:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Download cover letter PDF
export const downloadCoverLetter = async (req, res) => {
  try {
    const application = await JobApplication.findById(req.params.applicationId);
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    // Check if user is authorized (admin or the applicant)
    if (
      req.user.role !== 'admin' && 
      application.applicant.toString() !== req.user.userId
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Check if cover letter PDF exists
    if (!application.coverLetterPdfPath) {
      return res.status(404).json({ message: 'Cover letter PDF not found' });
    }
    
    // Get the absolute path to the file
    const filePath = path.resolve(application.coverLetterPdfPath);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'Cover letter file not found' });
    }
    
    // Send file
    res.download(filePath);
  } catch (error) {
    console.error('Error downloading cover letter:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all job applications (admin only)
export const getAllJobApplications = async (req, res) => {
  try {
    // Get pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    // Build query based on filters
    const query = {};
    
    // Status filter
    if (req.query.status && ['pending', 'reviewing', 'accepted', 'rejected'].includes(req.query.status)) {
      query.status = req.query.status;
    }
    
    // Search query - implemented as a simple search across related fields
    const searchQuery = req.query.search;
    if (searchQuery && searchQuery.trim() !== '') {
      // We'll need to use aggregation to search across related documents
      const applications = await JobApplication.aggregate([
        // First lookup to get job details
        {
          $lookup: {
            from: 'jobs',
            localField: 'job',
            foreignField: '_id',
            as: 'jobDetails'
          }
        },
        // Then lookup to get applicant details
        {
          $lookup: {
            from: 'users',
            localField: 'applicant',
            foreignField: '_id',
            as: 'applicantDetails'
          }
        },
        // Unwind the arrays created by lookups
        { $unwind: { path: '$jobDetails', preserveNullAndEmptyArrays: true } },
        { $unwind: { path: '$applicantDetails', preserveNullAndEmptyArrays: true } },
        // Match based on search criteria
        {
          $match: {
            $and: [
              // Include any status filter
              req.query.status ? { status: req.query.status } : {},
              // Search across multiple fields
              {
                $or: [
                  { 'jobDetails.title': { $regex: searchQuery, $options: 'i' } },
                  { 'jobDetails.company': { $regex: searchQuery, $options: 'i' } },
                  { 'applicantDetails.name': { $regex: searchQuery, $options: 'i' } },
                  { 'applicantDetails.email': { $regex: searchQuery, $options: 'i' } },
                  { 'applicantDetails.university': { $regex: searchQuery, $options: 'i' } }
                ]
              }
            ]
          }
        },
        // Sort
        {
          $sort: {
            [req.query.sort === 'status' ? 'status' :
             req.query.sort === 'job.title' ? 'jobDetails.title' :
             req.query.sort === 'applicant.name' ? 'applicantDetails.name' : 'createdAt']: 
             req.query.direction === 'asc' ? 1 : -1
          }
        },
        // Skip and limit for pagination
        { $skip: skip },
        { $limit: limit },
        // Project to format the output
        {
          $project: {
            _id: 1,
            status: 1,
            cvPath: 1,
            coverLetter: 1,
            coverLetterPdfPath: 1,
            adminFeedback: 1,
            createdAt: 1,
            appliedAt: 1,
            job: {
              _id: '$jobDetails._id',
              title: '$jobDetails.title',
              company: '$jobDetails.company',
              location: '$jobDetails.location',
              type: '$jobDetails.type'
            },
            applicant: {
              _id: '$applicantDetails._id',
              name: '$applicantDetails.name',
              email: '$applicantDetails.email',
              university: '$applicantDetails.university',
              department: '$applicantDetails.department'
            }
          }
        }
      ]);
      
      // Get total count with the same filters
      const totalCountAgg = await JobApplication.aggregate([
        { $lookup: { from: 'jobs', localField: 'job', foreignField: '_id', as: 'jobDetails' } },
        { $lookup: { from: 'users', localField: 'applicant', foreignField: '_id', as: 'applicantDetails' } },
        { $unwind: { path: '$jobDetails', preserveNullAndEmptyArrays: true } },
        { $unwind: { path: '$applicantDetails', preserveNullAndEmptyArrays: true } },
        {
          $match: {
            $and: [
              req.query.status ? { status: req.query.status } : {},
              {
                $or: [
                  { 'jobDetails.title': { $regex: searchQuery, $options: 'i' } },
                  { 'jobDetails.company': { $regex: searchQuery, $options: 'i' } },
                  { 'applicantDetails.name': { $regex: searchQuery, $options: 'i' } },
                  { 'applicantDetails.email': { $regex: searchQuery, $options: 'i' } },
                  { 'applicantDetails.university': { $regex: searchQuery, $options: 'i' } }
                ]
              }
            ]
          }
        },
        { $count: 'total' }
      ]);
      
      const totalCount = totalCountAgg.length > 0 ? totalCountAgg[0].total : 0;
      
      return res.status(200).json({
        applications,
        pagination: {
          totalCount,
          currentPage: page,
          totalPages: Math.ceil(totalCount / limit),
          hasMore: page < Math.ceil(totalCount / limit)
        }
      });
    }
    
    // If no search query, use the simpler approach with populate
    const totalCount = await JobApplication.countDocuments(query);
    
    // Determine sort field and direction
    const sortField = req.query.sort || 'createdAt';
    const sortDirection = req.query.direction === 'asc' ? 1 : -1;
    
    // Create sort object
    const sort = {};
    sort[sortField === 'job.title' ? 'job' : 
         sortField === 'applicant.name' ? 'applicant' : 
         sortField] = sortDirection;
    
    // Get applications with job and applicant details
    const applications = await JobApplication.find(query)
      .populate('job', 'title company location type')
      .populate('applicant', 'name email university department')
      .sort(sort)
      .skip(skip)
      .limit(limit);
    
    res.status(200).json({
      applications,
      pagination: {
        totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        hasMore: page < Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error('Error getting all job applications:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get total count of job applications (for admin dashboard)
export const getJobApplicationCount = async (req, res) => {
  try {
    const count = await JobApplication.countDocuments();
    console.log('Total job applications count:', count);
    res.status(200).json({ count });
  } catch (error) {
    console.error('Error getting job application count:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 