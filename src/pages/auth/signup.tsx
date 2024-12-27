import { Loader2, Lock, Mail, User } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AuthForm from '@/auth/components/AuthForm';

export default function SignUpPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');

  const onSuccess = (email: string) => {
    console.log('Success', email);
  };

  const onRequestOAuth = (provider: 'kick' | 'youtube' | 'twitch') => {
    console.log('Request OAuth', provider);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    onSuccess(email);
  };
  return (
    <AuthForm
      title="Create your account"
      subtitle="Join the streaming community"
      oauthHandler={onRequestOAuth}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="display-name"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Display Name
          </label>
          <div className="relative">
            <input
              type="text"
              id="display-name"
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              placeholder="Choose a display name"
              required
            />
            <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
          </div>
        </div>

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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              placeholder="Choose a strong password"
              required
            />
            <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-purple-500 hover:bg-purple-600 text-white rounded-lg py-2 font-medium transition-colors"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin mx-auto" />
          ) : (
            'Create account'
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-400">
        Already have an account?{' '}
        <button
          onClick={() => {
            navigate('/auth/login', { replace: true });
          }}
          className="text-purple-400 hover:text-purple-300 font-medium"
        >
          Sign in
        </button>
      </p>
    </AuthForm>
  );
}
