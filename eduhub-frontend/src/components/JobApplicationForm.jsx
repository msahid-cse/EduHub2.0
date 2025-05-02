import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Upload, Check, X, Send, RefreshCw, Eye, FileText } from 'lucide-react';

const JobApplicationForm = ({ jobId, onSuccess, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [cv, setCV] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [generatedCoverLetter, setGeneratedCoverLetter] = useState('');
  const [isGeneratingCoverLetter, setIsGeneratingCoverLetter] = useState(false);
  const [showGeneratedPreview, setShowGeneratedPreview] = useState(false);
  const [useGeneratedCoverLetter, setUseGeneratedCoverLetter] = useState(false);
  const [jobDetails, setJobDetails] = useState(null);
  const [userDetails, setUserDetails] = useState(null);

  // Fetch job and user details for cover letter generation
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // Fetch job details
        const jobResponse = await axios.get(
          `http://localhost:5000/api/jobs/${jobId}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        
        setJobDetails(jobResponse.data);
        
        // Fetch user profile
        const userId = localStorage.getItem('userId');
        if (userId) {
          const userResponse = await axios.get(
            `http://localhost:5000/api/users/${userId}`,
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          );
          
          setUserDetails(userResponse.data);
        }
      } catch (error) {
        console.error('Error fetching details for cover letter:', error);
      }
    };
    
    fetchData();
  }, [jobId]);

  const handleCVChange = (e) => {
    const selectedFile = e.target.files[0];
    
    // Validate file type
    if (selectedFile && selectedFile.type !== 'application/pdf') {
      setError('Please upload a PDF file');
      setCV(null);
      return;
    }
    
    // Validate file size (max 5MB)
    if (selectedFile && selectedFile.size > 5 * 1024 * 1024) {
      setError('File size should not exceed 5MB');
      setCV(null);
      return;
    }
    
    setCV(selectedFile);
    setError('');
  };

  const generateCoverLetter = () => {
    if (!jobDetails || !userDetails) {
      setError('Unable to generate cover letter. Please try again later.');
      return;
    }
    
    setIsGeneratingCoverLetter(true);
    
    try {
      // Get current date
      const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      // User information
      const { name, email, university, department, skills } = userDetails;
      
      // Format skills as a comma-separated list if available
      const skillsList = Array.isArray(skills) && skills.length > 0 
        ? skills.join(', ') 
        : 'relevant skills';
      
      // Job information
      const { title, company } = jobDetails;
      
      // Generate cover letter text
      const generatedText = `${currentDate}

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
      
      setGeneratedCoverLetter(generatedText);
      setUseGeneratedCoverLetter(true);
      
      // If no custom cover letter, set the generated one as active
      if (!coverLetter) {
        setCoverLetter(generatedText);
      }
    } catch (error) {
      console.error('Error generating cover letter:', error);
      setError('Failed to generate cover letter. Please try writing your own.');
    } finally {
      setIsGeneratingCoverLetter(false);
    }
  };

  const toggleCoverLetterSource = () => {
    if (useGeneratedCoverLetter) {
      // Switching to manual cover letter
      setUseGeneratedCoverLetter(false);
    } else {
      // Switching to generated cover letter
      setUseGeneratedCoverLetter(true);
      setCoverLetter(generatedCoverLetter);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!cv) {
      setError('Please upload your CV');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      
      // Create FormData
      const formData = new FormData();
      formData.append('cv', cv);
      
      // Use the appropriate cover letter
      const finalCoverLetter = useGeneratedCoverLetter ? generatedCoverLetter : coverLetter;
      if (finalCoverLetter.trim()) {
        formData.append('coverLetter', finalCoverLetter);
      }
      
      // Send API request
      const response = await axios.post(
        `http://localhost:5000/api/jobs/${jobId}/apply`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      // Call success callback
      onSuccess(response.data);
    } catch (error) {
      console.error('Error applying for job:', error);
      setError(
        error.response?.data?.message || 
        'Failed to submit application. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
      <h2 className="text-xl font-bold text-white mb-6">Apply for this position</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-900/30 border border-red-800 rounded-md text-red-300 text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {/* CV Upload */}
        <div className="mb-6">
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Upload Your CV* (PDF)
          </label>
          
          <div 
            className={`border-2 border-dashed rounded-lg p-4 text-center ${
              cv ? 'border-green-500 bg-green-500/10' : 'border-gray-600 hover:border-gray-500'
            } transition-all duration-300`}
          >
            {!cv ? (
              <label className="cursor-pointer block w-full h-full">
                <Upload className="mx-auto w-8 h-8 text-gray-400 mb-2" />
                <p className="text-gray-300 mb-1">Click to upload your CV</p>
                <p className="text-gray-500 text-xs">PDF only (max 5MB)</p>
                <input 
                  type="file" 
                  accept=".pdf" 
                  className="hidden" 
                  onChange={handleCVChange}
                  disabled={isSubmitting}
                />
              </label>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-400 mr-2" />
                  <span className="text-green-400 font-medium">
                    {cv.name} ({Math.round(cv.size / 1024)} KB)
                  </span>
                </div>
                
                <button 
                  type="button"
                  onClick={() => setCV(null)}
                  className="text-gray-400 hover:text-gray-300"
                  disabled={isSubmitting}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Auto-generate Cover Letter Button */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-300 text-sm font-medium">Cover Letter</h3>
            
            <div className="flex gap-2">
              {generatedCoverLetter && (
                <button
                  type="button"
                  onClick={toggleCoverLetterSource}
                  className={`px-2 py-1 text-xs rounded-md flex items-center ${
                    useGeneratedCoverLetter 
                      ? 'bg-teal-900/50 text-teal-400 border border-teal-800' 
                      : 'bg-gray-700 text-gray-300'
                  }`}
                >
                  {useGeneratedCoverLetter ? 'Using Auto-Generated' : 'Use Generated'}
                </button>
              )}
              
              <button
                type="button"
                className="px-2 py-1 bg-gray-700 text-gray-300 rounded-md text-xs hover:bg-gray-600 transition-colors flex items-center"
                onClick={generateCoverLetter}
                disabled={isGeneratingCoverLetter || !jobDetails || !userDetails}
              >
                {isGeneratingCoverLetter ? (
                  <>
                    <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                    Generating...
                  </>
                ) : generatedCoverLetter ? (
                  <>
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Regenerate
                  </>
                ) : (
                  <>
                    <FileText className="w-3 h-3 mr-1" />
                    Auto-Generate
                  </>
                )}
              </button>
              
              {generatedCoverLetter && (
                <button
                  type="button"
                  className="px-2 py-1 bg-gray-700 text-gray-300 rounded-md text-xs hover:bg-gray-600 transition-colors flex items-center"
                  onClick={() => setShowGeneratedPreview(!showGeneratedPreview)}
                >
                  <Eye className="w-3 h-3 mr-1" />
                  {showGeneratedPreview ? 'Hide Preview' : 'Preview'}
                </button>
              )}
            </div>
          </div>
          
          {/* Preview of generated cover letter */}
          {showGeneratedPreview && generatedCoverLetter && (
            <div className="mt-2 p-4 bg-gray-900 rounded-md border border-gray-700 text-gray-300 text-sm">
              <div className="max-h-60 overflow-y-auto">
                <pre className="whitespace-pre-wrap font-sans">
                  {generatedCoverLetter}
                </pre>
              </div>
            </div>
          )}
        </div>
        
        {/* Cover Letter Textarea - only show if not using generated or if no generated letter yet */}
        {(!useGeneratedCoverLetter || !generatedCoverLetter) && (
          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-medium mb-2">
              {generatedCoverLetter ? 'Custom Cover Letter' : 'Cover Letter (Optional)'}
            </label>
            <textarea
              rows="4"
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Tell the employer why you're the perfect fit for this role..."
              disabled={isSubmitting || useGeneratedCoverLetter}
            />
            <p className="text-gray-500 text-xs mt-1">
              A good cover letter increases your chances of getting an interview.
            </p>
          </div>
        )}
        
        {/* Actions */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition-colors"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          
          <button
            type="submit"
            className={`px-6 py-2 bg-gradient-to-r from-teal-500 to-green-500 text-white rounded-md hover:from-teal-600 hover:to-green-600 transition-colors flex items-center ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : (
              <>
                Submit Application <Send className="ml-2 w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default JobApplicationForm; 