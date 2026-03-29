import { useEffect } from 'react';

import { useIntegrations } from '../hooks/use-integrations';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import { ErrorView } from '../components/ui/ErrorView';
import { Share2, Plus, Unplug, CheckCircle2, RotateCcw, Monitor, Video, PlayCircle } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Integrations() {
  const { integrations, isLoading, error, clearError, fetchIntegrations, connect, disconnect, update } = useIntegrations();

  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const providers = [
    { id: 'twitch', name: 'Twitch', icon: Video, color: 'text-[#9146ff]', bg: 'bg-[#9146ff]/10 border-[#9146ff]/20 hover:border-[#9146ff]/40 shadow-[#9146ff]/5' },
    { id: 'youtube', name: 'YouTube', icon: PlayCircle, color: 'text-[#ff0000]', bg: 'bg-[#ff0000]/10 border-[#ff0000]/20 hover:border-[#ff0000]/40 shadow-[#ff0000]/5' },
    { id: 'kick', name: 'Kick', icon: Monitor, color: 'text-[#00e701]', bg: 'bg-[#00e701]/10 border-[#00e701]/20 hover:border-[#00e701]/40 shadow-[#00e701]/5' },
  ];

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <ErrorView
          message={error}
          onRetry={fetchIntegrations}
          title="Failed to Load Integrations"
        />
      </div>
    );
  }

  if (isLoading && integrations.length === 0) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-96 underline decoration-white/20 underline-offset-8" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-blue-500 font-bold text-[10px] uppercase tracking-widest mb-1 px-1">
          <Share2 className="w-3.5 h-3.5" />
          Connected Accounts
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">
          Integrations
        </h1>
        <p className="text-zinc-500 font-medium text-sm max-w-lg leading-relaxed px-1">
          Manage your streaming accounts to automatically sync data, events, and widgets for your broadcast.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {providers.map((provider) => {
          const integration = integrations.find(i => i.provider === provider.id);
          const isConnected = !!integration;

          return (
            <div
              key={provider.id}
              className={cn(
                'group p-6 rounded-3xl border bg-zinc-900/40 backdrop-blur-xl flex flex-col transition-all duration-300 shadow-xl overflow-hidden relative',
                provider.bg
              )}
            >
              <div className="flex justify-between items-start mb-6">
                <div className={cn('p-3 rounded-2xl group-hover:scale-110 transition-transform duration-500', provider.bg, provider.color)}>
                  <provider.icon className="w-6 h-6" />
                </div>
                {isConnected ? (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                    <CheckCircle2 className="w-3 h-3" />
                    Connected
                  </div>
                ) : (
                  <div className="px-3 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-400 text-[10px] font-black uppercase tracking-widest">
                    Disconnected
                  </div>
                )}
              </div>

              <div className="mb-8 overflow-hidden">
                <h3 className="text-xl font-extrabold text-white mb-1">{provider.name}</h3>
                <p className="text-zinc-500 text-xs font-medium truncate">
                  {isConnected
                    ? integration.displayName || integration.providerUsername
                    : `Connect your ${provider.name} account to sync data.`}
                </p>
              </div>

              {isConnected ? (
                <div className="mt-auto flex gap-2">
                  <Button
                    variant="secondary"
                    className="flex-1 bg-zinc-800/50 hover:bg-zinc-800 text-[11px] h-9 gap-1.5 font-bold uppercase tracking-wider"
                    onClick={() => update(provider.id, { allowOauthLogin: !integration.allowOauthLogin })}
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-zinc-400" />
                    Sync
                  </Button>
                  <Button
                    variant="danger"
                    className="aspect-square p-0 w-9 h-9 border border-red-500/20 bg-red-500/5 hover:bg-red-500 text-red-500 hover:text-white transition-all shadow-none"
                    onClick={() => disconnect(provider.id)}
                  >
                    <Unplug className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  className="mt-auto gap-2 text-xs font-bold uppercase tracking-widest h-11 shadow-lg shadow-blue-500/10 active:scale-[0.98]"
                  onClick={() => connect(provider.id)}
                >
                  <Plus className="w-4 h-4" />
                  Connect
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
