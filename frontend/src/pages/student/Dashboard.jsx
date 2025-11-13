// frontend/src/pages/student/Dashboard.jsx
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  AcademicCapIcon, 
  ClockIcon, 
  DocumentTextIcon, 
  ChartBarIcon,
  VideoCameraIcon,
  BellIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';

const StudentDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [pendingAssignments, setPendingAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch enrolled courses
      const coursesRes = await api.get('/courses?enrolled=true');
      setEnrolledCourses(coursesRes.data.data || []);

      // Fetch upcoming classes from all enrolled courses
      const classesPromises = coursesRes.data.data.map(course =>
        api.get(`/courses/${course._id}/schedule`)
      );
      const classesResponses = await Promise.all(classesPromises);
      const allClasses = classesResponses
        .flatMap(res => res.data.data || [])
        .filter(cls => new Date(cls.startTime) > new Date())
        .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
        .slice(0, 5);
      setUpcomingClasses(allClasses);

      // Fetch pending assignments
      const assignmentsRes = await api.get('/assignments/my-submissions');
      const pending = assignmentsRes.data.data
        .filter(sub => sub.status === 'pending' || !sub.submittedAt)
        .slice(0, 5);
      setPendingAssignments(pending);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 75) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
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
                Welcome back, {user?.name}!
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Here's what's happening with your learning journey
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                to="/notifications"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <BellIcon className="h-5 w-5 mr-2" />
                Notifications
              </Link>
              <Link
                to="/chat"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
                Messages
              </Link>
            </div>
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
                <p className="text-sm font-medium text-gray-500">Enrolled Courses</p>
                <p className="text-2xl font-semibold text-gray-900">{enrolledCourses.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                <ClockIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Upcoming Classes</p>
                <p className="text-2xl font-semibold text-gray-900">{upcomingClasses.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                <DocumentTextIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending Assignments</p>
                <p className="text-2xl font-semibold text-gray-900">{pendingAssignments.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                <ChartBarIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Avg. Progress</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {enrolledCourses.length > 0
                    ? Math.round(
                        enrolledCourses.reduce((acc, c) => acc + (c.progress || 0), 0) /
                          enrolledCourses.length
                      )
                    : 0}
                  %
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Enrolled Courses */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">My Courses</h2>
            </div>
            <div className="p-6">
              {enrolledCourses.length === 0 ? (
                <div className="text-center py-12">
                  <AcademicCapIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">No courses enrolled yet</p>
                  <Link
                    to="/courses"
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Browse Courses
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {enrolledCourses.slice(0, 5).map((course) => (
                    <Link
                      key={course._id}
                      to={`/courses/${course._id}`}
                      className="block hover:bg-gray-50 rounded-lg p-4 transition"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-gray-900">{course.title}</h3>
                          <p className="text-xs text-gray-500 mt-1">
                            by {course.tutorId?.name || 'Unknown Tutor'}
                          </p>
                        </div>
                        <div className="ml-4">
                          <div className="text-right">
                            <p className="text-xs text-gray-500">Progress</p>
                            <p className="text-sm font-semibold text-gray-900">{course.progress || 0}%</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getProgressColor(course.progress || 0)}`}
                          style={{ width: `${course.progress || 0}%` }}
                        ></div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Upcoming Classes */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Upcoming Classes</h2>
            </div>
            <div className="p-6">
              {upcomingClasses.length === 0 ? (
                <div className="text-center py-12">
                  <VideoCameraIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">No upcoming classes</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingClasses.map((classItem, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-indigo-100 rounded-md p-2">
                          <VideoCameraIcon className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">
                            {classItem.topic || 'Live Class'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(classItem.startTime).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      {classItem.join_url && (
                        <a
                          href={classItem.join_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                          Join Class
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pending Assignments */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Pending Assignments</h2>
          </div>
          <div className="p-6">
            {pendingAssignments.length === 0 ? (
              <div className="text-center py-12">
                <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">No pending assignments</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pendingAssignments.map((assignment) => (
                  <div
                    key={assignment._id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                  >
                    <h3 className="text-sm font-medium text-gray-900">{assignment.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </p>
                    <div className="mt-3">
                      <Link
                        to={`/courses/${assignment.courseId}/assignments/${assignment._id}`}
                        className="text-xs text-indigo-600 hover:text-indigo-500 font-medium"
                      >
                        Submit Assignment →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
