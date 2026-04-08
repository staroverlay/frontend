import { Monitor, Smartphone, Globe, Clock, LogOut, ShieldAlert, RotateCcw } from 'lucide-react';
import { Button } from '../ui/button';
import { SectionCard } from './SectionCard';
import { cn } from '../../lib/utils';
import { type Session } from '../../lib/types';


interface SessionsSectionProps {
  sessions: Session[];
  isLoading: boolean;
  onRefresh: () => Promise<void>;
  onRevoke: (id: string, isCurrent: boolean) => Promise<void>;
  onRevokeAll: () => Promise<void>;
}

export function SessionsSection({
  sessions,
  isLoading,
  onRefresh,
  onRevoke,
  onRevokeAll
}: SessionsSectionProps) {
  return (
    <SectionCard
      title="Active Sessions"
      subtitle="Currently logged-in devices across all platforms"
      icon={Monitor}
      badge="Security Monitoring"
      className="lg:col-span-2"
    >
      <div className="absolute top-6 right-6">
        <Button
          variant="ghost"
          size="sm"
          className="h-9 px-3 text-content-dimmed hover:text-content-primary hover:bg-surface-panel"
          onClick={onRefresh}
          disabled={isLoading}
        >
          <RotateCcw className={cn("w-4 h-4 mr-2", isLoading && "animate-spin")} />
          Reload
        </Button>
      </div>

      <div className="flex flex-col gap-3 mt-4">
        <div className="p-4 rounded-xl border border-status-error/20 bg-status-error/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-2">
          <div className="flex flex-col">
            <h4 className="text-sm font-bold text-status-error flex items-center gap-2 uppercase tracking-widest text-[10px]">
              <LogOut className="w-4 h-4" />
              Log out all devices
            </h4>
            <p className="text-content-dimmed text-xs mt-0.5">
              Secure your account by terminating all active sessions.
            </p>
          </div>
          <button
            onClick={onRevokeAll}
            className="shrink-0 px-3 py-1.5 bg-status-error/10 hover:bg-status-error/20 text-status-error border border-status-error/20 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors"
          >
            Log out everywhere
          </button>
        </div>

        {sessions.map((session) => (
          <div
            key={session.id}
            className={cn(
              "p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center gap-4 transition-colors",
              session.current
                ? "bg-brand-primary/5 border-brand-primary/20 shadow-premium"
                : "bg-surface-card border-border-subtle hover:border-border-default hover:bg-surface-panel"
            )}
          >
            <div className={cn(
              "w-12 h-12 rounded-lg flex items-center justify-center shrink-0 border",
              session.current
                ? "bg-brand-primary/10 border-brand-primary/20 text-brand-primary"
                : "bg-surface-base border-border-subtle text-content-dimmed"
            )}>
              {session.userAgent?.toLowerCase().includes('mobile')
                ? <Smartphone className="w-6 h-6" />
                : <Monitor className="w-6 h-6" />}
            </div>

            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-bold text-content-primary truncate">
                  {session.userAgent ? (
                    session.userAgent.split(' ')[0].replace('(', '') + ' on ' +
                    (session.userAgent.includes('Windows') ? 'Windows' :
                      session.userAgent.includes('Mac') ? 'MacOS' :
                        session.userAgent.includes('Linux') ? 'Linux' :
                          session.userAgent.includes('Android') ? 'Android' :
                            session.userAgent.includes('iPhone') ? 'iPhone' : 'Device')
                  ) : 'Unknown Device'}
                </p>
                {session.current && (
                  <span className="px-2 py-0.5 rounded text-brand-primary bg-brand-primary/10 text-[8px] font-black uppercase tracking-widest border border-brand-primary/20">
                    Current Device
                  </span>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-x-4 gap-y-1">
                <div className="flex items-center gap-1.5 text-[10px] font-medium text-content-muted">
                  <Globe className="w-3.5 h-3.5" />
                  {session.ipAddress || 'Unknown IP'}
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-medium text-content-muted">
                  <Clock className="w-3.5 h-3.5" />
                  Connected {new Date(session.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="w-full sm:w-auto mt-2 sm:mt-0">
              <button
                className={cn(
                  "w-full sm:w-auto h-9 px-3 text-[10px] font-black uppercase tracking-widest rounded-lg transition-colors flex items-center justify-center gap-2",
                  session.current
                    ? "text-status-error hover:text-status-error/80 hover:bg-status-error/10"
                    : "text-content-dimmed hover:text-status-error hover:bg-status-error/10"
                )}
                onClick={() => onRevoke(session.id, !!session.current)}
              >
                <LogOut className="w-4 h-4" />
                {session.current ? 'Log out' : 'Revoke'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {sessions.length === 0 && !isLoading && (
        <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 rounded-xl mt-4">
          <div className="w-12 h-12 rounded-full bg-surface-base flex items-center justify-center border border-border-subtle">
            <ShieldAlert className="w-6 h-6 text-content-dimmed" />
          </div>
          <p className="text-content-muted text-sm font-medium">No active sessions found.</p>
        </div>
      )}
    </SectionCard>
  );
}
