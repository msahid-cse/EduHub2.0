import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Briefcase, 
  FileText, 
  Search, 
  Code, 
  CheckCircle, 
  Send, 
  Eye, 
  X, 
  Upload, 
  Bookmark
} from 'lucide-react';
import { apiClient, jobService } from '../api/apiClient';

const JobSearchByCV = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Job search states
  const [jobs, setJobs] = useState([]);
  const [jobSkills, setJobSkills] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  
  // CV upload and analysis states
  const [uploadedCV, setUploadedCV] = useState(null);
  const [cvText, setCvText] = useState('');
  const [extractedSkills, setExtractedSkills] = useState([]);
  const [matchedJobs, setMatchedJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [jobSearchError, setJobSearchError] = useState('');
  const [appliedJobs, setAppliedJobs] = useState([]);

  useEffect(() => {
    // Load user info from localStorage
    const userEmail = localStorage.getItem('userEmail');
    const userUniversity = localStorage.getItem('userUniversity');
    
    if (userEmail) {
      setUserInfo({
        email: userEmail,
        university: userUniversity
      });
    }
    
    // Fetch all jobs
    fetchJobs();
  }, []);

  // Fetch all available jobs
  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      // Try to use the jobService API
      try {
        const response = await jobService.getAllJobs();
        if (response.data && Array.isArray(response.data)) {
          const jobsWithSkills = response.data.map(job => ({
            ...job,
            // If a job has no skills defined, provide a default empty array
            skills: job.skills || []
          }));
          setJobs(jobsWithSkills);
          
          // Extract skills from jobs and create a mapping
          const skillsMap = {};
          jobsWithSkills.forEach(job => {
            job.skills.forEach(skill => {
              if (!skillsMap[skill]) {
                skillsMap[skill] = [];
              }
              skillsMap[skill].push(job._id || job.id);
            });
          });
          
          setJobSkills(skillsMap);
        }
      } catch (apiError) {
        console.error('Error fetching jobs from API:', apiError);
        // Fall back to mock data
        useMockJobData();
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setJobSearchError('Failed to fetch jobs. Please try again later.');
      // Fall back to mock data
      useMockJobData();
    } finally {
      setIsLoading(false);
    }
  };

  // Function to use mock job data if API fails
  const useMockJobData = () => {
    // Mock data for jobs
    const mockJobs = [
      {
        id: 1,
        title: 'Frontend Developer',
        company: 'TechCorp Inc.',
        location: 'New York, NY',
        remote: true,
        description: 'We are looking for a skilled Frontend Developer to join our team and help build responsive web applications using React.',
        requirements: 'Bachelor\'s degree in Computer Science or related field. 3+ years of experience with React, JavaScript, HTML, and CSS.',
        salary: '$80,000 - $120,000',
        rating: 4.5,
        skills: ['React', 'JavaScript', 'HTML', 'CSS', 'Responsive Design', 'ES6', 'Redux'],
        applyLink: '#',
        postedDate: '2023-07-15'
      },
      {
        id: 2,
        title: 'Backend Developer',
        company: 'DataSys Solutions',
        location: 'San Francisco, CA',
        remote: true,
        description: 'Backend Developer with experience in Node.js, Express, and MongoDB to develop and maintain high-performance APIs.',
        requirements: 'Strong knowledge of Node.js, Express, and MongoDB. Experience with RESTful APIs and serverless architecture.',
        salary: '$90,000 - $130,000',
        rating: 4.2,
        skills: ['Node.js', 'Express', 'MongoDB', 'RESTful API', 'JavaScript', 'AWS', 'Docker'],
        applyLink: '#',
        postedDate: '2023-07-20'
      },
      {
        id: 3,
        title: 'Full Stack Developer',
        company: 'InnoTech Solutions',
        location: 'Austin, TX',
        remote: false,
        description: 'Looking for a talented Full Stack Developer who can work on both frontend and backend technologies.',
        requirements: 'Experience with React on the frontend and Node.js/Express on the backend. Knowledge of SQL and NoSQL databases.',
        salary: '$100,000 - $140,000',
        rating: 4.7,
        skills: ['React', 'Node.js', 'JavaScript', 'MongoDB', 'PostgreSQL', 'TypeScript', 'Git'],
        applyLink: '#',
        postedDate: '2023-07-25'
      },
      {
        id: 4,
        title: 'Data Scientist',
        company: 'Analytics Pro',
        location: 'Boston, MA',
        remote: true,
        description: 'Join our data science team to analyze large datasets and develop machine learning models for predictive analytics.',
        requirements: 'Master\'s or PhD in Data Science, Statistics, or related field. Proficiency in Python, R, and SQL.',
        salary: '$120,000 - $160,000',
        rating: 4.8,
        skills: ['Python', 'R', 'SQL', 'Machine Learning', 'Data Visualization', 'Statistical Analysis', 'TensorFlow'],
        applyLink: '#',
        postedDate: '2023-08-01'
      },
      {
        id: 5,
        title: 'DevOps Engineer',
        company: 'CloudTech Services',
        location: 'Seattle, WA',
        remote: true,
        description: 'DevOps Engineer to automate deployment processes and maintain cloud infrastructure.',
        requirements: 'Experience with AWS, Docker, Kubernetes, and CI/CD pipelines. Knowledge of Infrastructure as Code.',
        salary: '$110,000 - $150,000',
        rating: 4.4,
        skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Jenkins', 'Terraform', 'Linux'],
        applyLink: '#',
        postedDate: '2023-08-05'
      },
      {
        id: 6,
        title: 'UI/UX Designer',
        company: 'CreativeMinds Agency',
        location: 'Los Angeles, CA',
        remote: false,
        description: 'UI/UX Designer to create intuitive user interfaces and enhance user experience for web and mobile applications.',
        requirements: 'Portfolio showcasing UI/UX design projects. Proficiency in Figma, Adobe XD, and similar design tools.',
        salary: '$75,000 - $110,000',
        rating: 4.6,
        skills: ['UI Design', 'UX Design', 'Figma', 'Adobe XD', 'Wireframing', 'Prototyping', 'User Research'],
        applyLink: '#',
        postedDate: '2023-08-10'
      }
    ];
    
    setJobs(mockJobs);
    
    // Extract skills from jobs and create a mapping
    const skillsMap = {};
    mockJobs.forEach(job => {
      job.skills.forEach(skill => {
        if (!skillsMap[skill]) {
          skillsMap[skill] = [];
        }
        skillsMap[skill].push(job.id);
      });
    });
    
    setJobSkills(skillsMap);
  };

  // Handle CV file upload
  const handleCvUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check if file is a PDF
    if (file.type !== 'application/pdf') {
      setJobSearchError('Please upload a PDF file.');
      return;
    }
    
    setIsUploading(true);
    setJobSearchError('');
    
    try {
      // Set the uploaded CV file
      setUploadedCV(file);
      
      // In a real app, you would send this to a server endpoint for PDF parsing
      // For this demo, we'll simulate parsing the PDF with mock data
      
      // Simulating server processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock extracted text from CV - in a real app, this would come from server
      const mockExtractedText = `
        JOHN DOE
        Software Developer
        
        CONTACT:
        Email: john.doe@example.com
        Phone: (123) 456-7890
        
        SKILLS:
        JavaScript, React, Node.js, HTML, CSS, MongoDB, Git, TensorFlow
        
        EDUCATION:
        Bachelor of Science in Computer Science
        University of Technology, 2018-2022
        
        EXPERIENCE:
        Software Developer, Tech Solutions Inc.
        June 2022 - Present
        - Developed responsive web applications using React
        - Created and maintained RESTful APIs with Node.js and Express
        - Collaborated with design team to implement UI/UX improvements
        
        Intern, CodeCraft
        Jan 2022 - May 2022
        - Assisted in developing frontend components
        - Participated in code reviews and testing
        
        PROJECTS:
        E-commerce Platform - Built with React, Node.js, and MongoDB
        Data Analysis Tool - Python-based tool for analysis using TensorFlow
      `;
      
      setCvText(mockExtractedText);
      
      // Extract skills from CV text - in a real app, this would use NLP
      const mockExtractedSkills = ['JavaScript', 'React', 'Node.js', 'HTML', 'CSS', 'MongoDB', 'Git', 'TensorFlow'];
      setExtractedSkills(mockExtractedSkills);
      
      // Match jobs based on extracted skills
      matchJobsWithSkills(mockExtractedSkills);
      
      setIsUploading(false);
    } catch (error) {
      console.error('Error uploading CV:', error);
      setJobSearchError('Failed to process CV. Please try again.');
      setIsUploading(false);
    }
  };

  // Match jobs based on extracted skills from CV
  const matchJobsWithSkills = (extractedSkills) => {
    setIsProcessing(true);
    
    try {
      // Create a map to track job matches and their match scores
      const matchesMap = {};
      
      // For each extracted skill, find jobs that require it
      extractedSkills.forEach(skill => {
        // Get all jobs that require this skill
        const jobIdsRequiringSkill = jobSkills[skill] || [];
        
        // For each job that requires this skill, increment its match score
        jobIdsRequiringSkill.forEach(jobId => {
          if (!matchesMap[jobId]) {
            // Initialize the job match if it doesn't exist
            matchesMap[jobId] = {
              jobId,
              matchedSkills: [skill],
              matchScore: 1
            };
          } else {
            // Update existing job match
            matchesMap[jobId].matchedSkills.push(skill);
            matchesMap[jobId].matchScore += 1;
          }
        });
      });
      
      // Convert the matches map to an array and sort by match score
      const matchesArray = Object.values(matchesMap);
      matchesArray.sort((a, b) => b.matchScore - a.matchScore);
      
      // Get the actual job details for each match
      const matchedJobsWithDetails = matchesArray.map(match => {
        const job = jobs.find(j => (j._id || j.id) == match.jobId);
        return {
          ...job,
          matchScore: match.matchScore,
          matchedSkills: match.matchedSkills,
          // Calculate match percentage
          matchPercentage: Math.round((match.matchScore / job.skills.length) * 100),
        };
      }).filter(job => job); // Filter out any undefined jobs
      
      setMatchedJobs(matchedJobsWithDetails);
    } catch (error) {
      console.error('Error matching jobs with skills:', error);
      setJobSearchError('Failed to match jobs with your skills. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Function to handle applying for a job
  const handleApplyForJob = (jobId) => {
    if (!userInfo) {
      setJobSearchError('You must be logged in to apply for jobs.');
      return;
    }
    
    // In a real app, this would call an API endpoint to submit the application
    // For now, we'll just add the job to the applied jobs list
    setAppliedJobs(prev => [...prev, jobId]);
    
    // Inform user of successful application
    alert('Your application has been submitted successfully!');
  };

  // Function to view job details
  const handleViewJobDetails = (job) => {
    setSelectedJob(job);
  };

  // Function to close job details
  const handleCloseJobDetails = () => {
    setSelectedJob(null);
  };

  // Filter jobs based on search query
  const filteredJobs = searchQuery 
    ? jobs.filter(job => 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : jobs;

  return (
    <div className="min-h-screen bg-gray-900 text-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Job Search by CV</h1>
            <p className="text-gray-400 mt-2">Upload your CV to find matching jobs based on your skills</p>
          </div>
          <button 
            onClick={() => navigate('/userdashboard')} 
            className="px-4 py-2 text-sm bg-gray-800 hover:bg-gray-700 rounded-md text-gray-300"
          >
            Back to Dashboard
          </button>
        </div>

        {/* CV Upload Section */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Upload Your CV</h2>
          
          <div className="flex flex-col md:flex-row gap-6">
            {/* Upload Area */}
            <div className="flex-1">
              <div className={`border-2 border-dashed rounded-lg p-6 text-center
                ${uploadedCV ? 'border-green-500 bg-green-500/10' : 'border-gray-600 hover:border-cyan-500'}
                ${isUploading ? 'animate-pulse' : ''}
                transition-all duration-300
              `}>
                {!uploadedCV ? (
                  <label className="cursor-pointer block w-full h-full">
                    <Upload className="mx-auto w-12 h-12 text-gray-400 mb-3" />
                    <p className="mb-2 text-lg font-semibold text-gray-300">
                      {isUploading ? 'Uploading...' : 'Upload your CV'}
                    </p>
                    <p className="text-gray-500 text-sm mb-4">
                      PDF files only (max 10MB)
                    </p>
                    <button className="px-4 py-2 rounded-md bg-cyan-700 hover:bg-cyan-600 text-white">
                      Select PDF
                    </button>
                    <input 
                      type="file" 
                      accept=".pdf" 
                      className="hidden" 
                      onChange={handleCvUpload}
                      disabled={isUploading}
                    />
                  </label>
                ) : (
                  <div>
                    <FileText className="mx-auto w-12 h-12 text-green-400 mb-3" />
                    <p className="mb-2 text-lg font-semibold text-green-300">
                      CV Uploaded Successfully!
                    </p>
                    <p className="text-gray-400 text-sm mb-4">
                      {uploadedCV.name}
                    </p>
                    <div className="flex justify-center gap-3">
                      <button 
                        onClick={() => setUploadedCV(null)}
                        className="px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600 text-white flex items-center gap-2"
                      >
                        <X className="w-4 h-4" /> Remove
                      </button>
                      <label className="cursor-pointer px-4 py-2 rounded-md bg-cyan-700 hover:bg-cyan-600 text-white flex items-center gap-2">
                        <Upload className="w-4 h-4" /> Replace
                        <input 
                          type="file" 
                          accept=".pdf" 
                          className="hidden" 
                          onChange={handleCvUpload}
                          disabled={isUploading}
                        />
                      </label>
                    </div>
                  </div>
                )}
              </div>
              
              {jobSearchError && (
                <div className="mt-4 p-3 bg-red-900/30 border border-red-800 rounded-md text-red-300 text-sm">
                  {jobSearchError}
                </div>
              )}
            </div>
            
            {/* Extracted Skills Section */}
            <div className="flex-1">
              <div className="h-full bg-gray-700 rounded-lg p-5">
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <Code className="w-5 h-5 mr-2 text-cyan-400" />
                  Skills Extracted from CV
                </h3>
                
                {extractedSkills.length === 0 ? (
                  <div className="text-gray-400 text-center p-6">
                    <p>Upload your CV to extract skills</p>
                  </div>
                ) : (
                  <>
                    <div className="mb-3 flex flex-wrap gap-2">
                      {extractedSkills.map((skill, index) => (
                        <span 
                          key={index} 
                          className="px-3 py-1 bg-cyan-900/50 text-cyan-300 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                    
                    <p className="text-gray-400 text-sm">
                      {extractedSkills.length} skills found in your CV
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Matched Jobs Section */}
        {matchedJobs.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <CheckCircle className="w-6 h-6 mr-2 text-green-400" />
              Jobs Matching Your Skills ({matchedJobs.length})
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matchedJobs.map(job => (
                <div 
                  key={job._id || job.id} 
                  className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden hover:border-cyan-600 transition-all duration-300"
                >
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-semibold">{job.title}</h3>
                      <span className="text-lg font-bold text-green-400">{job.matchPercentage}%</span>
                    </div>
                    
                    <p className="text-gray-400 text-sm mb-3">{job.company} • {job.location}</p>
                    
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-300 mb-2">Matched Skills:</p>
                      <div className="flex flex-wrap gap-2">
                        {job.matchedSkills.map((skill, idx) => (
                          <span 
                            key={idx} 
                            className="px-2 py-1 bg-green-900/40 text-green-400 rounded-full text-xs"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <button 
                        onClick={() => handleViewJobDetails(job)}
                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-sm font-medium transition-colors flex items-center"
                      >
                        View Details <Eye className="ml-2 w-4 h-4" />
                      </button>
                      
                      {appliedJobs.includes(job._id || job.id) ? (
                        <span className="px-4 py-2 text-green-400 text-sm flex items-center">
                          <CheckCircle className="w-4 h-4 mr-1" /> Applied
                        </span>
                      ) : (
                        <button 
                          onClick={() => handleApplyForJob(job._id || job.id)}
                          className="px-4 py-2 bg-green-700 hover:bg-green-600 rounded-md text-sm font-medium transition-colors flex items-center"
                        >
                          Apply Now <Send className="ml-2 w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Jobs Section */}
        <div>
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Briefcase className="w-6 h-6 mr-2 text-cyan-400" />
            Browse All Jobs ({filteredJobs.length})
          </h2>
          
          {/* Search Area */}
          <div className="mb-6 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs by title, company, location, or skills..."
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {isLoading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mx-auto"></div>
              <p className="mt-4 text-gray-400">Loading jobs...</p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-10 bg-gray-800 rounded-lg">
              <Briefcase className="mx-auto w-12 h-12 text-gray-600 mb-3" />
              <h3 className="text-xl font-medium mb-2">No jobs found</h3>
              <p className="text-gray-400">Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobs.map(job => (
                <div 
                  key={job._id || job.id} 
                  className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden hover:border-gray-500 transition-all duration-300"
                >
                  <div className="p-5">
                    <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                    <p className="text-gray-400 text-sm mb-3">{job.company} • {job.location}</p>
                    
                    {/* Job description */}
                    <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                      {job.description}
                    </p>
                    
                    {/* Skills */}
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-300 mb-2">Required Skills:</p>
                      <div className="flex flex-wrap gap-2">
                        {job.neededSkills && job.neededSkills.slice(0, 5).map((skill, idx) => (
                          <span 
                            key={idx} 
                            className="px-2 py-1 bg-gray-700 text-gray-300 rounded-full text-xs"
                          >
                            {skill}
                          </span>
                        ))}
                        {job.neededSkills && job.neededSkills.length > 5 && (
                          <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded-full text-xs">
                            +{job.neededSkills.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <button 
                        onClick={() => handleViewJobDetails(job)}
                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-sm font-medium transition-colors flex items-center"
                      >
                        View Details <Eye className="ml-2 w-4 h-4" />
                      </button>
                      
                      {appliedJobs.includes(job._id || job.id) ? (
                        <span className="px-4 py-2 text-green-400 text-sm flex items-center">
                          <CheckCircle className="w-4 h-4 mr-1" /> Applied
                        </span>
                      ) : (
                        <button 
                          onClick={() => handleApplyForJob(job._id || job.id)}
                          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-sm font-medium transition-colors flex items-center"
                        >
                          Apply <Send className="ml-2 w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Job Details Modal */}
        {selectedJob && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 border border-gray-700 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gray-800 p-4 border-b border-gray-700 flex justify-between items-center">
                <h3 className="text-xl font-bold">{selectedJob.title}</h3>
                <button 
                  onClick={handleCloseJobDetails}
                  className="p-1 hover:bg-gray-700 rounded-full"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <p className="text-lg text-cyan-400 font-semibold">{selectedJob.company}</p>
                    <p className="text-gray-400">{selectedJob.location}</p>
                  </div>
                  
                  {selectedJob.matchPercentage && (
                    <div className="px-4 py-2 bg-green-900/30 text-green-400 rounded-lg text-center">
                      <p className="text-sm font-medium">Skills Match</p>
                      <p className="text-2xl font-bold">{selectedJob.matchPercentage}%</p>
                    </div>
                  )}
                </div>
                
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-2">Description</h4>
                  <p className="text-gray-300">{selectedJob.description}</p>
                </div>
                
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-2">Requirements</h4>
                  <p className="text-gray-300">{selectedJob.requirements}</p>
                </div>
                
                {selectedJob.neededSkills && selectedJob.neededSkills.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold mb-2">Needed Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedJob.neededSkills.map((skill, index) => (
                        <span key={index} className="px-3 py-1 bg-gray-700 rounded-full text-cyan-400 text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-2">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.skills && selectedJob.skills.map((skill, idx) => (
                      <span 
                        key={idx} 
                        className={`px-3 py-1 rounded-full text-sm
                          ${selectedJob.matchedSkills && selectedJob.matchedSkills.includes(skill)
                            ? 'bg-green-900/40 text-green-400'
                            : 'bg-gray-700 text-gray-300'
                          }`
                        }
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="border-t border-gray-700 pt-6 mt-6 flex flex-wrap gap-4">
                  {appliedJobs.includes(selectedJob._id || selectedJob.id) ? (
                    <div className="px-6 py-3 bg-green-900/30 text-green-400 rounded-lg flex items-center">
                      <CheckCircle className="w-6 h-6 mr-2" />
                      <span className="font-semibold">Already Applied</span>
                    </div>
                  ) : (
                    <button 
                      onClick={() => {
                        handleApplyForJob(selectedJob._id || selectedJob.id);
                        handleCloseJobDetails();
                      }}
                      className="px-6 py-3 bg-cyan-700 hover:bg-cyan-600 rounded-lg font-semibold flex items-center"
                    >
                      <Send className="w-5 h-5 mr-2" />
                      Apply for this position
                    </button>
                  )}
                  
                  <button 
                    onClick={() => {
                      // In a real app, this would add the job to a saved jobs list
                      alert('Job saved to your bookmarks!');
                    }}
                    className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold flex items-center"
                  >
                    <Bookmark className="w-5 h-5 mr-2" />
                    Save Job
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobSearchByCV; 