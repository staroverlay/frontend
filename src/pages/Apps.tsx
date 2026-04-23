import { useState, useMemo } from 'react';
import { Search, Layers, Grid } from 'lucide-react';
import { useAppExplorer } from '../hooks/use-app-explorer';
import { useAppsStore } from '../stores/apps-store';
import { PageHeader } from '../components/layouts/PageHeader';
import { AppCard } from '../components/apps/AppCard';
import { InstallAppModal } from '../components/apps/InstallAppModal';
import { ErrorView } from '../components/layouts/ErrorView';
import { EmptyState } from '../components/layouts/EmptyState';
import type { AppManifest } from '../services/apps-service';
import { cn } from '../lib/utils';

export default function Apps() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('');
  const [selectedApp, setSelectedApp] = useState<AppManifest | null>(null);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  const { apps: allApps } = useAppsStore();
  const { apps, isLoading, error } = useAppExplorer({
    search: search.length > 2 ? search : undefined,
    category: category || undefined,
  });

  const categories = useMemo(
    () => Array.from(new Set(allApps.map((a) => a.category).filter(Boolean))),
    [allApps]
  );

  const handleInstallClick = (app: AppManifest) => {
    setSelectedApp(app);
    setIsInstallModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-8 w-full animate-in fade-in duration-700">
      <PageHeader
        icon={<Grid className="w-5 h-5" />}
        title="Explore"
        highlight="Apps"
        description="Discover widgets, overlays, and tools to supercharge your stream and customize your broadcast."
      />

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-3 items-center p-1.5 rounded-2xl bg-surface-panel/50 border border-white/[0.06] backdrop-blur-md">
        {/* Search */}
        <div className="relative w-full lg:w-auto flex-1">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-content-dimmed" />
          </div>
          <input
            type="text"
            placeholder="Search for apps…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent border-none pl-11 pr-4 py-2.5 text-sm text-content-secondary placeholder:text-content-dimmed focus:outline-none font-medium"
          />
        </div>

        {/* Category pills */}
        <div className="flex items-center gap-1.5 px-2 overflow-x-auto w-full lg:w-auto pb-0 no-scrollbar shrink-0">
          <button
            onClick={() => setCategory('')}
            className={cn(
              'px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all',
              category === ''
                ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/25'
                : 'text-content-dimmed hover:text-content-muted hover:bg-white/5'
            )}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={cn(
                'px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize whitespace-nowrap transition-all',
                category === cat
                  ? 'bg-surface-elevated text-content-primary border border-white/[0.08] shadow-md shadow-black/20'
                  : 'text-content-dimmed hover:text-content-muted hover:bg-white/5'
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="w-full min-h-[400px]">
        {error ? (
          <ErrorView
            title="Search failed"
            message={error.message || "We couldn't search for apps at this moment."}
          />
        ) : isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-[300px] bg-surface-panel/20 border border-border-subtle rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : apps.length === 0 ? (
          <EmptyState
            icon={Layers}
            title="No apps found"
            description="Try adjusting your filters or search query to find what you're looking for."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apps.map((app) => (
              <AppCard key={app.id} app={app} onInstall={handleInstallClick} />
            ))}
          </div>
        )}
      </div>

      {selectedApp && (
        <InstallAppModal
          app={selectedApp}
          isOpen={isInstallModalOpen}
          onClose={() => setIsInstallModalOpen(false)}
        />
      )}
    </div>
  );
}
