# EduHub 2.0

EduHub 2.0 is a comprehensive educational platform designed to provide students with tools for learning, skill development, and career advancement.

## Recent Updates

### API Client Refactoring
- Created a centralized API client using axios to standardize API calls across the application
- Added request/response interceptors for better error handling and token management
- Organized API calls into service objects for better code organization

### Growth Analysis Implementation
- Implemented a fully functional Growth Analysis page with learning analytics visualizations
- Added multiple chart types: line, bar, pie, and radar charts
- Created statistics cards for key metrics like study hours, course completion, etc.
- Added weekly goals tracking with progress bars

## Project Structure

### Frontend
- Built with React, Vite, and TailwindCSS
- Uses Chart.js for data visualization
- Responsive design for all devices

### Backend
- Node.js and Express server
- MongoDB database with Mongoose ODM
- JWT-based authentication
- Learning analytics tracking

## Features

- User authentication and profile management
- Course viewing and enrollment
- Learning progress tracking
- Personal growth analysis with visualizations
- Job listings and applications
- Notices and announcements
- Skills development tracking

## Future Plans

1. **Real-time Notifications**
   - Implement WebSocket-based notifications for course updates, new notices, etc.

2. **Enhanced Learning Analytics**
   - Add predictive analytics for course completion
   - Implement study pattern recognition

3. **Community Features**
   - Discussion forums for courses
   - Peer-to-peer learning opportunities

4. **Offline Access**
   - Implement service workers for offline access to course content
   - Add content caching for improved performance

## Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB

### Installation

#### Backend
```bash
   cd eduhub-backend
npm install
npm start
   ```

#### Frontend
```bash
cd eduhub-frontend
   npm install
   npm run dev
   ```

## Environment Variables
Create a .env file in the backend directory with the following:

   ```
MONGODB_URI=mongodb://localhost:27017/eduhub
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
   ```

## Team

This project is being developed as part of an Independent Design Project (IDP) course.

## Application Flow

1. Landing Page → Dashboard
2. Dashboard → Login/Register
3. Login/Register → UserDashboard/AdminDashboard (based on role)

## API Endpoints

### Auth Routes
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/me` - Get current user information

### User Routes
- `GET /api/users/dashboard` - Get user dashboard data
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/enrolled-courses` - Get user enrolled courses
- `GET /api/users/applied-jobs` - Get user applied jobs

### Admin Routes
- `GET /api/admin/dashboard` - Get admin dashboard data

### Course Routes
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course by ID
- `POST /api/courses` - Create a new course (admin only)
- `PUT /api/courses/:id` - Update a course (admin only)
- `DELETE /api/courses/:id` - Delete a course (admin only)
- `POST /api/courses/:id/enroll` - Enroll in a course

### Notice Routes
- `GET /api/notices` - Get all notices
- `GET /api/notices/:id` - Get notice by ID
- `POST /api/notices` - Create a new notice (admin only)
- `PUT /api/notices/:id` - Update a notice (admin only)
- `DELETE /api/notices/:id` - Delete a notice (admin only)
- `GET /api/notices/university/:university` - Get notices by university

### Job Routes
- `GET /api/jobs` - Get all jobs
- `GET /api/jobs/:id` - Get job by ID
- `POST /api/jobs` - Create a new job (admin only)
- `PUT /api/jobs/:id` - Update a job (admin only)
- `DELETE /api/jobs/:id` - Delete a job (admin only)
- `POST /api/jobs/:id/apply` - Apply for a job
- `GET /api/jobs/type/:type` - Get jobs by type



## License

This project is licensed under the MIT License.
 
