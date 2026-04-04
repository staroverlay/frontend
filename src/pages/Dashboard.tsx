
import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/use-auth';
import { useProfile } from '../hooks/use-profile';
import { Skeleton } from '../components/ui/skeleton';
import { LayoutDashboard, Layers, Files, Cable, Users, Clock, ArrowRight, AppWindow } from 'lucide-react';
import { StatCard } from '../components/dashboard/StatCard';
import { useSubscriptionStore } from '../stores/subscription-store';
import { widgetsService } from '../services/widgets-service';
import { appsService, type AppManifest } from '../services/apps-service';
import { integrationsService } from '../services/integrations-service';
import { UploadsService } from '../services/uploads.service';
import { Link } from 'react-router-dom';
import type { Widget, Integration } from '../lib/types';
import { WidgetCard } from '../components/widgets/WidgetCard';

export default function Dashboard() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { profile, isLoading: isProfileLoading } = useProfile();
  const { getPlan, isLoading: isPlanLoading } = useSubscriptionStore();
  const plan = getPlan();

  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [apps, setApps] = useState<AppManifest[]>([]);
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [uploadsCount, setUploadsCount] = useState(0);
  const [isDataLoading, setIsDataLoading] = useState(true);

  const fetchDashboardData = async () => {
    setIsDataLoading(true);
    try {
      const [w, a, i, u] = await Promise.all([
        widgetsService.listWidgets().catch(() => []),
        appsService.getApps().catch(() => []),
        integrationsService.listIntegrations().catch(() => []),
        UploadsService.listUploads().catch(() => ({ uploads: [] }))
      ]);
      setWidgets(w || []);
      setApps(a || []);
      setIntegrations(i || []);
      setUploadsCount(u?.uploads?.length || 0);
    } catch (e) {
      console.error(e);
    } finally {
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const isLoading = isAuthLoading || (isProfileLoading && !profile) || isPlanLoading || isDataLoading;

  if (isLoading) {
    return (
      <div className="space-y-12 animate-in fade-in duration-700">
        <Skeleton className="h-12 w-full bg-zinc-900 rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-44 w-full rounded-3xl bg-zinc-900" />
          ))}
        </div>
        <Skeleton className="h-44 w-full rounded-3xl bg-zinc-900" />
      </div>
    );
  }

  const widgetLimit = plan?.limits?.widgets || 10;
  const filesLimit = plan?.limits?.files || 10;
  const editorsLimit = plan?.limits?.editors || 0;

  const stats = [
    { name: 'Widget Slots', value: `${widgets.length} / ${widgetLimit}`, change: 'Current Usage', icon: Layers },
    { name: 'File Uploads', value: `${uploadsCount} / ${filesLimit}`, change: 'Storage Usage', icon: Files },
    { name: 'Integrations', value: `${integrations.length}`, change: 'Connected Accounts', icon: Cable },
    { name: 'Editors', value: `0 / ${editorsLimit}`, change: 'Coming Soon', icon: Users },
  ];

  const recentApps = apps.slice(0, 5);
  const recentWidgets = [...widgets].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 4);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">

      {/* Mini Tier Banner */}
      <div className="flex flex-col sm:flex-row items-center justify-between bg-zinc-900/50 border border-violet-500/20 backdrop-blur-md rounded-2xl p-4 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center text-violet-400">
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-white font-bold tracking-tight">Active Plan: <span className="text-violet-400 uppercase tracking-widest text-xs ml-1">{plan?.name || 'Free Tier'}</span></h2>
            <p className="text-zinc-400 text-xs mt-0.5">Welcome back, {profile?.displayName || user?.email.split('@')[0]}!</p>
          </div>
        </div>
        <button disabled className="px-5 py-2 bg-zinc-800 text-zinc-500 rounded-xl text-xs font-black uppercase tracking-widest border border-white/5 cursor-not-allowed">
          Update Plan (Coming Soon)
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatCard
            key={stat.name}
            name={stat.name}
            value={stat.value}
            change={stat.change}
            icon={stat.icon}
          />
        ))}
      </div>

      {/* Last Apps Horizontal Panel */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2 text-zinc-300">
            <AppWindow className="w-5 h-5 text-violet-400" />
            <h3 className="font-bold">Last Apps <span className="text-zinc-500 text-sm font-normal">from Explore</span></h3>
          </div>
          <Link to="/apps" className="text-xs font-bold text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors">
            View All <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 px-1 custom-scrollbar snap-x">
          {recentApps.map(app => (
            <Link key={app.id} to={`/apps/${app.id}`} className="snap-start shrink-0 w-72 bg-zinc-900/40 border border-white/5 rounded-2xl p-4 hover:border-violet-500/30 hover:bg-zinc-900/80 transition-all flex items-start gap-4 group">
              <div className="w-12 h-12 rounded-xl bg-zinc-950 flex shrink-0 items-center justify-center p-2 group-hover:scale-110 transition-transform">
                <img src={import.meta.env.VITE_APP_WIDGET_SERVER ? `${import.meta.env.VITE_APP_WIDGET_SERVER}/apps/${app.id}/icon.png` : `http://localhost:4000/apps/${app.id}/icon.png`} alt="" className="w-full h-full object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.classList.remove('hidden'); }} />
                <Layers className="w-6 h-6 text-zinc-700 hidden" />
              </div>
              <div>
                <h4 className="text-zinc-200 font-bold text-sm truncate">{app.name}</h4>
                <p className="text-zinc-500 text-xs mt-1 line-clamp-2">{app.description}</p>
              </div>
            </Link>
          ))}
          {recentApps.length === 0 && (
            <div className="text-zinc-500 text-sm py-4 w-full text-center border rounded-2xl border-dashed border-white/10">No apps available in explore.</div>
          )}
        </div>
      </div>

      {/* Last Widgets Created */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2 text-zinc-300">
            <Clock className="w-5 h-5 text-violet-400" />
            <h3 className="font-bold">Last Widgets <span className="text-zinc-500 text-sm font-normal">Quick Access</span></h3>
          </div>
          <Link to="/widgets" className="text-xs font-bold text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors">
            Manage Widgets <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 px-1 custom-scrollbar snap-x">
          {recentWidgets.map(w => (
            <div key={w.id} className="snap-start shrink-0 w-80 lg:w-96">
              <WidgetCard widget={w} onDelete={fetchDashboardData} />
            </div>
          ))}
          {recentWidgets.length === 0 && (
            <div className="text-zinc-500 text-sm py-8 w-full text-center border rounded-2xl border-dashed border-white/10 bg-zinc-900/20">
              You haven't installed any widgets yet.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
