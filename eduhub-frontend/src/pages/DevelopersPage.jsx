// // DevelopersPage.jsx
// import React from 'react';

// // DeveloperInfo Component
// const DeveloperInfo = ({ developer }) => {
//     return (
//         <div className="max-w-sm rounded overflow-hidden shadow-lg p-4 bg-white m-4">
//             <img className="w-full h-48 object-cover" src={developer.profilePic} alt={`${developer.name}'s profile`} />
//             <div className="px-6 py-4">
//                 <div className="font-bold text-xl mb-2">{developer.name}</div>
//                 <p className="text-gray-700 text-base">Email: {developer.email}</p>
//                 <p className="text-gray-700 text-base">
//                     LinkedIn: <a href={developer.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-500">{developer.linkedin}</a>
//                 </p>
//                 <p className="text-gray-700 text-base">
//                     GitHub: <a href={developer.github} target="_blank" rel="noopener noreferrer" className="text-blue-500">{developer.github}</a>
//                 </p>
//                 <p className="text-gray-700 text-base">
//                     Website: <a href={developer.website} target="_blank" rel="noopener noreferrer" className="text-blue-500">{developer.website}</a>
//                 </p>
//             </div>
//         </div>
//     );
// };

// // InstructorInfo Component
// const InstructorInfo = ({ instructor }) => {
//     return (
//         <div className="max-w-sm rounded overflow-hidden shadow-lg p-4 bg-white m-4">
//             <img className="w-full h-48 object-cover" src={instructor.profilePic} alt={`${instructor.name}'s profile`} />
//             <div className="px-6 py-4">
//                 <div className="font-bold text-xl mb-2">{instructor.name}</div>
//                 <p className="text-gray-700 text-base">Email: {instructor.email}</p>
//                 <p className="text-gray-700 text-base">
//                     LinkedIn: <a href={instructor.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-500">{instructor.linkedin}</a>
//                 </p>
//                 <p className="text-gray-700 text-base">
//                     GitHub: <a href={instructor.github} target="_blank" rel="noopener noreferrer" className="text-blue-500">{instructor.github}</a>
//                 </p>
//                 <p className="text-gray-700 text-base">
//                     Website: <a href={instructor.website} target="_blank" rel="noopener noreferrer" className="text-blue-500">{instructor.website}</a>
//                 </p>
//             </div>
//         </div>
//     );
// };

// // Main DevelopersPage Component
// const DevelopersPage = () => {
//     const developers = [
//         {
//             name: 'John Doe',
//             email: 'john@example.com',
//             linkedin: 'https://linkedin.com/in/johndoe',
//             github: 'https://github.com/johndoe',
//             website: 'https://johndoe.com',
//             profilePic: 'https://example.com/johndoe.jpg',
//         },
//         {
//             name: 'Jane Smith',
//             email: 'jane@example.com',
//             linkedin: 'https://linkedin.com/in/janesmith',
//             github: 'https://github.com/janesmith',
//             website: 'https://janesmith.com',
//             profilePic: 'https://example.com/janesmith.jpg',
//         },
//         {
//             name: 'Alice Johnson',
//             email: 'alice@example.com',
//             linkedin: 'https://linkedin.com/in/alicejohnson',
//             github: 'https://github.com/alicejohnson',
//             website: 'https://alicejohnson.com',
//             profilePic: 'https://example.com/alicejohnson.jpg',
//         },
//     ];

//     const instructor = {
//         name: 'Dr. Emily Brown',
//         email: 'emily@example.com',
//         linkedin: 'https://linkedin.com/in/emilybrown',
//         github: 'https://github.com/emilybrown',
//         website: 'https://emilybrown.com',
//         profilePic: 'https://example.com/emilybrown.jpg',
//     };

//     return (
//         <div className="min-h-screen bg-gray-200">
//             <h1 className="text-3xl text-center p-6">Developers and Instructor Information</h1>
//             <div className="flex flex-wrap justify-center p-6">
//                 {developers.map((dev, index) => (
//                     <DeveloperInfo key={index} developer={dev} />
//                 ))}
//                 <InstructorInfo instructor={instructor} />
//             </div>
//         </div>
//     );
// };

// export default DevelopersPage;

import { useNavigate } from 'react-router-dom';

const DevelopersPage = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1); // Or specify your main page route
  };

  // Team data
  const instructor = {
    name: "Instructor Name",
    role: "Lead Mentor",
    bio: "Guiding the next generation of developers with cutting-edge knowledge.",
    avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=500&auto=format&fit=crop&q=60",
    email: "instructor@example.com",
    linkedin: "https://linkedin.com/in/instructor",
    github: "https://github.com/instructor",
    skills: ["LEADERSHIP", "MENTORSHIP", "ARCHITECTURE"]
  };

  const developers = [
    {
      name: "Developer 1",
      role: "Frontend Specialist",
      bio: "Crafting immersive user interfaces with pixel-perfect precision.",
      avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=500&auto=format&fit=crop&q=60",
      email: "dev1@example.com",
      linkedin: "https://linkedin.com/in/dev1",
      github: "https://github.com/dev1",
      skills: ["REACT", "UI/UX", "ANIMATION"]
    },
    {
      name: "Developer 2",
      role: "Backend Architect",
      bio: "Building robust server systems that power our digital experiences.",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&auto=format&fit=crop&q=60",
      email: "dev2@example.com",
      linkedin: "https://linkedin.com/in/dev2",
      github: "https://github.com/dev2",
      skills: ["NODE", "DATABASES", "CLOUD"]
    },
    {
      name: "Developer 3",
      role: "Full Stack Engineer",
      bio: "Bridging the gap between frontend and backend with seamless integration.",
      avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=500&auto=format&fit=crop&q=60",
      email: "dev3@example.com",
      linkedin: "https://linkedin.com/in/dev3",
      github: "https://github.com/dev3",
      skills: ["REACT", "NODE", "DEVOPS"]
    },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6">
      {/* Back Button */}
      <button
        onClick={goBack}
        className="absolute top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-all duration-300 group border border-gray-700"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 group-hover:-translate-x-1 transition-transform"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
            clipRule="evenodd"
          />
        </svg>
        <span className="font-mono text-sm">RETURN</span>
      </button>

      {/* Header */}
      <div className="max-w-7xl mx-auto text-center mb-16 mt-10">
        <h1 className="text-5xl font-bold mb-4 font-mono tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
          // TEAM_STRUCTURE
        </h1>
        <p className="text-gray-400 font-mono max-w-2xl mx-auto">
          {"<"} Our team combines expertise with innovation to build the future {"/>"}
        </p>
      </div>

      {/* Instructor Card */}
      <div className="flex justify-center mb-20">
        <div className="relative w-full max-w-2xl group">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-200"></div>
          <div className="relative bg-gray-900 rounded-lg p-6 flex flex-col md:flex-row items-center gap-6 border border-gray-800">
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-400 to-purple-600 blur opacity-30"></div>
              <img
                src={instructor.avatar}
                alt={instructor.name}
                className="relative w-32 h-32 rounded-full object-cover border-2 border-gray-800"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-baseline gap-3 mb-2">
                <h2 className="text-2xl font-bold font-mono">{instructor.name}</h2>
                <span className="text-xs px-2 py-1 bg-gray-800 rounded-full text-purple-400 border border-gray-700">
                  {instructor.role}
                </span>
              </div>
              <p className="text-gray-400 mb-4">{instructor.bio}</p>
              
              {/* Contact Info */}
              <div className="mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12.713l-11.985-9.713h23.97l-11.985 9.713zm0 2.574l-12-9.725v15.438h24v-15.438l-12 9.725z"/>
                  </svg>
                  <a href={`mailto:${instructor.email}`} className="hover:text-cyan-400 transition">{instructor.email}</a>
                </div>
                <div className="flex gap-4 mt-3">
                  <a href={instructor.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>
                  <a href={instructor.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-200 transition">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {instructor.skills.map((skill, index) => (
                  <span key={index} className="text-xs px-2 py-1 bg-gray-800 rounded-full text-cyan-300 border border-gray-700">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Developers Section */}
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-mono mb-10 text-center tracking-tight text-gray-300">
          {"<"} DEVELOPMENT_TEAM {"/>"}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {developers.map((dev, index) => (
            <div key={index} className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-200"></div>
              <div className="relative bg-gray-900 rounded-lg p-6 h-full flex flex-col border border-gray-800">
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative">
                    <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-400 to-purple-600 blur opacity-20"></div>
                    <img
                      src={dev.avatar}
                      alt={dev.name}
                      className="relative w-16 h-16 rounded-full object-cover border border-gray-800"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold font-mono">{dev.name}</h3>
                    <p className="text-sm text-purple-400">{dev.role}</p>
                  </div>
                </div>
                <p className="text-gray-400 text-sm mb-6 flex-1">{dev.bio}</p>
                
                {/* Contact Info */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12.713l-11.985-9.713h23.97l-11.985 9.713zm0 2.574l-12-9.725v15.438h24v-15.438l-12 9.725z"/>
                    </svg>
                    <a href={`mailto:${dev.email}`} className="hover:text-cyan-400 transition">{dev.email}</a>
                  </div>
                  <div className="flex gap-3 mt-2">
                    <a href={dev.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-400 transition">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                    </a>
                    <a href={dev.github} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-300 transition">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </a>
                  </div>
                </div>
                
                <div className="mt-auto">
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent mb-4"></div>
                  <div className="flex justify-between items-center">
                    <div className="flex flex-wrap gap-1">
                      {dev.skills.map((skill, i) => (
                        <span key={i} className="text-xs px-2 py-0.5 bg-gray-800 rounded-full text-cyan-300 border border-gray-700">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sci-Fi decorative elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gray-700 opacity-10"
            style={{
              width: Math.random() * 10 + 5 + 'px',
              height: Math.random() * 10 + 5 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              animation: `pulse ${Math.random() * 5 + 3}s infinite alternate`,
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default DevelopersPage;