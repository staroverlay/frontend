import { useState } from 'react';
import { useAuth } from '../hooks/use-auth';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, ShieldCheck, Loader2 } from 'lucide-react';
import { getError } from '../lib/utils';
import { authService } from '../services/auth-service';
import { AuthLayout } from '../components/layouts/AuthLayout';

export default function VerifyEmail() {
  const { user, verifyEmail, refreshUser, isLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [code, setCode] = useState(searchParams.get('code') || '');
  const [email] = useState(searchParams.get('email') || user?.email || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await verifyEmail({ email, code });
      setIsSuccess(true);

      if (user) {
        await refreshUser();
        setTimeout(() => navigate('/'), 2000);
      } else {
        setTimeout(() => navigate('/login'), 3000);
      }
    } catch (err: unknown) {
      setError(getError(err, 'Invalid verification code'));
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || isResending) return;
    setIsResending(true);
    setError('');
    setSuccess('');
    try {
      await authService.resendVerification({ email });
      setSuccess('Verification code resent!');
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
    } catch (err) {
      setError(getError(err, 'Failed to resend code'));
    } finally {
      setIsResending(false);
    }
  };

  if (isSuccess) {
    return (
      <AuthLayout
        title="Email Verified"
        icon={<div className="w-16 h-16 bg-status-success/10 rounded-2xl flex items-center justify-center text-status-success"><CheckCircle className="w-8 h-8" /></div>}
      >
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <p className="text-content-muted text-sm leading-relaxed">
              Your account has been successfully verified. You're ready to go!
            </p>
          </div>
          <div className="pt-6">
            <Button onClick={() => navigate('/login')} className="w-full h-12">
              Continue
            </Button>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Verification"
      subtitle="Please enter the security code sent to you"
      icon={<ShieldCheck className="w-7 h-7" />}
    >
      <form className="space-y-8" onSubmit={handleSubmit}>
        <div className="text-center space-y-2">
          <p className="text-content-dimmed text-sm font-medium">We've sent a 6-digit code to</p>
          <p className="text-content-primary text-base font-bold">{email}</p>
        </div>

        <div className="space-y-4">
          <div className="relative group">
            <Input
              placeholder="000000"
              className="text-center text-4xl font-black tracking-[0.6em] h-20 bg-surface-panel/50 border-border-subtle rounded-2xl focus:border-brand-primary/30 transition-all text-content-primary placeholder:text-content-dimmed selection:bg-brand-primary/30"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              autoFocus
              required
            />
          </div>
        </div>

        {error && (
          <div className="px-4 py-3 bg-status-error/10 border border-status-error/20 text-status-error rounded-2xl text-xs font-semibold text-center animate-in slide-in-from-top-2 duration-300">
            {error}
          </div>
        )}

        {success && (
          <div className="px-4 py-3 bg-status-success/10 border border-status-success/20 text-status-success rounded-2xl text-xs font-semibold text-center animate-in slide-in-from-top-2 duration-300">
            {success}
          </div>
        )}

        <Button className="w-full h-14 rounded-2xl font-black text-sm" disabled={isLoading}>
          {isLoading ? (
            <div className="flex items-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Verifying...</span>
            </div>
          ) : 'Confirm Authorization'}
        </Button>
      </form>

      <div className="mt-10 flex flex-col items-center gap-6 absolute -bottom-24 left-0 right-0">
        <div className="flex items-center gap-6">
          <button
            className="text-content-dimmed hover:text-content-primary transition-colors text-sm font-medium"
            onClick={() => navigate('/login')}
          >
            Cancel
          </button>
          <div className="w-1.5 h-1.5 rounded-full bg-white/5" />
          <button
            className={`text-sm font-bold transition-colors ${resendCooldown > 0 || isResending ? 'text-content-dimmed/50 cursor-not-allowed' : 'text-brand-primary hover:text-brand-accent'}`}
            onClick={handleResend}
            disabled={resendCooldown > 0 || isResending}
          >
            {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : isResending ? 'Resending...' : 'Request new code'}
          </button>
        </div>

        <p className="text-[10px] text-content-dimmed font-bold uppercase tracking-[0.2em]">StarOverlay Security Protocol</p>
      </div>
    </AuthLayout>
  );
}
