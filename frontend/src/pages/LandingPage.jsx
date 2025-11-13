import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  BookOpenIcon, 
  AcademicCapIcon, 
  UserGroupIcon, 
  SparklesIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const LandingPage = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const getDashboardLink = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'student':
        return '/student/dashboard';
      case 'tutor':
        return '/tutor/dashboard';
      case 'admin':
        return '/admin/dashboard';
      default:
        return '/courses';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      {/* Navbar */}
      <nav className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <AcademicCapIcon className="h-8 w-8 text-white" />
              <span className="text-white text-xl font-bold">EmmiDev CodeBridge</span>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <Link to={getDashboardLink()} className="text-white hover:text-gray-200">
                    Dashboard
                  </Link>
                  <Link 
                    to="/profile"
                    className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
                  >
                    Profile
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-white hover:text-gray-200">
                    Login
                  </Link>
                  <Link 
                    to="/register"
                    className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Learn, Connect, and Grow with EmmiDev
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            Join our vibrant learning community with live Zoom classes, AI-powered study recommendations, 
            and real-time collaboration. Your journey to mastery starts here.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/courses"
              className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition flex items-center space-x-2"
            >
              <span>Explore Courses</span>
              <ArrowRightIcon className="h-5 w-5" />
            </Link>
            {!isAuthenticated && (
              <Link
                to="/register"
                className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-indigo-700 transition border-2 border-white"
              >
                Join Free
              </Link>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">
          <FeatureCard
            icon={<BookOpenIcon className="h-12 w-12 text-indigo-600" />}
            title="Live Zoom Classes"
            description="Interactive live sessions with verified tutors and screen sharing capabilities"
          />
          <FeatureCard
            icon={<SparklesIcon className="h-12 w-12 text-indigo-600" />}
            title="AI Study Assistant"
            description="Personalized recommendations, study plans, and instant answers to your questions"
          />
          <FeatureCard
            icon={<UserGroupIcon className="h-12 w-12 text-indigo-600" />}
            title="Community Feed"
            description="Share projects, ask questions, and connect with fellow learners"
          />
          <FeatureCard
            icon={<AcademicCapIcon className="h-12 w-12 text-indigo-600" />}
            title="Assignment System"
            description="Submit assignments, get feedback, and track your progress"
          />
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <StatCard number="1000+" label="Active Students" />
          <StatCard number="50+" label="Expert Tutors" />
          <StatCard number="100+" label="Courses Available" />
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover:bg-white/20 transition">
    <div className="bg-white rounded-lg p-3 inline-block mb-4">
      {icon}
    </div>
    <h3 className="text-white text-xl font-semibold mb-2">{title}</h3>
    <p className="text-white/80">{description}</p>
  </div>
);

const StatCard = ({ number, label }) => (
  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-8 text-center">
    <div className="text-4xl font-bold text-white mb-2">{number}</div>
    <div className="text-white/80 text-lg">{label}</div>
  </div>
);

export default LandingPage;
