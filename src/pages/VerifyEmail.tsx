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
      {/* Immersive Cosmic Background */}
      <div className="absolute top-[10%] left-[10%] w-[30%] h-[30%] rounded-full bg-violet-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] rounded-full bg-fuchsia-600/5 blur-[120px] pointer-events-none" />

      {/* Floating Stars (CSS-only) */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 1.5 + 1}px`,
              height: `${Math.random() * 1.5 + 1}px`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 3 + 2}s`
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="mb-12 text-center animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="inline-flex w-16 h-16 rounded-3xl bg-white/5 border border-white/10 text-violet-400 items-center justify-center mb-6 shadow-2xl backdrop-blur-xl">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white mb-3">Verification</h1>
          <p className="text-zinc-400 font-medium">Please enter the security code sent to you</p>
        </div>

        <div className="glass-panel p-8 md:p-10 rounded-[2.5rem] shadow-2xl animate-in fade-in zoom-in-95 duration-1000 border-white/5 hover:border-violet-500/20 transition-all duration-500 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />

          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="text-center space-y-2">
              <p className="text-zinc-500 text-sm font-medium">We've sent a 6-digit code to</p>
              <p className="text-white text-base font-bold">{email}</p>
            </div>

            <div className="space-y-4">
              <div className="relative group">
                <Input
                  placeholder="000000"
                  className="text-center text-4xl font-black tracking-[0.6em] h-20 bg-white/5 border-white/5 rounded-2xl focus:border-violet-500/30 transition-all text-white placeholder:text-zinc-800 selection:bg-violet-500/30"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  autoFocus
                  required
                />
              </div>
            </div>

            {error && (
              <div className="px-4 py-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl text-xs font-semibold text-center animate-in slide-in-from-top-2 duration-300">
                {error}
              </div>
            )}

            {success && (
              <div className="px-4 py-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl text-xs font-semibold text-center animate-in slide-in-from-top-2 duration-300">
                {success}
              </div>
            )}

            <Button className="w-full h-14 bg-violet-600 hover:bg-violet-700 text-white rounded-2xl shadow-xl shadow-violet-500/20 font-extrabold text-sm transition-all active:scale-[0.98]" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                  <span>Verifying...</span>
                </div>
              ) : 'Confirm Authorization'}
            </Button>
          </form>
        </div>

        <div className="mt-10 flex flex-col items-center gap-6">
          <div className="flex items-center gap-6">
            <button
              className="text-zinc-500 hover:text-zinc-300 transition-colors text-sm font-medium"
              onClick={() => navigate('/login')}
            >
              Cancel
            </button>
            <div className="w-1.5 h-1.5 rounded-full bg-white/5" />
            <button
              className={`text-sm font-bold transition-colors ${resendCooldown > 0 || isResending ? 'text-zinc-700 cursor-not-allowed' : 'text-violet-400 hover:text-violet-300'}`}
              onClick={handleResend}
              disabled={resendCooldown > 0 || isResending}
            >
              {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : isResending ? 'Resending...' : 'Request new code'}
            </button>
          </div>

          <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.2em]">StarOverlay Security Protocol</p>
        </div>
      </div>
    </div>
  );
}
