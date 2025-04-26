import { useState } from "react";

function UploadCourse() {
  const [form, setForm] = useState({ title: "", description: "", category: "", video_link: "" });

  const handleUploadCourse = async () => {
    console.log("Upload Course Form Data:", form);
    // TODO: Connect to backend API: POST /api/admin/create-course/
  };

  return (
    <div className="p-10 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Upload New Course</h1>
      <input
        type="text"
        placeholder="Course Title"
        className="w-full p-3 mb-4 border rounded"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />
      <textarea
        placeholder="Course Description"
        className="w-full p-3 mb-4 border rounded h-32"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />
      <input
        type="text"
        placeholder="Category"
        className="w-full p-3 mb-4 border rounded"
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
      />
      <input
        type="text"
        placeholder="Video Link (optional)"
        className="w-full p-3 mb-4 border rounded"
        value={form.video_link}
        onChange={(e) => setForm({ ...form, video_link: e.target.value })}
      />
      <button
        onClick={handleUploadCourse}
        className="w-full bg-green-600 text-white p-3 rounded hover:bg-green-700"
      >
        Upload Course
      </button>
    </div>
  );
}

export default UploadCourse;
