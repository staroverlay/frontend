import { ArrowRight, Loader2 } from 'lucide-react';
import { useRef, useState } from 'react';

import AuthForm from '@/auth/components/AuthForm';

export default function VerifyEmailPage() {
  const [isLoading, setIsLoading] = useState(false);
  const email = 'foo@bar.com';
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Move to next input
    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
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
      title="Verify your email"
      subtitle="Check your inbox for the verification code"
    >
      <div className="space-y-4">
        <p className="text-gray-400 text-sm mb-6">
          We sent a verification code to{' '}
          <span className="text-purple-400">{email}</span>
        </p>

        <form onSubmit={handleSubmit}>
          <div className="flex justify-center space-x-2 mb-6">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputs.current[index] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center bg-white/5 border border-white/10 rounded-lg text-gray-100 text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={isLoading || code.some((d) => !d)}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white rounded-lg py-2 font-medium transition-colors flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <span>Verify email</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center">
          <button className="text-sm text-purple-400 hover:text-purple-300">
            Didn't receive the code? Resend
          </button>
        </div>
      </div>
    </AuthForm>
  );
}
