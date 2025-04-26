import { useState } from "react";

function PostJob() {
  const [form, setForm] = useState({ company_name: "", position: "", requirements: "", location: "" });

  const handlePostJob = async () => {
    console.log("Post Job Form Data:", form);
    // TODO: Connect to backend API: POST /api/admin/create-job/
  };

  return (
    <div className="p-10 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Post New Job</h1>
      <input
        type="text"
        placeholder="Company Name"
        className="w-full p-3 mb-4 border rounded"
        value={form.company_name}
        onChange={(e) => setForm({ ...form, company_name: e.target.value })}
      />
      <input
        type="text"
        placeholder="Position"
        className="w-full p-3 mb-4 border rounded"
        value={form.position}
        onChange={(e) => setForm({ ...form, position: e.target.value })}
      />
      <textarea
        placeholder="Requirements"
        className="w-full p-3 mb-4 border rounded h-32"
        value={form.requirements}
        onChange={(e) => setForm({ ...form, requirements: e.target.value })}
      />
      <input
        type="text"
        placeholder="Location"
        className="w-full p-3 mb-4 border rounded"
        value={form.location}
        onChange={(e) => setForm({ ...form, location: e.target.value })}
      />
      <button
        onClick={handlePostJob}
        className="w-full bg-purple-600 text-white p-3 rounded hover:bg-purple-700"
      >
        Post Job
      </button>
    </div>
  );
}

export default PostJob;
