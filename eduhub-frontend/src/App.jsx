// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Dashboard from "./pages/Dashboard";
// import PostNotice from "./pages/PostNotice";
// import UploadCourse from "./pages/UploadCourse";
// import PostJob from "./pages/PostJob";
// import ViewNotices from "./pages/ViewNotices";
// import ViewCourses from "./pages/ViewCourses";
// import ViewJobs from "./pages/ViewJobs";
// import ProtectedRoute from "./components/ProtectedRoute";
// import UserDashboard from "./pages/UserDashboard";
// import AdminDashboard from "./pages/AdminDashboard";

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* Public Routes */}
//         <Route path="/" element={<Login />} />
//         <Route path="/register" element={<Register />} />

//         {/* Protected Routes */}
//         <Route path="/dashboard" element={
//           <ProtectedRoute>
//             <Dashboard />
//           </ProtectedRoute>
//         } />
//         <Route path="/post-notice" element={
//           <ProtectedRoute>
//             <PostNotice />
//           </ProtectedRoute>
//         } />
//         <Route path="/upload-course" element={
//           <ProtectedRoute>
//             <UploadCourse />
//           </ProtectedRoute>
//         } />
//         <Route path="/post-job" element={
//           <ProtectedRoute>
//             <PostJob />
//           </ProtectedRoute>
//         } />
//         <Route path="/view-notices" element={
//           <ProtectedRoute>
//             <ViewNotices />
//           </ProtectedRoute>
//         } />
//         <Route path="/view-courses" element={
//           <ProtectedRoute>
//             <ViewCourses />
//           </ProtectedRoute>
//         } />
//         <Route path="/userdashboard" element={
//           <ProtectedRoute>
//             <UserDashboard />
//           </ProtectedRoute>
//         } />
//           <Route path="/admindashboard" element={
//           <ProtectedRoute>
//             <AdminDashboard />
//           </ProtectedRoute>
//         } />
//         <Route path="/view-jobs" element={
//           <ProtectedRoute>
//             <ViewJobs />
//           </ProtectedRoute>
//         } />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";

import Userdashboard from "./pages/UserDashboard";
import Admindashboard from "./pages/AdminDashboard";
import ResourceLibrary from "./pages/ResourceLibrary";
import PostNotice from "./pages/PostNotice";
import UploadCourse from "./pages/UploadCourse";
import PostJob from "./pages/PostJob";
import ViewNotices from "./pages/ViewNotices";
import ViewCourses from "./pages/ViewCourses";
import ViewJobs from "./pages/ViewJobs";
import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./components/Sidebar"; // Your Sidebar
import SkillDevelopment from "./pages/SkillDevelopment"; // Your Skill Development page
import CVBuilder from "./pages/CVBuilder"; // Your CV Builder page
import GrowthAnalysis from "./pages/GrowthAnalysis"; // Your Growth Analysis page
import EduHubWebsite from "./pages/EduHubWebsite"

import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import Topbar from "./components/Topbar";  // Your Top Navbar

function App() {
  return (
    <BrowserRouter>
      <Navbar />
 

      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<Landing />} />

        {/* Public Login and Register */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboard -- TEMPORARILY NOT Protected */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/userdashboard" element={<Userdashboard />} />
        <Route path="/admindashboard" element={<Admindashboard />} />
        <Route path="/resource-library" element={<ResourceLibrary />} />
        <Route path="/skill-development" element={<SkillDevelopment />} />
        <Route path="/cv-builder" element={<CVBuilder />} />
        <Route path="/growth-analysis" element={<GrowthAnalysis />} />
        <Route path="/post-notice" element={<PostNotice />} />
        <Route path="/upload-course" element={<UploadCourse />} />
        <Route path="/post-job" element={<PostJob />} />
        <Route path="/view-notices" element={<ViewNotices />} />
        <Route path="/view-courses" element={<ViewCourses />} />
        <Route path="/view-jobs" element={<ViewJobs />} />
        <Route path="/EduHubWebsite" element={<EduHubWebsite />} />
 

        


        {/* Protected Routes */}
        {/* <Route path="/dashboard" element={<ProtectedRoute component={Dashboard} />} /> */}
        {/* <Route path="/userdashboard" element={<ProtectedRoute component={Userdashboard} />} /> */}
        {/* <Route path="/admindashboard" element={<ProtectedRoute component={Admindashboard} />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
