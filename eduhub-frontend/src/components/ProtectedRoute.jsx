import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    // If no token, redirect to login page
    return <Navigate to="/" />;
  }

  return children; // If token exists, allow access
}

export default ProtectedRoute;
