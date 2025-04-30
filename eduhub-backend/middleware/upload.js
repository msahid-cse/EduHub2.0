import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure uploads directories exist
const cvUploadDir = './uploads/cvs';
const profileUploadDir = './uploads/profiles';
const courseUploadDir = './uploads/courses';

// Create directories if they don't exist
[cvUploadDir, profileUploadDir, courseUploadDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure storage for CVs
const cvStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, cvUploadDir);
  },
  filename: (req, file, cb) => {
    // Create unique filename with timestamp and original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Configure storage for profile pictures
const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, profileUploadDir);
  },
  filename: (req, file, cb) => {
    // Create unique filename with timestamp and original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Configure storage for course thumbnails
const courseStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, courseUploadDir);
  },
  filename: (req, file, cb) => {
    // Create unique filename with timestamp and original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter for CV uploads
const cvFilter = (req, file, cb) => {
  // Accept only PDF files
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed!'), false);
  }
};

// File filter for image uploads (profile pictures and course thumbnails)
const imageFilter = (req, file, cb) => {
  // Accept only image files
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Create upload middlewares
const cvUpload = multer({
  storage: cvStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max file size
  },
  fileFilter: cvFilter
});

const profileUpload = multer({
  storage: profileStorage,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB max file size
  },
  fileFilter: imageFilter
});

const courseUpload = multer({
  storage: courseStorage,
  limits: {
    fileSize: 3 * 1024 * 1024 // 3MB max file size
  },
  fileFilter: imageFilter
});

// Export middlewares
export const uploadCV = cvUpload.single('cv');
export const uploadProfilePicture = profileUpload.single('profilePicture');
export const uploadCourseThumbnail = courseUpload.single('thumbnail');

// Combined upload object for more flexibility
export const upload = {
  single: (fieldName) => {
    switch (fieldName) {
      case 'cv':
        return cvUpload.single('cv');
      case 'profilePicture':
        return profileUpload.single('profilePicture');
      case 'thumbnail':
        return courseUpload.single('thumbnail');
      default:
        return cvUpload.single(fieldName);
    }
  }
};

export default {
  uploadCV,
  uploadProfilePicture,
  uploadCourseThumbnail,
  upload
}; 