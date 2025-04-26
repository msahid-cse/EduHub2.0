// import { useEffect, useState } from "react";

// function Dashboard() {
//   const [country, setCountry] = useState("");
//   const [university, setUniversity] = useState("");

//   useEffect(() => {
//     // Get country and university from localStorage
//     const storedCountry = localStorage.getItem("country");
//     const storedUniversity = localStorage.getItem("university");

//     if (storedCountry && storedUniversity) {
//       setCountry(storedCountry);
//       setUniversity(storedUniversity);
//     } else {
//       // If no data, force user back to Landing
//       window.location.href = "/";
//     }
//   }, []);

//   return (
//     <div className="p-10 min-h-screen bg-gray-100">
//       <h1 className="text-3xl font-bold mb-6 text-blue-700">
//         🎓 Welcome to {university}
//       </h1>
//       <h2 className="text-xl text-gray-700 mb-8">
//         Country: {country}
//       </h2>

//       {/* Sections */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div className="bg-white p-6 rounded-lg shadow">
//           <h3 className="text-xl font-bold mb-2">📢 University Notices</h3>
//           {/* TODO: Fetch university-specific notices */}
//           <p className="text-gray-600">No notices available yet.</p>
//         </div>

//         <div className="bg-white p-6 rounded-lg shadow">
//           <h3 className="text-xl font-bold mb-2">👩‍🏫 Teacher Information</h3>
//           {/* TODO: Fetch teachers based on university */}
//           <p className="text-gray-600">No teacher information yet.</p>
//         </div>

//         <div className="bg-white p-6 rounded-lg shadow">
//           <h3 className="text-xl font-bold mb-2">💼 Jobs</h3>
//           {/* TODO: Fetch jobs for university students */}
//           <p className="text-gray-600">No jobs posted yet.</p>
//         </div>

//         <div className="bg-white p-6 rounded-lg shadow">
//           <h3 className="text-xl font-bold mb-2">🎯 Courses</h3>
//           {/* TODO: Fetch courses available */}
//           <p className="text-gray-600">No courses available yet.</p>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Dashboard;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const [country, setCountry] = useState("");
  const [university, setUniversity] = useState("");

  useEffect(() => {
    // Get country and university from localStorage
    const storedCountry = localStorage.getItem("country");
    const storedUniversity = localStorage.getItem("university");

    if (storedCountry && storedUniversity) {
      setCountry(storedCountry);
      setUniversity(storedUniversity);
    } else {
      // If no data, force user back to Landing
      window.location.href = "/";
    }
  }, []);

  const handlePersonalGrowthClick = () => {
    navigate("/login"); // Go to login page
  };

  return (
    <div className="p-10 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">
        🎓 Welcome to {university}
      </h1>
      <h2 className="text-xl text-gray-700 mb-8">
        Country: {country}
      </h2>

      {/* Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* University Notices */}
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h3 className="text-xl font-bold mb-2">📢 University Notices</h3>
          {/* TODO: Fetch university-specific notices */}
          <p className="text-gray-600">No notices available yet.</p>
        </div>

        {/* Teacher Info */}
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h3 className="text-xl font-bold mb-2">👩‍🏫 Teacher Information</h3>
          {/* TODO: Fetch teachers based on university */}
          <p className="text-gray-600">No teacher information yet.</p>
        </div>

        {/* Jobs */}
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h3 className="text-xl font-bold mb-2">💼 Job Postings</h3>
          {/* TODO: Fetch jobs for university students */}
          <p className="text-gray-600">No jobs posted yet.</p>
        </div>

        {/* Courses */}
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h3 className="text-xl font-bold mb-2">🎯 Courses</h3>
          {/* TODO: Fetch available courses */}
          <p className="text-gray-600">No courses available yet.</p>
        </div>

        {/* Personal Growth Analysis */}
        <div
          onClick={handlePersonalGrowthClick}
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
        >
          <h3 className="text-xl font-bold mb-2">📈 Personal Growth Analysis</h3>
          <p>Click to Login as User and Analyze your Academic & Extra Activities.</p>
        </div>

        {/* Country Important News */}
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h3 className="text-xl font-bold mb-2">📰 Country Important News</h3>
          {/* TODO: Fetch latest news based on country */}
          <p>Latest updates and news related to {country} coming soon.</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
