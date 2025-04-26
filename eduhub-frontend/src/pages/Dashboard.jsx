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


import { useEffect, useState } from "react";
import AdminDashboard from "./AdminDashboard";
import UserDashboard from "./UserDashboard";
import Sidebar from "../components/Sidebar";


function Dashboard() {
  const [role, setRole] = useState("admin"); // For now, hardcode "admin"

  useEffect(() => {
    // TODO: After backend ready:
    // Check user role using token
    // setRole('admin') or setRole('user')
  }, []);

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="ml-64 p-8 w-full">
        {role === "admin" ? <AdminDashboard /> : <UserDashboard />}
      </div>
    </div>
  );
}

export default Dashboard;
