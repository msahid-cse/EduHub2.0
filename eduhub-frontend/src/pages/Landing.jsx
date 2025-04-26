import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// Dummy Countries and Universities
const data = {
  Bangladesh: ["Dhaka University", "BUET", "NSU", "BRAC University"],
  India: ["IIT Bombay", "IIT Delhi", "IIM Ahmedabad"],
  USA: ["Harvard University", "MIT", "Stanford University"],
};

function Landing() {
  const navigate = useNavigate();
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedUniversity, setSelectedUniversity] = useState("");

  const handleNext = () => {
    if (!selectedCountry || !selectedUniversity) {
      alert("⚠️ Please select both Country and University!");
      return;
    }
    // Save to localStorage
    localStorage.setItem("country", selectedCountry);
    localStorage.setItem("university", selectedUniversity);
    navigate("/dashboard");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
          🎓 Welcome to EduHub
        </h1>
        <p className="text-white text-lg md:text-xl">
          Connect to your University and Explore Endless Learning
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg"
      >
        <label className="block mb-2 text-gray-700 font-semibold">Select Country:</label>
        <select
          className="w-full p-3 mb-6 border rounded focus:ring-2 focus:ring-blue-400"
          value={selectedCountry}
          onChange={(e) => {
            setSelectedCountry(e.target.value);
            setSelectedUniversity("");
          }}
        >
          <option value="">-- Select Country --</option>
          {Object.keys(data).map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>

        {selectedCountry && (
          <>
            <label className="block mb-2 text-gray-700 font-semibold">Select University:</label>
            <select
              className="w-full p-3 mb-6 border rounded focus:ring-2 focus:ring-indigo-400"
              value={selectedUniversity}
              onChange={(e) => setSelectedUniversity(e.target.value)}
            >
              <option value="">-- Select University --</option>
              {data[selectedCountry].map((university) => (
                <option key={university} value={university}>
                  {university}
                </option>
              ))}
            </select>
          </>
        )}

        <button
          onClick={handleNext}
          className="w-full bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white p-3 rounded-lg text-lg font-bold transition-all"
        >
          Next ➡️
        </button>
      </motion.div>
    </div>
  );
}

export default Landing;
