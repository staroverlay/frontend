import { useState } from 'react';
import { useAuth } from '../hooks/use-auth';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, ShieldCheck } from 'lucide-react';
import { getError } from '../lib/utils';
import { authService } from '../services/auth-service';

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
      await authService.resendVerification();
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 px-4 relative overflow-hidden">
        <div className="w-full max-w-md glass-panel p-10 rounded-[2.5rem] text-center space-y-6 animate-in fade-in zoom-in-95 duration-700 relative z-10">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto text-emerald-500">
            <CheckCircle className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Email Verified</h1>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Your account has been successfully verified. You're ready to go!
            </p>
          </div>
          <div className="pt-6">
            <Button onClick={() => navigate('/login')} className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-all">
              Continue
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-fuchsia-600/10 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="mb-10 text-center animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-violet-600/20 text-violet-500 items-center justify-center mb-6">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Verify Email</h1>
          <p className="text-zinc-400 text-sm">Enter the code sent to your email</p>
        </div>

        <div className="glass-panel p-10 rounded-[2.5rem] shadow-2xl animate-in fade-in zoom-in-95 duration-700 hover:border-violet-500/20 transition-all duration-500">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="text-center space-y-1 pb-2">
              <p className="text-zinc-500 text-sm">We sent a 6-digit code to</p>
              <p className="text-white text-sm font-semibold">{email}</p>
            </div>

            <div className="space-y-4">
              <div className="relative group">
                <Input
                  placeholder="000000"
                  className="text-center text-3xl font-bold tracking-[0.5em] h-16 bg-zinc-900/50 border-zinc-800 rounded-2xl focus:border-violet-500/50 transition-all text-white placeholder:text-zinc-800"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  autoFocus
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-rose-500/5 border border-rose-500/10 text-rose-500 rounded-xl text-sm text-center">
                {error}
              </div>
            )}

            {success && (
              <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 text-emerald-500 rounded-xl text-sm text-center">
                {success}
              </div>
            )}

            <Button className="w-full h-12 bg-violet-600 hover:bg-violet-700 text-white rounded-xl shadow-lg shadow-violet-500/20 font-semibold transition-all" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                  Verifying...
                </div>
              ) : 'Verify Account'}
            </Button>
          </form>
        </div>

        <div className="mt-8 flex items-center justify-center gap-6 text-sm">
          <button
            className="text-zinc-500 hover:text-zinc-300 transition-colors"
            onClick={() => navigate('/login')}
          >
            Cancel
          </button>
          <div className="w-1 h-1 rounded-full bg-zinc-800" />
          <button
            className={`font-semibold transition-colors ${resendCooldown > 0 || isResending ? 'text-zinc-600 cursor-not-allowed' : 'text-violet-400 hover:text-violet-300'}`}
            onClick={handleResend}
            disabled={resendCooldown > 0 || isResending}
          >
            {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : isResending ? 'Resending...' : 'Resend code'}
          </button>
        </div>
      </div>
    </div>
  );
}
