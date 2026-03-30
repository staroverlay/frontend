import React, { useState } from 'react';
import { useAuth } from '../hooks/use-auth';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, CheckCircle2, ShieldCheck } from 'lucide-react';
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 px-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-fuchsia-600/10 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="mb-10 text-center animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-violet-600/20 text-violet-500 items-center justify-center mb-6">
             <UserPlus className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Create Account</h1>
          <p className="text-zinc-400 text-sm">Sign up to get started</p>
        </div>

        <div className="glass-panel p-10 rounded-[2.5rem] shadow-2xl animate-in fade-in zoom-in-95 duration-700 hover:border-violet-500/20 transition-all duration-500">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
               <div className="relative group px-1">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-500 group-focus-within:text-violet-500 transition-colors" />
                  <Input 
                    placeholder="Email address"
                    type="email"
                    className="pl-11 h-12 bg-zinc-900/50 border-zinc-800 focus:border-violet-500/50 transition-all text-sm rounded-xl"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
               </div>

               <div className="relative group px-1">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-500 group-focus-within:text-violet-500 transition-colors" />
                  <Input 
                    placeholder="Password"
                    type="password"
                    className="pl-11 h-12 bg-zinc-900/50 border-zinc-800 focus:border-violet-500/50 transition-all text-sm rounded-xl"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
               </div>

               <div className="relative group px-1">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-500 group-focus-within:text-violet-500 transition-colors" />
                  <Input 
                    placeholder="Confirm password"
                    type="password"
                    className="pl-11 h-12 bg-zinc-900/50 border-zinc-800 focus:border-violet-500/50 transition-all text-sm rounded-xl"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
               </div>
            </div>

            {error && (
              <div className="p-4 bg-rose-500/5 border border-rose-500/10 text-rose-500 rounded-xl text-sm text-center">
                {error}
              </div>
            )}

            <Button className="w-full h-12 bg-violet-600 hover:bg-violet-700 text-white rounded-xl shadow-lg shadow-violet-500/20 font-semibold transition-all" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                  Creating account...
                </div>
              ) : 'Sign up'}
            </Button>
          </form>
        </div>

        <p className="mt-8 text-center text-sm text-zinc-400">
          Already have an account?{' '}
          <Link to="/login" className="text-violet-400 font-semibold hover:text-violet-300 transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
