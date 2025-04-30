import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
// import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ResourceLibrary from "./pages/ResourceLibrary";
import SkillDevelopment from "./pages/SkillDevelopment";
import CVBuilder from "./pages/CVBuilder";
import GrowthAnalysis from "./pages/GrowthAnalysis";
import PostNotice from "./pages/PostNotice";
import UploadCourse from "./pages/UploadCourse";
import PostJob from "./pages/PostJob";
import ViewNotices from "./pages/ViewNotices";
import ViewCourses from "./pages/ViewCourses";
import ViewJobs from "./pages/ViewJobs";
import JobDetails from "./pages/JobDetails";
import ProtectedRoute from "./components/ProtectedRoute";
// import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      {/* <Navbar /> */}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/jobs" element={<ViewJobs />} />
        <Route path="/job/:id" element={<JobDetails />} />
        {/* <Route path="/usrerdashboard" element={<UserDashboard />} /> */}
        {/* <Route path="/admindashboard" element={<AdminDashboard />} /> */}

        {/* Protected User Routes */}
        <Route path="/userdashboard" element={
          <ProtectedRoute requiredRole="user">
            <UserDashboard />
          </ProtectedRoute>
        } />
        <Route path="/resource-library" element={
          <ProtectedRoute requiredRole="user">
            <ResourceLibrary />
          </ProtectedRoute>
        } />
        <Route path="/skill-development" element={
          <ProtectedRoute requiredRole="user">
            <SkillDevelopment />
          </ProtectedRoute>
        } />
        <Route path="/cv-builder" element={
          <ProtectedRoute requiredRole="user">
            <CVBuilder />
          </ProtectedRoute>
        } />
        <Route path="/growth-analysis" element={
          <ProtectedRoute requiredRole="user">
            <GrowthAnalysis />
          </ProtectedRoute>
        } />
        <Route path="/view-notices" element={
          <ProtectedRoute>
            <ViewNotices />
          </ProtectedRoute>
        } />
        <Route path="/view-courses" element={
          <ProtectedRoute>
            <ViewCourses />
          </ProtectedRoute>
        } />
        
        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admindashboard" element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/post-notice" element={
          <ProtectedRoute requiredRole="admin">
            <PostNotice />
          </ProtectedRoute>
        } />
        <Route path="/upload-course" element={
          <ProtectedRoute requiredRole="admin">
            <UploadCourse />
          </ProtectedRoute>
        } />
        <Route path="/post-job" element={
          <ProtectedRoute requiredRole="admin">
            <PostJob />
          </ProtectedRoute>
        } />
        <Route path="/manage-jobs" element={
          <ProtectedRoute requiredRole="admin">
            <ViewJobs />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
