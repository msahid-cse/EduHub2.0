# EduHub 2.0

EduHub is an educational platform that connects students, educators, and institutions, providing tools for skill development, resource sharing, and career growth.

## Project Structure

The project consists of two main parts:

- `eduhub-frontend`: A React application built with Vite and TailwindCSS
- `eduhub-backend`: A Node.js API built with Express and MongoDB

## Features

- User authentication (login/register)
- Role-based access control (admin/user)
- Course management
- Job postings and applications
- University notices
- Skill development resources
- CV builder
- Growth analysis

## Prerequisites

- Node.js (v16+)
- MongoDB (local or Atlas)
- Git

## Setup and Installation

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd eduhub-backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root of the backend directory with the following variables:
   ```
   PORT=5000
   MONGODB_URL=mongodb://localhost:27017/eduhub
   JWT_SECRET=your_jwt_secret_key_here
   ```

4. Start the backend server:
   ```
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd eduhub-frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the frontend development server:
   ```
   npm run dev
   ```

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

## Contributors

- Your Name

## License

This project is licensed under the MIT License.
 
