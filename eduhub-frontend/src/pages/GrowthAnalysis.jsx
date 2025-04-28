import { useState } from "react";

function ResourceLibrary() {
  // Dummy YouTube Videos and Books List
  const youtubeVideos = [
    { title: "Learn C Programming", url: "https://www.youtube.com/embed/KJgsSFOSQv0" },
    { title: "Data Structures Full Course", url: "https://www.youtube.com/embed/sVxBVvlnJsM" },
    { title: "Machine Learning Crash Course", url: "https://www.youtube.com/embed/GwIo3gDZCVQ" },
  ];

  const books = [
    { title: "Introduction to Algorithms", link: "https://www.academia.edu/35348682/Introduction_to_Algorithms_3rd_Edition" },
    { title: "Operating System Concepts", link: "https://www.os-book.com/" },
    { title: "Artificial Intelligence: A Modern Approach", link: "https://aima.cs.berkeley.edu/" },
  ];

  const handnotes = [
    { title: "CSE Handnotes Collection", link: "https://drive.google.com/drive/folders/example" },
    { title: "Data Science Study Materials", link: "https://www.kaggle.com/learn/data-science" },
    { title: "Web Development Full Roadmap", link: "https://roadmap.sh/frontend" },
  ];

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">📚 Resource Library</h1>

      {/* YouTube Section */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">🎥 YouTube Tutorials</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {youtubeVideos.map((video, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <iframe
                src={video.url}
                title={video.title}
                className="w-full h-48"
                frameBorder="0"
                allowFullScreen
              ></iframe>
              <div className="p-4">
                <h3 className="font-semibold text-lg">{video.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Books Section */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">📚 Recommended Books</h2>
        <ul className="list-disc pl-6">
          {books.map((book, idx) => (
            <li key={idx} className="mb-2">
              <a
                href={book.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {book.title}
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* Handnotes Section */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">✏️ Handnotes & Study Websites</h2>
        <ul className="list-disc pl-6">
          {handnotes.map((note, idx) => (
            <li key={idx} className="mb-2">
              <a
                href={note.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {note.title}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default ResourceLibrary;
