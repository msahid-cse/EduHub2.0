

// import Sidebar from "../components/Sidebar";
// import Topbar from "../components/Topbar";
// import { useEffect, useState } from "react";

// function UserDashboard() {
//   const [username, setUsername] = useState("");

//   useEffect(() => {
//     // Dummy: fetch username from localStorage if saved during login (optional)
//     setUsername(localStorage.getItem("username") || "User");
//   }, []);

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       {/* Sidebar */}
//       <Sidebar />

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col">
//         {/* Top Navbar */}
//         {/* <Topbar /> */}

//         {/* Dashboard Content */}
//         <div className="p-8 grid grid-cols-1  md:grid-cols-2 gap-6">
//           {/* Welcome Box */}
//           <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
//             <h2 className="text-2xl font-bold mb-4">Welcome, {username} 🎉</h2>
//             <p className="text-gray-700">
//               Explore your courses, skills, resources, jobs, and grow your career!
//             </p>
//           </div>

//           {/* University Notices */}
//           <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
//             <h2 className="text-xl font-bold mb-4">📢 University Notices</h2>
//             <p className="text-gray-600">No new notices yet. Stay tuned!</p>
//           </div>

//           {/* Teachers Info */}
//           <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
//             <h2 className="text-xl font-bold mb-4">👩‍🏫 Teachers Info</h2>
//             <p className="text-gray-600">No teacher information available yet.</p>
//           </div>

//           {/* Skill Development Center */}
//           <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
//             <h2 className="text-xl font-bold mb-4">🎯 Skill Development Center</h2>
//             <p className="text-gray-600">Courses and workshops for your skills will be shown here.</p>
//           </div>

//           {/* Resource Library */}
//           <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
//             <h2 className="text-xl font-bold mb-4">📚 Resource Library</h2>
//             <p className="text-gray-600">Course materials, handnotes, videos available soon.</p>
//           </div>

//           {/* Personal Growth */}
//           <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
//             <h2 className="text-xl font-bold mb-4">📈 Personal Growth Analysis</h2>
//             <p className="text-gray-600">Track your academic and skill development journey here!</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default UserDashboard;

import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";

function UserDashboard() {
  const [username, setUsername] = useState("");
  const [page, setPage] = useState("home"); // 👈 Track which page to show

  useEffect(() => {
    setUsername(localStorage.getItem("username") || "User");
  }, []);

  const renderPage = () => {
    switch (page) {
      case "home":
        return (
          <div className="bg-white p-8 rounded-lg shadow hover:shadow-lg transition">
            <h2 className="text-3xl font-bold mb-4">Welcome, {username} 🎉</h2>
            <p className="text-gray-700 text-lg">
              Explore your courses, skills, resources, jobs, and grow your career!
            </p>
          </div>
        );
      case "skill":
        return (
          <div className="bg-white p-8 rounded-lg shadow hover:shadow-lg transition">
            <h2 className="text-2xl font-bold mb-4">🎯 Skill Development Center</h2>
            <p className="text-gray-600">Free and Paid courses will be shown here.</p>
          </div>
        );
      case "library":
        return (
          <div className="bg-white p-8 rounded-lg shadow hover:shadow-lg transition">
            <h2 className="text-2xl font-bold mb-4">📚 University Resource Library</h2>
            <p className="text-gray-600">YouTube tutorials, Books, Handnotes will be available here.</p>
          </div>
        );
      case "cvbuilder":
        return (
          <div className="bg-white p-8 rounded-lg shadow hover:shadow-lg transition">
            <h2 className="text-2xl font-bold mb-4">📄 CV Builder & Review</h2>
            <p className="text-gray-600">Build your CV, Upload CV for suggestions, Search jobs by CV.</p>
          </div>
        );
      case "growth":
        return (
          <div className="bg-white p-8 rounded-lg shadow hover:shadow-lg transition">
            <h2 className="text-2xl font-bold mb-4">📈 Personal Growth Analysis</h2>
            <p className="text-gray-600">Analyze your academic results and extracurricular activities.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar setPage={setPage} />

      {/* Main Content */}
      <div className="flex-1 p-8">
        {renderPage()}
      </div>
    </div>
  );
}

export default UserDashboard;
