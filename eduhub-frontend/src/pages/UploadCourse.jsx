import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  Book, 
  ArrowLeft, 
  AlertCircle, 
  Check, 
  Upload,
  Image,
  Clock,
  GraduationCap,
  BookOpen,
  LayoutDashboard,
  Tag,
  Video,
  FileText,
  Link
} from "lucide-react";

function UploadCourse() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [form, setForm] = useState({
    title: "",
    description: "",
    instructor: "",
    content: "",
    duration: "",
    skillLevel: "beginner",
    courseType: "academic",
    courseSegment: "video",
    videoUrl: "",
    theoryUrl: "",
    department: "",
    activityType: "",
    university: "",
    thumbnail: "",
    tags: []
  });

  const [tagInput, setTagInput] = useState("");

  // Check if user is admin
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    
    if (!token || userRole !== 'admin') {
      navigate('/login', { state: { message: 'You must be logged in as admin to access this page' } });
    }
  }, [navigate]);

  const addTag = () => {
    if (tagInput.trim() !== "" && !form.tags.includes(tagInput.trim())) {
      setForm({
        ...form,
        tags: [...form.tags, tagInput.trim()]
      });
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setForm({
      ...form,
      tags: form.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const validateForm = () => {
    const errors = {};
    
    if (!form.title.trim()) errors.title = "Course title is required";
    if (!form.description.trim()) errors.description = "Description is required";
    if (!form.instructor.trim()) errors.instructor = "Instructor name is required";
    if (!form.content.trim()) errors.content = "Course content is required";
    if (!form.duration.trim()) errors.duration = "Duration is required";
    
    if (form.courseType === "academic" && !form.department.trim()) {
      errors.department = "Department is required for academic courses";
    }
    
    if (form.courseType === "co-curricular" && !form.activityType.trim()) {
      errors.activityType = "Activity type is required for co-curricular courses";
    }
    
    if (form.courseSegment === "video" && !form.videoUrl.trim()) {
      errors.videoUrl = "Video URL is required for video courses";
    }
    
    if (form.courseSegment === "theory" && !form.theoryUrl.trim()) {
      errors.theoryUrl = "Theory URL is required for theory courses";
    }
    
    return { isValid: Object.keys(errors).length === 0, errors };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const { isValid, errors } = validateForm();
    
    if (!isValid) {
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
      
      const response = await axios.post(
        'http://localhost:5000/api/courses',
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      setMessage({
        text: "Course uploaded successfully!",
        type: "success"
      });
      
      // Reset form
      setForm({
        title: "",
        description: "",
        instructor: "",
        content: "",
        duration: "",
        skillLevel: "beginner",
        courseType: "academic",
        courseSegment: "video",
        videoUrl: "",
        theoryUrl: "",
        department: "",
        activityType: "",
        university: "",
        thumbnail: "",
        tags: []
      });
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/admin');
      }, 2000);
      
    } catch (error) {
      console.error("Error uploading course:", error);
      
      let errorMessage = "Failed to upload course. Please try again.";
      
      if (error.response) {
        errorMessage = error.response.data.message || error.response.data.error || errorMessage;
        
        if (error.response.status === 401) {
          errorMessage = "Authentication failed. Please login again.";
          setTimeout(() => {
            localStorage.removeItem('token');
            localStorage.removeItem('isLoggedIn');
            navigate('/login');
          }, 2000);
        }
      } else if (error.request) {
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
  };

  // Function to check if a YouTube URL is valid
  const isValidYoutubeUrl = (url) => {
    const youtubeRegex = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/;
    return youtubeRegex.test(url);
  };

  // Function to get YouTube video ID from URL
  const getYoutubeVideoId = (url) => {
    if (!url) return null;
    
    // Regular expressions for different YouTube URL formats
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Preview for YouTube videos
  const renderYoutubePreview = () => {
    if (!form.videoUrl || !isValidYoutubeUrl(form.videoUrl)) return null;
    
    const videoId = getYoutubeVideoId(form.videoUrl);
    if (!videoId) return null;
    
    return (
      <div className="mt-3 rounded-lg overflow-hidden border border-gray-600">
        <div className="relative pt-[56.25%]">
          <iframe 
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube video preview"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6">
      <div className="max-w-4xl mx-auto bg-gray-800 p-8 rounded-xl shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-blue-400">
              <Book className="w-8 h-8 inline-block mr-2 text-blue-400" />
              Upload New Course
            </h1>
            <p className="text-gray-400 mt-1">Create a new course for students to enroll in</p>
          </div>
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Dashboard
          </button>
        </div>
        
        {message.text && (
          <div className={`p-4 mb-6 rounded-md ${message.type === "success" ? "bg-green-600/20 text-green-400 border border-green-500" : "bg-red-600/20 text-red-400 border border-red-500"}`}>
            {message.type === "success" ? (
              <Check className="w-5 h-5 inline-block mr-2" />
            ) : (
              <AlertCircle className="w-5 h-5 inline-block mr-2" />
            )}
            {message.text}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Course Title*
            </label>
            <input
              type="text"
              name="title"
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Introduction to Computer Science"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Course Type*
              </label>
              <select
                name="courseType"
                className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.courseType}
                onChange={handleChange}
              >
                <option value="academic">Academic</option>
                <option value="co-curricular">Co-Curricular</option>
              </select>
            </div>
            
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                {form.courseType === "academic" ? "Department*" : "Activity Type*"}
              </label>
              {form.courseType === "academic" ? (
                <select
                  name="department"
                  className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.department}
                  onChange={handleChange}
                >
                  <option value="">Select Department</option>
                  <option value="CSE">Computer Science & Engineering</option>
                  <option value="EEE">Electrical & Electronic Engineering</option>
                  <option value="LAW">Law</option>
                  <option value="BBA">Business Administration</option>
                  <option value="AI and DATA SCIENCE">AI & Data Science</option>
                  <option value="Others">Others</option>
                </select>
              ) : (
                <select
                  name="activityType"
                  className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.activityType}
                  onChange={handleChange}
                >
                  <option value="">Select Activity Type</option>
                  <option value="Science">Science</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Arts">Arts</option>
                  <option value="Sports">Sports</option>
                  <option value="Music">Music</option>
                  <option value="Others">Others</option>
                </select>
              )}
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Course Segment*
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label className={`flex items-center justify-center border ${form.courseSegment === 'video' ? 'border-blue-500 bg-blue-500/20' : 'border-gray-600'} rounded-lg p-4 cursor-pointer hover:bg-gray-700 transition-colors`}>
                <input
                  type="radio"
                  name="courseSegment"
                  value="video"
                  checked={form.courseSegment === 'video'}
                  onChange={handleChange}
                  className="sr-only"
                />
                <Video className="w-6 h-6 text-blue-400 mr-2" />
                <span>Video Lecture</span>
              </label>
              
              <label className={`flex items-center justify-center border ${form.courseSegment === 'theory' ? 'border-green-500 bg-green-500/20' : 'border-gray-600'} rounded-lg p-4 cursor-pointer hover:bg-gray-700 transition-colors`}>
                <input
                  type="radio"
                  name="courseSegment"
                  value="theory"
                  checked={form.courseSegment === 'theory'}
                  onChange={handleChange}
                  className="sr-only"
                />
                <FileText className="w-6 h-6 text-green-400 mr-2" />
                <span>Theory Content</span>
              </label>
            </div>
          </div>
          
          {/* Conditional form fields based on course segment */}
          {form.courseSegment === 'video' ? (
            <div className="mb-6">
              <label className="block text-gray-300 text-sm font-medium mb-2">
                <Video className="w-4 h-4 inline-block mr-1" />
                Video URL* (YouTube)
              </label>
              <input
                type="text"
                name="videoUrl"
                className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.videoUrl}
                onChange={handleChange}
                placeholder="e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ"
              />
              <p className="text-gray-400 text-xs mt-1">
                Enter the URL of your YouTube video lecture
              </p>
              
              {renderYoutubePreview()}
            </div>
          ) : (
            <div className="mb-6">
              <label className="block text-gray-300 text-sm font-medium mb-2">
                <Link className="w-4 h-4 inline-block mr-1" />
                Theory Resource URL*
              </label>
              <input
                type="text"
                name="theoryUrl"
                className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.theoryUrl}
                onChange={handleChange}
                placeholder="e.g. https://example.com/course-theory.pdf"
              />
              <p className="text-gray-400 text-xs mt-1">
                Enter the URL to your theory content (PDF, document, or website)
              </p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                <GraduationCap className="w-4 h-4 inline-block mr-1" />
                Instructor*
              </label>
              <input
                type="text"
                name="instructor"
                className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.instructor}
                onChange={handleChange}
                placeholder="e.g. Prof. John Smith"
              />
            </div>
            
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                <Clock className="w-4 h-4 inline-block mr-1" />
                Duration*
              </label>
              <input
                type="text"
                name="duration"
                className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.duration}
                onChange={handleChange}
                placeholder="e.g. 12 weeks"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Skill Level
              </label>
              <select
                name="skillLevel"
                className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.skillLevel}
                onChange={handleChange}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                University (Optional)
              </label>
              <input
                type="text"
                name="university"
                className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.university}
                onChange={handleChange}
                placeholder="e.g. University of Dhaka"
              />
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-medium mb-2">
              <Image className="w-4 h-4 inline-block mr-1" />
              Course Thumbnail URL (Optional)
            </label>
            <input
              type="text"
              name="thumbnail"
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.thumbnail}
              onChange={handleChange}
              placeholder="e.g. https://example.com/course-image.jpg"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-medium mb-2">
              <Tag className="w-4 h-4 inline-block mr-1" />
              Tags
            </label>
            <div className="flex">
              <input
                type="text"
                className="flex-grow px-4 py-2 rounded-l-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="e.g. programming, web development"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag();
                  }
                }}
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 rounded-r-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                Add
              </button>
            </div>
            {form.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {form.tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-blue-300 hover:text-blue-100"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-medium mb-2">
              <BookOpen className="w-4 h-4 inline-block mr-1" />
              Course Description*
            </label>
            <textarea
              name="description"
              rows="3"
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.description}
              onChange={handleChange}
              placeholder="Enter a brief description of the course..."
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-medium mb-2">
              <LayoutDashboard className="w-4 h-4 inline-block mr-1" />
              Course Content*
            </label>
            <textarea
              name="content"
              rows="6"
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.content}
              onChange={handleChange}
              placeholder="Enter the detailed content, syllabus or curriculum..."
            />
          </div>
          
          <div className="flex items-center justify-between mt-8">
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
              className={`px-8 py-3 rounded-md bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium hover:from-blue-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Uploading...' : 'Upload Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UploadCourse;
