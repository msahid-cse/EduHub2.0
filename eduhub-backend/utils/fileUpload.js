import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Get the directory name using the ESM approach
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Make sure upload directories exist
const uploadDir = path.join(__dirname, '../uploads');
const noticeUploadsDir = path.join(uploadDir, 'notices');

// Create directories if they don't exist
[uploadDir, noticeUploadsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

// Set storage configuration for notice PDFs
const noticeStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, noticeUploadsDir);
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `notice-${uniqueSuffix}${ext}`);
  }
});

// File filter for PDFs
const pdfFilter = (req, file, cb) => {
  // Accept only PDF files
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed!'), false);
  }
};

// Create multer upload instances
export const uploadNoticePDF = multer({
  storage: noticeStorage,
  fileFilter: pdfFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max file size
  }
});

// Error handler for multer
export const uploadErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // A Multer error occurred when uploading
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        message: 'File too large. Maximum size is 5MB.' 
      });
    }
    return res.status(400).json({ 
      message: `Upload error: ${err.message}` 
    });
  } else if (err) {
    // An unknown error occurred
    return res.status(400).json({ 
      message: err.message || 'File upload failed'
    });
  }
  
  // No error
  next();
}; 