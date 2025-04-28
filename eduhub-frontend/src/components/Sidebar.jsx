// import { Link } from "react-router-dom";
// import { useState } from "react";
// import { Menu } from 'lucide-react'; // Optional: install lucide-react for icons (npm install lucide-react)

// function Sidebar() {
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <>
//       {/* Mobile Navbar */}
//       <div className="md:hidden flex justify-between items-center bg-blue-800 text-white p-4">
//         <div className="text-xl font-bold">EduHub Admin</div>
//         <button onClick={() => setIsOpen(!isOpen)}>
//           <Menu size={28} />
//         </button>
//       </div>

//       {/* Sidebar for Desktop */}
//       <div className={`bg-blue-800 text-white fixed md:static md:flex flex-col ${isOpen ? 'flex' : 'hidden'} md:h-screen w-64`}>
//         <div className="p-6 font-bold text-2xl border-b border-blue-700 hidden md:block">
//           EduHub Admin
//         </div>
//         <nav className="flex flex-col p-4 space-y-4">
//           <Link to="/dashboard" className="hover:bg-blue-700 p-2 rounded">Dashboard Home</Link>
//           <Link to="/post-notice" className="hover:bg-blue-700 p-2 rounded">Post Notice</Link>
//           <Link to="/upload-course" className="hover:bg-blue-700 p-2 rounded">Upload Course</Link>
//           <Link to="/post-job" className="hover:bg-blue-700 p-2 rounded">Post Job</Link>
//           <Link to="/view-notices" className="hover:bg-blue-700 p-2 rounded">View Notices</Link>
//           <Link to="/view-courses" className="hover:bg-blue-700 p-2 rounded">View Courses</Link>
//           <Link to="/view-jobs" className="hover:bg-blue-700 p-2 rounded">View Jobs</Link>
//         </nav>
//       </div>
//     </>
//   );
// }

// export default Sidebar;


import { useNavigate } from "react-router-dom";

function Sidebar({ setPage }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className="bg-blue-400 text-white w-64 min-h-screen p-6 flex flex-col gap-6">
      {/* <h2 className="text-2xl font-bold mb-8 cursor-pointer" onClick={() => setPage("home")}>
        EduHub
      </h2> */}
      <nav className="flex flex-col gap-4">
        <button onClick={() => setPage("home")} className="text-left hover:text-yellow-300">🏠 Home</button>
        <button onClick={() => setPage("skill")} className="text-left hover:text-yellow-300">🎯 Skill Development</button>
        <button onClick={() => setPage("library")} className="text-left hover:text-yellow-300">📚 Resource Library</button>
        <button onClick={() => setPage("cvbuilder")} className="text-left hover:text-yellow-300">📄 CV Builder</button>
        <button onClick={() => setPage("growth")} className="text-left hover:text-yellow-300">📈 Growth Analysis</button>
      </nav>

      <button
        onClick={handleLogout}
        className="mt-auto bg-red-500 hover:bg-red-600 text-white py-2 rounded text-center"
      >
        Logout
      </button>
    </div>
  );
}

export default Sidebar;
