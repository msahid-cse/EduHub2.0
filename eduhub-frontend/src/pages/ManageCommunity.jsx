import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Users, Search, Filter, Send, Image as ImageIcon, ArrowLeft, Upload, Trash, Heart, MessageCircle, AlertTriangle, Info, User } from 'lucide-react';
import { communityAPI } from '../api/apiClient';

const ManageCommunity = () => {
  const navigate = useNavigate();
  
  // State for global posts
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [error, setError] = useState('');
  const [newPostText, setNewPostText] = useState('');
  const [postImage, setPostImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  // Filtering and pagination
  const [filter, setFilter] = useState('all'); // 'all', 'announcements', 'discussions'
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Post deletion
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchPosts();
  }, [filter, currentPage]);

  const fetchPosts = async () => {
    try {
      setLoadingPosts(true);
      
      let endpoint = '/community/posts';
      const params = {
        page: currentPage,
        limit: 10
      };
      
      if (filter === 'announcements') {
        params.type = 'announcement';
      } else if (filter === 'discussions') {
        params.type = 'discussion';
      }
      
      const response = await communityAPI.get(endpoint, { params });
      
      // Handle search filtering client-side if needed
      let filteredPosts = response.data.posts || [];
      
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        filteredPosts = filteredPosts.filter(post => 
          post.content.toLowerCase().includes(query) || 
          (post.user && post.user.name && post.user.name.toLowerCase().includes(query))
        );
      }
      
      setPosts(filteredPosts);
      setTotalPages(response.data.pagination?.pages || 1);
      setError('');
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load community posts. Please try again.');
      setPosts([]);
    } finally {
      setLoadingPosts(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPostImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    
    if (!newPostText.trim()) {
      setError('Please enter some content for your post');
      return;
    }
    
    try {
      setUploading(true);
      
      let imageUrl = '';
      
      // Upload image if selected
      if (postImage) {
        const formData = new FormData();
        formData.append('image', postImage);
        
        try {
          const uploadResponse = await communityAPI.post('/upload/community-image', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          
          imageUrl = uploadResponse.data.imageUrl;
        } catch (imageError) {
          console.error('Error uploading image:', imageError);
          setError('Failed to upload image. Your post will be created without the image.');
          // Continue without image
        }
      }
      
      // Create the post
      const postData = {
        content: newPostText,
        type: 'announcement', // Admins create announcements
        imageUrl
      };
      
      const response = await communityAPI.post('/community/posts', postData);
      
      // Add the new post to the list
      setPosts([response.data, ...posts]);
      
      // Reset form
      setNewPostText('');
      setPostImage(null);
      setImagePreview(null);
      setError('');
      
      // Fetch the updated list of posts
      fetchPosts();
    } catch (err) {
      console.error('Error creating post:', err);
      setError('Failed to create post. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      setDeleting(true);
      
      await communityAPI.delete(`/community/posts/${postId}`);
      
      // Remove the deleted post from the list
      setPosts(posts.filter(post => post._id !== postId));
      
      setConfirmDelete(null);
    } catch (err) {
      console.error('Error deleting post:', err);
      setError('Failed to delete post. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleString(undefined, options);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold flex items-center">
              <Users className="mr-2" size={24} />
              Manage Community
            </h1>
            <button
              onClick={() => navigate('/admin-dashboard')}
              className="px-3 py-1.5 bg-purple-700/40 hover:bg-purple-700/60 rounded-md text-sm transition-colors flex items-center"
            >
              <ArrowLeft size={16} className="mr-1" />
              Back to Dashboard
            </button>
          </div>
          
          {error && (
            <div className="bg-red-900/30 border border-red-500 text-red-300 p-4 mb-6 rounded-md flex items-start">
              <AlertTriangle className="mr-2 mt-0.5 text-red-400 shrink-0" size={18} />
              <span>{error}</span>
            </div>
          )}
          
          {/* Create New Announcement */}
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Create Global Announcement</h2>
            <form onSubmit={handleCreatePost}>
              <textarea
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value)}
                placeholder="Share an important announcement with the community..."
                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-4 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 min-h-[120px] mb-4"
                required
              ></textarea>
              
              {imagePreview && (
                <div className="relative mb-4">
                  <img 
                    src={imagePreview} 
                    alt="Post image preview" 
                    className="max-h-60 rounded-lg object-contain bg-gray-700 p-2"
                  />
                  <button
                    type="button"
                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 rounded-full p-1 text-white"
                    onClick={() => {
                      setPostImage(null);
                      setImagePreview(null);
                    }}
                  >
                    <Trash size={16} />
                  </button>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="flex items-center text-gray-300 hover:text-white"
                >
                  <ImageIcon size={20} className="mr-2" />
                  Add Image
                </button>
                
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                
                <button
                  type="submit"
                  disabled={uploading}
                  className={`bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-md flex items-center ${
                    uploading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {uploading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Posting...
                    </>
                  ) : (
                    <>
                      <Send size={18} className="mr-2" />
                      Post Announcement
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
          
          {/* Filter Posts */}
          <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-purple-500"
              />
              {searchQuery && (
                <button 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  onClick={() => setSearchQuery('')}
                >
                  <X size={16} />
                </button>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter size={16} className="text-gray-400" />
              <select
                value={filter}
                onChange={(e) => {
                  setFilter(e.target.value);
                  setCurrentPage(1); // Reset to first page when filter changes
                }}
                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
              >
                <option value="all">All Posts</option>
                <option value="announcements">Announcements Only</option>
                <option value="discussions">Discussions Only</option>
              </select>
              
              <button
                onClick={() => {
                  fetchPosts();
                  if (searchQuery) setSearchQuery('');
                }}
                className="bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg text-sm"
              >
                Refresh
              </button>
            </div>
          </div>
          
          {/* Posts List */}
          {loadingPosts ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : posts.length === 0 ? (
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-center">
              <MessageSquare size={48} className="mx-auto text-gray-600 mb-4" />
              <h3 className="text-xl font-medium text-gray-300 mb-2">No posts found</h3>
              <p className="text-gray-400">
                {searchQuery 
                  ? 'No posts match your search criteria' 
                  : filter !== 'all' 
                    ? `No ${filter} found` 
                    : 'No community posts yet'}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <div key={post._id} className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-700 rounded-full overflow-hidden flex-shrink-0">
                          {post.user?.profilePicture ? (
                            <img 
                              src={post.user.profilePicture} 
                              alt={post.user.name} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="text-gray-500 w-full h-full p-2" />
                          )}
                        </div>
                        <div className="ml-3">
                          <div className="flex items-center">
                            <span className="font-medium text-white">{post.user?.name || 'Anonymous'}</span>
                            {post.type === 'announcement' && (
                              <span className="ml-2 px-2 py-0.5 bg-purple-900/50 text-purple-300 text-xs rounded-full">
                                Announcement
                              </span>
                            )}
                          </div>
                          <span className="text-gray-400 text-sm">{formatDate(post.createdAt)}</span>
                        </div>
                      </div>
                      
                      <div>
                        <button
                          onClick={() => setConfirmDelete(post._id)}
                          className="text-gray-400 hover:text-red-400 p-1"
                        >
                          <Trash size={18} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-gray-300 whitespace-pre-wrap">{post.content}</p>
                    </div>
                    
                    {post.imageUrl && (
                      <div className="mb-4">
                        <img 
                          src={post.imageUrl} 
                          alt="Post attachment" 
                          className="max-h-96 rounded-lg object-contain bg-gray-700/50 mx-auto"
                        />
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center text-gray-400">
                          <Heart size={18} className="mr-1" />
                          <span>{post.likes?.length || 0}</span>
                        </div>
                        <div className="flex items-center text-gray-400">
                          <MessageCircle size={18} className="mr-1" />
                          <span>{post.comments?.length || 0}</span>
                        </div>
                      </div>
                    </div>
                    
                    {confirmDelete === post._id && (
                      <div className="mt-4 p-3 bg-red-900/30 border border-red-700 rounded-md">
                        <p className="text-sm text-red-300 mb-2">Are you sure you want to delete this post?</p>
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => setConfirmDelete(null)}
                            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-xs rounded-md"
                            disabled={deleting}
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleDeletePost(post._id)}
                            className="px-3 py-1 bg-red-700 hover:bg-red-800 text-white text-xs rounded-md flex items-center"
                            disabled={deleting}
                          >
                            {deleting ? (
                              <>
                                <div className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full mr-1"></div>
                                Deleting...
                              </>
                            ) : (
                              'Delete'
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === 1
                      ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-700 hover:bg-gray-600 text-white'
                  }`}
                >
                  Previous
                </button>
                
                {[...Array(totalPages)].map((_, index) => {
                  const pageNumber = index + 1;
                  
                  // Only show a certain number of page buttons
                  if (
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => setCurrentPage(pageNumber)}
                        className={`px-3 py-1 rounded-md ${
                          currentPage === pageNumber
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-700 hover:bg-gray-600 text-white'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  }
                  
                  // Show dots for skipped pages
                  if (pageNumber === currentPage - 2 || pageNumber === currentPage + 2) {
                    return (
                      <span
                        key={pageNumber}
                        className="px-3 py-1 text-gray-500"
                      >
                        ...
                      </span>
                    );
                  }
                  
                  return null;
                })}
                
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === totalPages
                      ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-700 hover:bg-gray-600 text-white'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageCommunity; 