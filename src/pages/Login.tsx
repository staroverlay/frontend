import React, { useState } from 'react';
import { Mail, Lock, LogIn, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useAuth } from '../hooks/use-auth';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { getError } from '../lib/utils';
import { authService } from '../services/auth-service';
import { AuthLayout } from '../components/layouts/AuthLayout';
import { SocialLogin } from '../components/auth/SocialLogin';

export default function Login() {
  const { login, isLoading, verifyEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [needsVerification, setNeedsVerification] = useState(false);
  const [code, setCode] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login({ email, password });
    } catch (err: unknown) {
      const errMsg = getError(err, 'Failed to login');
      if (errMsg === 'EMAIL_NOT_VERIFIED' || errMsg.toLowerCase() === 'email not verified') {
        setNeedsVerification(true);
      } else {
        setError(errMsg);
      }
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await verifyEmail({ email, code });
      await login({ email, password });
    } catch (err: unknown) {
      setError(getError(err, 'Invalid verification code'));
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || isResending) return;
    setIsResending(true);
    setError('');
    try {
      await authService.resendVerification({ email });
      setResendCooldown(60);
      const timer = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err: unknown) {
      setError(getError(err, 'Failed to resend code'));
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AuthLayout
      title={needsVerification ? "Verify Email" : "Welcome Back"}
      subtitle={needsVerification ? `Enter the 6-digit code sent to ${email}` : "Continue your journey with StarOverlay"}
      icon={<LogIn className="w-7 h-7" />}
    >
      {needsVerification ? (
        <form className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500" onSubmit={handleVerify}>
          <div className="relative group">
            <Input
              placeholder="000000"
              className="text-center tracking-[0.5em] font-bold text-xl h-14"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              autoFocus
              required
            />
          </div>
          {error && (
            <div className="px-4 py-3 bg-status-error/10 border border-status-error/20 text-status-error rounded-2xl text-xs font-bold text-center">
              {error}
            </div>
          )}
          <Button className="w-full h-13 rounded-2xl" disabled={isLoading}>
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm'}
          </Button>
          <div className="flex items-center justify-between text-sm mt-4">
            <button
              type="button"
              onClick={() => setNeedsVerification(false)}
              className="text-content-dimmed hover:text-white"
            >
              Back to Login
            </button>
            <button
              type="button"
              onClick={handleResend}
              disabled={resendCooldown > 0 || isResending}
              className="text-brand-primary font-bold hover:text-brand-accent disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : isResending ? 'Resending...' : 'Resend code'}
            </button>
          </div>
        </form>
      ) : (
        <>
          <form className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500" onSubmit={handleSubmit}>
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

          <SocialLogin />
        </>
      )}

      <p className="mt-10 text-center text-sm text-content-dimmed font-medium absolute -bottom-20 left-0 right-0">
        Don't have an account?{' '}
        <Link to="/register" className="text-brand-primary font-bold hover:text-brand-accent transition-colors underline-offset-4 hover:underline">
          Sign up
        </Link>
      </p>
    </AuthLayout>
  );
}
