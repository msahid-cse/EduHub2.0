import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure uploads directories exist
const cvUploadDir = './uploads/cvs';
const profileUploadDir = './uploads/profiles';
const courseUploadDir = './uploads/courses';
const instructorDataDir = './uploads/instructors';
const courseVideosDir = './uploads/course-videos';
const courseMaterialsDir = './uploads/course-materials';
const csvImportsDir = './uploads/csv-imports';

// Create directories if they don't exist
[cvUploadDir, profileUploadDir, courseUploadDir, instructorDataDir, courseVideosDir, courseMaterialsDir, csvImportsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Event uploads directory
const eventUploadDir = './uploads/events';
if (!fs.existsSync(eventUploadDir)) {
  fs.mkdirSync(eventUploadDir, { recursive: true });
}

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

// Configure storage for instructor data files (Excel/CSV)
const instructorDataStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, instructorDataDir);
  },
  filename: (req, file, cb) => {
    // Create unique filename with timestamp and original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Configure storage for course videos
const courseVideoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, courseVideosDir);
  },
  filename: (req, file, cb) => {
    // Create unique filename with timestamp and original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Configure storage for course CSV imports
const csvImportStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, csvImportsDir);
  },
  filename: (req, file, cb) => {
    // Create unique filename with timestamp and original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Configure storage for event images
const eventImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, eventUploadDir);
  },
  filename: (req, file, cb) => {
    // Create unique filename with timestamp and original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Storage configuration for promotional videos
const promotionalVideoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const path = 'uploads/promotional-videos';
    fs.mkdirSync(path, { recursive: true });
    cb(null, path);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'promo-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
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

// File filter for instructor data uploads (Excel/CSV)
const instructorDataFilter = (req, file, cb) => {
  // Accept only Excel and CSV files
  const fileTypes = [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv'
  ];
  
  if (fileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only Excel and CSV files are allowed!'), false);
  }
};

// File filter for CSV/Excel imports
const csvFilter = (req, file, cb) => {
  // Accept only Excel and CSV files
  const fileTypes = [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv'
  ];
  
  if (fileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only Excel and CSV files are allowed!'), false);
  }
};

// File filter for video uploads
const videoFilter = (req, file, cb) => {
  // Accept only video files
  const videoTypes = [
    'video/mp4', 
    'video/mpeg', 
    'video/quicktime', 
    'video/x-msvideo', 
    'video/x-ms-wmv'
  ];
  
  if (videoTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only video files are allowed! Supported formats: MP4, MPEG, MOV, AVI, WMV'), false);
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

const instructorDataUpload = multer({
  storage: instructorDataStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max file size
  },
  fileFilter: instructorDataFilter
});

const courseVideoUpload = multer({
  storage: courseVideoStorage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB max file size for videos
  },
  fileFilter: videoFilter
});

const csvImportUpload = multer({
  storage: csvImportStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max file size
  },
  fileFilter: csvFilter
});

const eventImageUpload = multer({
  storage: eventImageStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max file size
  },
  fileFilter: imageFilter
});

// Export promotional video upload middleware
export const uploadPromotionalVideo = multer({
  storage: promotionalVideoStorage,
  limits: {
    fileSize: 200 * 1024 * 1024 // 200MB max file size for promotional videos
  },
  fileFilter: videoFilter
}).single('video');

// Export middlewares
export const uploadCV = cvUpload.single('cv');
export const uploadProfilePicture = profileUpload.single('profilePicture');
export const uploadCourseThumbnail = courseUpload.single('thumbnail');
export const uploadInstructorData = instructorDataUpload.single('instructorData');
export const uploadCourseVideo = courseVideoUpload.single('video');
export const uploadCSVFile = csvImportUpload.single('csvFile');
export const uploadEventImage = eventImageUpload.single('image');

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
      case 'instructorData':
        return instructorDataUpload.single('instructorData');
      case 'video':
        return courseVideoUpload.single('video');
      case 'csvFile':
        return csvImportUpload.single('csvFile');
      case 'promotionalVideo':
        return uploadPromotionalVideo;
      case 'image':
        return eventImageUpload.single('image');
      default:
        return cvUpload.single(fieldName);
    }
  }
};

export default {
  uploadCV,
  uploadProfilePicture,
  uploadCourseThumbnail,
  uploadInstructorData,
  uploadCourseVideo,
  uploadCSVFile,
  uploadPromotionalVideo,
  uploadEventImage,
  upload
}; 