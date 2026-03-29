import React, { useState } from 'react';
import { useAuth } from '../hooks/use-auth';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, CheckCircle2 } from 'lucide-react';
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 px-4">
        <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 p-8 rounded-2xl text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto">
             <CheckCircle2 className="w-8 h-8 text-emerald-500" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Account Created!</h1>
          <p className="text-zinc-400 text-sm">
            We've sent a verification email to <span className="text-zinc-200 font-bold">{email}</span>. 
            Please check your inbox to activate your account.
          </p>
          <div className="pt-4 flex flex-col gap-3">
             <Link to="/login" className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20">
                Go to Login
             </Link>
             <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Redirecting in 5 seconds...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 px-4">
      <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-blue-600/10 to-transparent -z-10" />
      
      <div className="w-full max-w-md">
        <div className="mb-10 text-center animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="inline-flex w-12 h-12 rounded-xl bg-blue-600 items-center justify-center mb-4 shadow-xl shadow-blue-500/30">
             <UserPlus className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Join StarOverlay</h1>
          <p className="text-zinc-400 text-sm">Create your account to start streaming</p>
        </div>

        <div className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-2xl backdrop-blur-md shadow-2xl animate-in fade-in zoom-in-95 duration-500">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="relative group px-1">
               <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-600 group-focus-within:text-blue-500 transition-colors" />
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
               <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-600 group-focus-within:text-blue-500 transition-colors" />
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
               <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-600 group-focus-within:text-blue-500 transition-colors" />
               <Input 
                 placeholder="Confirm Password"
                 type="password"
                 className="pl-12"
                 value={confirmPassword}
                 onChange={(e) => setConfirmPassword(e.target.value)}
                 required
               />
            </div>

            {error && (
              <div className="p-3.5 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-xs font-semibold">
                {error}
              </div>
            )}

            <Button className="w-full py-2.5 h-11 text-sm font-semibold shadow-lg shadow-blue-500/20 active:scale-[0.98]" disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>
        </div>

        <p className="mt-8 text-center text-sm text-zinc-500">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-400 font-semibold hover:text-blue-300 underline underline-offset-4 decoration-blue-400/30 transition-all">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
