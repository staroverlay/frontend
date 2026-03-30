import { useEffect, useState } from 'react';
import { Layers, Search, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

import { widgetsService } from '../services/widgets-service';
import type { Widget } from '../lib/types';
import { Skeleton } from '../components/ui/skeleton';
import { ErrorView } from '../components/ui/ErrorView';
import { getError } from '../lib/utils';
import { WidgetCard } from '../components/widgets/WidgetCard';
import { AppsHeader } from '../components/apps/AppsHeader';

export default function WidgetsPage() {
  const [widgets, setWidgets] = useState<Widget[]>([]);
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
      <div className="space-y-6 animate-in fade-in duration-700 max-w-6xl mx-auto">
        <ErrorView
          message={error}
          onRetry={refresh}
          title="Failed to Load Widgets"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex-1">
          <AppsHeader
            title="My Installed"
            highlightedText="Widgets"
            description="Manage your active app instances, configure their settings, and access their unique connection URLs."
          />
        </div>

        <Link
          to="/apps"
          className="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all shadow-lg shadow-violet-600/20 flex items-center gap-2 group shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
          Install New App
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-1 rounded-2xl bg-zinc-900/40 border border-white/5 backdrop-blur-md">
        <div className="relative w-full flex-1">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-zinc-500" />
          </div>
          <input
            type="text"
            placeholder="Search your instances by name, app ID or instance ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-950/50 border-none rounded-xl pl-11 pr-4 py-3 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-violet-500/50 transition-all font-medium"
          />
        </div>
      </div>

      {/* Content Area */}
      <div className="w-full min-h-[400px]">
        {isLoading && widgets.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-[320px] bg-zinc-900/20 border border-white/5 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : widgets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 rounded-3xl border border-dashed border-white/10 bg-zinc-900/20 text-center px-4">
            <div className="w-16 h-16 rounded-full bg-zinc-950 border border-white/5 flex items-center justify-center mb-6">
              <Layers className="w-8 h-8 text-zinc-700" />
            </div>
            <h3 className="text-xl font-black text-zinc-300">No widgets installed</h3>
            <p className="text-zinc-500 mt-2 max-w-sm">
              Explore the app store to find overlays and widgets to add to your stream.
            </p>
            <Link
              to="/apps"
              className="mt-8 px-8 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl border border-white/5 transition-all"
            >
              Browse Apps
            </Link>
          </div>
        ) : filteredWidgets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 rounded-3xl border border-dashed border-white/10 bg-zinc-900/20">
            <Layers className="w-12 h-12 text-zinc-700 mb-4" />
            <h3 className="text-xl font-bold text-zinc-300">No matches found</h3>
            <p className="text-zinc-500 mt-2">Try a different search term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWidgets.map((w) => (
              <WidgetCard key={w.id} widget={w} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
