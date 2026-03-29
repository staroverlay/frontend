import React, { useState } from 'react';
import { useAuth } from '../hooks/use-auth';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, CheckCircle, ShieldCheck } from 'lucide-react';
import { getError } from '../lib/utils';

export default function VerifyEmail() {
  const { user, verifyEmail, refreshUser, isLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [code, setCode] = useState(searchParams.get('code') || '');
  const [email] = useState(searchParams.get('email') || user?.email || '');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await verifyEmail({ email, code });
      setIsSuccess(true);
      
      // If logged in, refresh user and go home. Otherwise go to login.
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

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
        <div className="w-full max-w-md bg-zinc-900 border border-emerald-500/20 p-8 rounded-2xl text-center space-y-6 shadow-2xl shadow-emerald-500/10">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
             <CheckCircle className="w-8 h-8 text-emerald-500" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Email Verified</h1>
          <p className="text-zinc-400 text-sm">Your account has been successfully verified. You're ready to go!</p>
          <div className="pt-4 flex flex-col gap-3">
             <Button onClick={() => navigate('/login')} className="w-full h-11 bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/20 font-bold uppercase tracking-widest text-xs">
                Continue to Login
             </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
      <div className="absolute top-0 left-0 w-full h-1/4 bg-blue-600/5 -z-10 blur-3xl opacity-50" />
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 items-center justify-center mb-4">
             <ShieldCheck className="w-6 h-6 text-blue-500" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight mb-2">Verify Account</h1>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest px-4">Enter the code sent to your email address</p>
        </div>

        <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/80 p-8 rounded-2xl shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-group hover:opacity-10">
             <Mail className="w-24 h-24" />
          </div>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <div className="text-center pb-2">
                <p className="text-zinc-500 text-[10px] uppercase font-black tracking-widest mb-1">Verifying Account</p>
                <p className="text-white text-sm font-bold truncate">{email}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <Input 
                 placeholder="000000"
                 label="Verification Code"
                 className="text-center text-xl font-bold tracking-[0.5em] h-14 bg-zinc-950/50 border-zinc-800"
                 maxLength={6}
                 value={code}
                 onChange={(e) => setCode(e.target.value)}
                 autoFocus
                 required
               />
            </div>

            {error && (
              <div 
                key={error}
                className="p-4 bg-red-500/20 border border-red-500/40 text-red-200 rounded-xl text-xs font-bold text-center animate-in fade-in zoom-in duration-300"
              >
                {error}
              </div>
            )}

            <Button className="w-full h-12 font-black uppercase tracking-widest text-[11px] h-12 shadow-xl shadow-blue-500/10 active:scale-[0.98] transition-all" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Verifying...
                </div>
              ) : 'Complete Verification'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
