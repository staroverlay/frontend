import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/use-auth';
import { useProfile } from '../hooks/use-profile';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Skeleton } from '../components/ui/skeleton';
import { User, ShieldCheck, Mail, LogOut, CheckCircle, AlertCircle, Save } from 'lucide-react';
import { cn, getError } from '../lib/utils';

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

  // Sync local display name with profile data when it loads
  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName);
    }
  }, [profile]);

  // Password state
  const [passwords, setPasswords] = useState({ old: '', new: '', confirm: '' });
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [passMessage, setPassMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

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
      // Error is handled by the hook and exposed through profileError
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      setPassMessage({ text: 'New passwords do not match', type: 'error' });
      return;
    }
    setPassMessage(null);
    setIsChangingPass(true);
    try {
      const { authService } = await import('../services/auth-service');
      await authService.changePassword({ 
        oldPassword: passwords.old, 
        newPassword: passwords.new 
      });
      setPassMessage({ text: 'Password changed. Logging out for security...', type: 'success' });
      setTimeout(() => logout(), 2000);
    } catch (err) {
      setPassMessage({ text: getError(err, 'Failed to change password'), type: 'error' });
    } finally {
      setIsChangingPass(false);
    }
  };

  if (isProfileInitialLoading && !profile) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="h-64 rounded-3xl" />
          <Skeleton className="h-64 rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-blue-500 font-bold text-[10px] uppercase tracking-widest mb-1 px-1">
          <User className="w-3.5 h-3.5" />
          Account Management
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">
          Settings
        </h1>
        <p className="text-zinc-500 font-medium text-sm max-w-lg leading-relaxed px-1">
          Configure your personal profile details and security preferences for your account.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Profile Settings */}
        <section className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-800 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <User className="w-24 h-24" />
           </div>
           
           <h2 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
              Personal Profile
              <span className="text-zinc-800 text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full border border-zinc-700">Display Settings</span>
           </h2>

           <form className="space-y-6" onSubmit={handleUpdateProfile}>
              <div className="space-y-2">
                 <Input 
                   label="Display Name"
                   placeholder="Your public name"
                   value={displayName}
                   onChange={(e) => setDisplayName(e.target.value)}
                   required
                 />
              </div>

              <div className="p-5 bg-zinc-950/50 rounded-2xl border border-zinc-800 space-y-4">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                       <Mail className="w-5 h-5 text-blue-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                       <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-0.5">Primary Email</p>
                       <p className="text-sm font-bold text-white truncate">{user?.email}</p>
                    </div>
                    {user?.emailVerified && (
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase">
                         <CheckCircle className="w-3 h-3" />
                         Verified
                      </div>
                    )}
                 </div>
              </div>

              {(profileSuccess || profileError) && (
                <div className={cn(
                  "p-4 rounded-xl text-xs font-bold text-center animate-in zoom-in duration-300 flex items-center justify-center gap-2",
                  profileSuccess ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"
                )}>
                  {profileSuccess ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  {profileSuccess ? 'Profile updated successfully' : profileError}
                </div>
              )}

              <Button 
                className="w-full h-12 rounded-2xl font-black uppercase tracking-widest text-[11px] h-12 shadow-xl shadow-blue-500/10 active:scale-[0.98] transition-all gap-2"
                disabled={isSavingProfile}
              >
                <Save className="w-4 h-4" />
                {isSavingProfile ? 'Saving...' : 'Save Changes'}
              </Button>
           </form>
        </section>

        {/* Password settings */}
        <section className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-800 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <ShieldCheck className="w-24 h-24" />
           </div>
           
           <h2 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
              Security
              <span className="text-zinc-800 text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full border border-zinc-700">Password</span>
           </h2>

           <form className="space-y-6" onSubmit={handleChangePassword}>
              <div className="space-y-4">
                 <Input 
                   type="password"
                   label="Current Password"
                   placeholder="••••••••"
                   value={passwords.old}
                   onChange={(e) => setPasswords({ ...passwords, old: e.target.value })}
                   required
                 />
                 <Input 
                   type="password"
                   label="New Password"
                   placeholder="••••••••"
                   value={passwords.new}
                   onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                   required
                 />
                 <Input 
                   type="password"
                   label="Confirm New Password"
                   placeholder="••••••••"
                   value={passwords.confirm}
                   onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                   required
                 />
              </div>

              {passMessage && (
                <div className={cn(
                  "p-4 rounded-xl text-xs font-bold text-center animate-in zoom-in duration-300 flex items-center justify-center gap-2",
                  passMessage.type === 'success' ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"
                )}>
                  {passMessage.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  {passMessage.text}
                </div>
              )}

              <Button 
                variant="secondary"
                className="w-full h-12 rounded-2xl font-black uppercase tracking-widest text-[11px] h-12 shadow-xl bg-zinc-800 hover:bg-zinc-700 shadow-zinc-950/50 active:scale-[0.98] transition-all"
                disabled={isChangingPass}
              >
                {isChangingPass ? 'Changing...' : 'Update Password'}
              </Button>
           </form>
           
           <div className="mt-8 pt-8 border-t border-zinc-800/50">
              <div className="p-6 rounded-3xl bg-red-500/5 border border-red-500/10 group/sessions">
                 <h4 className="text-xs font-black text-red-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <LogOut className="w-3.5 h-3.5" />
                    Hazard Zone
                 </h4>
                 <p className="text-zinc-500 text-[10px] font-medium leading-relaxed mb-4">
                    Instantly invalidate all active sessions for your account across all devices. Useful if you suspect your account has been compromised.
                 </p>
                 <Button 
                   variant="ghost"
                   className="w-full h-10 text-red-500/70 hover:text-red-500 hover:bg-red-500/10 rounded-xl text-[10px] font-black uppercase tracking-widest border border-red-500/10 transition-all"
                   onClick={async () => {
                     const { authService } = await import('../services/auth-service');
                     if (confirm('Are you sure you want to revoke ALL sessions? You will be logged out.')) {
                        await authService.logoutAll();
                        logout();
                     }
                   }}
                 >
                   Kill All Sessions
                 </Button>
              </div>
           </div>
        </section>
      </div>
    </div>
  );
}
