import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';

import { oauthService } from '@/services/oauth-service';
import { authService } from '@/services/auth-service';
import { useAuth } from '@/hooks/use-auth';
import { useAuthStore } from '@/stores/auth-store';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function OAuthCallback() {
  const { provider } = useParams<{ provider: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const { setAuthenticated, setUser } = useAuthStore();

  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
      setStatus('error');
      setErrorMsg(searchParams.get('error_description') || 'Authentication failed');
      return;
    }

    if (!code || !state || !provider) {
      setStatus('error');
      setErrorMsg('Invalid callback parameters');
      return;
    }

    const processCallback = async () => {
      try {
        const result = await oauthService.handleCallback(provider, { code, state });

        // If it was a login (result has accessToken), we should fetch the session.
        // If it was just a connection, we just redirect back to integrations.
        if (result && 'accessToken' in result) {
          // Save tokens to localStorage
          const tokens = result as any;
          localStorage.setItem('access_token', tokens.accessToken);
          localStorage.setItem('refresh_token', tokens.refreshToken);

          try {
            // Fetch user data directly to avoid hook closure issues
            const userData = await authService.getMe();
            setUser(userData);
            setAuthenticated(true);
            navigate('/', { replace: true });
          } catch (fetchErr) {
            console.error('Failed to fetch user after OAuth:', fetchErr);
            setStatus('error');
            setErrorMsg('Authenticated successfully, but failed to fetch your profile. Please try logging in normally.');
          }
        } else {
          setStatus('success');
          setTimeout(() => {
            navigate('/integrations', { replace: true });
          }, 2000);
        }
      } catch (err: any) {
        setStatus('error');
        setErrorMsg(err.response?.data?.error || err.message || 'Something went wrong during authentication');
      }
    };

    processCallback();
  }, [provider, searchParams, navigate, refreshUser]);

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-zinc-900/50 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-12 flex flex-col items-center gap-8 shadow-2xl relative overflow-hidden group">
        {/* Decorative elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

        {status === 'processing' && (
          <>
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full scale-150 animate-pulse" />
              <Loader2 className="w-16 h-16 text-blue-500 animate-spin relative z-10" />
            </div>
            <div className="text-center space-y-3">
              <h1 className="text-2xl font-black text-white tracking-tight uppercase">Authenticating</h1>
              <p className="text-zinc-500 text-sm font-medium tracking-wide">
                Securely connecting to <span className="text-blue-400 capitalize">{provider}</span>...
              </p>
            </div>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="relative animate-in zoom-in duration-500">
              <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full scale-150" />
              <CheckCircle2 className="w-16 h-16 text-emerald-500 relative z-10" />
            </div>
            <div className="text-center space-y-3">
              <h1 className="text-2xl font-black text-white tracking-tight uppercase">Connected!</h1>
              <p className="text-zinc-500 text-sm font-medium tracking-wide">
                Your <span className="text-emerald-400 capitalize">{provider}</span> account has been linked.
              </p>
            </div>
            <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-[0.2em]">Redirecting shortly</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="relative animate-in zoom-in duration-500">
              <div className="absolute inset-0 bg-red-500/20 blur-3xl rounded-full scale-150" />
              <XCircle className="w-16 h-16 text-red-500 relative z-10" />
            </div>
            <div className="text-center space-y-3">
              <h1 className="text-2xl font-black text-white tracking-tight uppercase">Connection Failed</h1>
              <p className="text-red-400/80 text-sm font-medium leading-relaxed">
                {errorMsg}
              </p>
            </div>
            <Button
              variant="secondary"
              className="mt-4 w-full h-12 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest text-[11px] rounded-2xl border border-white/5"
              onClick={() => navigate('/integrations')}
            >
              Back to Integrations
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
