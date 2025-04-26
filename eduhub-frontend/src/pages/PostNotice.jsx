import { useState } from "react";

function PostNotice() {
  const [form, setForm] = useState({ title: "", description: "" });

  const handlePostNotice = async () => {
    console.log("Post Notice Form Data:", form);
    // TODO: Connect to backend API: POST /api/admin/create-notice/
  };

  return (
    <div className="p-10 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Post New Notice</h1>
      <input
        type="text"
        placeholder="Notice Title"
        className="w-full p-3 mb-4 border rounded"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />
      <textarea
        placeholder="Notice Description"
        className="w-full p-3 mb-4 border rounded h-32"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />
      <button
        onClick={handlePostNotice}
        className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
      >
        Post Notice
      </button>
    </div>
  );
}

export default PostNotice;
