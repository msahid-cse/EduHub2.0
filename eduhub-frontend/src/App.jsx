import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
// import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import OAuthCallback from "./pages/OAuthCallback";
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
import CourseDetails from "./pages/CourseDetails";
import Community from "./pages/Community";
import ProtectedRoute from "./components/ProtectedRoute";
import AddNewCourse from "./pages/AddNewCourse";
import AddNewInstructor from "./pages/AddNewInstructor";
import ManageCommunity from "./pages/ManageCommunity";
import AddNewEvent from "./pages/AddNewEvent";
import ViewEvents from "./pages/ViewEvents";
import EventDetail from "./pages/EventDetail";
import EditEvent from "./pages/EditEvent";
import SendEventInvitations from "./pages/SendEventInvitations";
import JobSearchByCV from "./pages/JobSearchByCV";
import JobApplications from "./pages/JobApplications";
import UserApplications from "./pages/UserApplications";
import ViewAllApplications from "./pages/ViewAllApplications";
import TestConnection from "./TestConnection";
import Developers from './pages/Developers';
import PromotionalVideoManager from './pages/PromotionalVideoManager';
import PartnerManagement from './pages/PartnerManagement';


// import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      {/* <Navbar /> */}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/developers" element={<Developers />} />
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/oauth-callback" element={<OAuthCallback />} />
        <Route path="/jobs" element={<ViewJobs />} />
        <Route path="/job/:id" element={<JobDetails />} />
        <Route path="/course/:id" element={<CourseDetails />} />
        <Route path="/courses" element={<ViewCourses />} />
        <Route path="/events" element={<ViewEvents />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/test-connection" element={<TestConnection />} />
        <Route path="/edit-event/:id" element={
          <ProtectedRoute requiredRole="admin">
            <EditEvent />
          </ProtectedRoute>
        } />
        <Route path="/events/:id/send-invitations" element={
          <ProtectedRoute requiredRole="admin">
            <SendEventInvitations />
          </ProtectedRoute>
        } />
        {/* <Route path="/usrerdashboard" element={<UserDashboard />} /> */}
        {/* <Route path="/admindashboard" element={<AdminDashboard />} /> */}

        {/* Protected User Routes */}
        <Route path="/userdashboard" element={
          <ProtectedRoute requiredRole="user">
            <UserDashboard />
          </ProtectedRoute>
        } />
        <Route path="/job-search-by-cv" element={
          <ProtectedRoute requiredRole="user">
            <JobSearchByCV />
          </ProtectedRoute>
        } />
        <Route path="/applications" element={
          <ProtectedRoute requiredRole="user">
            <UserApplications />
          </ProtectedRoute>
        } />
        <Route path="/my-applications" element={
          <ProtectedRoute requiredRole="user">
            <UserApplications />
          </ProtectedRoute>
        } />
        <Route path="/community" element={
          <ProtectedRoute>
            <Community />
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
        <Route path="/view-applications" element={
          <ProtectedRoute requiredRole="admin">
            <ViewAllApplications />
          </ProtectedRoute>
        } />
        <Route path="/job-applications/:id" element={
          <ProtectedRoute requiredRole="admin">
            <JobApplications />
          </ProtectedRoute>
        } />
        <Route path="/manage-jobs" element={
          <ProtectedRoute requiredRole="admin">
            <ViewJobs />
          </ProtectedRoute>
        } />
        <Route path="/add-course" element={
          <ProtectedRoute requiredRole="admin">
            <AddNewCourse />
          </ProtectedRoute>
        } />
        <Route path="/add-event" element={
          <ProtectedRoute requiredRole="admin">
            <AddNewEvent />
          </ProtectedRoute>
        } />
        <Route path="/manage-instructors" element={
          <ProtectedRoute requiredRole="admin">
            <AddNewInstructor />
          </ProtectedRoute>
        } />
        <Route path="/manage-community" element={
          <ProtectedRoute requiredRole="admin">
            <ManageCommunity />
          </ProtectedRoute>
        } />
        <Route path="/events/:id/send-invitations" element={
          <ProtectedRoute requiredRole="admin">
            <SendEventInvitations />
          </ProtectedRoute>
        } />
        <Route path="/admin/promotional-video" element={
          <ProtectedRoute requiredRole="admin">
            <PromotionalVideoManager />
          </ProtectedRoute>
        } />
        <Route path="/promotional-video-manager" element={
          <ProtectedRoute requiredRole="admin">
            <PromotionalVideoManager />
          </ProtectedRoute>
        } />
        <Route path="/admin/partners" element={
          <ProtectedRoute requiredRole="admin">
            <PartnerManagement />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
