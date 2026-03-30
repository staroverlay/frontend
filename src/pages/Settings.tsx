import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/use-auth';
import { useProfile } from '../hooks/use-profile';
import { Skeleton } from '../components/ui/skeleton';
import { User, ShieldCheck, Monitor, Share2 } from 'lucide-react';
import { getError, cn } from '../lib/utils';
import { sessionsService } from '../services/sessions-service';
import { type Session } from '../lib/types';
import { ProfileSection } from '../components/settings/ProfileSection';
import { SecuritySection } from '../components/settings/SecuritySection';
import { SessionsSection } from '../components/settings/SessionsSection';
import Integrations from './Integrations';
import { authService } from '../services/auth-service';

export default function Settings() {
  const { user, refreshUser, logout } = useAuth();
  const {
    profile,
    isLoading: isProfileInitialLoading,
    error: profileError,
    updateProfile,
    clearError: clearProfileError
  } = useProfile();

  const [displayName, setDisplayName] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName);
    }
  }, [profile]);

  const [sessions, setSessions] = useState<Session[]>([]);
  const [isSessionsLoading, setIsSessionsLoading] = useState(false);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    setIsSessionsLoading(true);
    try {
      const data = await sessionsService.listActiveSessions();
      setSessions(data);
    } catch (err) {
      console.error('Failed to fetch sessions:', err);
    } finally {
      setIsSessionsLoading(false);
    }
  };

  const handleRevokeSession = async (id: string, isCurrent: boolean) => {
    const msg = isCurrent
      ? 'Are you sure you want to revoke your CURRENT session? You will be logged out.'
      : 'Terminate this session? The device will be logged out.';

    if (!window.confirm(msg)) return;

    try {
      await sessionsService.revokeSession(id);
      if (isCurrent) {
        logout();
      } else {
        setSessions(prev => prev.filter(s => s.id !== id));
      }
    } catch (err) {
      alert('Failed to revoke session: ' + getError(err, 'Unknown error'));
    }
  };

  const handleKillAllSessions = async () => {
    if (confirm('Are you sure you want to revoke ALL sessions? You will be instantly logged out.')) {
      try {
        await authService.logoutAll();
        logout();
      } catch (err) {
        alert('Action failed: ' + getError(err, 'Unknown error'));
      }
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccess(false);
    clearProfileError();
    setIsSavingProfile(true);
    try {
      await updateProfile(displayName);
      setProfileSuccess(true);
      await refreshUser();
    } catch (err) {
      // Error handled by hook
    } finally {
      setIsSavingProfile(false);
    }
  };

  const location = useLocation();

  const tabs = [
    { name: 'Profile', href: '/settings/profile', icon: User },
    { name: 'Integrations', href: '/settings/integrations', icon: Share2 },
    { name: 'Security', href: '/settings/security', icon: ShieldCheck },
    { name: 'Sessions', href: '/settings/sessions', icon: Monitor },
  ];

  if (isProfileInitialLoading && !profile) {
    return (
      <div className="space-y-10 animate-in fade-in duration-500 max-w-5xl mx-auto">
        <Skeleton className="h-6 w-48 bg-zinc-900" />
        <div className="flex gap-12 mt-8">
          <Skeleton className="h-48 w-64 bg-zinc-900 rounded-2xl" />
          <Skeleton className="h-96 flex-1 bg-zinc-900 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-8 md:mb-10">
        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white m-0">Settings</h1>
        <p className="text-zinc-500 text-sm md:text-base mt-2 max-w-2xl">
          Manage your account preferences and security settings.
        </p>
      </header>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
        {/* Settings Sidebar */}
        <aside className="w-full lg:w-64 shrink-0 -mx-4 md:mx-0">
          <nav className="flex lg:flex-col gap-1.5 bg-zinc-900/30 p-1.5 md:p-2 rounded-2xl border border-white/5 overflow-x-auto lg:overflow-visible no-scrollbar px-4 md:px-2">
            {tabs.map((tab) => {
              const isActive = location.pathname.startsWith(tab.href);
              return (
                <Link
                  key={tab.name}
                  to={tab.href}
                  className={cn(
                    'flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs md:text-sm font-bold transition-all group shrink-0 lg:shrink',
                    isActive
                      ? 'bg-violet-600/10 text-violet-400 border border-violet-500/20 shadow-lg shadow-violet-500/5'
                      : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50 border border-transparent'
                  )}
                >
                  <tab.icon className={cn('w-4 h-4', isActive ? 'text-violet-500' : 'text-zinc-600 group-hover:text-zinc-400')} />
                  {tab.name}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Settings Content */}
        <main className="flex-1 min-w-0">
          <Routes>
            <Route path="/" element={<Navigate to="profile" replace />} />

            <Route path="profile" element={
              <ProfileSection
                user={user}
                displayName={displayName}
                setDisplayName={setDisplayName}
                isSaving={isSavingProfile}
                success={profileSuccess}
                error={profileError}
                onUpdate={handleUpdateProfile}
              />
            } />

            <Route path="security" element={<SecuritySection logout={logout} />} />

            <Route path="sessions" element={
              <SessionsSection
                sessions={sessions}
                isLoading={isSessionsLoading}
                onRefresh={fetchSessions}
                onRevoke={handleRevokeSession}
                onRevokeAll={handleKillAllSessions}
              />
            } />

            <Route path="integrations" element={<Integrations />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
