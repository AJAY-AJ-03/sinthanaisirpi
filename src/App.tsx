



// import React, { useState } from 'react';
// import { motion } from 'framer-motion';
// import { useKeenSlider } from 'keen-slider/react';
// import "keen-slider/keen-slider.min.css";
// import { Navbar } from './components/Navbar';
// import { LoginForm } from './components/LoginForm';
// import { EvaluatorLogin } from './components/EvaluatorLogin';
// import { AdminLogin } from './components/AdminLogin';
// import { LoginSelectionModal } from './components/LoginSelectionModal';
// import { Dashboard } from './components/Dashboard';
// import { EvaluatorDashboard } from './components/EvaluatorDashboard';
// import { Footer } from './components/Footer';
// import { ChevronRight, Mail, Phone, MapPin, Send, ExternalLink, Calendar, Clock, Users, Trophy } from 'lucide-react';
// import { FaGoogle, FaMicrosoft, FaApple, FaAmazon } from "react-icons/fa";

// function App() {
//   const [showLoginSelection, setShowLoginSelection] = useState(false);
//   const [showSchoolLogin, setShowSchoolLogin] = useState(false);
//   const [showEvaluatorLogin, setShowEvaluatorLogin] = useState(false);
//   const [showAdminLogin, setShowAdminLogin] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [user, setUser] = useState(null);
//   const [evaluator, setEvaluator] = useState(null);
//   const [activeSection, setActiveSection] = useState('Home');
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const [loaded, setLoaded] = useState(false);

//   const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
//     initial: 0,
//     slideChanged(slider) {
//       setCurrentSlide(slider.track.details.rel);
//     },
//     created() {
//       setLoaded(true);
//     },
//     loop: true,
//     mode: "snap",
//     slides: {
//       perView: () => {
//         if (window.innerWidth < 640) return 1;
//         if (window.innerWidth < 1024) return 2;
//         return 3;
//       },
//       spacing: 15,
//     },
//   });

//   const handleLoginSuccess = (userData: any) => {
//     setIsLoggedIn(true);
//     setUser(userData);
//     setShowLoginSelection(false);
//     setShowSchoolLogin(false);
//     setShowEvaluatorLogin(false);
//     setShowAdminLogin(false);
//   };

//   const handleEvaluatorLoginSuccess = (evaluatorData: any) => {
//     setEvaluator(evaluatorData.evaluator);
//     setIsLoggedIn(true);
//     setShowEvaluatorLogin(false);
//   };

//   const handleLogout = () => {
//     setIsLoggedIn(false);
//     setUser(null);
//     setEvaluator(null);
//     localStorage.removeItem('token');
//     localStorage.removeItem('evaluatorToken');
//     localStorage.removeItem('evaluatorData');
//   };

//   const handleLoginTypeSelect = (type: 'school' | 'evaluator' | 'admin') => {
//     setShowLoginSelection(false);
//     switch (type) {
//       case 'school':
//         setShowSchoolLogin(true);
//         break;
//       case 'evaluator':
//         setShowEvaluatorLogin(true);
//         break;
//       case 'admin':
//         setShowAdminLogin(true);
//         break;
//     }
//   };

//   const handleSectionChange = (section: string) => {
//     setActiveSection(section);
//     const element = document.getElementById(section.toLowerCase());
//     if (element) {
//       element.scrollIntoView({ behavior: 'smooth' });
//     }
//   };

//   const HomeBanners = () => (
//     <div className="space-y-4">
//       <div className="bg-red-800 text-white py-3 overflow-hidden rounded-lg">
//         <div className="animate-marquee whitespace-nowrap">
//           <span className="mx-4">🚀 Register now for the EDII Hackathon 2024!</span>
//           <span className="mx-4">💡 Showcase your innovative ideas</span>
//           <span className="mx-4">🏆 Win exciting prizes</span>
//           <span className="mx-4">📅 Last date for registration: March 31, 2024</span>
//         </div>
//       </div>
//       <div className="relative h-[550px] overflow-hidden rounded-xl">
//         <div className="flex h-full">
//           <img
//             src="school2.avif"
//             alt="Banner 1"
//             className="w-1/2 object-fit"
//           />
//           <img
//             src="banner.png"
//             alt="Banner 2"
//             className="w-1/2 object-fit"
//           />
//         </div>
//       </div>
      
//     </div>
//   );

//   const AboutSection = () => (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
//       <img
//         src="about1.png"
//         alt="About Us"
//         className="h-[550px] w-[550px]"
//       />
//       <div className="space-y-6">
//         <h2 className="text-3xl font-bold text-gray-900">About EDII Hackathon</h2>
//         <p className="text-gray-600 leading-relaxed">
//           The EDII Hackathon is a premier innovation challenge that brings together bright minds
//           to solve real-world problems. Our mission is to foster innovation, creativity, and
//           entrepreneurship among students while providing them with a platform to showcase their talents.
//         </p>
//         <div className="grid grid-cols-2 gap-4">
//           <div className="bg-red-50 p-4 rounded-lg">
//             <h3 className="font-semibold text-red-800">Innovation</h3>
//             <p className="text-sm text-gray-600">Fostering creative solutions</p>
//           </div>
//           <div className="bg-red-50 p-4 rounded-lg">
//             <h3 className="font-semibold text-red-800">Collaboration</h3>
//             <p className="text-sm text-gray-600">Building together</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const ScheduleSection = () => (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//       <div className="space-y-4">
//         <img
//           src="event.png"
//           alt="Schedule"
//           className="w-[550px] h-[450px]"
//         />
//         <div className="grid grid-cols-2 gap-4">
//           <div className="bg-red-50 p-4 rounded-lg text-center">
//             <Calendar className="w-6 h-6 text-red-800 mx-auto mb-2" />
//             <span className="text-sm font-medium">March 15 - April 15</span>
//           </div>
//           <div className="bg-red-50 p-4 rounded-lg text-center">
//             <Clock className="w-6 h-6 text-red-800 mx-auto mb-2" />
//             <span className="text-sm font-medium">24 Hours</span>
//           </div>
//         </div>
//       </div>
//       <div className="bg-white rounded-xl shadow-lg p-6">
//         <h2 className="text-2xl font-bold mb-6 text-red-800">Event Timeline</h2>
//         <div className="space-y-6">
//           {[
//             { date: "March 15, 2024", title: "Registration Opens", description: "Start of participant registration" },
//             { date: "March 31, 2024", title: "Registration Closes", description: "Last date to register" },
//             { date: "April 5, 2024", title: "Idea Submission", description: "Submit your proposals" },
//             { date: "April 15, 2024", title: "Hackathon Day", description: "Main event" }
//           ].map((event, index) => (
//             <div key={index} className="flex items-start">
//               <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
//                 <span className="text-red-800 font-semibold">{index + 1}</span>
//               </div>
//               <div className="ml-4">
//                 <h3 className="text-lg font-semibold">{event.title}</h3>
//                 <p className="text-gray-600 text-sm">{event.date}</p>
//                 <p className="text-gray-700 mt-1">{event.description}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );

//   const GuidelinesSection = () => (
//     <div className="space-y-8">
//       <h2 className="text-3xl font-bold text-center text-gray-900">Hackathon Guidelines</h2>
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {[
//           {
//             title: "Team Formation",
//             description: "Form a team of 2-5 members from your school",
//             icon: Users
//           },
//           {
//             title: "Project Requirements",
//             description: "Focus on innovative solutions for real-world problems",
//             icon: Trophy
//           },
//           {
//             title: "Submission Process",
//             description: "Submit your project with documentation and presentation",
//             icon: Send
//           }
//         ].map((guideline, index) => (
//           <motion.div
//             key={index}
//             className="bg-white p-6 rounded-xl shadow-lg"
//             whileHover={{ y: -5 }}
//           >
//             <guideline.icon className="w-8 h-8 text-red-800 mb-4" />
//             <h3 className="text-xl font-semibold mb-2">{guideline.title}</h3>
//             <p className="text-gray-600">{guideline.description}</p>
//           </motion.div>
//         ))}
//       </div>
//     </div>
//   );

//   const RoadmapSection = () => (
//     <div className="w-full">
//       <img
//         src="roadmap1.png"
//         alt="Roadmap"
//         className="w-full h-[1000px] object-cover rounded-xl shadow-lg"
//       />
//     </div>
//   );

//   const GallerySection = () => (
//     <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//       {[
//         {
//           image: "image-2.jpg",
//           title: "Innovation Hub",
//           description: "Where ideas come to life"
//         },
//         {
//           image: "image-1.jpg",
//           title: "Collaboration Space",
//           description: "Teams working together"
//         },
//         {
//           image: "image-4.jpg",
//           title: "Presentation Time",
//           description: "Showcasing solutions"
//         }
//       ].map((item, index) => (
//         <motion.div
//           key={index}
//           className="bg-white rounded-xl shadow-lg overflow-hidden"
//           whileHover={{ scale: 1.02 }}
//         >
//           <img
//             src={`${item.image}?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80`}
//             alt={item.title}
//             className="w-full h-55 object-cover"
//           />
//           <div className="p-6">
//             <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
//             <p className="text-gray-600">{item.description}</p>
//           </div>
//         </motion.div>
//       ))}
//     </div>
//   );

//   const SpeakersSection = () => {
//     const speakers = [
//       { 
//         name: "Dr. Ramesh Kumar", 
//         title: "AI & ML Expert, Google",
//         image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=400&q=80"
//       },
//       { 
//         name: "Ms. Priya Sharma", 
//         title: "Cybersecurity Analyst, Microsoft",
//         image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=400&q=80"
//       },
//       { 
//         name: "Mr. Aditya Verma", 
//         title: "CTO, StartupX",
//         image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=400&q=80"
//       },
//       { 
//         name: "Dr. Anjali Mehta", 
//         title: "Professor, IIT Madras",
//         image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=400&q=80"
//       },
//       { 
//         name: "Mr. Karthik Rajan", 
//         title: "Lead Developer, TCS",
//         image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=400&q=80"
//       },
//     ];

//     return (
//       <div className="space-y-8">
//         <h2 className="text-3xl font-bold text-center text-gray-900">Featured Speakers</h2>
//         <div ref={sliderRef} className="keen-slider">
//           {speakers.map((speaker, idx) => (
//             <div key={idx} className="keen-slider__slide">
//               <div className="bg-white rounded-xl shadow-lg p-6 text-center">
//                 <img 
//                   src={speaker.image} 
//                   alt={speaker.name}
//                   className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
//                 />
//                 <h3 className="text-xl font-semibold">{speaker.name}</h3>
//                 <p className="text-gray-600">{speaker.title}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//         {loaded && instanceRef.current && (
//           <div className="flex justify-center gap-2 mt-4">
//             {[...Array(instanceRef.current.track.details.slides.length).keys()].map((idx) => (
//               <button
//                 key={idx}
//                 onClick={() => instanceRef.current?.moveToIdx(idx)}
//                 className={`w-2 h-2 rounded-full transition-colors duration-200 ${
//                   currentSlide === idx ? "bg-red-800" : "bg-gray-300"
//                 }`}
//               />
//             ))}
//           </div>
//         )}
//       </div>
//     );
//   };

//   const ContactSection = () => (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//       <div className="bg-white p-6">
//         <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
//         <form className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Name</label>
//             <input type="text" className="mt-1 block w-full rounded-lg border-gray-300" />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Email</label>
//             <input type="email" className="mt-1 block w-full rounded-lg border-gray-300" />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Message</label>
//             <textarea rows={4} className="mt-1 block w-full rounded-lg border-gray-300"></textarea>
//           </div>
//           <button type="submit" className="w-full bg-red-800 text-white rounded-lg py-2 hover:bg-red-900">
//             Send Message
//           </button>
//         </form>
//       </div>
//       <div className="space-y-4">
//         <img
//           src="contact.png"
//           alt="Contact"
//           className="h-[480px] w-[500px]"
//         />
//       </div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {isLoggedIn ? (
//         evaluator ? (
//           <EvaluatorDashboard 
//             evaluator={evaluator} 
//             onLogout={handleLogout}
//           />
//         ) : (
//           <Dashboard user={user} />
//         )
//       ) : (
//         <>
//           <header className="bg-white shadow-sm">
//             <div className="mx-auto px-4 sm:px-6 lg:px-8">
//               <div className="flex items-center justify-between h-20">
//                 <div className="flex items-center space-x-4 flex-shrink-0">
//                   <img src="/vosa.png" alt="Logo 1" className="h-16 w-auto" />
//                   <img src="/tn.png" alt="Logo 2" className="h-14 w-auto" />
//                   <img src="/edii.png" alt="Logo 3" className="h-12 w-auto" />
//                 </div>

//                 <div className="hidden md:block flex-grow ml-20">
//                   <Navbar 
//                     activeSection={activeSection}
//                     onSectionChange={handleSectionChange}
//                   />
//                 </div>

//                 <button
//                   onClick={() => setShowLoginSelection(true)}
//                   className="flex-shrink-0 px-6 py-2 bg-red-800 text-white rounded-lg hover:bg-red-900 transition-colors"
//                 >
//                   Login
//                 </button>
//               </div>
//             </div>
//           </header>

//           <div className="md:hidden">
//             <Navbar 
//               activeSection={activeSection}
//               onSectionChange={handleSectionChange}
//             />
//           </div>

//           <main className="mx-auto px-4 space-y-24">
//             <section id="home">
//               <HomeBanners />
//             </section>

//             <section id="about">
//               <AboutSection />
//             </section>

//             <section id="roadmap">
//               <RoadmapSection />
//             </section>

//             <section id="schedule">
//               <ScheduleSection />
//             </section>

//             <section id="guidelines">
//               <GuidelinesSection />
//             </section>

//             <section id="gallery">
//               <GallerySection />
//             </section>

//             <section id="speakers">
//               <SpeakersSection />
//             </section>

//             <section id="contact">
//               <ContactSection />
//             </section>
//           </main>
//           <Footer />

//           {showLoginSelection && (
//             <LoginSelectionModal
//               onClose={() => setShowLoginSelection(false)}
//               onSelectLoginType={handleLoginTypeSelect}
//             />
//           )}

//           {showSchoolLogin && (
//             <LoginForm
//               onClose={() => setShowSchoolLogin(false)}
//               onLoginSuccess={handleLoginSuccess}
//             />
//           )}

//           {showEvaluatorLogin && (
//             <EvaluatorLogin
//               onClose={() => setShowEvaluatorLogin(false)}
//               onLoginSuccess={handleEvaluatorLoginSuccess}
//             />
//           )}

//           {showAdminLogin && (
//             <AdminLogin
//               onClose={() => setShowAdminLogin(false)}
//               onLoginSuccess={handleLoginSuccess}
//             />
//           )}
//         </>
//       )}

//       <style jsx>{`
//         @keyframes marquee {
//           0% { transform: translateX(100%); }
//           100% { transform: translateX(-100%); }
//         }
//         .animate-marquee {
//           display: inline-block;
//           animation: marquee 20s linear infinite;
//         }
//       `}</style>
//     </div>
//   );
// }

// export default App;



import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useKeenSlider } from 'keen-slider/react';
import "keen-slider/keen-slider.min.css";
import { Navbar } from './components/Navbar';
import { LoginForm } from './components/LoginForm';
import { EvaluatorLogin } from './components/EvaluatorLogin';
import { AdminLogin } from './components/AdminLogin';
import { LoginSelectionModal } from './components/LoginSelectionModal';
import { Dashboard } from './components/Dashboard';
import { EvaluatorDashboard } from './components/EvaluatorDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';
import { ChevronRight, Mail, Phone, MapPin, Send, ExternalLink, Calendar, Clock, Users, Trophy } from 'lucide-react';
import { FaGoogle, FaMicrosoft, FaApple, FaAmazon } from "react-icons/fa";

function App() {
  const [showLoginSelection, setShowLoginSelection] = useState(false);
  const [showSchoolLogin, setShowSchoolLogin] = useState(false);
  const [showEvaluatorLogin, setShowEvaluatorLogin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [evaluator, setEvaluator] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [activeSection, setActiveSection] = useState('Home');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created() {
      setLoaded(true);
    },
    loop: true,
    mode: "snap",
    slides: {
      perView: () => {
        if (window.innerWidth < 640) return 1;
        if (window.innerWidth < 1024) return 2;
        return 3;
      },
      spacing: 15,
    },
  });

  const handleLoginSuccess = (userData: any) => {
    setIsLoggedIn(true);
    if (userData.role === 'admin') {
      setAdmin(userData);
      setUser(null);
      setEvaluator(null);
    } else if (userData.evaluator) {
      setEvaluator(userData.evaluator);
      setUser(null);
      setAdmin(null);
    } else {
      setUser(userData);
      setAdmin(null);
      setEvaluator(null);
    }
    setShowLoginSelection(false);
    setShowSchoolLogin(false);
    setShowEvaluatorLogin(false);
    setShowAdminLogin(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setEvaluator(null);
    setAdmin(null);
    localStorage.removeItem('token');
    localStorage.removeItem('evaluatorToken');
    localStorage.removeItem('evaluatorData');
    localStorage.removeItem('adminData');
  };

  const handleLoginTypeSelect = (type: 'school' | 'evaluator' | 'admin') => {
    setShowLoginSelection(false);
    switch (type) {
      case 'school':
        setShowSchoolLogin(true);
        break;
      case 'evaluator':
        setShowEvaluatorLogin(true);
        break;
      case 'admin':
        setShowAdminLogin(true);
        break;
    }
  };

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    const element = document.getElementById(section.toLowerCase());
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const HomeBanners = () => (
    <div className="space-y-4">
      <div className="bg-red-800 text-white py-3 overflow-hidden rounded-lg">
        <div className="animate-marquee whitespace-nowrap">
          <span className="mx-4">🚀 Register now for the EDII Hackathon 2024!</span>
          <span className="mx-4">💡 Showcase your innovative ideas</span>
          <span className="mx-4">🏆 Win exciting prizes</span>
          <span className="mx-4">📅 Last date for registration: March 31, 2024</span>
        </div>
      </div>
      <div className="relative h-[550px] overflow-hidden rounded-xl">
        <div className="flex h-full">
          <img
            src="school2.avif"
            alt="Banner 1"
            className="w-1/2 object-fit"
          />
          <img
            src="banner.png"
            alt="Banner 2"
            className="w-1/2 object-fit"
          />
        </div>
      </div>
    </div>
  );

  const AboutSection = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      <img
        src="about1.png"
        alt="About Us"
        className="h-[550px] w-[550px]"
      />
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900">About EDII Hackathon</h2>
        <p className="text-gray-600 leading-relaxed">
          The EDII Hackathon is a premier innovation challenge that brings together bright minds
          to solve real-world problems. Our mission is to foster innovation, creativity, and
          entrepreneurship among students while providing them with a platform to showcase their talents.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="font-semibold text-red-800">Innovation</h3>
            <p className="text-sm text-gray-600">Fostering creative solutions</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="font-semibold text-red-800">Collaboration</h3>
            <p className="text-sm text-gray-600">Building together</p>
          </div>
        </div>
      </div>
    </div>
  );

  const ScheduleSection = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <img
          src="event.png"
          alt="Schedule"
          className="w-[550px] h-[450px]"
        />
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-red-50 p-4 rounded-lg text-center">
            <Calendar className="w-6 h-6 text-red-800 mx-auto mb-2" />
            <span className="text-sm font-medium">March 15 - April 15</span>
          </div>
          <div className="bg-red-50 p-4 rounded-lg text-center">
            <Clock className="w-6 h-6 text-red-800 mx-auto mb-2" />
            <span className="text-sm font-medium">24 Hours</span>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-red-800">Event Timeline</h2>
        <div className="space-y-6">
          {[
            { date: "March 15, 2024", title: "Registration Opens", description: "Start of participant registration" },
            { date: "March 31, 2024", title: "Registration Closes", description: "Last date to register" },
            { date: "April 5, 2024", title: "Idea Submission", description: "Submit your proposals" },
            { date: "April 15, 2024", title: "Hackathon Day", description: "Main event" }
          ].map((event, index) => (
            <div key={index} className="flex items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-800 font-semibold">{index + 1}</span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold">{event.title}</h3>
                <p className="text-gray-600 text-sm">{event.date}</p>
                <p className="text-gray-700 mt-1">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const GuidelinesSection = () => (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-center text-gray-900">Hackathon Guidelines</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: "Team Formation",
            description: "Form a team of 2-5 members from your school",
            icon: Users
          },
          {
            title: "Project Requirements",
            description: "Focus on innovative solutions for real-world problems",
            icon: Trophy
          },
          {
            title: "Submission Process",
            description: "Submit your project with documentation and presentation",
            icon: Send
          }
        ].map((guideline, index) => (
          <motion.div
            key={index}
            className="bg-white p-6 rounded-xl shadow-lg"
            whileHover={{ y: -5 }}
          >
            <guideline.icon className="w-8 h-8 text-red-800 mb-4" />
            <h3 className="text-xl font-semibold mb-2">{guideline.title}</h3>
            <p className="text-gray-600">{guideline.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const RoadmapSection = () => (
    <div className="w-full">
      <img
        src="roadmap1.png"
        alt="Roadmap"
        className="w-full h-[1000px] object-cover rounded-xl shadow-lg"
      />
    </div>
  );

  const GallerySection = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {[
        {
          image: "image-2.jpg",
          title: "Innovation Hub",
          description: "Where ideas come to life"
        },
        {
          image: "image-1.jpg",
          title: "Collaboration Space",
          description: "Teams working together"
        },
        {
          image: "image-4.jpg",
          title: "Presentation Time",
          description: "Showcasing solutions"
        }
      ].map((item, index) => (
        <motion.div
          key={index}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
          whileHover={{ scale: 1.02 }}
        >
          <img
            src={`${item.image}?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80`}
            alt={item.title}
            className="w-full h-55 object-cover"
          />
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
            <p className="text-gray-600">{item.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );

  const SpeakersSection = () => {
    const speakers = [
      { 
        name: "Dr. Ramesh Kumar", 
        title: "AI & ML Expert, Google",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=400&q=80"
      },
      { 
        name: "Ms. Priya Sharma", 
        title: "Cybersecurity Analyst, Microsoft",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=400&q=80"
      },
      { 
        name: "Mr. Aditya Verma", 
        title: "CTO, StartupX",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=400&q=80"
      },
      { 
        name: "Dr. Anjali Mehta", 
        title: "Professor, IIT Madras",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=400&q=80"
      },
      { 
        name: "Mr. Karthik Rajan", 
        title: "Lead Developer, TCS",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=400&q=80"
      },
    ];

    return (
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-center text-gray-900">Featured Speakers</h2>
        <div ref={sliderRef} className="keen-slider">
          {speakers.map((speaker, idx) => (
            <div key={idx} className="keen-slider__slide">
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <img 
                  src={speaker.image} 
                  alt={speaker.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold">{speaker.name}</h3>
                <p className="text-gray-600">{speaker.title}</p>
              </div>
            </div>
          ))}
        </div>
        {loaded && instanceRef.current && (
          <div className="flex justify-center gap-2 mt-4">
            {[...Array(instanceRef.current.track.details.slides.length).keys()].map((idx) => (
              <button
                key={idx}
                onClick={() => instanceRef.current?.moveToIdx(idx)}
                className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                  currentSlide === idx ? "bg-red-800" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  const ContactSection = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-white p-6">
        <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input type="text" className="mt-1 block w-full rounded-lg border-gray-300" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" className="mt-1 block w-full rounded-lg border-gray-300" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Message</label>
            <textarea rows={4} className="mt-1 block w-full rounded-lg border-gray-300"></textarea>
          </div>
          <button type="submit" className="w-full bg-red-800 text-white rounded-lg py-2 hover:bg-red-900">
            Send Message
          </button>
        </form>
      </div>
      <div className="space-y-4">
        <img
          src="contact.png"
          alt="Contact"
          className="h-[480px] w-[500px]"
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {isLoggedIn ? (
        admin ? (
          <AdminDashboard onLogout={handleLogout} />
        ) : evaluator ? (
          <EvaluatorDashboard 
            evaluator={evaluator} 
            onLogout={handleLogout}
          />
        ) : (
          <Dashboard user={user} />
        )
      ) : (
        <>
          <header className="bg-white shadow-sm">
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-20">
                <div className="flex items-center space-x-4 flex-shrink-0">
                  <img src="/vosa.png" alt="Logo 1" className="h-16 w-auto" />
                  <img src="/tn.png" alt="Logo 2" className="h-14 w-auto" />
                  <img src="/edii.png" alt="Logo 3" className="h-12 w-auto" />
                </div>

                <div className="hidden md:block flex-grow ml-20">
                  <Navbar 
                    activeSection={activeSection}
                    onSectionChange={handleSectionChange}
                  />
                </div>

                <button
                  onClick={() => setShowLoginSelection(true)}
                  className="flex-shrink-0 px-6 py-2 bg-red-800 text-white rounded-lg hover:bg-red-900 transition-colors"
                >
                  Login
                </button>
              </div>
            </div>
          </header>

          <div className="md:hidden">
            <Navbar 
              activeSection={activeSection}
              onSectionChange={handleSectionChange}
            />
          </div>

          <main className="mx-auto px-4 space-y-24">
            <section id="home">
              <HomeBanners />
            </section>

            <section id="about">
              <AboutSection />
            </section>

            <section id="roadmap">
              <RoadmapSection />
            </section>

            <section id="schedule">
              <ScheduleSection />
            </section>

            <section id="guidelines">
              <GuidelinesSection />
            </section>

            <section id="gallery">
              <GallerySection />
            </section>

            <section id="speakers">
              <SpeakersSection />
            </section>

            <section id="contact">
              <ContactSection />
            </section>
          </main>
          <Footer />

          {showLoginSelection && (
            <LoginSelectionModal
              onClose={() => setShowLoginSelection(false)}
              onSelectLoginType={handleLoginTypeSelect}
            />
          )}

          {showSchoolLogin && (
            <LoginForm
              onClose={() => setShowSchoolLogin(false)}
              onLoginSuccess={handleLoginSuccess}
            />
          )}

          {showEvaluatorLogin && (
            <EvaluatorLogin
              onClose={() => setShowEvaluatorLogin(false)}
              onLoginSuccess={handleLoginSuccess}
            />
          )}

          {showAdminLogin && (
            <AdminLogin
              onClose={() => setShowAdminLogin(false)}
              onLoginSuccess={handleLoginSuccess}
            />
          )}
        </>
      )}

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </div>
  );
}

export default App;