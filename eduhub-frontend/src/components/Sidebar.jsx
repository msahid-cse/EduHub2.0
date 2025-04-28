


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
      className={`bg-gray-900 text-white flex flex-col h-full border-r border-gray-700 transition-all duration-300 ${collapsed ? "w-20" : "w-64"}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Collapse Button */}
      <div className="flex justify-end p-4 ">
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="px-2 space-y-2 ">
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
        className={`flex items-center p-3 m-2 mt-24 rounded-lg hover:bg-red-900/50 transition-colors ${collapsed ? "justify-center" : ""}`}
      >
        <LogOut size={20} className="text-red-400 " />
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




//222

// import { useState } from "react";
// import { motion } from "framer-motion";
// import { FaHome, FaTools, FaBook, FaClipboardList, FaChartLine } from "react-icons/fa";

// function Sidebar({ activePage, setActivePage, collapsed, setCollapsed }) {
//   const toggleSidebar = () => setCollapsed(!collapsed);

//   return (
//     <div className={`flex flex-col w-${collapsed ? "20" : "64"} bg-gray-800 text-white transition-all duration-300 ease-in-out`}>
//       {/* Sidebar Header with Toggle Button */}
//       <div className="flex items-center justify-between p-4 border-b border-gray-700">
//         <h2 className={`text-xl font-semibold ${collapsed ? "text-center" : "text-left"}`}>EduHub</h2>
//         <button onClick={toggleSidebar} className="text-white">
//           {collapsed ? "▶" : "◁"}
//         </button>
//       </div>

//       {/* Sidebar Navigation Links */}
//       <motion.div className="flex flex-col space-y-2 mt-4 px-4">
//         <SidebarLink
//           icon={<FaHome />}
//           label="Home"
//           active={activePage === "home"}
//           onClick={() => setActivePage("home")}
//           collapsed={collapsed}
//         />
//         <SidebarLink
//           icon={<FaTools />}
//           label="Skill Development"
//           active={activePage === "skill"}
//           onClick={() => setActivePage("skill")}
//           collapsed={collapsed}
//         />
//         <SidebarLink
//           icon={<FaBook />}
//           label="Resource Library"
//           active={activePage === "library"}
//           onClick={() => setActivePage("library")}
//           collapsed={collapsed}
//         />
//         <SidebarLink
//           icon={<FaClipboardList />}
//           label="CV Builder"
//           active={activePage === "cvbuilder"}
//           onClick={() => setActivePage("cvbuilder")}
//           collapsed={collapsed}
//         />
//         <SidebarLink
//           icon={<FaChartLine />}
//           label="Growth Analysis"
//           active={activePage === "growth"}
//           onClick={() => setActivePage("growth")}
//           collapsed={collapsed}
//         />
//       </motion.div>
//     </div>
//   );
// }

// const SidebarLink = ({ icon, label, active, onClick, collapsed }) => {
//   return (
//     <motion.div
//       whileHover={{ scale: 1.05 }}
//       className={`flex items-center p-3 space-x-3 rounded-lg cursor-pointer hover:bg-gray-700 transition-all duration-200 ${
//         active ? "bg-blue-600" : "bg-transparent"
//       }`}
//       onClick={onClick}
//     >
//       <div className="text-2xl">{icon}</div>
//       {/* Conditionally render label based on collapse state */}
//       <span className={`text-sm ${collapsed ? "hidden" : "block"}`}>{label}</span>
//     </motion.div>
//   );
// };

// export default Sidebar;
