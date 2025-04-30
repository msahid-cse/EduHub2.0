// import { Link } from "react-router-dom";

// function AdminDashboard() {
//   return (
//     <div className="p-6">
//       <h1 className="text-3xl font-bold mb-8">Welcome, Admin 🎓</h1>

//       {/* Statistics */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
//         <div className="bg-blue-500 text-white p-6 rounded-lg shadow hover:scale-105 transition-transform">
//           <h2 className="text-xl font-semibold">Total Notices</h2>
//           <p className="text-4xl mt-3">12</p> {/* TODO: Fetch real count */}
//         </div>
//         <div className="bg-green-500 text-white p-6 rounded-lg shadow hover:scale-105 transition-transform">
//           <h2 className="text-xl font-semibold">Total Courses</h2>
//           <p className="text-4xl mt-3">8</p> {/* TODO: Fetch real count */}
//         </div>
//         <div className="bg-purple-500 text-white p-6 rounded-lg shadow hover:scale-105 transition-transform">
//           <h2 className="text-xl font-semibold">Total Jobs</h2>
//           <p className="text-4xl mt-3">5</p> {/* TODO: Fetch real count */}
//         </div>
//       </div>

//       {/* Quick Actions */}
//       <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <Link
//           to="/post-notice"
//           className="block bg-yellow-400 hover:bg-yellow-500 text-white text-center py-6 rounded-lg shadow-lg text-xl font-semibold transition-all"
//         >
//           📜 Post a New Notice
//         </Link>
//         <Link
//           to="/upload-course"
//           className="block bg-indigo-500 hover:bg-indigo-600 text-white text-center py-6 rounded-lg shadow-lg text-xl font-semibold transition-all"
//         >
//           🎯 Upload a New Course
//         </Link>
//         <Link
//           to="/post-job"
//           className="block bg-pink-500 hover:bg-pink-600 text-white text-center py-6 rounded-lg shadow-lg text-xl font-semibold transition-all"
//         >
//           💼 Post a New Job
//         </Link>
//       </div>
//     </div>
//   );
// }

// export default AdminDashboard;

import React from 'react';
// Assuming you have icon libraries set up, e.g., react-icons
// import { FaUsers, FaCalendarAlt, FaCog } from 'react-icons/fa'; // Example icons

// Assuming Tailwind CSS is set up in your React project.

const AdminDashboard = () => {
  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen p-6">
      {/* Header/Navbar (Placeholder) */}
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-cyan-400">Edu Hub Admin Dashboard</h1>
        {/* Admin Info / Settings Link (Placeholder) */}
        <div className="flex items-center">
          <span className="mr-3 text-gray-300">Welcome, Admin!</span>
           {/* Settings Icon (Placeholder) */}
           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 cursor-pointer hover:text-cyan-400 transition duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        </div>
      </header>

      {/* Dashboard Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Event Activity Section */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
          <h3 className="text-xl font-semibold text-gray-200 mb-4">Event Activity</h3>
          {/* Placeholder for recent system events or user activities */}
          <ul className="space-y-3 text-gray-400 text-sm">
            <li>User 'john.doe' registered an account.</li>
            <li>New course "Data Science Fundamentals" added.</li>
            <li>Admin 'admin_user' updated user roles.</li>
            <li>System backup completed successfully.</li>
          </ul>
        </div>

        {/* User Management Quick Links (Placeholder) */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
          <h3 className="text-xl font-semibold text-gray-200 mb-4">Management</h3>
          {/* Placeholder for links to manage users, courses, etc. */}
          <div className="grid grid-cols-1 gap-4">
            <button className="bg-gray-700 text-gray-300 py-3 px-4 rounded-md text-sm hover:bg-gray-600 transition duration-200">
               {/* <FaUsers className="inline-block mr-2" /> */}
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.146M21 21v-7a6 6 0 00-9-5.146" />
                </svg>
              Manage Users
            </button>
             <button className="bg-gray-700 text-gray-300 py-3 px-4 rounded-md text-sm hover:bg-gray-600 transition duration-200">
              {/* <FaCalendarAlt className="inline-block mr-2" /> */}
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              Manage Courses
            </button>
             <button className="bg-gray-700 text-gray-300 py-3 px-4 rounded-md text-sm hover:bg-gray-600 transition duration-200">
              {/* <FaCog className="inline-block mr-2" /> */}
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              System Settings
            </button>
          </div>
        </div>

        {/* More admin-specific sections can be added */}
        {/* For example: Analytics, Reporting, Content Approval, etc. */}

      </div>
    </div>
  );
};

export default AdminDashboard;
