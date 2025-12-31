import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';

// Layout
import Layout from './components/layout/Layout';

// Auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Dashboard pages
import Home from './pages/dashboard/Home';
import Friends from './pages/dashboard/Friends';
import Profile from './pages/dashboard/Profile';
import PublicFeed from './pages/dashboard/PublicFeed';

// Chat pages
import ChatRoom from './pages/chat/ChatRoom';
import GroupChat from './pages/chat/GroupChat';
import VoiceRoom from './pages/chat/VoiceRoom';

// Settings pages
import AccountSettings from './pages/settings/Account';
import PrivacySettings from './pages/settings/Privacy';
import NotificationSettings from './pages/settings/Notifications';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import UserManagement from './pages/admin/Users';
import Analytics from './pages/admin/Analytics';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuthStore();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Admin Route component
const AdminRoute = ({ children }) => {
  const { userData } = useAuthStore();
  
  // Check if user is admin (you need to implement your own admin check logic)
  const isAdmin = userData?.role === 'admin';
  
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Protected Routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Home />} />
        <Route path="friends" element={<Friends />} />
        <Route path="profile" element={<Profile />} />
        <Route path="feed" element={<PublicFeed />} />
        
        <Route path="chat/:chatId" element={<ChatRoom />} />
        <Route path="group/:groupId" element={<GroupChat />} />
        <Route path="voice/:roomId" element={<VoiceRoom />} />
        
        <Route path="settings">
          <Route path="account" element={<AccountSettings />} />
          <Route path="privacy" element={<PrivacySettings />} />
          <Route path="notifications" element={<NotificationSettings />} />
        </Route>
        
        {/* Admin Routes */}
        <Route path="admin" element={
          <AdminRoute>
            <Layout />
          </AdminRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>
      </Route>
      
      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
