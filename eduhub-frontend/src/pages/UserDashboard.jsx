import { Link } from "react-router-dom";

function UserDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Welcome to EduHub! 🎓</h1>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-green-400 text-white p-6 rounded-lg shadow hover:scale-105 transition-transform">
          <h2 className="text-xl font-semibold">Available Courses</h2>
          <p className="text-2xl mt-3">Learn & Grow!</p>
        </div>
        <div className="bg-indigo-400 text-white p-6 rounded-lg shadow hover:scale-105 transition-transform">
          <h2 className="text-xl font-semibold">Job Opportunities</h2>
          <p className="text-2xl mt-3">Start Your Career!</p>
        </div>
      </div>

      {/* Explore */}
      <h2 className="text-2xl font-bold mb-4">Explore</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/view-notices"
          className="block bg-blue-500 hover:bg-blue-600 text-white text-center py-6 rounded-lg shadow-lg text-xl font-semibold transition-all"
        >
          📢 View Notices
        </Link>
        <Link
          to="/view-courses"
          className="block bg-green-600 hover:bg-green-700 text-white text-center py-6 rounded-lg shadow-lg text-xl font-semibold transition-all"
        >
          📚 View Courses
        </Link>
        <Link
          to="/view-jobs"
          className="block bg-purple-600 hover:bg-purple-700 text-white text-center py-6 rounded-lg shadow-lg text-xl font-semibold transition-all"
        >
          💼 View Jobs
        </Link>
      </div>
    </div>
  );
}

export default UserDashboard;
