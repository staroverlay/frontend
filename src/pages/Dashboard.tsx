import { useAuth } from '../hooks/use-auth';
import { useProfile } from '../hooks/use-profile';
import { Skeleton } from '../components/ui/skeleton';
import { LayoutDashboard, TrendingUp, Users, Activity, ExternalLink, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Dashboard() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { profile, isLoading: isProfileLoading } = useProfile();

  const isLoading = isAuthLoading || (isProfileLoading && !profile);

  if (isLoading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex justify-between items-end">
          <div className="space-y-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  const stats = [
    { name: 'Total Viewers', value: '2.4k', change: '+12.5%', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10 border-blue-500/20' },
    { name: 'Avg. Activity', value: '84%', change: '+4.2%', icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    { name: 'Growth Rate', value: '18.2%', change: '+2.1%', icon: TrendingUp, color: 'text-indigo-500', bg: 'bg-indigo-500/10 border-indigo-500/20' },
    { name: 'Overlay Health', value: '99.9%', change: 'Stable', icon: Sparkles, color: 'text-amber-500', bg: 'bg-amber-500/10 border-amber-500/20' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 text-blue-500 font-bold text-[10px] uppercase tracking-widest mb-2 px-1">
             <LayoutDashboard className="w-3.5 h-3.5" />
             Dashboard Overivew
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">
            Welcome, {profile?.displayName || user?.email.split('@')[0]}!
          </h1>
          <p className="text-zinc-500 font-medium text-sm max-w-md leading-relaxed px-1">
            Monitor your stream overlays and performance stats across all connected platforms in real-time.
          </p>
        </div>
        <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98] flex items-center gap-2.5">
          <ExternalLink className="w-4 h-4" />
          Open Preview
        </button>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className={cn(
              'p-6 rounded-2xl border bg-zinc-900/40 backdrop-blur-xl transition-all duration-300 hover:translate-y-[-4px] hover:shadow-2xl hover:shadow-black/20 group',
              stat.bg
            )}
          >
            <div className="flex justify-between items-start mb-4">
              <div className={cn('p-2.5 rounded-xl transition-all group-hover:scale-110', stat.bg, stat.color)}>
                 <stat.icon className="w-5 h-5" />
              </div>
              <span className={cn('text-xs font-black tracking-tighter uppercase', stat.color)}>
                {stat.change}
              </span>
            </div>
            <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">{stat.name}</p>
            <p className="text-3xl font-black text-white tracking-tight">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 p-8 rounded-3xl border border-zinc-900 bg-zinc-900/50 backdrop-blur-sm min-h-[400px] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8">
               <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-950 border border-zinc-800 text-[10px] font-bold text-zinc-500 uppercase">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Sync
               </div>
            </div>
            <h2 className="text-xl font-bold text-zinc-200 mb-8 flex items-center gap-3">
               Performance History
               <span className="text-zinc-600 text-[10px] font-medium border border-zinc-800 px-2 py-0.5 rounded-md">Last 7 Days</span>
            </h2>
            <div className="h-64 flex items-end gap-3 justify-between px-2">
               {[40, 60, 45, 90, 65, 80, 55].map((h, i) => (
                 <div key={i} className="flex-1 group/bar relative">
                    <div 
                      className="w-full bg-zinc-800 rounded-lg transition-all duration-500 group-hover/bar:bg-blue-500/80 cursor-pointer"
                      style={{ height: `${h}%` }}
                    />
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-opacity bg-blue-600 text-white text-[10px] px-2 py-1 rounded font-bold shadow-lg pointer-events-none">
                      {h}%
                    </div>
                 </div>
               ))}
            </div>
            <div className="flex justify-between mt-6 px-2 text-[10px] font-black text-zinc-600 uppercase tracking-widest">
               <span>Mon</span>
               <span>Tue</span>
               <span>Wed</span>
               <span>Thu</span>
               <span>Fri</span>
               <span>Sat</span>
               <span>Sun</span>
            </div>
         </div>

         <div className="p-8 rounded-3xl border border-zinc-900 bg-zinc-950 relative flex flex-col items-center justify-center text-center group">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-6 shadow-2xl shadow-indigo-500/20 group-hover:scale-110 transition-transform duration-500">
               <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white mb-3">Add Custom Widget</h3>
            <p className="text-zinc-500 text-sm mb-8 max-w-[200px] leading-relaxed">
               Personalize your overlay with custom animations, subs goals and more.
            </p>
            <button className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs font-bold tracking-widest uppercase transition-all active:scale-[0.98]">
               Explore Widgets
            </button>
         </div>
      </div>
    </div>
  );
}
