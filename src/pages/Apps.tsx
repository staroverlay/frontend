import { useState, useMemo } from 'react';
import { Search, Layers, AlertCircle } from 'lucide-react';
import { useAppExplorer } from '../hooks/use-app-explorer';
import { useAppsStore } from '../stores/apps-store';
import { AppsHeader } from '../components/apps/AppsHeader';
import { AppCard } from '../components/apps/AppCard';
import { InstallAppModal } from '../components/apps/InstallAppModal';
import { type AppManifest } from '../services/apps-service';

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

  const categories = useMemo(() => {
    return Array.from(new Set(allApps.map(a => a.category).filter(Boolean)));
  }, [allApps]);

  const handleInstallClick = (app: AppManifest) => {
    setSelectedApp(app);
    setIsInstallModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-8 w-full animate-in fade-in duration-700">
      <AppsHeader
        title="Explore"
        highlightedText="Apps"
        description="Discover widgets, overlays, and tools to supercharge your stream and customize your experience."
      />

      {/* Filters and Search */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between p-1 rounded-2xl bg-surface-card border border-border-subtle backdrop-blur-md">
        <div className="relative w-full lg:w-96 flex-1">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-content-dimmed" />
          </div>
          <input
            type="text"
            placeholder="Search for apps..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface-base/50 border-none rounded-xl pl-11 pr-4 py-3 text-sm text-content-secondary placeholder:text-content-dimmed focus:outline-none focus:ring-1 focus:ring-brand-primary/50 transition-all font-medium"
          />
        </div>

        <div className="flex items-center gap-2 px-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 no-scrollbar">
          <button
            onClick={() => setCategory('')}
            className={`px-4 py-2 rounded-lg text-sm font-black uppercase tracking-widest transition-all ${category === ''
              ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/25'
              : 'text-content-muted hover:text-content-secondary hover:bg-surface-panel/50'
              }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-black uppercase tracking-widest transition-all capitalize ${category === cat
                ? 'bg-surface-elevated text-content-primary shadow-md shadow-black/20 border border-border-subtle'
                : 'text-content-dimmed hover:text-content-muted hover:bg-surface-panel/40'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="w-full min-h-[400px]">
        {error ? (
          <div className="flex flex-col items-center justify-center py-20 bg-status-error/5 border border-status-error/10 rounded-3xl">
            <AlertCircle className="w-12 h-12 text-status-error mb-4" />
            <h3 className="text-xl font-bold text-content-primary opacity-90">Error loading applications</h3>
            <p className="text-status-error/80 mt-2 text-sm max-w-md text-center">{error.message}</p>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-[300px] bg-surface-panel/20 border border-border-subtle rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : apps.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 rounded-3xl border border-dashed border-border-default bg-surface-card/20">
            <Layers className="w-12 h-12 text-content-dimmed mb-4" />
            <h3 className="text-xl font-bold text-content-secondary">No apps found</h3>
            <p className="text-content-dimmed mt-2">Try adjusting your filters or search query.</p>
          </div>
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
