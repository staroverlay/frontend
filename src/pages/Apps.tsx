import { useState, useMemo } from 'react';
import { Search, Layers, AlertCircle } from 'lucide-react';
import { useAppExplorer } from '../hooks/use-app-explorer';
import { useAppsStore } from '../stores/apps-store';
import { AppsHeader } from '../components/apps/AppsHeader';
import { AppCard } from '../components/apps/AppCard';

export default function Apps() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('');
  
  const { apps: allApps } = useAppsStore();
  
  const { apps, isLoading, error } = useAppExplorer({
    search: search.length > 2 ? search : undefined,
    category: category || undefined,
  });

  const categories = useMemo(() => {
    return Array.from(new Set(allApps.map(a => a.category).filter(Boolean)));
  }, [allApps]);

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto animate-in fade-in duration-700">
      <AppsHeader 
        title="Explore"
        highlightedText="Apps"
        description="Discover widgets, overlays, and tools to supercharge your stream and customize your experience."
      />

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-1 rounded-2xl bg-zinc-900/40 border border-white/5 backdrop-blur-md">
        <div className="relative w-full md:w-96 flex-1">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-zinc-500" />
          </div>
          <input
            type="text"
            placeholder="Search for apps..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-950/50 border-none rounded-xl pl-11 pr-4 py-3 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-violet-500/50 transition-all font-medium"
          />
        </div>

        <div className="flex items-center gap-2 px-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
          <button
            onClick={() => setCategory('')}
            className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${
              category === '' 
                ? 'bg-violet-500 text-white shadow-lg shadow-violet-500/25' 
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all capitalize ${
                category === cat
                  ? 'bg-zinc-800 text-white shadow-md shadow-black/20'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/40'
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
          <div className="flex flex-col items-center justify-center py-20 bg-red-500/5 border border-red-500/10 rounded-3xl">
            <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
            <h3 className="text-xl font-bold text-red-200">Error loading applications</h3>
            <p className="text-red-400/80 mt-2 text-sm max-w-md text-center">{error.message}</p>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-[300px] bg-zinc-900/20 border border-white/5 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : apps.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 rounded-3xl border border-dashed border-white/10 bg-zinc-900/20">
            <Layers className="w-12 h-12 text-zinc-700 mb-4" />
            <h3 className="text-xl font-bold text-zinc-300">No apps found</h3>
            <p className="text-zinc-500 mt-2">Try adjusting your filters or search query.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apps.map((app) => (
              <AppCard key={app.id} app={app} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
