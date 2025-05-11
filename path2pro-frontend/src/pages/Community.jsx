import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, 
  MessageCircle, 
  Send, 
  User,
  Users, 
  Clock, 
  Image as ImageIcon,
  ThumbsUp,
  FileText,
  Globe,
  Download,
  Home,
  PaperclipIcon,
  X,
  File
} from 'lucide-react';
import { communityAPI } from '../api/apiClient';

const Community = () => {
  const navigate = useNavigate();
  const [university, setUniversity] = useState('');
  const [userRole, setUserRole] = useState('user');
  const [globalPosts, setGlobalPosts] = useState([]);
  const [universityPosts, setUniversityPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [postImage, setPostImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('university'); // 'university', 'global', or 'chat'
  const [members, setMembers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [fileAttachment, setFileAttachment] = useState(null);
  const [commentText, setCommentText] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState('');
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Check if user is logged in and get user info
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      navigate('/login', { state: { message: 'You must be logged in to access the community' } });
    }
    
    // Get user information from localStorage
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const storedRole = localStorage.getItem('userRole');
    const storedUserId = localStorage.getItem('userId');
    
    if (userInfo.university) {
      setUniversity(userInfo.university);
    }
    
    if (storedRole) {
      setUserRole(storedRole);
      setIsAdmin(storedRole === 'admin');
    }
    
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, [navigate]);

  // Fetch posts based on active section
  useEffect(() => {
    if (activeSection === 'university') {
      fetchUniversityPosts();
    } else if (activeSection === 'global') {
      fetchGlobalPosts();
    }
  }, [activeSection]);

  // Fetch global posts
  const fetchGlobalPosts = async () => {
    setIsLoading(true);
    try {
      const response = await communityAPI.getGlobalPosts();
      setGlobalPosts(response.data);
    } catch (error) {
      console.error('Error fetching global posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch university posts
  const fetchUniversityPosts = async () => {
    setIsLoading(true);
    try {
      const response = await communityAPI.getPosts();
      setUniversityPosts(response.data);
    } catch (error) {
      console.error('Error fetching university posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // New function to fetch global community members
  const fetchGlobalMembers = async () => {
    try {
      const response = await communityAPI.getGlobalMembers();
      setAllUsers(response.data);
    } catch (error) {
      console.error('Error fetching global community members:', error);
      // Fall back to university members if global fetch fails
      fetchUniversityMembers();
    }
  };

  // Fetch users for chat based on active section
  useEffect(() => {
    if (activeSection === 'chat') {
      if (isAdmin) {
        fetchAllUsers();
      } else if (activeSection === 'global') {
        fetchGlobalMembers();
      } else {
        fetchUniversityMembers();
      }
    }
  }, [activeSection, isAdmin]);

  // Fetch all users (admin only)
  const fetchAllUsers = async () => {
    try {
      const response = await communityAPI.getAllUsers();
      setAllUsers(response.data);
    } catch (error) {
      console.error('Error fetching all users:', error);
      // Fall back to university members if admin fetch fails
      fetchUniversityMembers();
    }
  };

  // Fetch university members
  const fetchUniversityMembers = async () => {
    try {
      const response = await communityAPI.getMembers();
      setMembers(response.data);
    } catch (error) {
      console.error('Error fetching university members:', error);
    }
  };

  // Fetch conversation when a user is selected
  useEffect(() => {
    if (selectedUser) {
      const fetchConversation = async () => {
        try {
          const response = await communityAPI.getConversation(selectedUser._id);
          setMessages(response.data);
        } catch (error) {
          console.error('Error fetching conversation:', error);
        }
      };

      fetchConversation();
    }
  }, [selectedUser]);

  // Scroll to bottom of messages when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Handle image upload for posts
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('Image size should be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPostImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle file attachment for messages
  const handleFileAttachment = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert('File size should be less than 10MB');
        return;
      }
      
      try {
        // Upload the file
        const response = await communityAPI.uploadAttachment(file);
        setFileAttachment({
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          fileUrl: response.data.fileUrl
        });
      } catch (error) {
        console.error('Error uploading file:', error);
        alert('Error uploading file. Please try again.');
      }
    }
  };

  // Clear file attachment
  const handleClearAttachment = () => {
    setFileAttachment(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Create a new post
  const handleCreatePost = async () => {
    if (!newPostContent.trim()) return;

    try {
      const postData = {
        content: newPostContent,
        media: postImage || '',
        isGlobal: activeSection === 'global'
      };

      const response = await communityAPI.createPost(postData);
      
      if (activeSection === 'global') {
        setGlobalPosts([response.data, ...globalPosts]);
      } else {
        setUniversityPosts([response.data, ...universityPosts]);
      }
      
      setNewPostContent('');
      setPostImage(null);
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Error creating post. Please try again.');
    }
  };

  // Add a comment to a post
  const handleAddComment = async (postId, isGlobalPost = false) => {
    if (!commentText[postId]?.trim()) return;

    try {
      const response = await communityAPI.addComment(postId, commentText[postId]);
      
      // Update the appropriate posts state with the new comment
      if (isGlobalPost) {
        const updatedPosts = globalPosts.map(post => 
          post._id === postId ? response.data : post
        );
        setGlobalPosts(updatedPosts);
      } else {
        const updatedPosts = universityPosts.map(post => 
          post._id === postId ? response.data : post
        );
        setUniversityPosts(updatedPosts);
      }
      
      setCommentText({...commentText, [postId]: ''});
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Error adding comment. Please try again.');
    }
  };

  // Like a post
  const handleLikePost = async (postId, isGlobalPost = false) => {
    try {
      const response = await communityAPI.likePost(postId);
      
      // Update the appropriate posts state with the updated likes
      if (isGlobalPost) {
        const updatedPosts = globalPosts.map(post => 
          post._id === postId ? response.data : post
        );
        setGlobalPosts(updatedPosts);
      } else {
        const updatedPosts = universityPosts.map(post => 
          post._id === postId ? response.data : post
        );
        setUniversityPosts(updatedPosts);
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  // Send a message
  const handleSendMessage = async () => {
    if ((!newMessage.trim() && !fileAttachment) || !selectedUser) return;

    try {
      // Determine if this is global communication
      const isGlobalCommunication = activeSection === 'global';
      
      const response = await communityAPI.sendMessage(
        selectedUser._id, 
        newMessage || 'Sent an attachment', 
        fileAttachment,
        isGlobalCommunication
      );
      
      setMessages([...messages, response.data]);
      setNewMessage('');
      setFileAttachment(null);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      if (error.response?.data?.globalRequired) {
        // If the error indicates global communication is required
        if (window.confirm('This user is from a different university. Would you like to connect through the Global Community?')) {
          setActiveSection('global');
          // Retry after switching to global mode
          setTimeout(() => {
            const message = newMessage;
            const attachment = fileAttachment;
            setNewMessage(message);
            setFileAttachment(attachment);
          }, 500);
        }
      } else {
        alert('Error sending message. Please try again.');
      }
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes < 1024) {
      return bytes + ' B';
    } else if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(1) + ' KB';
    } else {
      return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }
  };

  // Get file type icon
  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) {
      return <ImageIcon className="w-5 h-5" />;
    } else if (fileType.startsWith('application/pdf')) {
      return <FileText className="w-5 h-5" />;
    } else {
      return <File className="w-5 h-5" />;
    }
  };

  // Check if current user is sender of message
  const isCurrentUserSender = (message) => {
    return message.sender === userId;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 py-4 shadow-md">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-cyan-400 flex items-center">
            {activeSection === 'university' && (
              <>University Community: {university}</>
            )}
            {activeSection === 'global' && (
              <><Globe className="mr-2" /> Global Community</>
            )}
            {activeSection === 'chat' && (
              <><MessageCircle className="mr-2" /> Chat</>
            )}
          </h1>
          <div className="flex space-x-2">
            <button 
              className={`px-4 py-2 rounded-lg transition-colors flex items-center ${
                activeSection === 'university' ? 'bg-cyan-600' : 'bg-gray-700 hover:bg-gray-600'
              }`}
              onClick={() => setActiveSection('university')}
            >
              <Home className="mr-1 w-4 h-4" />
              University
            </button>
            <button 
              className={`px-4 py-2 rounded-lg transition-colors flex items-center ${
                activeSection === 'global' ? 'bg-cyan-600' : 'bg-gray-700 hover:bg-gray-600'
              }`}
              onClick={() => setActiveSection('global')}
            >
              <Globe className="mr-1 w-4 h-4" />
              Global
            </button>
            <button 
              className={`px-4 py-2 rounded-lg transition-colors flex items-center ${
                activeSection === 'chat' ? 'bg-cyan-600' : 'bg-gray-700 hover:bg-gray-600'
              }`}
              onClick={() => setActiveSection('chat')}
            >
              <MessageCircle className="mr-1 w-4 h-4" />
              Chat
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {activeSection === 'university' ? (
          <div className="max-w-3xl mx-auto">
            {/* Create University Post */}
            <div className="bg-gray-800 rounded-lg shadow-md p-4 mb-6">
              <h2 className="text-xl font-semibold mb-4">Create Post for {university}</h2>
              <textarea
                className="w-full bg-gray-700 text-white rounded-lg p-3 mb-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Share something with your university community..."
                rows="3"
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
              />
              
              {postImage && (
                <div className="mb-3 relative">
                  <img 
                    src={postImage} 
                    alt="Post preview" 
                    className="max-h-40 rounded-lg"
                  />
                  <button 
                    className="absolute top-2 right-2 bg-gray-800 p-1 rounded-full text-gray-300 hover:text-white"
                    onClick={() => setPostImage(null)}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              )}
              
              <div className="flex justify-between items-center">
                <label className="cursor-pointer flex items-center text-gray-300 hover:text-white transition-colors">
                  <ImageIcon className="h-5 w-5 mr-2" />
                  <span>Add Image</span>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
                <button
                  className="bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded-lg transition-colors"
                  onClick={handleCreatePost}
                  disabled={!newPostContent.trim()}
                >
                  Post
                </button>
              </div>
            </div>

            {/* University Posts List */}
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mx-auto"></div>
                <p className="mt-3 text-gray-400">Loading posts...</p>
              </div>
            ) : universityPosts.length === 0 ? (
              <div className="text-center py-12 bg-gray-800 rounded-lg">
                <Users className="h-16 w-16 mx-auto text-gray-600 mb-4" />
                <h3 className="text-xl font-medium text-gray-400 mb-2">No Posts Yet</h3>
                <p className="text-gray-500 mb-6">Be the first to share something with your university community!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {universityPosts.map(post => (
                  <div key={post._id} className="bg-gray-800 rounded-lg shadow-md overflow-hidden">
                    {/* Post Header */}
                    <div className="p-4 border-b border-gray-700">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold">
                          {post.userName.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-3">
                          <p className="font-medium">{post.userName}</p>
                          <p className="text-xs text-gray-400 flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatDate(post.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Post Content */}
              <div className="p-4">
                      <p className="whitespace-pre-wrap">{post.content}</p>
                      {post.media && (
                        <img 
                          src={post.media} 
                          alt="Post attachment" 
                          className="mt-3 max-h-96 rounded-lg w-full object-cover"
                        />
                      )}
                    </div>
                    
                    {/* Post Actions */}
                    <div className="px-4 py-2 border-t border-gray-700 flex">
                      <button 
                        className={`flex items-center mr-4 ${
                          post.likes.includes(userId) 
                            ? 'text-cyan-400' 
                            : 'text-gray-400 hover:text-white'
                        } transition-colors`}
                        onClick={() => handleLikePost(post._id, false)}
                      >
                        <Heart className="h-5 w-5 mr-1" fill={post.likes.includes(userId) ? "currentColor" : "none"} />
                        <span>{post.likes.length || 0}</span>
                      </button>
                      <button className="flex items-center text-gray-400 hover:text-white transition-colors">
                        <MessageCircle className="h-5 w-5 mr-1" />
                        <span>{post.comments.length || 0}</span>
                      </button>
                    </div>
                    
                    {/* Comments */}
                    {post.comments.length > 0 && (
                      <div className="px-4 py-3 bg-gray-750 border-t border-gray-700">
                        <h4 className="text-sm font-medium text-gray-300 mb-2">Comments</h4>
                        <div className="space-y-3">
                          {post.comments.map((comment, index) => (
                            <div key={index} className="flex">
                              <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center text-white text-xs mr-2 flex-shrink-0">
                                {comment.userName.charAt(0).toUpperCase()}
                              </div>
                              <div className="bg-gray-700 rounded-lg p-2 flex-grow">
                                <p className="text-xs font-medium">{comment.userName}</p>
                                <p className="text-sm mt-1">{comment.content}</p>
                                <p className="text-xs text-gray-400 mt-1">{formatDate(comment.createdAt)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Add Comment */}
                    <div className="p-3 bg-gray-750 border-t border-gray-700 flex items-center">
                      <input
                        type="text"
                        className="bg-gray-700 rounded-full px-4 py-2 flex-grow text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500"
                        placeholder="Write a comment..."
                        value={commentText[post._id] || ''}
                        onChange={(e) => setCommentText({...commentText, [post._id]: e.target.value})}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddComment(post._id, false)}
                      />
                      <button 
                        className="ml-2 p-2 rounded-full bg-cyan-600 hover:bg-cyan-700 transition-colors"
                        onClick={() => handleAddComment(post._id, false)}
                        disabled={!commentText[post._id]?.trim()}
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : activeSection === 'global' ? (
          <div className="max-w-3xl mx-auto">
            {/* Create Global Post (For All Users) */}
            <div className="bg-gray-800 rounded-lg shadow-md p-4 mb-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Globe className="mr-2 text-cyan-400" />
                {isAdmin ? "Create Global Announcement" : "Post to Global Community"}
              </h2>
              <textarea
                className="w-full bg-gray-700 text-white rounded-lg p-3 mb-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder={isAdmin ? "Share an announcement with all users..." : "Share something with the global community..."}
                rows="3"
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
              />
              
              {postImage && (
                <div className="mb-3 relative">
                  <img 
                    src={postImage} 
                    alt="Post preview" 
                    className="max-h-40 rounded-lg"
                  />
                  <button 
                    className="absolute top-2 right-2 bg-gray-800 p-1 rounded-full text-gray-300 hover:text-white"
                    onClick={() => setPostImage(null)}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              )}
              
              <div className="flex justify-between items-center">
                <label className="cursor-pointer flex items-center text-gray-300 hover:text-white transition-colors">
                  <ImageIcon className="h-5 w-5 mr-2" />
                  <span>Add Image</span>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
                <button
                  className="bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded-lg transition-colors"
                  onClick={handleCreatePost}
                  disabled={!newPostContent.trim()}
                >
                  {isAdmin ? "Post Globally" : "Share Globally"}
                </button>
              </div>
            </div>

            {/* Global Posts List */}
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mx-auto"></div>
                <p className="mt-3 text-gray-400">Loading global posts...</p>
              </div>
            ) : globalPosts.length === 0 ? (
              <div className="text-center py-12 bg-gray-800 rounded-lg">
                <Globe className="h-16 w-16 mx-auto text-gray-600 mb-4" />
                <h3 className="text-xl font-medium text-gray-400 mb-2">No Global Announcements Yet</h3>
                <p className="text-gray-500 mb-6">Check back later for important announcements.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {globalPosts.map(post => (
                  <div key={post._id} className="bg-gray-800 rounded-lg shadow-md overflow-hidden border-l-4 border-cyan-500">
                    {/* Post Header */}
                    <div className="p-4 border-b border-gray-700 bg-gradient-to-r from-cyan-900/30 to-transparent">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-white font-bold">
                          {post.userName.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-3">
                          <p className="font-medium flex items-center">
                            {post.userName} 
                            {post.userId === '000000000000000000000000' || post.university === 'Admin' ? (
                              <span className="ml-2 bg-cyan-900/50 text-cyan-400 text-xs px-2 py-0.5 rounded-full">
                                Admin
                              </span>
                            ) : (
                              <span className="ml-2 bg-blue-900/50 text-blue-400 text-xs px-2 py-0.5 rounded-full">
                                {post.university}
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-gray-400 flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatDate(post.createdAt)}
                            <Globe className="h-3 w-3 ml-2 mr-1" />
                            Global
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Post Content */}
                    <div className="p-4">
                      <p className="whitespace-pre-wrap">{post.content}</p>
                      {post.media && (
                        <img 
                          src={post.media} 
                          alt="Post attachment" 
                          className="mt-3 max-h-96 rounded-lg w-full object-cover"
                        />
                      )}
                    </div>
                    
                    {/* Post Actions */}
                    <div className="px-4 py-2 border-t border-gray-700 flex">
                      <button 
                        className={`flex items-center mr-4 ${
                          post.likes.includes(userId) 
                            ? 'text-cyan-400' 
                            : 'text-gray-400 hover:text-white'
                        } transition-colors`}
                        onClick={() => handleLikePost(post._id, true)}
                      >
                        <Heart className="h-5 w-5 mr-1" fill={post.likes.includes(userId) ? "currentColor" : "none"} />
                        <span>{post.likes.length || 0}</span>
                      </button>
                      <button className="flex items-center text-gray-400 hover:text-white transition-colors">
                        <MessageCircle className="h-5 w-5 mr-1" />
                        <span>{post.comments.length || 0}</span>
                      </button>
                    </div>
                    
                    {/* Comments */}
                    {post.comments.length > 0 && (
                      <div className="px-4 py-3 bg-gray-750 border-t border-gray-700">
                        <h4 className="text-sm font-medium text-gray-300 mb-2">Comments</h4>
                        <div className="space-y-3">
                          {post.comments.map((comment, index) => (
                            <div key={index} className="flex">
                              <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center text-white text-xs mr-2 flex-shrink-0">
                                {comment.userName.charAt(0).toUpperCase()}
                              </div>
                              <div className="bg-gray-700 rounded-lg p-2 flex-grow">
                                <p className="text-xs font-medium">{comment.userName}</p>
                                <p className="text-sm mt-1">{comment.content}</p>
                                <p className="text-xs text-gray-400 mt-1">{formatDate(comment.createdAt)}</p>
              </div>
            </div>
          ))}
        </div>
                      </div>
                    )}
                    
                    {/* Add Comment */}
                    <div className="p-3 bg-gray-750 border-t border-gray-700 flex items-center">
                      <input
                        type="text"
                        className="bg-gray-700 rounded-full px-4 py-2 flex-grow text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500"
                        placeholder="Write a comment..."
                        value={commentText[post._id] || ''}
                        onChange={(e) => setCommentText({...commentText, [post._id]: e.target.value})}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddComment(post._id, true)}
                      />
                      <button 
                        className="ml-2 p-2 rounded-full bg-cyan-600 hover:bg-cyan-700 transition-colors"
                        onClick={() => handleAddComment(post._id, true)}
                        disabled={!commentText[post._id]?.trim()}
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="flex h-[calc(100vh-150px)]">
            {/* Users List */}
            <div className="w-64 bg-gray-800 rounded-lg overflow-hidden mr-4 flex flex-col">
              <div className="p-3 bg-gray-700">
                <h3 className="font-medium">{isAdmin ? 'All Users' : `${university} Members`}</h3>
              </div>
              <div className="overflow-y-auto flex-grow">
                {(isAdmin ? allUsers : members).length === 0 ? (
                  <div className="p-4 text-center text-gray-400">
                    <Users className="h-8 w-8 mx-auto mb-2" />
                    <p>No users found</p>
                  </div>
                ) : (
                  <div>
                    {(isAdmin ? allUsers : members).map(user => (
                      <div 
                        key={user._id}
                        className={`p-3 flex items-center cursor-pointer hover:bg-gray-700 transition-colors ${
                          selectedUser && selectedUser._id === user._id ? 'bg-gray-700' : ''
                        }`}
                        onClick={() => setSelectedUser(user)}
                      >
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold mr-3">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{user.name}</p>
                          <p className="text-xs text-gray-400">{user.university || user.department}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-grow bg-gray-800 rounded-lg overflow-hidden flex flex-col">
              {selectedUser ? (
                <>
                  {/* Chat Header */}
                  <div className="p-3 bg-gray-700 flex items-center border-b border-gray-600">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold mr-3">
                      {selectedUser.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium">{selectedUser.name}</p>
                      <p className="text-xs text-gray-400">{selectedUser.department}</p>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-grow p-4 overflow-y-auto bg-gray-850">
                    {messages.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-gray-400">
                        <div className="text-center">
                          <MessageCircle className="h-12 w-12 mx-auto mb-3 text-gray-600" />
                          <p>No messages yet</p>
                          <p className="text-sm">Start the conversation!</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {messages.map((message, index) => {
                          const isSender = isCurrentUserSender(message);
                          const senderUniversity = message.university || (isSender ? university : selectedUser?.university);
                          const isDifferentUniversity = senderUniversity !== university && !isSender;
                          
                          return (
                            <div 
                              key={message._id || index} 
                              className={`flex mb-4 ${isSender ? 'justify-end' : 'justify-start'}`}
                            >
                              <div 
                                className={`max-w-[75%] break-words rounded-lg p-3 ${
                                  isSender 
                                    ? 'bg-cyan-600 text-white rounded-tr-none' 
                                    : 'bg-gray-700 text-white rounded-tl-none'
                                }`}
                              >
                                {isDifferentUniversity && (
                                  <div className="text-xs font-medium text-blue-300 mb-1 flex items-center">
                                    <Globe className="h-3 w-3 mr-1" />
                                    {senderUniversity}
                                  </div>
                                )}
                                
                                <div>
                                  {message.content}
                                </div>
                                
                                {message.attachment && (
                                  <div className="mt-2 p-2 bg-black/20 rounded-md">
                                    <a 
                                      href={message.attachment.fileUrl} 
                target="_blank"
                rel="noopener noreferrer"
                                      className="flex items-center text-blue-300 hover:text-blue-400 transition-colors"
                                      download
                                    >
                                      {getFileIcon(message.attachment.fileType)}
                                      <div className="ml-2 flex-1 min-w-0">
                                        <p className="text-sm truncate">{message.attachment.fileName}</p>
                                        <p className="text-xs text-gray-400">{formatFileSize(message.attachment.fileSize)}</p>
                                      </div>
                                      <Download className="h-4 w-4 ml-2 flex-shrink-0" />
                                    </a>
                                  </div>
                                )}
                                
                                <div className="text-xs opacity-70 text-right mt-1">
                                  {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        <div ref={messagesEndRef} />
                      </div>
                    )}
                  </div>

                  {/* Message Input */}
                  <div className="p-3 bg-gray-700 border-t border-gray-600">
                    {fileAttachment && (
                      <div className="mb-2 rounded bg-gray-750 p-2 flex items-center">
                        {getFileIcon(fileAttachment.fileType)}
                        <span className="ml-2 flex-grow truncate">{fileAttachment.fileName}</span>
                        <button
                          className="p-1 text-gray-400 hover:text-white"
                          onClick={handleClearAttachment}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                    <div className="flex items-center">
                      <input
                        type="text"
                        className="flex-grow bg-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      />
                      <label className="mx-2 p-2 rounded-full text-gray-300 hover:text-white hover:bg-gray-600 cursor-pointer">
                        <input
                          type="file"
                          ref={fileInputRef}
                          className="hidden"
                          onChange={handleFileAttachment}
                        />
                        <File className="h-5 w-5" />
                      </label>
                      <button
                        className="p-2 bg-cyan-600 rounded-full hover:bg-cyan-700 transition-colors"
                        onClick={handleSendMessage}
                        disabled={(!newMessage.trim() && !fileAttachment)}
                      >
                        <Send className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400 p-4 text-center">
                  <div>
                    <MessageCircle className="h-16 w-16 mx-auto mb-4 text-gray-600" />
                    <h3 className="text-xl font-medium mb-2">Select a user to start chatting</h3>
                    <p className="text-gray-500">
                      {isAdmin 
                        ? 'As an admin, you can chat with all users across universities' 
                        : `Chat with other members from ${university}`}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Community;
