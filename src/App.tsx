import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/use-auth';
import { MainLayout } from './components/layout/main-layout';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import Dashboard from './pages/Dashboard';
import Integrations from './pages/Integrations';
import Settings from './pages/Settings';
import OAuthCallback from './pages/OAuthCallback';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  // Only show the global initializing screen if we don't have a user session yet.
  if (isLoading && !user) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-zinc-800 border-t-blue-500 animate-spin" />
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest animate-pulse tracking-[0.2em] ml-1">Initializing Session</p>
        </div>
      </div>
    );
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
  const { isAuthenticated } = useAuth();
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
        <Route path="/integrations" element={<ProtectedRoute><Integrations /></ProtectedRoute>} />
        <Route path="/oauth/callback/:provider" element={<OAuthCallback />} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
