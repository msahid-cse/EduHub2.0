import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({ children, requiredRole }) {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const userRole = localStorage.getItem("userRole");
  const location = useLocation();
  
  // Check if user is logged in
  if (!isLoggedIn) {
    // Redirect to login if not logged in
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // If requiredRole is specified, check if user has the required role
  if (requiredRole && userRole !== requiredRole) {
    // Redirect admin users to admin dashboard if trying to access user pages
    if (userRole === "admin" && requiredRole === "user") {
      return <Navigate to="/admindashboard" replace />;
    }
    
    // Redirect user to user dashboard if trying to access admin pages
    if (userRole === "user" && requiredRole === "admin") {
      return <Navigate to="/userdashboard" replace />;
    }
  }
  
  // If all checks pass, render the protected component
  return children;
}

export default ProtectedRoute;
