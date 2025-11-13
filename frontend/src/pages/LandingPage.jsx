import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  BookOpen, 
  Users, 
  Sparkles, 
  Video, 
  Globe, 
  Award,
  ArrowRight,
  Play,
  MessageCircle,
  TrendingUp,
  Star,
  Menu,
  X
} from 'lucide-react';

// Animated Background Component
const AnimatedBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 opacity-90"></div>
      
      {/* Animated Mesh Grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          animation: 'gridMove 20s linear infinite'
        }}></div>
      </div>

      {/* Floating Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes gridMove {
          0% { transform: translateY(0); }
          100% { transform: translateY(40px); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

// Navigation Bar
const Navbar = ({ isAuthenticated, user, navigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getDashboardLink = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'admin':
      case 'superadmin':
        return '/admin/dashboard';
      case 'tutor':
        return '/tutor/dashboard';
      default:
        return '/student/dashboard';
    }
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/90 backdrop-blur-lg shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Award className={`h-8 w-8 ${isScrolled ? 'text-indigo-600' : 'text-white'}`} />
            <span className={`text-xl font-bold ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
              EmmiDev CodeBridge
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className={`${isScrolled ? 'text-gray-700 hover:text-indigo-600' : 'text-white hover:text-gray-200'} transition`}>
              Features
            </a>
            <a href="#courses" className={`${isScrolled ? 'text-gray-700 hover:text-indigo-600' : 'text-white hover:text-gray-200'} transition`}>
              Courses
            </a>
            <a href="#community" className={`${isScrolled ? 'text-gray-700 hover:text-indigo-600' : 'text-white hover:text-gray-200'} transition`}>
              Community
            </a>
            <a href="#testimonials" className={`${isScrolled ? 'text-gray-700 hover:text-indigo-600' : 'text-white hover:text-gray-200'} transition`}>
              Testimonials
            </a>
            
            {isAuthenticated ? (
              <Link 
                to={getDashboardLink()}
                className="bg-white text-indigo-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition shadow-md"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link 
                  to="/login"
                  className={`px-4 py-2 rounded-lg font-semibold transition ${
                    isScrolled 
                      ? 'text-gray-700 hover:text-indigo-600' 
                      : 'text-white hover:text-gray-200'
                  }`}
                >
                  Login
                </Link>
                <Link 
                  to="/register"
                  className="bg-white text-indigo-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition shadow-md"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className={isScrolled ? 'text-gray-900' : 'text-white'} />
            ) : (
              <Menu className={isScrolled ? 'text-gray-900' : 'text-white'} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-4 py-6 space-y-4">
            <a href="#features" className="block text-gray-700 hover:text-indigo-600">Features</a>
            <a href="#courses" className="block text-gray-700 hover:text-indigo-600">Courses</a>
            <a href="#community" className="block text-gray-700 hover:text-indigo-600">Community</a>
            <a href="#testimonials" className="block text-gray-700 hover:text-indigo-600">Testimonials</a>
            
            {isAuthenticated ? (
              <Link 
                to={getDashboardLink()}
                className="block w-full bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 text-center"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link 
                  to="/login"
                  className="block w-full text-left text-gray-700 hover:text-indigo-600"
                >
                  Login
                </Link>
                <Link 
                  to="/register"
                  className="block w-full bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 text-center"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

// Hero Section
const HeroSection = ({ navigate }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <AnimatedBackground />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
          Empowering the Next Generation
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-pink-200">
            of African Developers
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto animate-fade-in-delay">
          Learn. Build. Connect. Launch your career in tech with live classes, 
          AI-powered learning, and a vibrant community.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-delay-2">
          <Link 
            to="/register"
            className="group bg-white text-indigo-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition shadow-2xl flex items-center space-x-2"
          >
            <span>Start Learning Now</span>
            <ArrowRight className="group-hover:translate-x-1 transition" />
          </Link>
          <button className="group bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/10 transition flex items-center space-x-2">
            <Play className="h-5 w-5" />
            <span>Watch Demo</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 mt-20 max-w-3xl mx-auto">
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">5,000+</div>
            <div className="text-white/80">Active Learners</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">100+</div>
            <div className="text-white/80">Expert Tutors</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">200+</div>
            <div className="text-white/80">Courses</div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out;
        }
        .animate-fade-in-delay {
          animation: fadeIn 0.8s ease-out 0.2s backwards;
        }
        .animate-fade-in-delay-2 {
          animation: fadeIn 0.8s ease-out 0.4s backwards;
        }
      `}</style>
    </section>
  );
};

const LandingPage = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();


  return (
    <div className="min-h-screen">
      <Navbar isAuthenticated={isAuthenticated} user={user} navigate={navigate} />
      <HeroSection navigate={navigate} />
      <FeaturesSection />
      <CoursesSection navigate={navigate} />
      <CommunitySection />
      <TestimonialsSection />
      <Footer />
    </div>
  );
};

// Features Section
const FeaturesSection = () => {
  const features = [
    {
      icon: <Video className="h-8 w-8" />,
      title: "Live Zoom Classes",
      description: "Interactive sessions with verified tutors, screen sharing, and real-time collaboration"
    },
    {
      icon: <Sparkles className="h-8 w-8" />,
      title: "AI Study Assistant",
      description: "Personalized recommendations, study plans, and instant answers powered by AI"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Community Learning",
      description: "Share projects, ask questions, and network with fellow developers"
    },
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: "Assignment System",
      description: "Submit work, get feedback, and track your progress with detailed analytics"
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Career Support",
      description: "Job placement assistance, portfolio reviews, and interview preparation"
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Global Access",
      description: "Learn from anywhere with our platform optimized for African internet speeds"
    }
  ];

  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A complete learning ecosystem designed for African developers
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="group bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-indigo-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl p-4 inline-block mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

// Courses Section
const CoursesSection = ({ navigate }) => {
  const courses = [
    {
      title: "Full Stack Web Development",
      instructor: "Sarah Mensah",
      price: "₦50,000",
      rating: 4.8,
      students: 1234,
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400"
    },
    {
      title: "Mobile App Development",
      instructor: "Kwame Osei",
      price: "₦45,000",
      rating: 4.9,
      students: 987,
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400"
    },
    {
      title: "Data Science & AI",
      instructor: "Amara Nwosu",
      price: "₦60,000",
      rating: 4.7,
      students: 756,
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400"
    }
  ];

  return (
    <section id="courses" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Popular Courses
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Expert-led courses designed to take you from beginner to professional
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <CourseCard key={index} {...course} navigate={navigate} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link 
            to="/courses"
            className="inline-flex items-center space-x-2 bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            <span>View All Courses</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

const CourseCard = ({ title, instructor, price, rating, students, image, navigate }) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow">
      <div className="h-48 bg-gradient-to-br from-indigo-500 to-purple-600 relative overflow-hidden">
        <img src={image} alt={title} className="w-full h-full object-cover opacity-75" />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">by {instructor}</p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-1">
            <Star className="h-5 w-5 text-yellow-400 fill-current" />
            <span className="font-semibold">{rating}</span>
            <span className="text-gray-500 text-sm">({students} students)</span>
          </div>
          <span className="text-2xl font-bold text-indigo-600">{price}</span>
        </div>

        <button 
          onClick={() => navigate('/courses')}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
        >
          Enroll Now
        </button>
      </div>
    </div>
  );
};

// Community Section
const CommunitySection = () => {
  const posts = [
    {
      author: "Chioma Eze",
      avatar: "CE",
      time: "2 hours ago",
      content: "Just completed my first React project! The community here is amazing. Special thanks to @mentor_kwesi for the guidance! 🚀",
      likes: 45,
      comments: 12
    },
    {
      author: "Yusuf Ibrahim",
      avatar: "YI",
      time: "5 hours ago",
      content: "Looking for study partners for the upcoming Data Structures bootcamp. Who's in? 💪",
      likes: 32,
      comments: 18
    },
    {
      author: "Aisha Kamara",
      avatar: "AK",
      time: "1 day ago",
      content: "Just got my first freelance client thanks to the portfolio tips from this platform! Dreams do come true! 🎉",
      likes: 124,
      comments: 34
    }
  ];

  return (
    <section id="community" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Join Our Vibrant Community
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Connect, collaborate, and grow with thousands of developers across Africa
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <CommunityCard key={index} {...post} />
          ))}
        </div>
      </div>
    </section>
  );
};

const CommunityCard = ({ author, avatar, time, content, likes, comments }) => {
  return (
    <div className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
          {avatar}
        </div>
        <div>
          <div className="font-semibold text-gray-900">{author}</div>
          <div className="text-sm text-gray-500">{time}</div>
        </div>
      </div>
      
      <p className="text-gray-700 mb-4">{content}</p>
      
      <div className="flex items-center space-x-6 text-gray-500">
        <button className="flex items-center space-x-2 hover:text-indigo-600">
          <MessageCircle className="h-5 w-5" />
          <span>{comments}</span>
        </button>
        <button className="flex items-center space-x-2 hover:text-red-600">
          <span>❤️</span>
          <span>{likes}</span>
        </button>
      </div>
    </div>
  );
};

// Testimonials Section
const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Oluwaseun Adeyemi",
      role: "Software Engineer at Paystack",
      content: "EmmiDev CodeBridge transformed my career. Within 6 months, I went from complete beginner to landing my dream job!",
      rating: 5
    },
    {
      name: "Grace Mwangi",
      role: "Freelance Developer",
      content: "The AI study assistant is a game-changer. It's like having a personal tutor available 24/7.",
      rating: 5
    },
    {
      name: "Abdul Rahman",
      role: "Full Stack Developer",
      content: "The community support here is unmatched. I've made lifelong friends and collaborators.",
      rating: 5
    }
  ];

  return (
    <section id="testimonials" className="py-24 bg-gradient-to-br from-indigo-600 to-purple-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Success Stories
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Hear from developers who transformed their careers with EmmiDev CodeBridge
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

const TestimonialCard = ({ name, role, content, rating }) => {
  return (
    <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8">
      <div className="flex mb-4">
        {[...Array(rating)].map((_, i) => (
          <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
        ))}
      </div>
      
      <p className="text-white mb-6 italic">"{content}"</p>
      
      <div>
        <div className="font-semibold text-white">{name}</div>
        <div className="text-white/80 text-sm">{role}</div>
      </div>
    </div>
  );
};

// Footer
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Award className="h-8 w-8" />
              <span className="text-xl font-bold">EmmiDev</span>
            </div>
            <p className="text-gray-400">
              Empowering African developers to reach their full potential
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#features" className="hover:text-white">Features</a></li>
              <li><a href="#courses" className="hover:text-white">Courses</a></li>
              <li><a href="#community" className="hover:text-white">Community</a></li>
              <li><Link to="/about" className="hover:text-white">About Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">Documentation</a></li>
              <li><a href="#" className="hover:text-white">Blog</a></li>
              <li><a href="#" className="hover:text-white">FAQs</a></li>
              <li><a href="#" className="hover:text-white">Support</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Connect</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">Twitter</a></li>
              <li><a href="#" className="hover:text-white">LinkedIn</a></li>
              <li><a href="#" className="hover:text-white">GitHub</a></li>
              <li><a href="#" className="hover:text-white">Discord</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; 2025 EmmiDev CodeBridge. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default LandingPage;
