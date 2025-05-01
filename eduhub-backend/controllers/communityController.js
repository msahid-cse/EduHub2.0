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
    
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Only admins can post global posts
    if (isGlobal && user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can create global posts' });
    }

    const post = new Post({
      userId: req.user.userId,
      userName: user.name,
      university: user.university,
      isGlobal,
      content,
      media: media || ''
    });

    await post.save();
    res.status(201).json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Server error while creating post' });
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

    // Only admins can access all users
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized access' });
    }
    
    // Find all users except current user
    const users = await User.find({ 
      _id: { $ne: req.user.userId } 
    }).select('_id name profilePicture department university role');
    
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

    // Check if receiver is from the same university or sender is admin
    if (sender.university !== receiver.university && sender.role !== 'admin') {
      return res.status(403).json({ message: 'You can only message users from your university' });
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