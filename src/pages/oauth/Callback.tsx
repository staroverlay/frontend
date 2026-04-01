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
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Immersive Background Effects */}
      <div className="absolute top-[20%] left-[20%] w-[40%] h-[40%] rounded-full bg-blue-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[20%] w-[40%] h-[40%] rounded-full bg-violet-600/5 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/5 rounded-[3rem] p-12 flex flex-col items-center gap-10 shadow-2xl relative overflow-hidden group animate-in fade-in zoom-in-95 duration-700">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />

        {status === 'processing' && (
          <>
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full scale-150 animate-pulse" />
              <Loader2 className="w-16 h-16 text-blue-400 animate-spin relative z-10" />
            </div>
            <div className="text-center space-y-4">
              <h1 className="text-3xl font-extrabold text-white tracking-tight">Authenticating</h1>
              <p className="text-zinc-400 text-base font-medium">
                Securely connecting to <span className="text-blue-400 font-bold capitalize">{provider}</span>...
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
            <div className="text-center space-y-4">
              <h1 className="text-3xl font-extrabold text-white tracking-tight">Connection Ready</h1>
              <p className="text-zinc-400 text-base font-medium">
                Your <span className="text-emerald-400 font-bold capitalize">{provider}</span> account has been linked.
              </p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-5 h-5 text-zinc-600 animate-spin" />
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Redirecting</p>
            </div>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="relative animate-in zoom-in duration-500">
              <div className="absolute inset-0 bg-rose-500/20 blur-3xl rounded-full scale-150" />
              <XCircle className="w-16 h-16 text-rose-500 relative z-10" />
            </div>
            <div className="text-center space-y-4">
              <h1 className="text-3xl font-extrabold text-white tracking-tight">Authentication Error</h1>
              <p className="text-rose-400/90 text-sm font-medium leading-relaxed max-w-[280px]">
                {errorMsg}
              </p>
            </div>
            <Button
              variant="secondary"
              className="mt-4 w-full h-14 bg-white/5 hover:bg-white/10 text-white font-bold text-sm rounded-2xl border border-white/5 active:scale-[0.98] transition-all"
              onClick={() => navigate('/integrations')}
            >
              Return to Integrations
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
