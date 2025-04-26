function ViewCourses() {
    // TODO: Fetch Courses from Backend GET /api/view-courses/
    return (
      <div className="p-10">
        <h1 className="text-3xl font-bold mb-6">All Courses</h1>
        <div className="space-y-4">
          {/* Example static course */}
          <div className="border p-4 rounded shadow">
            <h2 className="text-xl font-bold">Data Science 101</h2>
            <p className="text-gray-600">Introduction to Data Science course for beginners.</p>
          </div>
        </div>
      </div>
    );
  }
  
  export default ViewCourses;
  