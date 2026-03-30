import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/use-auth';
import { MainLayout } from './components/layout/main-layout';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import OAuthCallback from './pages/oauth/Callback';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  // Only show the global initializing screen if we don't have a user session yet.
  if (isLoading && !user) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-600/5 blur-[100px] pointer-events-none" />
        <div className="flex flex-col items-center gap-6 relative z-10 animate-in fade-in zoom-in-95 duration-1000">
          <div className="w-16 h-16 rounded-[2rem] border-4 border-zinc-900 border-t-violet-500 animate-spin shadow-2xl shadow-violet-500/10" />
          <div className="flex flex-col items-center gap-1.5">
            <p className="text-zinc-500 text-[9px] font-black uppercase tracking-[0.4em] animate-pulse ml-1">Initializing Engine</p>
            <span className="text-[10px] font-black text-violet-500/60 uppercase tracking-widest">Protocol 4.2-A</span>
          </div>
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
        <Route path="/oauth/callback/:provider" element={<OAuthCallback />} />
        <Route path="/settings/*" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
