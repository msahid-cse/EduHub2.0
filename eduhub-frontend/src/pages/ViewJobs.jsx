function ViewJobs() {
    // TODO: Fetch Jobs from Backend GET /api/view-jobs/
    return (
      <div className="p-10">
        <h1 className="text-3xl font-bold mb-6">Job Opportunities</h1>
        <div className="space-y-4">
          {/* Example static job */}
          <div className="border p-4 rounded shadow">
            <h2 className="text-xl font-bold">Software Engineer Intern at TechSoft</h2>
            <p className="text-gray-600">Requirements: Basic Python knowledge</p>
            <p className="text-gray-600">Location: Dhaka, Bangladesh</p>
          </div>
        </div>
      </div>
    );
  }
  
  export default ViewJobs;
  