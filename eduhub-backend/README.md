# EduHub 2.0 Backend

## Course Management Features

### Course Creation
- Support for academic, professional, and co-curricular courses
- Department selection from predefined list (CSE, EEE, LAW, BBA, etc.)
- Multiple video source options:
  - Direct video upload (MP4, MPEG, MOV, AVI, WMV)
  - YouTube video URL
  - YouTube playlist URL
  - Google Drive video URL
  - Other direct video URLs
- Theory materials with multiple link support
- Course thumbnail that displays in course listings
- Tag and prerequisite management

### Batch Import
- CSV template download for batch course creation
- Support for importing multiple courses at once
- Handles tags and prerequisites with semicolon-separated values
- Async processing of uploaded files

## API Endpoints

### Course Endpoints
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course by ID
- `POST /api/courses` - Create a new course
- `PUT /api/courses/:id` - Update a course
- `DELETE /api/courses/:id` - Delete a course
- `POST /api/courses/:id/enroll` - Enroll in a course
- `GET /api/courses/department/:department` - Get courses by department
- `GET /api/courses/activity/:activityType` - Get courses by activity type
- `GET /api/courses/csv-template` - Get CSV template for batch import
- `POST /api/courses/batch-import` - Batch import courses from CSV/Excel
- `POST /api/courses/:id/materials` - Upload course materials

## Course Model Fields
- `title` - Course title
- `description` - Course description
- `instructor` - Course instructor name
- `content` - Course content/syllabus
- `duration` - Course duration
- `skillLevel` - Skill level (beginner, intermediate, advanced)
- `courseType` - Course type (academic, professional, co-curricular)
- `courseSegment` - Course segment (video, theory, hybrid)
- `videoUrl` - Direct video URL
- `youtubeVideoUrl` - YouTube video URL
- `youtubePlaylistUrl` - YouTube playlist URL
- `driveVideoUrl` - Google Drive video URL
- `theoryUrl` - Main theory resource URL
- `theoryLinks` - Additional theory links
- `department` - Academic department
- `activityType` - Co-curricular activity type
- `thumbnail` - Course thumbnail image
- `tags` - Course tags
- `prerequisites` - Course prerequisites 