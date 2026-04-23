import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/use-auth';
import { MainLayout } from './components/layouts/MainLayout';
import { useSubscriptionStore } from './stores/subscription-store';
import { useEffect } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import OAuthCallback from './pages/oauth/Callback';
import Apps from './pages/Apps';
import AppDetails from './pages/AppDetails';
import Widgets from './pages/Widgets';
import WidgetDetails from './pages/WidgetDetails';
import Content from './pages/Content';

import { LoadingScreen } from './components/layouts/LoadingScreen';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { fetchSubscription, plans } = useSubscriptionStore();

  useEffect(() => {
    if (isAuthenticated && plans.length === 0) {
      fetchSubscription();
    }
  }, [isAuthenticated, plans.length, fetchSubscription]);

  // Only show the global initializing screen if we don't have a user session yet.
  if (isLoading && !user) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Verification Gate
  if (user && !user.emailVerified) {
    return <VerifyEmail />;
  }

  return <MainLayout>{children}</MainLayout>;
};

// Auth Route Component (Redirect if already logged in)
const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading && !user) return <LoadingScreen />;
  if (isAuthenticated) return <Navigate to="/" replace />;
  return <>{children}</>;
};

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
        <Route path="/register" element={<AuthRoute><Register /></AuthRoute>} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/content" element={<ProtectedRoute><Content /></ProtectedRoute>} />
        <Route path="/apps" element={<ProtectedRoute><Apps /></ProtectedRoute>} />
        <Route path="/apps/:id" element={<ProtectedRoute><AppDetails /></ProtectedRoute>} />
        <Route path="/widgets" element={<ProtectedRoute><Widgets /></ProtectedRoute>} />
        <Route path="/widgets/:id" element={<ProtectedRoute><WidgetDetails /></ProtectedRoute>} />
        <Route path="/oauth/callback/:provider" element={<OAuthCallback />} />
        <Route path="/settings/*" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
