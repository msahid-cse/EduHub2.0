import Post from '../models/Post.js';
import Message from '../models/Message.js';
import User from '../models/User.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get absolute path for uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '../uploads/attachments');

// Create uploads directory if it doesn't exist
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Get global posts
export const getGlobalPosts = async (req, res) => {
  try {
    const posts = await Post.find({ isGlobal: true }).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching global posts:', error);
    res.status(500).json({ message: 'Server error while fetching global posts' });
  }
};

// Get posts from user's university
export const getUniversityPosts = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const university = user.university;
    const posts = await Post.find({ university, isGlobal: false }).sort({ createdAt: -1 });
    
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching university posts:', error);
    res.status(500).json({ message: 'Server error while fetching posts' });
  }
};

// Create a new post
export const createPost = async (req, res) => {
  try {
    const { content, media, isGlobal = false } = req.body;
    
    console.log('Create post request:', { content, isGlobal, userId: req.user.userId });
    
    if (!content) {
      return res.status(400).json({ message: 'Content is required for a post' });
    }
    
    // Check if userId exists in the request
    if (!req.user || !req.user.userId) {
      console.error('No userId found in request:', req.user);
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const user = await User.findById(req.user.userId);
    if (!user) {
      console.error('User not found with ID:', req.user.userId);
      
      // For admin posts, create a default admin user object to prevent errors
      if (req.user.role === 'admin') {
        console.log('Creating admin post with default admin user');
        
        const post = new Post({
          userId: req.user.userId,
          userName: "Admin",
          university: "Admin",
          isGlobal: true,
          content,
          media: media || ''
        });
        
        const savedPost = await post.save();
        console.log('Admin post saved successfully:', { postId: savedPost._id });
        return res.status(201).json(savedPost);
      }
      
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User found:', { id: user._id, name: user.name, role: user.role });

    // Any user can post to the global community
    const postData = {
      userId: req.user.userId,
      userName: user.name,
      university: user.university || 'Global',
      isGlobal,
      content,
      media: media || ''
    };
    
    console.log('Creating post with data:', postData);
    const post = new Post(postData);

    const savedPost = await post.save();
    console.log('Post saved successfully:', { postId: savedPost._id });
    res.status(201).json(savedPost);
  } catch (error) {
    console.error('Error creating post:', error);
    // More detailed error response
    res.status(500).json({ 
      message: 'Server error while creating post',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Add a comment to a post
export const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if post belongs to user's university or is global
    if (!post.isGlobal && post.university !== user.university) {
      return res.status(403).json({ message: 'You can only comment on posts from your university or global posts' });
    }

    const comment = {
      userId: req.user.userId,
      userName: user.name,
      content
    };

    post.comments.push(comment);
    await post.save();

    res.status(201).json(post);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Server error while adding comment' });
  }
};

// Like a post
export const likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if post belongs to user's university or is global
    if (!post.isGlobal && post.university !== user.university) {
      return res.status(403).json({ message: 'You can only like posts from your university or global posts' });
    }

    // Check if user already liked the post
    if (post.likes.includes(req.user.userId)) {
      // Unlike the post
      post.likes = post.likes.filter(userId => userId.toString() !== req.user.userId);
    } else {
      // Like the post
      post.likes.push(req.user.userId);
    }

    await post.save();
    res.status(200).json(post);
  } catch (error) {
    console.error('Error liking post:', error);
    res.status(500).json({ message: 'Server error while liking post' });
  }
};

// Get all users for admin
export const getAllUsers = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if this is the admin route
    const isAdminRoute = req.originalUrl.includes('/admin/users');
    
    // If using standard route with middleware, the role check is already done
    // If using the alternative route, we need to check the role here
    if (!isAdminRoute && user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized access' });
    }
    
    // For alternative route, verify user is admin
    if (isAdminRoute && user.role !== 'admin') {
      console.log('Non-admin user attempted to access admin users list:', { userId: user._id, role: user.role });
      // For alternative route, return global members instead of error for non-admins
      const members = await User.find({ 
        _id: { $ne: req.user.userId }
      }).select('_id name profilePicture department university');
      
      return res.status(200).json(members);
    }
    
    // Find all users except current user (with admin-specific fields)
    // For admins, we want to get ALL users from ALL universities
    const users = await User.find({ 
      _id: { $ne: req.user.userId } 
    }).select('_id name profilePicture department university role');
    
    console.log(`Admin ${user.name} requested all users list, returning ${users.length} users`);
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching all users:', error);
    res.status(500).json({ message: 'Server error while fetching users' });
  }
};

// Get university members for chat
export const getUniversityMembers = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const university = user.university;
    
    // Find all users from the same university
    const members = await User.find({ 
      university,
      _id: { $ne: req.user.userId } // Exclude current user
    }).select('_id name profilePicture department');
    
    res.status(200).json(members);
  } catch (error) {
    console.error('Error fetching university members:', error);
    res.status(500).json({ message: 'Server error while fetching university members' });
  }
};

// Send a message with optional file attachment
export const sendMessage = async (req, res) => {
  try {
    const { receiverId, content, attachment } = req.body;
    
    const sender = await User.findById(req.user.userId);
    if (!sender) {
      return res.status(404).json({ message: 'Sender not found' });
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: 'Receiver not found' });
    }

    // Allow global communication - users can message anyone
    // If both users are from the same university or the sender is admin, the message is allowed
    // Admin can message anyone from any university
    const isGlobalCommunication = req.query.global === 'true' || req.body.global === true;
    
    if (sender.university !== receiver.university && sender.role !== 'admin' && !isGlobalCommunication) {
      return res.status(403).json({ 
        message: 'You can only message users from your university or global community',
        globalRequired: true
      });
    }

    const message = new Message({
      sender: req.user.userId,
      receiver: receiverId,
      senderName: sender.name,
      university: sender.university,
      content,
      attachment: attachment || null
    });

    await message.save();
    res.status(201).json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Server error while sending message' });
  }
};

// Get conversation with another user
export const getConversation = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const otherUser = await User.findById(userId);
    if (!otherUser) {
      return res.status(404).json({ message: 'Other user not found' });
    }

    // Check if users are from the same university or user is admin
    // Admin can chat with anyone from any university
    if (user.university !== otherUser.university && user.role !== 'admin') {
      return res.status(403).json({ message: 'You can only view conversations with users from your university' });
    }

    // Get messages between the two users
    const messages = await Message.find({
      $or: [
        { sender: req.user.userId, receiver: userId },
        { sender: userId, receiver: req.user.userId }
      ]
    }).sort({ createdAt: 1 });

    // Mark messages as read
    await Message.updateMany(
      { sender: userId, receiver: req.user.userId, isRead: false },
      { $set: { isRead: true } }
    );

    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching conversation:', error);
    res.status(500).json({ message: 'Server error while fetching conversation' });
  }
};

// Get unread message count
export const getUnreadCount = async (req, res) => {
  try {
    const count = await Message.countDocuments({
      receiver: req.user.userId,
      isRead: false
    });

    res.status(200).json({ count });
  } catch (error) {
    console.error('Error counting unread messages:', error);
    res.status(500).json({ message: 'Server error while counting unread messages' });
  }
};

// Upload file attachment
export const uploadAttachment = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileName = req.file.filename;
    const fileType = req.file.mimetype;
    const fileSize = req.file.size;
    const fileUrl = `/uploads/attachments/${fileName}`;

    res.status(200).json({ 
      fileName, 
      fileType, 
      fileSize, 
      fileUrl 
    });
  } catch (error) {
    console.error('Error uploading attachment:', error);
    res.status(500).json({ message: 'Server error while uploading attachment' });
  }
};

// Get all users for global community
export const getGlobalCommunityMembers = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Find all users except current user, regardless of university
    const members = await User.find({ 
      _id: { $ne: req.user.userId }
    }).select('_id name profilePicture department university');
    
    res.status(200).json(members);
  } catch (error) {
    console.error('Error fetching global community members:', error);
    res.status(500).json({ message: 'Server error while fetching global community members' });
  }
};

// Check if user has admin access
export const checkAdminStatus = async (req, res) => {
  try {
    // Short-circuit if the token already has an admin role
    if (req.user && req.user.role === 'admin') {
      return res.status(200).json({ 
        isAdmin: true,
        role: 'admin',
        userId: req.user.userId,
        name: req.user.name || 'Admin',
        tokenData: req.user
      });
    }
    
    // Otherwise check the database
    const user = await User.findById(req.user.userId);
    if (!user) {
      console.error('Check admin status: User not found with ID:', req.user.userId);
      return res.status(200).json({ 
        isAdmin: false,
        error: 'User not found',
        userId: req.user.userId
      });
    }
    
    const isAdmin = user.role === 'admin';
    
    res.status(200).json({ 
      isAdmin,
      role: user.role,
      userId: user._id,
      name: user.name,
      university: user.university
    });
  } catch (error) {
    console.error('Error checking admin status:', error);
    res.status(500).json({ message: 'Server error while checking admin status' });
  }
}; 