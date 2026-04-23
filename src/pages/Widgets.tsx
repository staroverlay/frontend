import { useEffect, useState } from 'react';
import { Layers, Search, Sparkles, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

import { widgetsService } from '../services/widgets-service';
import type { Widget } from '../lib/types';
import { ErrorView } from '../components/layouts/ErrorView';
import { getError } from '../lib/utils';
import { WidgetCard } from '../components/widgets/WidgetCard';
import { PageHeader } from '../components/layouts/PageHeader';
import { useSubscriptionStore } from '../stores/subscription-store';
import { EmptyState } from '../components/layouts/EmptyState';

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

  useEffect(() => { refresh(); }, []);

  const filteredWidgets = (widgets || []).filter(w =>
    w.display_name?.toLowerCase().includes(search.toLowerCase()) ||
    w.app_id?.toLowerCase().includes(search.toLowerCase()) ||
    w.id.toLowerCase().includes(search.toLowerCase())
  );

  if (error) {
    return (
      <div className="space-y-6 animate-in fade-in duration-700">
        <ErrorView message={error} onRetry={refresh} title="Failed to Load Widgets" />
      </div>
    );
  }

  const usagePct = plan ? Math.min(100, (widgets.length / plan.limits.widgets) * 100) : 0;
  const isNearLimit = plan && (widgets.length / plan.limits.widgets) >= 0.9;

  return (
    <div className="flex flex-col gap-8 w-full animate-in fade-in duration-700">
      <PageHeader
        icon={<Layers className="w-5 h-5" />}
        title="Your"
        highlight="Widgets"
        description="Manage your active stream enhancements. All widgets are hyper-synced with your broadcast software in real-time."
        actions={
          <div className="flex flex-col items-end gap-3">
            <Link
              to="/apps"
              className="flex items-center gap-2 px-5 py-2.5 bg-brand-primary hover:bg-brand-primary/90 text-white font-bold text-sm rounded-xl shadow-lg shadow-brand-primary/20 transition-all active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              New Widget
            </Link>
            {plan && (
              <div className="flex flex-col gap-1.5 min-w-[140px]">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-content-dimmed">Slots</span>
                  <span className="text-[10px] font-bold text-content-muted">{widgets.length}/{plan.limits.widgets}</span>
                </div>
                <div className="h-1 w-full bg-surface-panel rounded-full overflow-hidden border border-white/[0.05]">
                  <div
                    className={`h-full transition-all duration-700 rounded-full ${isNearLimit ? 'bg-status-warning' : 'bg-brand-primary'}`}
                    style={{ width: `${usagePct}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        }
      />

      {/* Search bar */}
      <div className="flex items-center gap-3 p-1.5 rounded-2xl bg-surface-panel/50 border border-white/[0.06] backdrop-blur-md">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-content-dimmed" />
          </div>
          <input
            type="text"
            placeholder="Search by name, app ID, or instance ID…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent border-none pl-11 pr-4 py-2.5 text-sm text-content-secondary placeholder:text-content-dimmed focus:outline-none font-medium"
          />
        </div>
      </div>

      {/* Content */}
      <div className="w-full min-h-[400px]">
        {isLoading && widgets.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-[320px] bg-surface-panel/20 border border-border-subtle rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : widgets.length === 0 ? (
          <EmptyState
            icon={Layers}
            title="No widgets installed"
            description="Explore the app store to find overlays and widgets for your stream."
            action={
              <Link
                to="/apps"
                className="flex items-center gap-2 px-6 py-2.5 bg-brand-primary hover:bg-brand-primary/90 text-white font-bold text-sm rounded-xl shadow-lg shadow-brand-primary/20 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Browse Apps
              </Link>
            }
          />
        ) : filteredWidgets.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No matches found"
            description="Try a different search term to find what you're looking for."
          />
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
