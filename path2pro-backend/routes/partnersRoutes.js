import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { auth, adminOnly } from '../middleware/auth.js';
import Partner from '../models/Partner.js';

const router = express.Router();

// Multer setup for logo uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads', 'partners');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'partner-' + uniqueSuffix + ext);
  }
});

const fileFilter = (req, file, cb) => {
  // Accept only image files
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter
});

// @route   GET /api/partners/universities
// @desc    Get all university partners
// @access  Public
router.get('/universities', async (req, res) => {
  try {
    const universityPartners = await Partner.find({ 
      type: 'university',
      isActive: true
    }).sort({ ranking: -1 });
    
    res.json(universityPartners);
  } catch (err) {
    console.error('Error fetching university partners:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/partners/industry
// @desc    Get all industry partners
// @access  Public
router.get('/industry', async (req, res) => {
  try {
    const industryPartners = await Partner.find({ 
      type: 'industry',
      isActive: true
    }).sort({ ranking: -1 });
    
    res.json(industryPartners);
  } catch (err) {
    console.error('Error fetching industry partners:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/partners/upload/logo
// @desc    Upload partner logo
// @access  Private/Admin
router.post('/upload/logo', auth, adminOnly, upload.single('logo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    // Return the path to the uploaded file
    const logoUrl = `/uploads/partners/${req.file.filename}`;
    res.json({ logoUrl });
  } catch (err) {
    console.error('Error uploading logo:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/partners
// @desc    Create new partner
// @access  Private/Admin
router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const newPartner = new Partner(req.body);
    await newPartner.save();
    
    res.status(201).json(newPartner);
  } catch (err) {
    console.error('Error creating partner:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/partners/:id
// @desc    Update partner
// @access  Private/Admin
router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid partner ID' });
    }
    
    const updatedPartner = await Partner.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    
    if (!updatedPartner) {
      return res.status(404).json({ message: 'Partner not found' });
    }
    
    res.json(updatedPartner);
  } catch (err) {
    console.error('Error updating partner:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/partners/:id
// @desc    Delete partner
// @access  Private/Admin
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid partner ID' });
    }
    
    const partner = await Partner.findById(id);
    
    if (!partner) {
      return res.status(404).json({ message: 'Partner not found' });
    }
    
    // Delete the logo file if it exists
    if (partner.logoUrl) {
      const logoPath = path.join(__dirname, '..', partner.logoUrl);
      if (fs.existsSync(logoPath)) {
        fs.unlinkSync(logoPath);
      }
    }
    
    await Partner.findByIdAndDelete(id);
    
    res.json({ message: 'Partner deleted successfully' });
  } catch (err) {
    console.error('Error deleting partner:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 