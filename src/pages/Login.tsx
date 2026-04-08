import React, { useState } from 'react';
import { Mail, Lock, LogIn, Video, Monitor, PlayCircle, Loader2 } from 'lucide-react';

import { useAuth } from '../hooks/use-auth';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Link } from 'react-router-dom';
import { getError } from '../lib/utils';

export default function Login() {
  const { login, initiateOAuthLogin, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login({ email, password });
    } catch (err: unknown) {
      setError(getError(err, 'Failed to login'));
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface-base px-4 relative overflow-hidden">
      {/* Immersive Cosmic Background */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[10%] left-[10%] w-[30%] h-[30%] rounded-full bg-brand-primary/5 blur-[120px]" />
        <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] rounded-full bg-brand-secondary/5 blur-[120px]" />
      </div>

      {/* Floating Stars */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 3 + 2}s`
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="mb-12 text-center animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="inline-flex w-16 h-16 rounded-3xl bg-surface-panel/50 border border-border-default text-brand-primary items-center justify-center mb-6 shadow-premium backdrop-blur-xl transition-all hover:scale-110">
            <LogIn className="w-7 h-7" />
          </div>
          <h1 className="text-4xl font-black tracking-tight text-content-primary mb-3 uppercase">Welcome Back</h1>
          <p className="text-content-muted font-medium">Continue your journey with StarOverlay</p>
        </div>

        <div className="glass-panel p-8 md:p-10 rounded-[2.5rem] shadow-premium animate-in fade-in zoom-in-95 duration-1000 border-border-subtle hover:border-brand-primary/20 transition-all duration-500 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-content-dimmed group-focus-within:text-brand-primary transition-colors z-10" />
                <Input
                  placeholder="Email address"
                  type="email"
                  className="pl-11"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-content-dimmed group-focus-within:text-brand-primary transition-colors z-10" />
                <Input
                  placeholder="Password"
                  type="password"
                  className="pl-11"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && (
              <div className="px-4 py-3 bg-status-error/10 border border-status-error/20 text-status-error rounded-2xl text-xs font-bold text-center animate-in slide-in-from-top-2 duration-300">
                {error}
              </div>
            )}

            <Button className="w-full h-13 rounded-2xl" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Signing in...</span>
                </div>
              ) : 'Sign in'}
            </Button>
          </form>

          <div className="mt-10">
            <div className="relative flex items-center justify-center mb-8">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border-subtle" /></div>
              <span className="relative bg-surface-card backdrop-blur-md px-4 text-[10px] text-content-dimmed font-black uppercase tracking-widest">Or connect via</span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <button
                className="w-full h-13 flex items-center justify-center gap-3 rounded-2xl bg-[#9146ff] hover:bg-[#a970ff] text-white transition-all shadow-lg shadow-[#9146ff]/10 active:scale-[0.98] font-bold"
                onClick={() => initiateOAuthLogin('twitch')}
                disabled={isLoading}
              >
                <Video className="w-5 h-5" />
                <span className="text-sm">Twitch</span>
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  className="h-13 flex items-center justify-center gap-2 rounded-2xl bg-surface-panel border border-border-subtle text-content-secondary hover:bg-surface-elevated hover:text-content-primary transition-all active:scale-[0.98] font-bold"
                  onClick={() => initiateOAuthLogin('kick')}
                  disabled={isLoading}
                >
                  <Monitor className="w-4 h-4" />
                  <span className="text-sm">Kick</span>
                </button>
                <button
                  className="h-13 flex items-center justify-center gap-2 rounded-2xl bg-surface-panel border border-border-subtle text-content-secondary hover:bg-surface-elevated hover:text-content-primary transition-all active:scale-[0.98] font-bold"
                  onClick={() => initiateOAuthLogin('youtube')}
                  disabled={isLoading}
                >
                  <PlayCircle className="w-4 h-4" />
                  <span className="text-sm">YouTube</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-10 text-center text-sm text-content-dimmed font-medium">
          Don't have an account?{' '}
          <Link to="/register" className="text-brand-primary font-bold hover:text-brand-accent transition-colors underline-offset-4 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
