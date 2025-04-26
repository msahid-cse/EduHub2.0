import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import PostNotice from "./pages/PostNotice";
import UploadCourse from "./pages/UploadCourse";
import PostJob from "./pages/PostJob";
import ViewNotices from "./pages/ViewNotices";
import ViewCourses from "./pages/ViewCourses";
import ViewJobs from "./pages/ViewJobs";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/post-notice" element={
          <ProtectedRoute>
            <PostNotice />
          </ProtectedRoute>
        } />
        <Route path="/upload-course" element={
          <ProtectedRoute>
            <UploadCourse />
          </ProtectedRoute>
        } />
        <Route path="/post-job" element={
          <ProtectedRoute>
            <PostJob />
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
        <Route path="/view-jobs" element={
          <ProtectedRoute>
            <ViewJobs />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
