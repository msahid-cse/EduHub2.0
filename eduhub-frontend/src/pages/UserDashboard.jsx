function UserDashboard() {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Welcome to EduHub User Dashboard 🎓</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-green-400 text-white p-6 rounded shadow-md">
            <h2 className="text-xl font-bold">Available Courses</h2>
            <p className="text-2xl mt-2">Browse and Learn!</p>
          </div>
          <div className="bg-indigo-400 text-white p-6 rounded shadow-md">
            <h2 className="text-xl font-bold">Job Opportunities</h2>
            <p className="text-2xl mt-2">Apply Now!</p>
          </div>
        </div>
      </div>
    );
  }
  
  export default UserDashboard;
  