import { ArrowLeft, Loader2, Mail } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AuthForm from '@/auth/components/AuthForm';

export default function PasswordRecoverPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    setIsSubmitted(true);
  };

  return (
    <AuthForm
      title="Reset your password"
      subtitle="We'll send you instructions to reset your password"
    >
      <div className="space-y-4">
        <button
          onClick={() => {
            navigate('/auth/login', { replace: true });
          }}
          className="flex items-center text-sm text-purple-400 hover:text-purple-300 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to sign in
        </button>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Email address
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

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white rounded-lg py-2 font-medium transition-colors"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin mx-auto" />
              ) : (
                'Send reset instructions'
              )}
            </button>
          </form>
        ) : (
          <div className="text-center py-4">
            <div className="bg-purple-500/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <Mail className="h-6 w-6 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-200 mb-2">
              Check your email
            </h3>
            <p className="text-gray-400 mb-4">
              We sent password reset instructions to
              <br />
              <span className="text-purple-400">{email}</span>
            </p>
          </div>
        )}
      </div>
    </AuthForm>
  );
}
