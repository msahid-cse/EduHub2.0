import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Github, Linkedin, Mail, ArrowLeft } from 'lucide-react';

const Developers = () => {
  const navigate = useNavigate();

  // Instructor data
  const instructor = {
    name: "Dr. Jane Smith",
    title: "Project Instructor",
    department: "Computer Science & Engineering",
    university: "University of Bangladesh",
    email: "janesmith@example.com",
    linkedin: "https://linkedin.com/in/janesmith",
    github: "https://github.com/janesmith",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    bio: "PhD in Computer Science with expertise in Web Development and Software Engineering. Leading EduHub 2.0 to revolutionize education technology in Bangladesh."
  };

  // Developers data
  const developers = [
    {
      name: "Mohammad Ali",
      role: "Full Stack Developer",
      email: "mohammadali@example.com",
      linkedin: "https://linkedin.com/in/mohammadali",
      github: "https://github.com/mohammadali",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      bio: "Specialized in MERN stack development with focus on performance optimization and responsive design."
    },
    {
      name: "Fatima Rahman",
      role: "UX/UI Designer & Frontend Developer",
      email: "fatimarahman@example.com",
      linkedin: "https://linkedin.com/in/fatimarahman",
      github: "https://github.com/fatimarahman",
      image: "https://randomuser.me/api/portraits/women/65.jpg",
      bio: "Passionate about creating intuitive user interfaces with expertise in React and TailwindCSS."
    },
    {
      name: "Rahul Khan",
      role: "Backend Developer & DevOps",
      email: "rahulkhan@example.com",
      linkedin: "https://linkedin.com/in/rahulkhan",
      github: "https://github.com/rahulkhan",
      image: "https://randomuser.me/api/portraits/men/75.jpg",
      bio: "Focused on server optimization, database design, and implementing secure authentication systems."
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
        
        <div className="flex space-x-4">
          <a 
            href={`mailto:${person.email}`} 
            className="flex items-center text-gray-400 hover:text-teal-400 transition-colors"
          >
            <Mail className="w-5 h-5 mr-2" />
            <span className="text-sm">Email</span>
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