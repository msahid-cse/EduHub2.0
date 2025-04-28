


// import { useEffect, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import Sidebar from "../components/Sidebar";
// import ResourceLibrary from "../pages/ResourceLibrary";
// import SkillDevelopment from "../pages/SkillDevelopment";
// import CVBuilder from "../pages/CVBuilder";
// import GrowthAnalysis from "../pages/GrowthAnalysis";

// function UserDashboard() {
//   const [username, setUsername] = useState("");
//   const [activePage, setActivePage] = useState("home");
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     // Simulate data loading
//     const timer = setTimeout(() => {
//       setUsername(localStorage.getItem("username") || "User");
//       setIsLoading(false);
//     }, 800);
    
//     return () => clearTimeout(timer);
//   }, []);

//   const renderPage = () => {
//     const pageComponents = {
//       home: (
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           exit={{ opacity: 0 }}
//           className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-xl shadow-lg border border-gray-100"
//         >
//           <h2 className="text-4xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-500">
//             Welcome back, {username} <span className="animate-waving-hand">👋</span>
//           </h2>
//           <p className="text-gray-600 text-lg mb-8">
//             Your personalized career development hub is ready. Where would you like to start today?
//           </p>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <DashboardCard 
//               title="Skill Development"
//               description="Enhance your professional skills"
//               icon="📊"
//               onClick={() => setActivePage("skill")}
//             />
//             <DashboardCard 
//               title="Resource Library"
//               description="Access learning materials"
//               icon="📚"
//               onClick={() => setActivePage("library")}
//             />
//             <DashboardCard 
//               title="CV Builder"
//               description="Create a standout resume"
//               icon="📝"
//               onClick={() => setActivePage("cvbuilder")}
//             />
//             <DashboardCard 
//               title="Growth Analysis"
//               description="Track your progress"
//               icon="📈"
//               onClick={() => setActivePage("growth")}
//             />
//           </div>
//         </motion.div>
//       ),
//       skill: <SkillDevelopment />,
//       library: <ResourceLibrary />,
//       cvbuilder: <CVBuilder />,
//       growth: <GrowthAnalysis />,
//     };

//     return pageComponents[activePage] || null;
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       {/* Enhanced Sidebar */}
//       <Sidebar activePage={activePage} setActivePage={setActivePage} />
      
//       {/* Main Content Area */}
//       <main className="flex-1 p-6 lg:p-10 overflow-auto">
//         {isLoading ? (
//           <div className="flex items-center justify-center h-full">
//             <div className="flex flex-col items-center">
//               <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
//               <p className="mt-4 text-gray-600">Loading your dashboard...</p>
//             </div>
//           </div>
//         ) : (
//           <AnimatePresence mode="wait">
//             <motion.div
//               key={activePage}
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               transition={{ duration: 0.25 }}
//             >
//               {renderPage()}
//             </motion.div>
//           </AnimatePresence>
//         )}
//       </main>
//     </div>
//   );
// }

// // Reusable Dashboard Card Component
// const DashboardCard = ({ title, description, icon, onClick }) => (
//   <motion.div 
//     whileHover={{ y: -5 }}
//     whileTap={{ scale: 0.98 }}
//     onClick={onClick}
//     className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-200 hover:border-blue-200"
//   >
//     <div className="text-4xl mb-4">{icon}</div>
//     <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
//     <p className="text-gray-500">{description}</p>
//   </motion.div>
// );

// export default UserDashboard;


import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../components/Sidebar";
import ResourceLibrary from "../pages/ResourceLibrary";
import SkillDevelopment from "../pages/SkillDevelopment";
import CVBuilder from "../pages/CVBuilder";
import GrowthAnalysis from "../pages/GrowthAnalysis";

function UserDashboard() {
  const [username, setUsername] = useState("");
  const [activePage, setActivePage] = useState("home");
  const [isLoading, setIsLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);  // Track sidebar state

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setUsername(localStorage.getItem("username") || "User");
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  const renderPage = () => {
    const pageComponents = {
      home: (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-xl shadow-lg border border-gray-100"
        >
          <h2 className="text-4xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-500">
            Welcome back, {username} <span className="animate-waving-hand text-yellow-300">👋</span>
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            Your personalized career development hub is ready. Where would you like to start today?
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DashboardCard 
              title="Skill Development"
              description="Enhance your professional skills"
              icon="📊"
              onClick={() => setActivePage("skill")}
            />
            <DashboardCard 
              title="Resource Library"
              description="Access learning materials"
              icon="📚"
              onClick={() => setActivePage("library")}
            />
            <DashboardCard 
              title="CV Builder"
              description="Create a standout resume"
              icon="📝"
              onClick={() => setActivePage("cvbuilder")}
            />
            <DashboardCard 
              title="Growth Analysis"
              description="Track your progress"
              icon="📈"
              onClick={() => setActivePage("growth")}
            />
          </div>
        </motion.div>
      ),
      skill: <SkillDevelopment />,
      library: <ResourceLibrary />,
      cvbuilder: <CVBuilder />,
      growth: <GrowthAnalysis />,
    };

    return pageComponents[activePage] || null;
  };

  return (
    // <div className="flex min-h-screen bg-gray-50">
    <div className="flex h-min-screen">
      {/* Sidebar with dynamic state for collapse */}
      <div className="w-[25%]"><Sidebar activePage={activePage} setActivePage={setActivePage} collapsed={collapsed} setCollapsed={setCollapsed} /></div>
      
      {/* Main Content Area */}
      <main className={`w-[400%] `}>
        {isLoading ? (
          <div className="">
            <div className="">
              <div className=""></div>
              <p className="">Loading your dashboard...</p>
            </div>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        )}
      </main>
    </div>
  );
}

// Reusable Dashboard Card Component
const DashboardCard = ({ title, description, icon, onClick }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-200 hover:border-blue-200"
  >
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-500">{description}</p>
  </motion.div>
);

export default UserDashboard;
