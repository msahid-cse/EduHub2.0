import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Github, Linkedin, Mail, ArrowLeft, Globe } from 'lucide-react';

const Developers = () => {
  const navigate = useNavigate();

  // Instructor data
  const instructor = {
    name: "Md. Saiful Islam Bhuiyan",
    title: "Project Instructor",
    department: "Computer Science & Engineering",
    university: "Green University of Bangladesh",
    email: "saiful_islam@cse.green.ac.bd",
    linkedin: "https://www.linkedin.com/in/md-saiful-islam-bhuiyan-8487a9241/?originalSubdomain=bd",
    github: "#",
    portfolio: "#",
    image: "https://media.licdn.com/dms/image/v2/D5603AQG_Y9UFTTs1CQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1686282786466?e=1751500800&v=beta&t=4g-og-Upf6UxlDltY19g80-O7MiDmsz7cMuNDZ6MYGY",
    bio: "Lecturer at Green University of Bangladesh | Studies MSc Engg.(CSE) in BUET"
  };

  // Developers data
  const developers = [
    {
      name: "Md. Sahid",
      role: "Full Stack Developer",
      email: "msahid.cse@gmail.com",
      linkedin: "https://www.linkedin.com/in/msahid-cse/",
      github: "https://github.com/msahid-cse",
      portfolio: "#",
      image: "https://media.licdn.com/dms/image/v2/D4E03AQHEWtWCZl8-CA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1695474462749?e=1751500800&v=beta&t=-tjNpzVIrQp7SZu7WZRvarzE34cmU8_NA-XIhAi-Q1A",
      bio: "Specialized in MERN stack development with focus on performance optimization and responsive design. Focused on server optimization, database design, and implementing secure authentication systems."
    },
    {
      name: "Bithi Saha Mom",
      role: "UX/UI Designer",
      email: "bithisahamom@gmail.com",
      linkedin: "https://www.linkedin.com/in/bithi-saha-886301248/",
      github: "#",
      portfolio: "#",
      image: "https://media.licdn.com/dms/image/v2/D5603AQHZ4HKGXCeW6Q/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1677003523550?e=1751500800&v=beta&t=TceIS-9haHJKS8-7JcMABmIF8JwsUWp75Wn9x59SNss",
      bio: "Passionate about creating intuitive user interfaces with expertise Figma and React and TailwindCSS."
    },
    {
      name: "Sanjid Ahmmed",
      role: "Frontend Developer",
      email: "sanjid.sa19@gmail.com",
      linkedin: "https://www.linkedin.com/in/sanjid-ahmmed-191sa/",
      github: "https://github.com/sanjid191",
      portfolio: "#",
      image: "https://media.licdn.com/dms/image/v2/D5603AQEL92m33bR9vw/profile-displayphoto-shrink_800_800/B56ZYBcEiFHQAc-/0/1743780858853?e=1751500800&v=beta&t=zQQG7qNvHrG6xO5jkboTMwLF_Aqs_hdhwGMPLUaefWs",
      bio: "Passionate about creating intuitive user interfaces with expertise in React and TailwindCSS."
    }
  ];

  // Developer card component
  const DeveloperCard = ({ person, isInstructor }) => (
    <div className={`bg-gray-800/60 backdrop-blur-md rounded-xl overflow-hidden border border-gray-700 transition-all hover:border-teal-500/50 hover:shadow-lg hover:shadow-teal-500/10 ${isInstructor ? 'lg:flex' : ''}`}>
      <div className={`relative ${isInstructor ? 'lg:w-1/3' : ''}`}>
        <img 
          src={person.image} 
          alt={person.name} 
          className={`w-full object-cover ${isInstructor ? 'h-64 lg:h-full' : 'h-64'}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-70"></div>
      </div>
      
      <div className={`p-6 ${isInstructor ? 'lg:w-2/3' : ''}`}>
        <div className="mb-4">
          <h3 className="text-2xl font-bold text-white">{person.name}</h3>
          <p className="text-teal-400 font-medium">{isInstructor ? person.title : person.role}</p>
          {isInstructor && (
            <p className="text-gray-400 mt-1">
              {person.department}, {person.university}
            </p>
          )}
        </div>
        
        <p className="text-gray-300 mb-6">{person.bio}</p>
        
        <div className="flex flex-wrap gap-4">
          <a 
            href={`mailto:${person.email}`} 
            className="flex items-center text-gray-400 hover:text-teal-400 transition-colors"
          >
            <Mail className="w-5 h-5 mr-2" />
            <span className="text-sm">Email</span>
          </a>
          <a 
            href={person.portfolio} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center text-gray-400 hover:text-teal-400 transition-colors"
          >
            <Globe className="w-5 h-5 mr-2" />
            <span className="text-sm">Portfolio</span>
          </a>
          <a 
            href={person.linkedin} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center text-gray-400 hover:text-teal-400 transition-colors"
          >
            <Linkedin className="w-5 h-5 mr-2" />
            <span className="text-sm">LinkedIn</span>
          </a>
          <a 
            href={person.github} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center text-gray-400 hover:text-teal-400 transition-colors"
          >
            <Github className="w-5 h-5 mr-2" />
            <span className="text-sm">GitHub</span>
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Header */}
      <header className="py-8 px-6 md:px-12 bg-black/50 backdrop-blur-md border-b border-gray-800">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold text-teal-400">EduHub Developers</h1>
          <button 
            onClick={() => navigate('/')}
            className="flex items-center text-gray-300 hover:text-teal-400 transition-colors py-2 px-4 rounded-lg border border-gray-700 hover:border-teal-500"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </button>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="container mx-auto py-12 px-6 md:px-12">
        {/* Project Description */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet the Team Behind <span className="text-teal-400">EduHub</span></h2>
          <p className="text-gray-300 max-w-3xl mx-auto">
            EduHub is a comprehensive educational platform designed to connect students, instructors, and educational resources.
            Our team is dedicated to improving educational accessibility and opportunities in Bangladesh.
          </p>
        </div>
        
        {/* Project Instructor */}
        <section className="mb-16">
          <h3 className="text-2xl font-bold mb-8 border-b border-gray-800 pb-3">Project Instructor</h3>
          <DeveloperCard person={instructor} isInstructor={true} />
        </section>
        
        {/* Developers */}
        <section>
          <h3 className="text-2xl font-bold mb-8 border-b border-gray-800 pb-3">Development Team</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {developers.map((developer, index) => (
              <DeveloperCard key={index} person={developer} isInstructor={false} />
            ))}
          </div>
        </section>
      </div>
      
      {/* Footer */}
      <footer className="py-6 px-8 bg-black/50 backdrop-blur-md border-t border-gray-800 mt-12">
        <div className="container mx-auto text-center text-gray-400">
          <div>© {new Date().getFullYear()} EduHub. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
};

export default Developers; 