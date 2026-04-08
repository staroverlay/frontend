import { useEffect, useState } from 'react';
import { Layers, Search, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

import { widgetsService } from '../services/widgets-service';
import type { Widget } from '../lib/types';
import { ErrorView } from '../components/ui/ErrorView';
import { getError } from '../lib/utils';
import { WidgetCard } from '../components/widgets/WidgetCard';
import { AppsHeader } from '../components/apps/AppsHeader';
import { useSubscriptionStore } from '../stores/subscription-store';

export default function WidgetsPage() {
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const { getPlan } = useSubscriptionStore();
  const plan = getPlan();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const refresh = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await widgetsService.listWidgets();
      setWidgets(data || []);
    } catch (e) {
      setError(getError(e, 'Failed to load widgets'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const filteredWidgets = (widgets || []).filter(w =>
    w.display_name?.toLowerCase().includes(search.toLowerCase()) ||
    w.app_id?.toLowerCase().includes(search.toLowerCase()) ||
    w.id.toLowerCase().includes(search.toLowerCase())
  );

  if (error) {
    return (
      <div className="space-y-6 animate-in fade-in duration-700">
        <ErrorView
          message={error}
          onRetry={refresh}
          title="Failed to Load Widgets"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 w-full animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="flex-1">
          <AppsHeader
            title="My Installed"
            highlightedText="Widgets"
            description="Manage your active app instances, configure their settings, and access their unique connection URLs."
          />
        </div>

        <div className="flex flex-col gap-4 shrink-0">
          <Link
            to="/apps"
            className="px-6 py-3 bg-brand-primary hover:bg-brand-primary/90 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all shadow-lg shadow-brand-primary/20 flex items-center gap-2 group shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
            Install New App
          </Link>

          {plan && (
            <div className="flex flex-col gap-2 px-1">
              <div className="flex items-center justify-between gap-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-content-dimmed">
                  Widgets Slots
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest text-content-muted">
                  {widgets.length} / {plan.limits.widgets}
                </span>
              </div>
              <div className="h-1.5 w-full bg-surface-panel rounded-full overflow-hidden border border-border-subtle">
                <div
                  className={`h-full transition-all duration-700 ${(widgets.length / plan.limits.widgets) >= 0.9 ? 'bg-status-warning' : 'bg-brand-primary'
                    }`}
                  style={{ width: `${Math.min(100, (widgets.length / plan.limits.widgets) * 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-1 rounded-2xl bg-surface-card border border-border-subtle backdrop-blur-md">
        <div className="relative w-full flex-1">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-content-dimmed" />
          </div>
          <input
            type="text"
            placeholder="Search your instances by name, app ID or instance ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface-base/50 border-none rounded-xl pl-11 pr-4 py-3 text-sm text-content-secondary placeholder:text-content-dimmed focus:outline-none focus:ring-1 focus:ring-brand-primary/50 transition-all font-medium"
          />
        </div>
      </div>

      {/* Content Area */}
      <div className="w-full min-h-[400px]">
        {isLoading && widgets.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-[320px] bg-surface-panel/20 border border-border-subtle rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : widgets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 rounded-3xl border border-dashed border-border-default bg-surface-card/20 text-center px-4">
            <div className="w-16 h-16 rounded-full bg-surface-base border border-border-subtle flex items-center justify-center mb-6">
              <Layers className="w-8 h-8 text-content-dimmed" />
            </div>
            <h3 className="text-xl font-black text-content-secondary uppercase">No widgets installed</h3>
            <p className="text-content-dimmed mt-2 max-w-sm">
              Explore the app store to find overlays and widgets to add to your stream.
            </p>
            <Link
              to="/apps"
              className="mt-8 px-8 py-3 bg-surface-elevated hover:bg-surface-panel text-content-primary font-bold rounded-xl border border-border-subtle transition-all uppercase tracking-widest text-xs"
            >
              Browse Apps
            </Link>
          </div>
        ) : filteredWidgets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 rounded-3xl border border-dashed border-border-default bg-surface-card/20">
            <Layers className="w-12 h-12 text-content-dimmed mb-4" />
            <h3 className="text-xl font-bold text-content-secondary">No matches found</h3>
            <p className="text-content-dimmed mt-2">Try a different search term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWidgets.map((w) => (
              <WidgetCard key={w.id} widget={w} onDelete={refresh} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
