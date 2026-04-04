import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/use-auth';
import { MainLayout } from './components/layout/main-layout';
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
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-600/5 blur-[100px] pointer-events-none" />
        <div className="flex flex-col items-center gap-8 relative z-10 animate-in fade-in zoom-in-95 duration-1000">
          <div className="relative">
            <div className="absolute inset-0 bg-violet-600/20 blur-2xl rounded-full animate-pulse" />
            <div className="w-12 h-12 rounded-xl border-2 border-white/5 border-t-violet-500 animate-spin relative z-10" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="text-zinc-400 text-sm font-medium tracking-wide animate-pulse">Loading account data...</p>
            <span className="text-[10px] font-bold text-violet-500/40 uppercase tracking-[0.3em]">StarOverlay</span>
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
