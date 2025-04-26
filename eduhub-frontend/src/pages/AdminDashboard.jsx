function AdminDashboard() {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Welcome to Admin Dashboard 🎓</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-500 text-white p-6 rounded shadow-md">
            <h2 className="text-xl font-bold">Total Notices</h2>
            <p className="text-3xl mt-2">12</p> {/* TODO: Fetch real count */}
          </div>
          <div className="bg-green-500 text-white p-6 rounded shadow-md">
            <h2 className="text-xl font-bold">Total Courses</h2>
            <p className="text-3xl mt-2">8</p> {/* TODO: Fetch real count */}
          </div>
          <div className="bg-purple-500 text-white p-6 rounded shadow-md">
            <h2 className="text-xl font-bold">Total Jobs</h2>
            <p className="text-3xl mt-2">5</p> {/* TODO: Fetch real count */}
          </div>
        </div>
      </div>
    );
  }
  
  export default AdminDashboard;
  