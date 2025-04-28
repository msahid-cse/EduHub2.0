

// import Sidebar from "../components/Sidebar";
// import ResourceLibrary from "../pages/ResourceLibrary"; // Import the ResourceLibrary component
// import { useEffect, useState } from "react";

// function UserDashboard() {
//   const [username, setUsername] = useState("");
//   const [page, setPage] = useState("home"); // 👈 Track which page to show

//   useEffect(() => {
//     setUsername(localStorage.getItem("username") || "User");
//   }, []);

//   const renderPage = () => {
//     switch (page) {
//       case "home":
//         return (
//           <div className="bg-white p-8 rounded-lg shadow hover:shadow-lg transition">
//             <h2 className="text-3xl font-bold mb-4">Welcome, {username} 🎉</h2>
//             <p className="text-gray-700 text-lg">
//               Explore your courses, skills, resources, jobs, and grow your career!
//             </p>
//           </div>
//         );
//       case "skill":
//         return (
//           <div className="bg-white p-8 rounded-lg shadow hover:shadow-lg transition">
//             <h2 className="text-2xl font-bold mb-4">🎯 Skill Development Center</h2>
//             <p className="text-gray-600">Free and Paid courses will be shown here.</p>
//           </div>
//         );
//       case "library":
//         return (
//           <div className="bg-white p-8 rounded-lg shadow hover:shadow-lg transition">
//             <h2 className="text-2xl font-bold mb-4">📚 University Resource Library</h2>
//             <p className="text-gray-600">YouTube tutorials, Books, Handnotes will be available here.</p>
//           </div>
//         );
//       case "cvbuilder":
//         return (
//           <div className="bg-white p-8 rounded-lg shadow hover:shadow-lg transition">
//             <h2 className="text-2xl font-bold mb-4">📄 CV Builder & Review</h2>
//             <p className="text-gray-600">Build your CV, Upload CV for suggestions, Search jobs by CV.</p>
//           </div>
//         );
//       case "growth":
//         return (
//           <div className="bg-white p-8 rounded-lg shadow hover:shadow-lg transition">
//             <h2 className="text-2xl font-bold mb-4">📈 Personal Growth Analysis</h2>
//             <p className="text-gray-600">Analyze your academic results and extracurricular activities.</p>
//           </div>
//         );
//       case "library":
//           return <ResourceLibrary />;
        
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       {/* Sidebar */}
//       <Sidebar setPage={setPage} />

//       {/* Main Content */}
//       <div className="flex-1 p-8">
//         {renderPage()}
//       </div>
//     </div>
//   );
// }

// export default UserDashboard;


import Sidebar from "../components/Sidebar";
import ResourceLibrary from "../pages/ResourceLibrary"; 
// Later we'll create these:
import SkillDevelopment from "../pages/SkillDevelopment";
import CVBuilder from "../pages/CVBuilder";
import GrowthAnalysis from "../pages/GrowthAnalysis";
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
        return <SkillDevelopment />;  // 🆕 Show full Skill page
      case "library":
        return <ResourceLibrary />;   // 🆕 Show full Library page
      case "cvbuilder":
        return <CVBuilder />;         // 🆕 Show full CV page
      case "growth":
        return <GrowthAnalysis />;    // 🆕 Show full Growth page
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
