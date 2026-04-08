import React, { useState } from 'react';
import { UserPlus, Mail, Lock, CheckCircle2, ShieldCheck, Loader2 } from 'lucide-react';

import { useAuth } from '../hooks/use-auth';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Link, useNavigate } from 'react-router-dom';
import { getError } from '../lib/utils';

export default function Register() {
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await register({ email, password });
      setIsSuccess(true);
      setTimeout(() => navigate('/login'), 5000);
    } catch (err: unknown) {
      setError(getError(err, 'Failed to create account'));
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 px-4 relative overflow-hidden">
        <div className="w-full max-w-md glass-panel p-10 rounded-[2.5rem] text-center space-y-6 animate-in fade-in zoom-in-95 duration-700 relative z-10">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto text-emerald-500">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Account Created</h1>
            <p className="text-zinc-400 text-sm leading-relaxed">
              We've sent a verification email to <span className="text-white font-medium">{email}</span>.
              Please verify your email to continue.
            </p>
          </div>
          <div className="pt-6 flex flex-col gap-4">
            <Link to="/login" className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-all">
              Go to Login
            </Link>
            <p className="text-xs text-zinc-500">Redirecting in 5s...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface-base px-4 relative overflow-hidden">
      {/* Immersive Cosmic Background */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[10%] right-[10%] w-[30%] h-[30%] rounded-full bg-brand-primary/5 blur-[120px]" />
        <div className="absolute bottom-[10%] left-[10%] w-[30%] h-[30%] rounded-full bg-brand-secondary/5 blur-[120px]" />
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
            <UserPlus className="w-7 h-7" />
          </div>
          <h1 className="text-4xl font-black tracking-tight text-content-primary mb-3 uppercase">Join the Stars</h1>
          <p className="text-content-muted font-medium">Create your StarOverlay account today</p>
        </div>

        <div className="glass-panel p-8 md:p-10 rounded-[2.5rem] shadow-premium animate-in fade-in zoom-in-95 duration-1000 border-border-subtle hover:border-brand-primary/20 transition-all duration-500 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="relative group px-1">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-content-dimmed group-focus-within:text-brand-primary transition-colors z-10" />
                <Input
                  placeholder="Email address"
                  type="email"
                  className="pl-12"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="relative group px-1">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-content-dimmed group-focus-within:text-brand-primary transition-colors z-10" />
                <Input
                  placeholder="Password"
                  type="password"
                  className="pl-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="relative group px-1">
                <ShieldCheck className="absolute left-5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-content-dimmed group-focus-within:text-brand-primary transition-colors z-10" />
                <Input
                  placeholder="Confirm password"
                  type="password"
                  className="pl-12"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                  <span>Creating account...</span>
                </div>
              ) : 'Sign up'}
            </Button>
          </form>
        </div>

        <p className="mt-10 text-center text-sm text-content-dimmed font-medium">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-primary font-bold hover:text-brand-accent transition-colors underline-offset-4 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
