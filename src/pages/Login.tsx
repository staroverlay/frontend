import React, { useState } from 'react';
import { useAuth } from '../hooks/use-auth';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Link } from 'react-router-dom';
import { Mail, Lock, LogIn, Video, Monitor, PlayCircle } from 'lucide-react';
import { getError } from '../lib/utils';

export default function Login() {
  const { login, initiateOAuthLogin, isLoading } = useAuth();
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 px-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-fuchsia-600/10 blur-[120px] pointer-events-none" />
      
      <div className="w-full max-w-md relative z-10">
        <div className="mb-10 text-center animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-violet-600/20 text-violet-500 items-center justify-center mb-6">
             <LogIn className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Welcome Back</h1>
          <p className="text-zinc-400 text-sm">Sign in to your account</p>
        </div>

        <div className="glass-panel p-10 rounded-[2.5rem] shadow-2xl animate-in fade-in zoom-in-95 duration-700 hover:border-violet-500/20 transition-all duration-500">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
                <div className="relative group">
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

               <div className="relative group">
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
            </div>

            {error && (
              <div className="p-4 bg-rose-500/5 border border-rose-500/10 text-rose-500 rounded-xl text-[10px] font-black uppercase tracking-widest text-center animate-in slide-in-from-top-2 duration-300">
                {error}
              </div>
            )}

            <Button className="w-full h-12 bg-violet-600 hover:bg-violet-700 text-white rounded-xl shadow-lg shadow-violet-500/20 font-semibold transition-all" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                  Signing in...
                </div>
              ) : 'Sign in'}
            </Button>
          </form>

          <div className="mt-10">
            <div className="relative flex items-center justify-center mb-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-800" /></div>
              <span className="relative bg-[#09090b] px-3 text-xs text-zinc-500 font-medium tracking-wide">Or continue with</span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <button 
                className="w-full h-12 flex items-center justify-center gap-3 rounded-xl bg-[#9146ff] hover:bg-[#a970ff] text-white transition-colors"
                onClick={() => initiateOAuthLogin('twitch')}
                disabled={isLoading}
              >
                <Video className="w-5 h-5" />
                <span className="text-sm font-semibold">Twitch</span>
              </button>
              
              <div className="grid grid-cols-2 gap-3">
                <button 
                  className="h-12 flex items-center justify-center gap-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
                  onClick={() => initiateOAuthLogin('kick')}
                  disabled={isLoading}
                >
                  <Monitor className="w-4 h-4" />
                  <span className="text-sm font-semibold">Kick</span>
                </button>
                <button 
                  className="h-12 flex items-center justify-center gap-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
                  onClick={() => initiateOAuthLogin('youtube')}
                  disabled={isLoading}
                >
                  <PlayCircle className="w-4 h-4" />
                  <span className="text-sm font-semibold">YouTube</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-zinc-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-violet-400 font-semibold hover:text-violet-300 transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
