// import { useEffect, useState } from "react";
// import AdminDashboard from "./AdminDashboard";
// import UserDashboard from "./UserDashboard";

// function Dashboard() {
//   const [role, setRole] = useState("admin"); // Temporary role (hardcoded)

//   useEffect(() => {
//     // TODO: After backend is ready:
//     // Fetch user role using token (GET /api/protected/)
//     // setRole('admin') or setRole('user');
//   }, []);

//   if (role === "admin") return <AdminDashboard />;
//   else if (role === "user") return <UserDashboard />;
//   else return <div>Loading...</div>;
// }

// export default Dashboard;




// import { useEffect, useState } from "react";
// import AdminDashboard from "./AdminDashboard";
// import UserDashboard from "./UserDashboard";
// import Sidebar from "../components/Sidebar";


// function Dashboard() {
//   const [role, setRole] = useState("admin"); // For now, hardcode "admin"

//   useEffect(() => {
//     // TODO: After backend ready:
//     // Check user role using token
//     // setRole('admin') or setRole('user')
//   }, []);

//   return (
//     <div className="flex">
//       {/* Sidebar */}
//       <Sidebar />

//       {/* Main Content */}
//       <div className="ml-64 p-8 w-full">
//         {role === "admin" ? <AdminDashboard /> : <UserDashboard />}
//       </div>
//     </div>
//   );
// }

// export default Dashboard;



//3

import { useEffect, useState } from "react";
import AdminDashboard from "./AdminDashboard";
import UserDashboard from "./UserDashboard";
import Sidebar from "../components/Sidebar";
import Loader from "../components/Loader"; // Optional loader if you want

function Dashboard() {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/";
    } else {
      // TODO: Verify token from backend (for now simulate)
      setTimeout(() => {
        // Fake role assignment
        setRole("admin"); // OR "user"
      }, 500);
    }
  }, []);

  if (!role) {
    return <Loader />; // Show loading spinner
  }

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 ml-0 md:ml-64 p-6 bg-gray-100 min-h-screen">
        {role === "admin" ? <AdminDashboard /> : <UserDashboard />}
      </div>
    </div>
  );
}

export default Dashboard;

