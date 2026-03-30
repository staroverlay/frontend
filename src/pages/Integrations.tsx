import { useEffect } from 'react';
import { useIntegrations } from '../hooks/use-integrations';
import { Skeleton } from '../components/ui/skeleton';
import { ErrorView } from '../components/ui/ErrorView';
import { Share2, Monitor, Video, PlayCircle, Sparkles } from 'lucide-react';
import { IntegrationCard } from '../components/integrations/IntegrationCard';
import { SectionCard } from '../components/settings/SectionCard';

export default function Integrations() {
  const { integrations, isLoading, error, clearError, fetchIntegrations, connect, disconnect, update } = useIntegrations();

  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const providers = [
    { id: 'twitch', name: 'Twitch', icon: Video, color: 'text-[#9146ff]', bg: 'bg-[#9146ff]/5 border-[#9146ff]/10 hover:border-[#9146ff]/30 shadow-[#9146ff]/10' },
    { id: 'youtube', name: 'YouTube', icon: PlayCircle, color: 'text-[#ff0000]', bg: 'bg-[#ff0000]/5 border-[#ff0000]/10 hover:border-[#ff0000]/30 shadow-[#ff0000]/10' },
    { id: 'kick', name: 'Kick', icon: Monitor, color: 'text-[#00e701]', bg: 'bg-[#00e701]/5 border-[#00e701]/10 hover:border-[#00e701]/30 shadow-[#00e701]/10' },
  ];

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] animate-in fade-in duration-500">
        <div className="max-w-md w-full glass-panel p-12 rounded-[3rem] border-rose-500/20 text-center space-y-8">
           <ErrorView
             message={error}
             onRetry={fetchIntegrations}
             title="Failed to Load Integrations"
           />
        </div>
      </div>
    );
  }

  if (isLoading && integrations.length === 0) {
    return (
      <div className="space-y-12 animate-in fade-in duration-700">
        <div className="space-y-4 px-1">
          <Skeleton className="h-4 w-32 bg-zinc-900" />
          <Skeleton className="h-14 w-80 bg-zinc-900 rounded-2xl" />
          <Skeleton className="h-4 w-96 bg-zinc-900" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-72 w-full rounded-[2.5rem] bg-zinc-900" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <SectionCard
      title="Service Integrations"
      subtitle="Connect and manage your streaming accounts to synchronize real-time widgets and broadcast data."
      icon={Share2}
    >

      <div className="flex flex-col gap-4">
        {providers.map((provider) => {
          const integration = integrations.find(i => i.provider === provider.id);
          return (
            <IntegrationCard
              key={provider.id}
              provider={provider}
              integration={integration}
              onConnect={() => connect(provider.id)}
              onDisconnect={() => disconnect(provider.id)}
              onUpdate={(id, data) => update(id, data)}
            />
          );
        })}
      </div>

      <div className="p-6 rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/40 flex flex-col items-center justify-center text-center mt-6">
        <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800">
           <Sparkles className="w-5 h-5 text-zinc-600" />
        </div>
        <p className="mt-3 text-zinc-500 text-sm font-medium">More integrations coming soon</p>
      </div>
    </SectionCard>
  );
}
