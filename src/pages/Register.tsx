import React, { useState } from 'react';
import { UserPlus, Mail, Lock, CheckCircle2, ShieldCheck, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../hooks/use-auth';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { getError } from '../lib/utils';
import { AuthLayout } from '../components/layouts/AuthLayout';

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
      <AuthLayout
        title="Account Created"
        icon={<div className="w-16 h-16 bg-status-success/10 rounded-2xl flex items-center justify-center text-status-success"><CheckCircle2 className="w-8 h-8" /></div>}
      >
        <div className="text-center space-y-6">
          <p className="text-content-muted text-sm leading-relaxed">
            We've sent a verification email to <span className="text-content-primary font-medium">{email}</span>.
            Please verify your email to continue.
          </p>
          <div className="pt-6 flex flex-col gap-4">
            <Button onClick={() => navigate('/login')} variant="primary" className="h-12">
              Go to Login
            </Button>
            <p className="text-xs text-content-dimmed">Redirecting in 5s...</p>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Join the Stars"
      subtitle="Create your StarOverlay account today"
      icon={<UserPlus className="w-7 h-7" />}
    >
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

          <div className="relative group">
            <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-content-dimmed group-focus-within:text-brand-primary transition-colors z-10" />
            <Input
              placeholder="Confirm password"
              type="password"
              className="pl-11"
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

      <p className="mt-10 text-center text-sm text-content-dimmed font-medium absolute -bottom-20 left-0 right-0">
        Already have an account?{' '}
        <Link to="/login" className="text-brand-primary font-bold hover:text-brand-accent transition-colors underline-offset-4 hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
