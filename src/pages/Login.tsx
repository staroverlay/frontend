import React, { useState } from 'react';
import { useAuth } from '../hooks/use-auth';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Link } from 'react-router-dom';
import { Mail, Lock, LogIn, Globe, Code2 } from 'lucide-react';
import { getError } from '../lib/utils';

export default function Login() {
  const { login, isLoading } = useAuth();
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 px-4">
      <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-blue-600/10 to-transparent -z-10" />
      
      <div className="w-full max-w-md">
        <div className="mb-10 text-center animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="inline-flex w-12 h-12 rounded-xl bg-blue-600 items-center justify-center mb-4 shadow-xl shadow-blue-500/30">
             <LogIn className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Welcome Back</h1>
          <p className="text-zinc-400 text-sm">Sign in to your account to continue</p>
        </div>

        <div className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-2xl backdrop-blur-md shadow-2xl animate-in fade-in zoom-in-95 duration-500">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="relative group">
               <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-600 group-focus-within:text-blue-500 transition-colors" />
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
               <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-600 group-focus-within:text-blue-500 transition-colors" />
               <Input 
                 placeholder="Password"
                 type="password"
                 className="pl-11"
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 required
               />
            </div>

            {error && (
              <div className="p-3.5 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-xs font-semibold animate-shake">
                {error}
              </div>
            )}

            <Button className="w-full py-2.5 h-11 text-sm font-semibold shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98]" disabled={isLoading}>
              {isLoading ? 'Wait a moment...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-8">
            <div className="relative flex items-center justify-center mb-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-800" /></div>
              <span className="relative bg-[#09090b] px-3 text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Or social login</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="secondary" className="gap-2.5 text-xs font-semibold bg-zinc-800 border border-zinc-700/50 hover:bg-zinc-700 transition-all">
                <Globe className="w-4 h-4 text-[#ea4335]" />
                Google
              </Button>
              <Button variant="secondary" className="gap-2.5 text-xs font-semibold bg-zinc-800 border border-zinc-700/50 hover:bg-zinc-700 transition-all">
                <Code2 className="w-4 h-4 text-white" />
                GitHub
              </Button>
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-zinc-500 animate-in fade-in duration-1000">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-400 font-semibold hover:text-blue-300 underline underline-offset-4 decoration-blue-400/30 transition-all hover:decoration-blue-300">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
