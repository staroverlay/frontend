import { Star } from 'lucide-react';
import { PropsWithChildren } from 'react';

import OAuthButtons from './OAuthButtons';

interface AuthFormProps extends PropsWithChildren {
  title: string;
  subtitle: string;
  oauthHandler?: (provider: 'twitch' | 'youtube' | 'kick') => unknown;
}

export default function AuthForm({
  title,
  subtitle,
  oauthHandler,
  children,
}: AuthFormProps) {
  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Star className="h-8 w-8 text-purple-400" />
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
            StarOverlay
          </span>
        </div>
        <h2 className="text-xl font-semibold text-gray-200">{title}</h2>
        <p className="text-gray-400 mt-2">{subtitle}</p>
      </div>

      <div className="glass rounded-2xl p-8">
        {children}
        {oauthHandler && <OAuthButtons />}
      </div>
    </div>
  );
}
