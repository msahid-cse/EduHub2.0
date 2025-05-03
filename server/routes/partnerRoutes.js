const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Partner = require('../models/Partner');
const { authenticateToken, isAdmin } = require('../middleware/auth');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/logos');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'logo-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

// GET all partners (public route)
router.get('/', async (req, res) => {
  try {
    const partners = await Partner.find().sort({ ranking: -1, name: 1 });
    res.json(partners);
  } catch (err) {
    console.error('Error fetching partners:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET all universities
router.get('/universities', async (req, res) => {
  try {
    const universities = await Partner.find({ type: 'university', isActive: true }).sort({ ranking: -1, name: 1 });
    res.json(universities);
  } catch (err) {
    console.error('Error fetching universities:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET all industry partners
router.get('/industry', async (req, res) => {
  try {
    const industryPartners = await Partner.find({ type: 'industry', isActive: true }).sort({ ranking: -1, name: 1 });
    res.json(industryPartners);
  } catch (err) {
    console.error('Error fetching industry partners:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET single partner by ID
router.get('/:id', async (req, res) => {
  try {
    const partner = await Partner.findById(req.params.id);
    
    if (!partner) {
      return res.status(404).json({ message: 'Partner not found' });
    }
    
    res.json(partner);
  } catch (err) {
    console.error('Error fetching partner:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST create new partner (admin only)
router.post('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { name, type, websiteUrl, logoUrl, description } = req.body;
    
    // Basic validation
    if (!name || !type || !websiteUrl) {
      return res.status(400).json({ message: 'Name, type, and website URL are required fields' });
    }
    
    // Create new partner
    const partner = new Partner({
      name,
      type,
      websiteUrl,
      logoUrl: logoUrl || '',
      description: description || ''
    });
    
    await partner.save();
    
    res.status(201).json(partner);
  } catch (err) {
    console.error('Error creating partner:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT update partner (admin only)
router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { name, type, websiteUrl, logoUrl, description, isActive, ranking } = req.body;
    
    // Find partner
    const partner = await Partner.findById(req.params.id);
    
    if (!partner) {
      return res.status(404).json({ message: 'Partner not found' });
    }
    
    // Update fields
    if (name) partner.name = name;
    if (type) partner.type = type;
    if (websiteUrl) partner.websiteUrl = websiteUrl;
    if (logoUrl !== undefined) partner.logoUrl = logoUrl;
    if (description !== undefined) partner.description = description;
    if (isActive !== undefined) partner.isActive = isActive;
    if (ranking !== undefined) partner.ranking = ranking;
    
    // Save changes
    await partner.save();
    
    res.json(partner);
  } catch (err) {
    console.error('Error updating partner:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE partner (admin only)
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const partner = await Partner.findById(req.params.id);
    
    if (!partner) {
      return res.status(404).json({ message: 'Partner not found' });
    }
    
    await Partner.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Partner deleted successfully' });
  } catch (err) {
    console.error('Error deleting partner:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST upload logo (admin only)
router.post('/upload/logo', authenticateToken, isAdmin, upload.single('logo'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    // Generate URL for the uploaded file
    const logoUrl = `/uploads/logos/${req.file.filename}`;
    
    res.json({
      message: 'Logo uploaded successfully',
      logoUrl
    });
  } catch (err) {
    console.error('Error uploading logo:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 