// import React, { useState } from 'react';
// import LoginPage from "../pages/Login";
// import {
//   Rocket,
//   Users,
//   LogIn,
//   UserPlus,
//   Search,
//   ArrowRight,
//   BookOpen,
//   GraduationCap,
//   MessageCircle,
//   Award,
//   PlayCircle,
//   BarChart,
//   LifeBuoy,
//   XCircle,
// } from 'lucide-react';
// import { NavLink } from 'react-router-dom';

// const Landing = () => {
//   const [currentPage, setCurrentPage] = useState('home');
//   const [videoPlaying, setVideoPlaying] = useState(false);

//   const handleNavigate = (page) => {
//     setCurrentPage(page);
//   };

//   return (
//     <div className="bg-gradient-to-br from-gray-900 to-black min-h-screen flex flex-col">
//       <Header onNavigate={handleNavigate} />
//       <main className="flex-grow">
//         {currentPage === 'home' && (
//           <div className="transition-opacity duration-500">
//             <HomePage onNavigate={handleNavigate} videoPlaying={videoPlaying} setVideoPlaying={setVideoPlaying} />
//           </div>
//         )}
//         {currentPage === 'login' && (
//           <div className="transition-opacity duration-500">
//             <LoginPage onBackToHome={() => handleNavigate('home')} />
//           </div>
//         )}
//       </main>
//       <Footer />
//     </div>
//   );
// };

// const Header = ({ onNavigate }) => {
//   return (
//     <header className="py-6 px-8 bg-black/50 backdrop-blur-md border-b border-gray-800">
//       <div className="container mx-auto flex items-center justify-between">
//         <h1 
//           className="font-['Inter'] text-2xl font-bold text-white flex items-center gap-2 cursor-pointer"
//           onClick={() => onNavigate('home')}
//         >
//           <Rocket className="w-6 h-6 text-teal-400" />
//           EduHub
//         </h1>
//         <nav>
//           <ul className="flex items-center gap-6">
//             <li>
//               <NavLink to="/login"> 
//               <button className="font-['Source_Sans_Pro'] text-gray-300 hover:text-white transition-colors flex items-center"
//                 onClick={() => onNavigate('login')}
//               >
//                 <LogIn className="w-4 h-4 mr-1" />
//                 Login
//               </button>
//              </NavLink>

//             </li>
//             <li>
//               <NavLink to="/register">
//               <button className="font-['Source_Sans_Pro'] text-gray-300 hover:text-white transition-colors flex items-center">
//                 <UserPlus className="w-4 h-4 mr-1" />
//                 Register
//               </button>
//               </NavLink>

//             </li>
//             <li>
//               <button className="font-['Source_Sans_Pro'] font-semibold px-6 py-3 rounded-full transition-all duration-300 flex items-center gap-2 shadow-lg border-2 bg-transparent text-teal-400 border-teal-500/50 hover:bg-teal-500/20 hover:text-teal-300">
//                 <Search className="w-4 h-4" />
//                 Search
//               </button>
//             </li>
//           </ul>
//         </nav>
//       </div>
//     </header>
//   );
// };

// const Footer = () => {
//   return (
//     <footer className="py-6 px-8 bg-black/50 backdrop-blur-md border-t border-gray-800">
//       <div className="container mx-auto text-center text-gray-400 flex flex-col sm:flex-row items-center justify-between gap-4">
//         <div>© {new Date().getFullYear()} EduHub. All rights reserved.</div>
//         <div className="flex gap-4">
//           <a href="#" className="font-['Source_Sans_Pro'] text-gray-300 hover:text-white transition-colors">Privacy Policy</a>
//           <a href="#" className="font-['Source_Sans_Pro'] text-gray-300 hover:text-white transition-colors">Terms of Service</a>
//           <a href="#" className="font-['Source_Sans_Pro'] text-gray-300 hover:text-white transition-colors">Contact Us</a>
//         </div>
//       </div>
//     </footer>
//   );
// };

// const HomePage = ({ onNavigate, videoPlaying, setVideoPlaying }) => {
//   return (
//     <div className="container mx-auto py-12 px-8">
//       <HomeSection onNavigate={onNavigate} />
//       <CoursesSection />
//       <InstructorsSection />
//       <CommunitySection />
//       <VideoSection videoPlaying={videoPlaying} setVideoPlaying={setVideoPlaying} />
//       <StatsSection />
//       <SupportSection />
//       <CallToActionSection onNavigate={onNavigate} />
//     </div>
//   );
// };

// const HomeSection = ({ onNavigate }) => {
//   return (
//     <section className="text-center mb-16">
//       <h2 className="font-['Inter'] text-4xl sm:text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400 mb-4">
//         Welcome to EduHub
//       </h2>
//       <p className="font-['Source_Sans_Pro'] text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
//         The future of education is here. Explore <span className="px-2 py-1 rounded bg-gradient-to-r from-teal-500/20 to-cyan-500/20">cutting-edge courses</span>, connect with <span className="px-2 py-1 rounded bg-gradient-to-r from-teal-500/20 to-cyan-500/20">top instructors</span>, and achieve your <span className="px-2 py-1 rounded bg-gradient-to-r from-teal-500/20 to-cyan-500/20">learning goals</span>.
//       </p>
//       <button 
//         className="font-['Source_Sans_Pro'] font-semibold px-6 py-3 rounded-full transition-all duration-300 flex items-center gap-2 shadow-lg border-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white border-transparent hover:from-teal-600 hover:to-cyan-600 hover:scale-105 mx-auto"
//         onClick={() => onNavigate('login')}
//       >
//         <Rocket className="w-5 h-5 mr-2" />
//         Explore Courses
//       </button>
//     </section>
//   );
// };

// const CoursesSection = () => {
//   const courses = [
//     {
//       title: 'Mastering React',
//       description: 'Build powerful and interactive web applications with React.',
//       instructor: 'Jane Smith',
//       level: 'Advanced',
//       image: 'https://placehold.co/400x200/EEE/31343C',
//     },
//     {
//       title: 'Data Science Essentials',
//       description: 'Learn the fundamentals of data science and machine learning.',
//       instructor: 'David Johnson',
//       level: 'Intermediate',
//       image: 'https://placehold.co/400x200/EEE/31343C',
//     },
//     {
//       title: 'Web Development Bootcamp',
//       description: 'Become a full-stack web developer in this intensive course.',
//       instructor: 'Sarah Williams',
//       level: 'Beginner',
//       image: 'https://placehold.co/400x200/EEE/31343C',
//     },
//   ];

//   return (
//     <section className="mb-16">
//       <h2 className="font-['Inter'] text-3xl sm:text-4xl font-bold text-white mb-6 text-center relative">
//         <BookOpen className="w-6 h-6 inline-block mr-2 text-teal-400" />
//         Featured Courses
//         <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/3 h-1 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full"></span>
//       </h2>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//         {courses.map((course, index) => (
//           <div key={index} className="rounded-xl p-6 bg-gradient-to-br from-gray-900/50 to-gray-900/80 border border-gray-800 shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-[1.02] group">
//             <div className="relative">
//               <img src={course.image} alt={course.title} className="w-full h-48 object-cover rounded-t-xl" onError={(e) => { e.target.src = 'https://placehold.co/400x200/555/EEE?text=Image+Error' }} />
//               <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent rounded-t-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
//               <div className="absolute bottom-2 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                 <h4 className="font-['Inter'] text-lg">{course.title}</h4>
//                 <p className="font-['Source_Sans_Pro'] text-sm">{course.instructor}</p>
//               </div>
//             </div>
//             <div className="mt-4">
//               <h3 className="font-['Inter'] text-xl text-white">{course.title}</h3>
//               <p className="font-['Source_Sans_Pro'] text-gray-400">{course.description}</p>
//             </div>
//             <div className="mt-4 font-['Source_Sans_Pro'] flex items-center justify-between text-gray-300">
//               <span>Instructor: {course.instructor}</span>
//               <span className="font-semibold">Level: {course.level}</span>
//             </div>
//             <div className="mt-4">
//               <button className="font-['Source_Sans_Pro'] font-semibold w-full px-6 py-3 rounded-full transition-all duration-300 flex items-center gap-2 shadow-lg border-2 bg-transparent text-teal-400 border-teal-500/50 hover:bg-teal-500/20 hover:text-teal-300 justify-center">
//                 View Course <ArrowRight className="w-4 h-4" />
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//       <div className="mt-12 text-center">
//         <button className="font-['Source_Sans_Pro'] font-semibold px-6 py-3 rounded-full transition-all duration-300 flex items-center gap-2 shadow-lg border-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white border-transparent hover:from-teal-600 hover:to-cyan-600 hover:scale-105 mx-auto">
//           View All Courses <BookOpen className="w-5 h-5 ml-2" />
//         </button>
//       </div>
//     </section>
//   );
// };

// const InstructorsSection = () => {
//   const instructors = [
//     {
//       name: 'Dr. Eleanor Vance',
//       expertise: 'Astrophysics',
//       bio: 'A renowned astrophysicist with over 20 years of experience.',
//       image: 'https://placehold.co/150x150/EEE/31343C',
//     },
//     {
//       name: 'Professor Jian Li',
//       expertise: 'Artificial Intelligence',
//       bio: 'A leading researcher in AI and machine learning.',
//       image: 'https://placehold.co/150x150/EEE/31343C',
//     },
//     {
//       name: 'Dr. Anya Petrova',
//       expertise: 'Quantum Physics',
//       bio: 'An expert in quantum physics and theoretical mechanics.',
//       image: 'https://placehold.co/150x150/EEE/31343C',
//     },
//   ];

//   return (
//     <section className="mb-16">
//       <h2 className="font-['Inter'] text-3xl sm:text-4xl font-bold text-white mb-6 text-center relative">
//         <GraduationCap className="w-6 h-6 inline-block mr-2 text-cyan-400" />
//         Meet Our Instructors
//         <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/3 h-1 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full"></span>
//       </h2>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//         {instructors.map((instructor, index) => (
//           <div key={index} className="rounded-xl p-6 bg-gradient-to-br from-gray-900/50 to-gray-900/80 border border-gray-800 shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-[1.02] group flex flex-col items-center text-center">
//             <div className="relative mb-4">
//               <img src={instructor.image} alt={instructor.name} className="w-32 h-32 rounded-full border-4 border-teal-500/50" onError={(e) => { e.target.src = 'https://placehold.co/150x150/555/EEE?text=Image+Error' }} />
//               <div className="absolute inset-0 rounded-full bg-gradient-to-br from-teal-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
//             </div>
//             <h4 className="font-['Inter'] text-xl text-white">{instructor.name}</h4>
//             <p className="font-['Source_Sans_Pro'] text-gray-400 mb-2">{instructor.expertise}</p>
//             <p className="font-['Source_Sans_Pro'] text-gray-300 text-sm">{instructor.bio}</p>
//           </div>
//         ))}
//       </div>
//       <div className="mt-12 text-center">
//         <button className="font-['Source_Sans_Pro'] font-semibold px-6 py-3 rounded-full transition-all duration-300 flex items-center gap-2 shadow-lg border-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white border-transparent hover:from-teal-600 hover:to-cyan-600 hover:scale-105 mx-auto">
//           View All Instructors <GraduationCap className="w-5 h-5 ml-2" />
//         </button>
//       </div>
//     </section>
//   );
// };

// const CommunitySection = () => {
//   const testimonials = [
//     {
//       name: 'Alice Johnson',
//       quote: 'EduHub has transformed my learning experience. The instructors are amazing and the community is incredibly supportive.',
//       avatar: 'https://placehold.co/50x50/EEE/31343C',
//     },
//     {
//       name: 'Bob Williams',
//       quote: 'The job matching feature helped me find my dream job. I am so grateful for EduHub!',
//       avatar: 'https://placehold.co/50x50/EEE/31343C',
//     },
//   ];

//   return (
//     <section className="mb-16">
//       <h2 className="font-['Inter'] text-3xl sm:text-4xl font-bold text-white mb-6 text-center relative">
//         <MessageCircle className="w-6 h-6 inline-block mr-2 text-purple-400" />
//         Community & Testimonials
//         <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/3 h-1 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full"></span>
//       </h2>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         {testimonials.map((testimonial, index) => (
//           <div key={index} className="rounded-xl p-6 bg-gradient-to-br from-gray-900/50 to-gray-900/80 border border-gray-800 shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-[1.02] group">
//             <div className="flex items-center gap-4 mb-4">
//               <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full border-2 border-purple-500/50" onError={(e) => { e.target.src = 'https://placehold.co/50x50/555/EEE?text=Error' }} />
//               <h4 className="font-['Inter'] text-lg text-white">{testimonial.name}</h4>
//             </div>
//             <p className="font-['Source_Sans_Pro'] text-gray-300 italic">"{testimonial.quote}"</p>
//           </div>
//         ))}
//       </div>
//       <div className="mt-12 text-center">
//         <button className="font-['Source_Sans_Pro'] font-semibold px-6 py-3 rounded-full transition-all duration-300 flex items-center gap-2 shadow-lg border-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white border-transparent hover:from-teal-600 hover:to-cyan-600 hover:scale-105 mx-auto">
//           Join Our Community <Users className="w-5 h-5 ml-2" />
//         </button>
//       </div>
//     </section>
//   );
// };

// const VideoSection = ({ videoPlaying, setVideoPlaying }) => {
//   return (
//     <section className="mb-16">
//       <h2 className="font-['Inter'] text-3xl sm:text-4xl font-bold text-white mb-6 text-center relative">
//         <PlayCircle className="w-6 h-6 inline-block mr-2 text-pink-400" />
//         Featured Video
//         <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/3 h-1 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full"></span>
//       </h2>
//       <div className="flex justify-center">
//         <div 
//           className="relative rounded-xl overflow-hidden shadow-2xl border border-gray-800 w-full max-w-3xl transition-all duration-300 hover:scale-[1.02]"
//           onClick={() => setVideoPlaying(!videoPlaying)}
//         >
//           {!videoPlaying && (
//             <div className="absolute inset-0 flex items-center justify-center bg-black/50 cursor-pointer">
//               <PlayCircle className="w-16 h-16 text-white opacity-75" />
//             </div>
//           )}
//           {videoPlaying ? (
//             <iframe
//               src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
//               title="Featured Video"
//               frameBorder="0"
//               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
//               allowFullScreen
//               className="w-full aspect-video"
//             />
//           ) : (
//             <img
//               src="https://placehold.co/800x450/EEE/31343C"
//               alt="Video Placeholder"
//               className="w-full aspect-video cursor-pointer"
//               onError={(e) => { e.target.src = 'https://placehold.co/800x450/555/EEE?text=Video+Placeholder' }}
//             />
//           )}
//         </div>
//       </div>
//       <div className="mt-8 text-center">
//         <button 
//           className="font-['Source_Sans_Pro'] font-semibold px-4 py-2 rounded-md transition-all duration-300 flex items-center gap-2 shadow-lg border-2 bg-black/50 text-white border-white/20 hover:bg-white/10 hover:text-white mx-auto"
//           onClick={() => setVideoPlaying(!videoPlaying)}
//         >
//           {videoPlaying ? 'Close Video' : 'Watch Video'}
//           {videoPlaying ? <XCircle className="w-5 h-5 ml-2" /> : <PlayCircle className="w-5 h-5 ml-2" />}
//         </button>
//       </div>
//     </section>
//   );
// };

// const StatsSection = () => {
//   const stats = [
//     { label: 'Students', value: '10K+', icon: <Users className="w-6 h-6 text-teal-400" /> },
//     { label: 'Courses', value: '500+', icon: <BookOpen className="w-6 h-6 text-cyan-400" /> },
//     { label: 'Instructors', value: '50+', icon: <GraduationCap className="w-6 h-6 text-purple-400" /> },
//     { label: 'Awards', value: '10+', icon: <Award className="w-6 h-6 text-pink-400" /> },
//   ];

//   return (
//     <section className="mb-16">
//       <h2 className="font-['Inter'] text-3xl sm:text-4xl font-bold text-white mb-6 text-center relative">
//         <BarChart className="w-6 h-6 inline-block mr-2 text-yellow-400" />
//         Our Achievements
//         <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/3 h-1 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full"></span>
//       </h2>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//         {stats.map((stat, index) => (
//           <div key={index} className="rounded-xl p-6 bg-gradient-to-br from-gray-900/50 to-gray-900/80 border border-gray-800 shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-[1.02] flex flex-col items-center justify-center h-40">
//             <div className="mb-4">{stat.icon}</div>
//             <h3 className="font-['Inter'] text-2xl text-white">{stat.value}</h3>
//             <p className="font-['Source_Sans_Pro'] text-gray-400">{stat.label}</p>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// };

// const SupportSection = () => {
//   return (
//     <section className="mb-16">
//       <h2 className="font-['Inter'] text-3xl sm:text-4xl font-bold text-white mb-6 text-center relative">
//         <LifeBuoy className="w-6 h-6 inline-block mr-2 text-orange-400" />
//         Support
//         <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/3 h-1 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full"></span>
//       </h2>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         <div className="rounded-xl p-6 bg-gradient-to-br from-gray-900/50 to-gray-900/80 border border-gray-800 shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-[1.02]">
//           <div className="mb-4">
//             <h3 className="font-['Inter'] text-xl text-white">Help Center</h3>
//             <p className="font-['Source_Sans_Pro'] text-gray-400">
//               Find answers to common questions and get support.
//             </p>
//           </div>
//           <div>
//             <ul className="font-['Source_Sans_Pro'] list-disc list-inside space-y-2 text-gray-300">
//               <li>Account & Profile</li>
//               <li>Course Access</li>
//               <li>Payments & Billing</li>
//               <li>Technical Issues</li>
//             </ul>
//             <div className="mt-4">
//               <button className="font-['Source_Sans_Pro'] font-semibold w-full px-6 py-3 rounded-full transition-all duration-300 flex items-center gap-2 shadow-lg border-2 bg-transparent text-teal-400 border-teal-500/50 hover:bg-teal-500/20 hover:text-teal-300 justify-center">
//                 Visit Help Center <ArrowRight className="w-4 h-4 ml-2" />
//               </button>
//             </div>
//           </div>
//         </div>

//         <div className="rounded-xl p-6 bg-gradient-to-br from-gray-900/50 to-gray-900/80 border border-gray-800 shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-[1.02]">
//           <div className="mb-4">
//             <h3 className="font-['Inter'] text-xl text-white">Community Forum</h3>
//             <p className="font-['Source_Sans_Pro'] text-gray-400">
//               Connect with other learners and instructors.
//             </p>
//           </div>
//           <div>
//             <ul className="font-['Source_Sans_Pro'] list-disc list-inside space-y-2 text-gray-300">
//               <li>Discussions</li>
//               <li>Q&A</li>
//               <li>Announcements</li>
//               <li>Feedback</li>
//             </ul>
//             <div className="mt-4">
//               <button className="font-['Source_Sans_Pro'] font-semibold w-full px-6 py-3 rounded-full transition-all duration-300 flex items-center gap-2 shadow-lg border-2 bg-transparent text-teal-400 border-teal-500/50 hover:bg-teal-500/20 hover:text-teal-300 justify-center">
//                 Join Forum <Users className="w-4 h-4 ml-2" />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// const CallToActionSection = ({ onNavigate }) => {
//   return (
//     <section className="text-center py-16 px-8 rounded-xl bg-gradient-to-br from-teal-900/90 to-cyan-900/90 border border-gray-800 shadow-2xl">
//       <h2 className="font-['Inter'] text-4xl sm:text-5xl font-bold text-white mb-4">Ready to Transform Your Future?</h2>
//       <p className="font-['Source_Sans_Pro'] text-xl text-gray-300 max-w-3xl mx-auto mb-8">
//         Join EduHub today and unlock a world of knowledge and opportunities.
//       </p>
//       <NavLink to="/login">
//       <button 
//       className="font-['Source_Sans_Pro'] font-semibold px-6 py-3 rounded-full transition-all duration-300 flex items-center gap-2 shadow-lg border-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white border-transparent hover:from-teal-600 hover:to-cyan-600 hover:scale-105 mx-auto text-xl"
//         onClick={() => onNavigate('login')}
//       >
//         Get Started Now <ArrowRight className="w-6 h-6 ml-2" />
//       </button>
//       </NavLink>


//     </section>
//   );
// };
// export default Landing;






import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { ArrowRight } from 'lucide-react';
import axios from 'axios'; // for fetching universities and countries

const Landing = () => {
  const [selectedCountry, setSelectedCountry] = useState('');
  const [universityName, setUniversityName] = useState('');
  const [universities, setUniversities] = useState([]);
  const [countries, setCountries] = useState([]);
  const [isLoadingUniversities, setIsLoadingUniversities] = useState(false);
  const [isLoadingCountries, setIsLoadingCountries] = useState(true);
  const navigate = useNavigate();

  // Fetch countries from RestCountries API
  useEffect(() => {
    axios.get('https://restcountries.com/v3.1/all')
      .then(response => {
        const sortedCountries = response.data
          .map(country => country.name.common)
          .sort((a, b) => a.localeCompare(b));
        setCountries(sortedCountries);
        setIsLoadingCountries(false);
      })
      .catch(error => {
        console.error('Error fetching countries:', error);
        setIsLoadingCountries(false);
      });
  }, []);

  // Fetch universities when country changes
  useEffect(() => {
    if (selectedCountry) {
      setIsLoadingUniversities(true);
      axios.get(`http://universities.hipolabs.com/search?country=${selectedCountry}`)
        .then(response => {
          setUniversities(response.data.map(uni => uni.name));
          setIsLoadingUniversities(false);
        })
        .catch(error => {
          console.error('Error fetching universities:', error);
          setIsLoadingUniversities(false);
        });
    }
  }, [selectedCountry]);

  const handleCountryChange = (e) => {
    setSelectedCountry(e.target.value);
    setUniversityName('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedCountry && universityName) {
      localStorage.setItem('userPreferences', JSON.stringify({
        country: selectedCountry,
        university: universityName
      }));
      navigate('/dashboard'); // Redirect to dashboard or another page
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black min-h-screen flex flex-col">
      {/* <Navbar /> */}
      
      <main className="flex-grow flex items-center justify-center">
        <div className="container mx-auto px-8 py-12">
          <div className="max-w-2xl mx-auto bg-gradient-to-br from-gray-900/50 to-gray-900/80 border border-gray-800 rounded-xl shadow-2xl backdrop-blur-md p-8">
            <h2 className="font-['Inter'] text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400 mb-6 text-center">
              Welcome to EduHub
            </h2>
            
            <p className="font-['Source_Sans_Pro'] text-lg text-gray-300 mb-8 text-center">
              Please select your country and enter your university name to get personalized recommendations.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="country" className="font-['Source_Sans_Pro'] block text-gray-300 mb-2">
                  Select Your Country
                </label>
                {isLoadingCountries ? (
                  <div className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white">
                    Loading countries...
                  </div>
                ) : (
                  <select
                    id="country"
                    value={selectedCountry}
                    onChange={handleCountryChange}
                    className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  >
                    <option value="">-- Select Country --</option>
                    {countries.map((country, index) => (
                      <option key={index} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              
              <div>
                <label htmlFor="university" className="font-['Source_Sans_Pro'] block text-gray-300 mb-2">
                  {selectedCountry ? `Select Your University in ${selectedCountry}` : 'Select Your University'}
                </label>
                {isLoadingUniversities ? (
                  <div className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white">
                    Loading universities...
                  </div>
                ) : (
                  <select
                    id="university"
                    value={universityName}
                    onChange={(e) => setUniversityName(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                    disabled={!selectedCountry || universities.length === 0}
                  >
                    <option value="">-- Select University --</option>
                    {universities.map((uni, index) => (
                      <option key={index} value={uni}>{uni}</option>
                    ))}
                  </select>
                )}
                {selectedCountry && universities.length === 0 && !isLoadingUniversities && (
                  <p className="text-gray-400 mt-2">No universities found for this country</p>
                )}
              </div>
              
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={!selectedCountry || !universityName}
                  className={`font-['Source_Sans_Pro'] font-semibold w-full px-6 py-4 rounded-full transition-all duration-300 flex items-center gap-2 shadow-lg border-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white border-transparent hover:from-teal-600 hover:to-cyan-600 justify-center text-lg ${(!selectedCountry || !universityName) ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02]'}`}>
                  Continue to EduHub <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="py-6 px-8 bg-black/50 backdrop-blur-md border-t border-gray-800">
      <div className="container mx-auto text-center text-gray-400 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>© {new Date().getFullYear()} EduHub Global. All rights reserved.</div>
        <div className="flex gap-4">
          <a href="#" className="font-['Source_Sans_Pro'] text-gray-300 hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="font-['Source_Sans_Pro'] text-gray-300 hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="font-['Source_Sans_Pro'] text-gray-300 hover:text-white transition-colors">Contact Us</a>
        </div>
      </div>
    </footer>
  );
};

export default Landing;
