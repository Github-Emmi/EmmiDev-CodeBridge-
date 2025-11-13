import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  AcademicCapIcon,
  UsersIcon,
  DocumentTextIcon,
  ChartBarIcon,
  PlusIcon,
  VideoCameraIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';

const TutorDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalEarnings: 0,
    pendingGrading: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch tutor's courses
      const coursesRes = await api.get('/courses?tutor=me');
      const coursesData = coursesRes.data.data || [];
      setCourses(coursesData);

      // Calculate stats
      const totalStudents = coursesData.reduce(
        (acc, course) => acc + (course.enrolledStudents?.length || 0),
        0
      );

      // Fetch pending submissions
      const submissionsRes = await api.get('/assignments/submissions?status=submitted');
      const pendingGrading = submissionsRes.data.data?.length || 0;

      setStats({
        totalCourses: coursesData.length,
        totalStudents,
        totalEarnings: 0, // Will be calculated from payment history
        pendingGrading
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user?.verifiedTutor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
            <ClockIcon className="h-6 w-6 text-yellow-600" />
          </div>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Verification Pending</h2>
          <p className="mt-2 text-sm text-gray-600">
            Your tutor account is pending verification by our admin team. You'll be able to create
            courses once your account is verified.
          </p>
          <p className="mt-4 text-sm text-gray-500">
            This usually takes 24-48 hours. We'll send you an email once you're verified.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Tutor Dashboard
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage your courses and students
              </p>
            </div>
            <Link
              to="/tutor/courses/create"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Create Course
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                <AcademicCapIcon className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Courses</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalCourses}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                <UsersIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Students</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalStudents}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                <DocumentTextIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending Grading</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.pendingGrading}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                <ChartBarIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Earnings</p>
                <p className="text-2xl font-semibold text-gray-900">₦{stats.totalEarnings.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* My Courses */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">My Courses</h2>
            <Link
              to="/tutor/courses/create"
              className="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
            >
              Create New Course
            </Link>
          </div>
          <div className="p-6">
            {courses.length === 0 ? (
              <div className="text-center py-12">
                <AcademicCapIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">No courses created yet</p>
                <Link
                  to="/tutor/courses/create"
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Create Your First Course
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <div
                    key={course._id}
                    className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition"
                  >
                    {course.thumbnail && (
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-40 object-cover"
                      />
                    )}
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {course.description}
                      </p>
                      <div className="mt-4 flex items-center justify-between text-sm">
                        <div className="flex items-center text-gray-500">
                          <UsersIcon className="h-4 w-4 mr-1" />
                          {course.enrolledStudents?.length || 0} students
                        </div>
                        <div className="text-indigo-600 font-semibold">
                          ₦{course.price.toLocaleString()}
                        </div>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <Link
                          to={`/courses/${course._id}`}
                          className="flex-1 text-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                          View
                        </Link>
                        <Link
                          to={`/tutor/courses/${course._id}/edit`}
                          className="flex-1 text-center px-3 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                          Edit
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/tutor/schedule-class"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                <VideoCameraIcon className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-900">Schedule Class</h3>
                <p className="text-xs text-gray-500 mt-1">Create a new Zoom session</p>
              </div>
            </div>
          </Link>

          <Link
            to="/tutor/assignments"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                <DocumentTextIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-900">Grade Assignments</h3>
                <p className="text-xs text-gray-500 mt-1">{stats.pendingGrading} pending</p>
              </div>
            </div>
          </Link>

          <Link
            to="/tutor/students"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                <UsersIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-900">View Students</h3>
                <p className="text-xs text-gray-500 mt-1">{stats.totalStudents} total students</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TutorDashboard;
