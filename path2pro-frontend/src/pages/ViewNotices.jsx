function ViewNotices() {
    // TODO: Fetch Notices from Backend GET /api/view-notices/
    return (
      <div className="p-10">
        <h1 className="text-3xl font-bold mb-6">All Notices</h1>
        <div className="space-y-4">
          {/* Example static notice */}
          <div className="border p-4 rounded shadow">
            <h2 className="text-xl font-bold">Mid-Term Exam Notice</h2>
            <p className="text-gray-600">All students must submit assignments before 25th May.</p>
          </div>
        </div>
      </div>
    );
  }
  
  export default ViewNotices;
  