import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Users,
  BookOpen,
  FileText,
  DollarSign,
  TrendingUp,
  Activity,
  UserCheck,
  UserPlus,
} from 'lucide-react';
import { fetchPlatformOverview, fetchUserGrowth } from '../../redux/slices/adminSlice';
import { Card, Loader } from '../../components/ui';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { analytics } = useSelector((state) => state.admin);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchPlatformOverview());
    dispatch(fetchUserGrowth(6));
  }, [dispatch]);

  if (analytics.loading && !analytics.overview) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  const stats = analytics.overview?.stats || {};
  const recent = analytics.overview?.recent || {};

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers || 0,
      icon: Users,
      color: 'bg-blue-500',
      link: '/admin/users',
    },
    {
      title: 'Students',
      value: stats.totalStudents || 0,
      icon: UserCheck,
      color: 'bg-green-500',
      link: '/admin/users?role=student',
    },
    {
      title: 'Tutors',
      value: stats.totalTutors || 0,
      icon: UserPlus,
      color: 'bg-purple-500',
      link: '/admin/users?role=tutor',
    },
    {
      title: 'Courses',
      value: stats.totalCourses || 0,
      icon: BookOpen,
      color: 'bg-indigo-500',
      link: '/admin/courses',
    },
    {
      title: 'Assignments',
      value: stats.totalAssignments || 0,
      icon: FileText,
      color: 'bg-orange-500',
      link: '/admin/assignments',
    },
    {
      title: 'Community Posts',
      value: stats.totalPosts || 0,
      icon: Activity,
      color: 'bg-pink-500',
      link: '/admin/feed-moderation',
    },
    {
      title: 'Total Revenue',
      value: `₦${(stats.totalRevenue || 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-emerald-500',
      link: '/admin/payments',
    },
    {
      title: 'Analytics',
      value: 'View Reports',
      icon: TrendingUp,
      color: 'bg-cyan-500',
      link: '/admin/analytics',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome back, {user?.name}! Manage your EmmiDev-CodeBridge platform.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link key={stat.title} to={stat.link}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-xl ${stat.color}`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Users */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Users</h3>
              <Link
                to="/admin/users"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View All →
              </Link>
            </div>
            <div className="space-y-3">
              {recent.users?.length > 0 ? (
                recent.users.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        user.role === 'tutor'
                          ? 'bg-purple-100 text-purple-700'
                          : user.role === 'admin'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {user.role}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No recent users</p>
              )}
            </div>
          </Card>

          {/* Recent Courses */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Courses</h3>
              <Link
                to="/admin/courses"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View All →
              </Link>
            </div>
            <div className="space-y-3">
              {recent.courses?.length > 0 ? (
                recent.courses.map((course) => (
                  <div
                    key={course._id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{course.title}</p>
                      <p className="text-sm text-gray-600">
                        by {course.tutorId?.name || 'Unknown'}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(course.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No recent courses</p>
              )}
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              to="/admin/users/create"
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center transition"
            >
              <UserPlus className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm font-medium">Add User</p>
            </Link>
            <Link
              to="/admin/courses"
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center transition"
            >
              <BookOpen className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm font-medium">Manage Courses</p>
            </Link>
            <Link
              to="/admin/payments"
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center transition"
            >
              <DollarSign className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm font-medium">View Payments</p>
            </Link>
            <Link
              to="/admin/analytics"
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center transition"
            >
              <TrendingUp className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm font-medium">Analytics</p>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
