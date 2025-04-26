// function Navbar() {
//     return (
//       <div className="w-full bg-blue-700 text-white p-4 flex justify-between items-center">
//         <h1 className="text-xl font-bold">EduHub Admin Panel</h1>
//         <button
//           onClick={() => {
//             localStorage.removeItem("token");
//             window.location.href = "/";
//           }}
//           className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
//         >
//           Logout
//         </button>
//       </div>
//     );
//   }
  
//   export default Navbar;
  


import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="bg-blue-700 text-white p-4 flex justify-between items-center shadow-md">
      {/* Left: Logo */}
      <Link to="/" className="text-2xl font-bold">
        🎓 EduHub
      </Link>

      {/* Right: Links */}
      <div className="space-x-4">
        {!token ? (
          <>
            <Link
              to="/login"
              className="bg-white text-blue-700 font-semibold px-4 py-2 rounded hover:bg-gray-200 transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-yellow-400 text-white font-semibold px-4 py-2 rounded hover:bg-yellow-500 transition"
            >
              Register
            </Link>
          </>
        ) : (
          <>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white font-semibold px-4 py-2 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
