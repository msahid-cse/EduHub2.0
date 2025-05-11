import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function PostJob() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
    requirements: "",
    neededSkills: "",
    type: "full-time",
    salary: "",
    contactEmail: "",
    deadline: ""
  });

  // Validation state
  const [errors, setErrors] = useState({});

  // Check if user is admin
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    
    if (!token || userRole !== 'admin') {
      navigate('/login', { state: { message: 'You must be logged in as admin to access this page' } });
    }
  }, [navigate]);

  const validateForm = () => {
    const newErrors = {};
    const today = new Date().toISOString().split('T')[0];
    
    // Required fields
    if (!form.title.trim()) newErrors.title = "Job title is required";
    if (!form.company.trim()) newErrors.company = "Company name is required";
    if (!form.location.trim()) newErrors.location = "Location is required";
    if (!form.description.trim()) newErrors.description = "Description is required";
    if (!form.contactEmail.trim()) newErrors.contactEmail = "Contact email is required";
    if (!form.deadline) newErrors.deadline = "Deadline is required";
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (form.contactEmail && !emailRegex.test(form.contactEmail)) {
      newErrors.contactEmail = "Please enter a valid email address";
    }
    
    // Deadline must be in the future
    if (form.deadline && form.deadline < today) {
      newErrors.deadline = "Deadline must be in the future";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setMessage({
        text: "Please fix the errors in the form",
        type: "error"
      });
      return;
    }
    
    setIsSubmitting(true);
    setMessage({ text: "", type: "" });
    
    try {
      const token = localStorage.getItem('token');
      
      // Format requirements and neededSkills as arrays if they're not empty
      const formattedData = {
        ...form,
        requirements: form.requirements ? form.requirements.split('\n').filter(req => req.trim() !== '') : [],
        neededSkills: form.neededSkills ? form.neededSkills.split('\n').filter(skill => skill.trim() !== '') : []
      };
      
      const response = await axios.post(
        'http://localhost:5000/api/jobs',
        formattedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      setMessage({
        text: "Job posted successfully!",
        type: "success"
      });
      
      // Reset form
      setForm({
        title: "",
        company: "",
        location: "",
        description: "",
        requirements: "",
        neededSkills: "",
        type: "full-time",
        salary: "",
        contactEmail: "",
        deadline: ""
      });
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/admin');
      }, 2000);
      
    } catch (error) {
      console.error("Error posting job:", error);
      let errorMessage = "Failed to post job. Please try again.";
      
      if (error.response) {
        // The server responded with a status code outside the 2xx range
        errorMessage = error.response.data.message || error.response.data.error || errorMessage;
        
        if (error.response.status === 401) {
          errorMessage = "Authentication failed. Please login again.";
          // Optionally redirect to login
          setTimeout(() => {
            localStorage.removeItem('token');
            localStorage.removeItem('isLoggedIn');
            navigate('/login');
          }, 2000);
        }
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = "No response from server. Please check your connection.";
      }
      
      setMessage({
        text: errorMessage,
        type: "error"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6">
      <div className="max-w-3xl mx-auto bg-gray-800 p-8 rounded-xl shadow-xl">
        <h1 className="text-3xl font-bold mb-6 text-cyan-400">Post New Job Opportunity</h1>
        
        {message.text && (
          <div className={`p-4 mb-6 rounded-md ${message.type === "success" ? "bg-green-600/20 text-green-400 border border-green-500" : "bg-red-600/20 text-red-400 border border-red-500"}`}>
            {message.text}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Job Title*
              </label>
              <input
                type="text"
                name="title"
                className={`w-full px-4 py-2 rounded-md bg-gray-700 text-white border ${errors.title ? "border-red-500" : "border-gray-600"} focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Software Engineer"
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
            </div>
            
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Company Name*
              </label>
              <input
                type="text"
                name="company"
                className={`w-full px-4 py-2 rounded-md bg-gray-700 text-white border ${errors.company ? "border-red-500" : "border-gray-600"} focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                value={form.company}
                onChange={handleChange}
                placeholder="e.g. TechNova Bangladesh"
              />
              {errors.company && <p className="text-red-500 text-xs mt-1">{errors.company}</p>}
            </div>
            
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Location*
              </label>
              <input
                type="text"
                name="location"
                className={`w-full px-4 py-2 rounded-md bg-gray-700 text-white border ${errors.location ? "border-red-500" : "border-gray-600"} focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                value={form.location}
                onChange={handleChange}
                placeholder="e.g. Dhaka, Bangladesh"
              />
              {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
            </div>
            
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Job Type
              </label>
              <select
                name="type"
                className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                value={form.type}
                onChange={handleChange}
              >
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="internship">Internship</option>
                <option value="remote">Remote</option>
              </select>
            </div>
            
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Salary (Optional)
              </label>
              <input
                type="text"
                name="salary"
                className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                value={form.salary}
                onChange={handleChange}
                placeholder="e.g. BDT 50,000 - 80,000 per month"
              />
            </div>
            
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Contact Email*
              </label>
              <input
                type="email"
                name="contactEmail"
                className={`w-full px-4 py-2 rounded-md bg-gray-700 text-white border ${errors.contactEmail ? "border-red-500" : "border-gray-600"} focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                value={form.contactEmail}
                onChange={handleChange}
                placeholder="e.g. careers@example.com"
              />
              {errors.contactEmail && <p className="text-red-500 text-xs mt-1">{errors.contactEmail}</p>}
            </div>
            
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Application Deadline*
              </label>
              <input
                type="date"
                name="deadline"
                className={`w-full px-4 py-2 rounded-md bg-gray-700 text-white border ${errors.deadline ? "border-red-500" : "border-gray-600"} focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                value={form.deadline}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
              />
              {errors.deadline && <p className="text-red-500 text-xs mt-1">{errors.deadline}</p>}
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Job Description*
            </label>
            <textarea
              name="description"
              rows="4"
              className={`w-full px-4 py-2 rounded-md bg-gray-700 text-white border ${errors.description ? "border-red-500" : "border-gray-600"} focus:outline-none focus:ring-2 focus:ring-cyan-500`}
              value={form.description}
              onChange={handleChange}
              placeholder="Provide a detailed description of the role, responsibilities, etc."
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>
          
          <div className="mb-8">
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Requirements (One per line)
            </label>
            <textarea
              name="requirements"
              rows="5"
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              value={form.requirements}
              onChange={handleChange}
              placeholder="e.g. Bachelor's degree in Computer Science&#10;2+ years of experience with React&#10;Strong problem-solving skills"
            />
            <p className="text-gray-400 text-xs mt-1">Enter each requirement on a new line</p>
          </div>
          
          <div className="mb-8">
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Needed Skills (One per line)
            </label>
            <textarea
              name="neededSkills"
              rows="5"
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              value={form.neededSkills}
              onChange={handleChange}
              placeholder="e.g. JavaScript&#10;React&#10;Node.js&#10;MongoDB"
            />
            <p className="text-gray-400 text-xs mt-1">Enter each skill on a new line</p>
          </div>
          
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="px-6 py-2 rounded-md bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-8 py-3 rounded-md bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium hover:from-cyan-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Posting...' : 'Post Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PostJob;
