import { Link } from "react-router-dom";

function AdminDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Welcome, Admin 🎓</h1>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-blue-500 text-white p-6 rounded-lg shadow hover:scale-105 transition-transform">
          <h2 className="text-xl font-semibold">Total Notices</h2>
          <p className="text-4xl mt-3">12</p> {/* TODO: Fetch real count */}
        </div>
        <div className="bg-green-500 text-white p-6 rounded-lg shadow hover:scale-105 transition-transform">
          <h2 className="text-xl font-semibold">Total Courses</h2>
          <p className="text-4xl mt-3">8</p> {/* TODO: Fetch real count */}
        </div>
        <div className="bg-purple-500 text-white p-6 rounded-lg shadow hover:scale-105 transition-transform">
          <h2 className="text-xl font-semibold">Total Jobs</h2>
          <p className="text-4xl mt-3">5</p> {/* TODO: Fetch real count */}
        </div>
      </div>

      {/* Quick Actions */}
      <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/post-notice"
          className="block bg-yellow-400 hover:bg-yellow-500 text-white text-center py-6 rounded-lg shadow-lg text-xl font-semibold transition-all"
        >
          📜 Post a New Notice
        </Link>
        <Link
          to="/upload-course"
          className="block bg-indigo-500 hover:bg-indigo-600 text-white text-center py-6 rounded-lg shadow-lg text-xl font-semibold transition-all"
        >
          🎯 Upload a New Course
        </Link>
        <Link
          to="/post-job"
          className="block bg-pink-500 hover:bg-pink-600 text-white text-center py-6 rounded-lg shadow-lg text-xl font-semibold transition-all"
        >
          💼 Post a New Job
        </Link>
      </div>
    </div>
  );
}

export default AdminDashboard;
