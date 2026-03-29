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

              <div className="mb-8 flex items-center gap-4">
                {isConnected && integration.providerAvatarUrl && (
                  <div className="relative">
                    <img 
                      src={integration.providerAvatarUrl} 
                      alt={integration.providerUsername}
                      className="w-12 h-12 rounded-2xl object-cover ring-2 ring-white/10 shadow-lg"
                    />
                    <div className={cn("absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-zinc-900 flex items-center justify-center", provider.bg)}>
                       <provider.icon className={cn("w-2 h-2", provider.color)} />
                    </div>
                  </div>
                )}
                <div className="overflow-hidden">
                  <h3 className="text-xl font-black text-white tracking-tight leading-none mb-1.5">{provider.name}</h3>
                  <p className={cn(
                    "text-[10px] font-bold uppercase tracking-widest truncate max-w-[150px]",
                    isConnected ? "text-emerald-400 font-black" : "text-zinc-500"
                  )}>
                    {isConnected
                      ? (integration.displayName || `@${integration.providerUsername}`)
                      : `Disconnected`}
                  </p>
                </div>
              </div>

              {isConnected && (
                <div className="mb-6 mx-1 p-3.5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between group/toggle hover:bg-white/[0.07] transition-all">
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] font-black text-white/90 uppercase tracking-widest">Login Access</span>
                        <span className="text-[9px] font-medium text-zinc-500">Allow sign in with this account</span>
                    </div>
                    <button 
                        onClick={() => update(provider.id, { allowOauthLogin: !integration.allowOauthLogin })}
                        className={cn(
                            "w-10 h-5 rounded-full transition-all duration-300 relative border",
                            integration.allowOauthLogin 
                                ? "bg-emerald-500/20 border-emerald-500/50" 
                                : "bg-zinc-800 border-zinc-700 hover:border-zinc-600"
                        )}
                    >
                        <div className={cn(
                            "absolute top-1 w-2.5 h-2.5 rounded-full transition-all duration-300 shadow-sm",
                            integration.allowOauthLogin 
                                ? "right-1 bg-emerald-500 shadow-emerald-500/50 scale-110" 
                                : "left-1 bg-zinc-500"
                        )} />
                    </button>
                </div>
              )}

              {isConnected ? (
                <div className="mt-auto flex gap-2">
                  <Button
                    variant="secondary"
                    className="flex-1 bg-zinc-800/50 hover:bg-zinc-800 text-[11px] h-9 gap-1.5 font-bold uppercase tracking-wider border border-white/5"
                    onClick={() => update(provider.id, { })} // Just sync
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
