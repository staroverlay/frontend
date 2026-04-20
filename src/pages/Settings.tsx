import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/use-auth';
import { useProfile } from '../hooks/use-profile';
import { Skeleton } from '../components/ui/skeleton';
import { PageHeader } from '../components/ui/PageHeader';
import { getError } from '../lib/utils';
import { sessionsService } from '../services/sessions-service';
import { type Session } from '../lib/types';
import { ProfileSection } from '../components/settings/ProfileSection';
import { SecuritySection } from '../components/settings/SecuritySection';
import { SessionsSection } from '../components/settings/SessionsSection';
import { SettingsNav } from '../components/settings/SettingsNav';
import Integrations from './Integrations';
import { authService } from '../services/auth-service';
import { Settings as SettingsIcon } from 'lucide-react';

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
    if (profile) setDisplayName(profile.displayName);
  }, [profile]);

  const [sessions, setSessions] = useState<Session[]>([]);
  const [isSessionsLoading, setIsSessionsLoading] = useState(false);

  useEffect(() => { fetchSessions(); }, []);

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
      ? 'Revoke your CURRENT session? You will be logged out.'
      : 'Terminate this session? The device will be logged out.';
    if (!window.confirm(msg)) return;
    try {
      await sessionsService.revokeSession(id);
      if (isCurrent) logout();
      else setSessions(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      alert('Failed to revoke session: ' + getError(err, 'Unknown error'));
    }
  };

  const handleKillAllSessions = async () => {
    if (confirm('Revoke ALL sessions? You will be instantly logged out.')) {
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
    } catch (_) {
      // handled by hook
    } finally {
      setIsSavingProfile(false);
    }
  };

  if (isProfileInitialLoading && !profile) {
    return (
      <div className="space-y-10 animate-in fade-in duration-500">
        <Skeleton className="h-20 w-full bg-surface-panel rounded-2xl" />
        <div className="flex gap-10 mt-8">
          <Skeleton className="h-48 w-60 bg-surface-panel rounded-2xl" />
          <Skeleton className="h-96 flex-1 bg-surface-panel rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader
        icon={<SettingsIcon className="w-5 h-5" />}
        title="Account"
        highlight="Settings"
        description="Manage your profile, security preferences, active sessions, and service integrations."
      />

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
        <SettingsNav />

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
