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




// import { useNavigate } from "react-router-dom";

// function Sidebar({ setPage }) {
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("role");
//     navigate("/login");
//   };

//   return (
//     <div className="bg-blue-400 text-white w-64 min-h-screen p-6 flex flex-col gap-6">
//       {/* <h2 className="text-2xl font-bold mb-8 cursor-pointer" onClick={() => setPage("home")}>
//         EduHub
//       </h2> */}
//       <nav className="flex flex-col gap-4">
//         <button onClick={() => setPage("home")} className="text-left hover:text-yellow-300">🏠 Home</button>
//         <button onClick={() => setPage("skill")} className="text-left hover:text-yellow-300">🎯 Skill Development</button>
//         {/* <button onClick={() => setPage("library")} className="text-left hover:text-yellow-300">📚 Resource Library</button> */}
//         <button onClick={() => setPage("library")}>📚 Resource Library</button>

//         <button onClick={() => setPage("cvbuilder")} className="text-left hover:text-yellow-300">📄 CV Builder</button>
//         <button onClick={() => setPage("growth")} className="text-left hover:text-yellow-300">📈 Growth Analysis</button>
//       </nav>

//       <button
//         onClick={handleLogout}
//         className="mt-auto bg-red-500 hover:bg-red-600 text-white py-2 rounded text-center"
//       >
//         Logout
//       </button>
//     </div>
//   );
// }

// export default Sidebar;


import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Home, 
  Target, 
  BookOpen, 
  FileText, 
  TrendingUp, 
  LogOut,
  ChevronRight,
  ChevronLeft
} from "lucide-react";
import { useState } from "react";

function Sidebar({ setPage, activePage }) {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    navigate("/login");
  };

  const navItems = [
    { id: "home", label: "Home", icon: <Home size={20} /> },
    { id: "skill", label: "Skill Dev", icon: <Target size={20} /> },
    { id: "library", label: "Resources", icon: <BookOpen size={20} /> },
    { id: "cvbuilder", label: "CV Builder", icon: <FileText size={20} /> },
    { id: "growth", label: "Growth", icon: <TrendingUp size={20} /> }
  ];

  return (
    <motion.div 
      className={`bg-gray-900 text-white flex flex-col border-r border-gray-700 transition-all duration-300 ${collapsed ? "w-20" : "w-64"}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Collapse Button */}
      <div className="flex justify-end p-4">
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-2 space-y-2">
        {navItems.map((item) => (
          <motion.button
            key={item.id}
            onClick={() => setPage(item.id)}
            onHoverStart={() => setHoveredItem(item.id)}
            onHoverEnd={() => setHoveredItem(null)}
            className={`w-full flex items-center p-3 rounded-lg transition-all ${activePage === item.id ? "bg-blue-900/50 border-l-4 border-blue-400" : "hover:bg-gray-800"}`}
            whileHover={{ x: 5 }}
          >
            <div className="flex items-center">
              <div className={`p-1 rounded-md ${activePage === item.id ? "text-blue-400" : "text-gray-400"}`}>
                {item.icon}
              </div>
              {!collapsed && (
                <motion.span 
                  className="ml-3"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: collapsed ? 0 : 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {item.label}
                </motion.span>
              )}
            </div>
            {hoveredItem === item.id && collapsed && (
              <motion.div 
                className="absolute left-full ml-2 px-3 py-2 bg-gray-800 text-white rounded-md shadow-lg z-50"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
              >
                {item.label}
              </motion.div>
            )}
          </motion.button>
        ))}
      </nav>

      {/* Logout Button */}
      <motion.button
        onClick={handleLogout}
        whileHover={{ x: 5 }}
        className={`flex items-center p-3 m-2 rounded-lg hover:bg-red-900/50 transition-colors ${collapsed ? "justify-center" : ""}`}
      >
        <LogOut size={20} className="text-red-400" />
        {!collapsed && (
          <motion.span 
            className="ml-3 text-red-400"
            initial={{ opacity: 1 }}
            animate={{ opacity: collapsed ? 0 : 1 }}
            transition={{ duration: 0.2 }}
          >
            Logout
          </motion.span>
        )}
      </motion.button>
    </motion.div>
  );
}

export default Sidebar;