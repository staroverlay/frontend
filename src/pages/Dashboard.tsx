
import { useAuth } from '../hooks/use-auth';
import { useProfile } from '../hooks/use-profile';
import { Skeleton } from '../components/ui/skeleton';
import { LayoutDashboard, TrendingUp, Users, Activity, ExternalLink, Sparkles } from 'lucide-react';
import { StatCard } from '../components/dashboard/StatCard';
import { PerformanceHistory } from '../components/dashboard/PerformanceHistory';
import { WidgetPrompt } from '../components/dashboard/WidgetPrompt';

export default function Dashboard() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { profile, isLoading: isProfileLoading } = useProfile();

  const isLoading = isAuthLoading || (isProfileLoading && !profile);

  if (isLoading) {
    return (
      <div className="space-y-12 animate-in fade-in duration-700">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-1">
          <div className="space-y-4">
            <Skeleton className="h-4 w-32 bg-zinc-900" />
            <Skeleton className="h-14 w-80 bg-zinc-900 rounded-2xl" />
            <Skeleton className="h-4 w-64 bg-zinc-900" />
          </div>
          <Skeleton className="h-12 w-40 bg-zinc-900 rounded-2xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-44 w-full rounded-3xl bg-zinc-900" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <Skeleton className="lg:col-span-2 h-[450px] w-full rounded-[3rem] bg-zinc-900" />
           <Skeleton className="h-[450px] w-full rounded-[3rem] bg-zinc-900" />
        </div>
      </div>
    );
  }

  const stats = [
    { name: 'Total Viewers', value: '2.4k', change: '+12.5%', icon: Users },
    { name: 'Avg. Activity', value: '84%', change: '+4.2%', icon: Activity },
    { name: 'Growth Rate', value: '18.2%', change: '+2.1%', icon: TrendingUp },
    { name: 'Engine Health', value: '99.9%', change: 'Stable', icon: Sparkles },
  ];

  return (
    <div className="space-y-14 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-violet-400 font-semibold text-sm mb-2">
             <LayoutDashboard className="w-4 h-4" />
             Overview
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-2">
            Welcome, {profile?.displayName || user?.email.split('@')[0]}
          </h1>
          <p className="text-zinc-400 text-sm max-w-lg">
            Monitor your stream performance metrics and manage your overlay in real-time.
          </p>
        </div>
        <button className="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-violet-500/20 transition-all active:scale-[0.98] flex items-center gap-2">
          <ExternalLink className="w-4 h-4" />
          Open Overlay
        </button>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <PerformanceHistory />
         <WidgetPrompt />
      </div>
    </div>
  );
}
