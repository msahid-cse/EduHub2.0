import { useNavigate } from "react-router-dom";

function Topbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className="flex justify-between items-center bg-white p-4 shadow-md">
      <h1 className="text-xl font-bold text-blue-700">🎓 User Dashboard - EduHub</h1>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
}

export default Topbar;
