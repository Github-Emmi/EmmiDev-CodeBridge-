// frontend/src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useSocket } from './hooks/useSocket';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import StudentDashboard from './pages/student/Dashboard';
import TutorDashboard from './pages/tutor/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';
import CoursesPage from './pages/courses/CoursesPage';
import CourseDetailPage from './pages/courses/CourseDetailPage';
import CommunityFeedPage from './pages/community/FeedPage';
import NotificationsPage from './pages/notifications/NotificationsPage';
import ChatPage from './pages/chat/ChatPage';
import ProfilePage from './pages/profile/ProfilePage';

// Components
import PrivateRoute from './components/PrivateRoute';
import RoleRoute from './components/RoleRoute';
import ConnectionStatus from './components/ConnectionStatus';
import './App.css';

function App() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  // Initialize socket connection for authenticated users
  useSocket();

  const getDashboardByRole = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'student':
        return '/student/dashboard';
      case 'tutor':
        return '/tutor/dashboard';
      case 'admin':
      case 'superadmin':
        return '/admin/dashboard';
      default:
        return '/courses';
    }
  };

  return (
    <div className="App">
      <ConnectionStatus />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to={getDashboardByRole()} /> : <LoginPage />} 
        />
        <Route 
          path="/register" 
          element={isAuthenticated ? <Navigate to={getDashboardByRole()} /> : <RegisterPage />} 
        />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/:id" element={<CourseDetailPage />} />

        {/* Protected Routes - Student */}
        <Route 
          path="/student/dashboard" 
          element={
            <PrivateRoute>
              <RoleRoute allowedRoles={['student']}>
                <StudentDashboard />
              </RoleRoute>
            </PrivateRoute>
          } 
        />

        {/* Protected Routes - Tutor */}
        <Route 
          path="/tutor/dashboard" 
          element={
            <PrivateRoute>
              <RoleRoute allowedRoles={['tutor']}>
                <TutorDashboard />
              </RoleRoute>
            </PrivateRoute>
          } 
        />

        {/* Protected Routes - Admin */}
        <Route 
          path="/admin/dashboard" 
          element={
            <PrivateRoute>
              <RoleRoute allowedRoles={['admin', 'superadmin']}>
                <AdminDashboard />
              </RoleRoute>
            </PrivateRoute>
          } 
        />

        {/* Protected Routes - All Authenticated Users */}
        <Route 
          path="/community" 
          element={
            <PrivateRoute>
              <CommunityFeedPage />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/notifications" 
          element={
            <PrivateRoute>
              <NotificationsPage />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/chat" 
          element={
            <PrivateRoute>
              <ChatPage />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/chat/:roomId" 
          element={
            <PrivateRoute>
              <ChatPage />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          } 
        />

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;