import { Loader2, Lock, Mail } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AuthForm from '@/auth/components/AuthForm';

export default function LoginPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const onRequestOAuth = (provider: 'kick' | 'youtube' | 'twitch') => {
    console.log('Request OAuth', provider);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  return (
    <AuthForm
      title="Welcome back"
      subtitle="Sign in to access your account"
      oauthHandler={onRequestOAuth}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Email
          </label>
          <div className="relative">
            <input
              type="email"
              id="email"
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              placeholder="Enter your email"
              required
            />
            <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Password
          </label>
          <div className="relative">
            <input
              type="password"
              id="password"
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              placeholder="Enter your password"
              required
            />
            <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-purple-500 hover:bg-purple-600 text-white rounded-lg py-2 font-medium transition-colors relative"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin mx-auto" />
          ) : (
            'Sign in'
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={() => {
            navigate('/auth/password-recovery', { replace: true });
          }}
          className="text-sm text-purple-400 hover:text-purple-300"
        >
          Forgot your password?
        </button>
      </div>

      <p className="mt-4 text-center text-sm text-gray-400">
        Don't have an account?{' '}
        <button
          onClick={() => {
            navigate('/auth/sign-up', { replace: true });
          }}
          className="text-purple-400 hover:text-purple-300 font-medium"
        >
          Sign up
        </button>
      </p>
    </AuthForm>
  );
}
