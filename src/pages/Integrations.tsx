import { useEffect } from 'react';
import { Monitor, Video, PlayCircle, Sparkles } from 'lucide-react';

import { useIntegrations } from '../hooks/use-integrations';
import { Skeleton } from '../components/ui/skeleton';
import { ErrorView } from '../components/layouts/ErrorView';
import { IntegrationCard } from '../components/settings/IntegrationCard';

export default function Integrations() {
  const { integrations, isLoading, error, clearError, fetchIntegrations, connect, disconnect, update, sync } = useIntegrations();

  useEffect(() => { return () => clearError(); }, [clearError]);

  const providers = [
    { id: 'twitch', name: 'Twitch', icon: Video, color: 'text-[#9146ff]', bg: 'bg-[#9146ff]/5 border-[#9146ff]/10 hover:border-[#9146ff]/30 shadow-[#9146ff]/10' },
    { id: 'youtube', name: 'YouTube', icon: PlayCircle, color: 'text-[#ff0000]', bg: 'bg-[#ff0000]/5 border-[#ff0000]/10 hover:border-[#ff0000]/30 shadow-[#ff0000]/10' },
    { id: 'kick', name: 'Kick', icon: Monitor, color: 'text-[#00e701]', bg: 'bg-[#00e701]/5 border-[#00e701]/10 hover:border-[#00e701]/30 shadow-[#00e701]/10' },
  ];

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] animate-in fade-in duration-500">
        <div className="max-w-md w-full">
          <ErrorView message={error} onRetry={fetchIntegrations} title="Failed to Load Integrations" />
        </div>
      </div>
    );
  }

  if (isLoading && integrations.length === 0) {
    return (
      <div className="space-y-10 animate-in fade-in duration-700">
        <Skeleton className="h-20 w-full bg-surface-panel rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-72 w-full rounded-3xl bg-surface-panel" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-700">
      <div className="flex flex-col gap-4">
        {providers.map((provider) => {
          const integration = integrations.find((i) => i.provider === provider.id);
          return (
            <IntegrationCard
              key={provider.id}
              provider={provider}
              integration={integration}
              onConnect={() => connect(provider.id)}
              onDisconnect={() => disconnect(provider.id)}
              onUpdate={(id, data) => update(id, data)}
              onSync={() => sync(provider.id)}
            />
          );
        })}
      </div>

      <div className="p-6 rounded-2xl border border-dashed border-border-default bg-surface-card/40 flex flex-col items-center justify-center text-center">
        <div className="w-10 h-10 rounded-full bg-surface-panel flex items-center justify-center border border-white/[0.06]">
          <Sparkles className="w-5 h-5 text-content-dimmed" />
        </div>
        <p className="mt-3 text-content-dimmed text-sm font-medium">More integrations coming soon</p>
      </div>
    </div>
  );
}
