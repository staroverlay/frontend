import { CheckCircle2, RotateCcw, Unplug, type LucideIcon } from 'lucide-react';

import { cn } from '../../lib/utils';
import { type Integration } from '../../lib/types';

interface IntegrationCardProps {
  provider: {
    id: string;
    name: string;
    icon: LucideIcon;
    color: string;
    bg: string;
  };
  integration?: Integration;
  onConnect: (id: string) => void;
  onDisconnect: (id: string) => void;
  onUpdate: (id: string, data: any) => void;
}

export function IntegrationCard({
  provider,
  integration,
  onConnect,
  onDisconnect,
  onUpdate,
}: IntegrationCardProps) {
  const isConnected = !!integration;

  return (
    <div className="p-4 rounded-xl border bg-surface-card/60 border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-brand-primary/30 overflow-hidden relative">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        {isConnected && integration?.providerAvatarUrl ? (
          <div className="relative shrink-0">
            <img
              src={integration.providerAvatarUrl || ''}
              alt={integration.providerUsername}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-border-subtle"
            />
            <div className={cn("absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-surface-base flex items-center justify-center bg-surface-panel", provider.color)}>
              <provider.icon className="w-2.5 h-2.5" />
            </div>
          </div>
        ) : (
          <div className={cn('p-2.5 rounded-lg shrink-0', provider.bg, provider.color)}>
            <provider.icon className="w-5 h-5" />
          </div>
        )}

        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-content-primary leading-none">{provider.name}</h3>
            {isConnected ? (
              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold">
                <CheckCircle2 className="w-3 h-3" />
                Connected
              </span>
            ) : (
              <span className="px-1.5 py-0.5 rounded border border-border-subtle bg-surface-panel text-content-dimmed text-[10px] font-semibold">
                Not connected
              </span>
            )}
          </div>
          {isConnected && (
            <p className="text-xs text-content-muted truncate mt-1">
              {integration?.displayName || `@${integration?.providerUsername}`}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {isConnected && integration ? (
          <>
            <div className="flex items-center gap-2 mr-2 border-r border-border-subtle pr-4">
              <span className="text-xs font-medium text-content-muted">Login Access</span>
              <button
                onClick={() => onUpdate(provider.id, { allowOauthLogin: !integration.allowOauthLogin })}
                className={cn(
                  "w-8 h-4.5 rounded-full transition-all relative border", // updated height to h-4.5
                  integration.allowOauthLogin
                    ? "bg-brand-primary border-brand-primary"
                    : "bg-surface-elevated hover:bg-surface-panel border-transparent"
                )}
                style={{ height: '1.125rem' }} // fallback inline style since h-4.5 is custom
              >
                <div className={cn(
                  "absolute top-[1px] w-3.5 h-3.5 bg-white rounded-full transition-all shadow-sm",
                  integration.allowOauthLogin ? "translate-x-4" : "translate-x-[1px]"
                )} />
              </button>
            </div>

            <button
              className="p-2 border border-border-subtle bg-surface-panel hover:bg-surface-elevated text-content-muted transition-colors rounded-lg flex items-center justify-center"
              onClick={() => onUpdate(provider.id, {})}
              title="Sync Data"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              className="p-2 border border-border-subtle bg-surface-panel hover:bg-rose-500/10 hover:border-rose-500/30 text-content-muted hover:text-rose-500 transition-colors rounded-lg flex items-center justify-center"
              onClick={() => onDisconnect(provider.id)}
              title="Disconnect"
            >
              <Unplug className="w-4 h-4" />
            </button>
          </>
        ) : (
          <button
            className="px-4 py-1.5 bg-brand-primary hover:bg-brand-primary/80 text-white text-xs font-semibold rounded-lg transition-colors"
            onClick={() => onConnect(provider.id)}
          >
            Connect Account
          </button>
        )}
      </div>
    </div>
  );
}
