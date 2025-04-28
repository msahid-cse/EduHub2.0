
// import { Link, useNavigate } from "react-router-dom";

// function Navbar() {
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/");
//   };

//   return (
//     <nav className="bg-blue-700 text-white p-4 flex justify-between items-center shadow-md">
//       {/* Left: Logo */}
//       <Link to="/" className="text-2xl font-bold">
//         🎓 EduHub
//       </Link>

//       {/* Right: Links */}
//       <div className="space-x-4">
//         {!token ? (
//           <>
//             <Link
//               to="/login"
//               className="bg-white text-blue-700 font-semibold px-4 py-2 rounded hover:bg-gray-200 transition"
//             >
//               Login
//             </Link>
//             <Link
//               to="/register"
//               className="bg-yellow-400 text-white font-semibold px-4 py-2 rounded hover:bg-yellow-500 transition"
//             >
//               Register
//             </Link>
//           </>
//         ) : (
//           <>
//             <button
//               onClick={handleLogout}
//               className="bg-red-500 text-white font-semibold px-4 py-2 rounded hover:bg-red-600 transition"
//             >
//               Logout
//             </button>
//           </>
//         )}
//       </div>
//     </nav>
//   );
// }

// export default Navbar;


import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Rocket,
  ChevronsLeftRight,
  LogIn,
  UserPlus,
  Search,
  User,
  LogOut,
} from 'lucide-react';

const Navbar = ({ isAuthenticated, onNavigate, onLogout }) => {
  return (
    <header className="py-4 px-6 bg-gray-950 backdrop-blur-md border-b border-gray-800">
      <div className="container mx-auto flex items-center justify-between">
        <NavLink to="/dashboard">
        <h1 
          className="font-['Inter'] text-2xl font-bold text-white flex items-center gap-2 cursor-pointer"
          onClick={() => onNavigate('home')}
        >
          {/* <Rocket className="w-6 h-6 text-teal-400" /> */}
          <ChevronsLeftRight className="w-10 h-10 text-teal-400" />
          EduHub
        </h1> 
        </NavLink>

        
        <nav>
          <ul className="flex items-center gap-6">
            {!isAuthenticated ? (
              <>
                <li>
                  <NavLink to="/login">
                    <button 
                      className="font-['Source_Sans_Pro'] text-gray-300 hover:text-white transition-colors flex items-center"
                      onClick={() => onNavigate('login')}
                    >
                      <LogIn className="w-4 h-4 mr-1" />
                      Login
                    </button>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/register">
                    <button className="font-['Source_Sans_Pro'] text-gray-300 hover:text-white transition-colors flex items-center">
                      <UserPlus className="w-4 h-4 mr-1" />
                      Register
                    </button>
                  </NavLink>
                </li>
              </>
            ) : (
              <>
                <li>
                  <NavLink to="/profile">
                    <button className="font-['Source_Sans_Pro'] text-gray-300 hover:text-white transition-colors flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      Profile
                    </button>
                  </NavLink>
                </li>
                <li>
                  <button 
                    className="font-['Source_Sans_Pro'] text-gray-300 hover:text-white transition-colors flex items-center"
                    onClick={onLogout}
                  >
                    <LogOut className="w-4 h-4 mr-1" />
                    Logout
                  </button>
                </li>
              </>
            )}
            
            <li>
              <NavLink to="/search">
                <button className="font-['Source_Sans_Pro'] font-semibold px-6 py-3 rounded-full transition-all duration-300 flex items-center gap-2 shadow-lg border-2 bg-transparent text-teal-400 border-teal-500/50 hover:bg-teal-500/20 hover:text-teal-300">
                  <Search className="w-4 h-4" />
                  Search
                </button>
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;