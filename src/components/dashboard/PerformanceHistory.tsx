import { Sparkles, Activity } from 'lucide-react';

export function PerformanceHistory() {
  const data = [40, 60, 45, 90, 65, 80, 55];
  const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  return (
    <div className="lg:col-span-2 p-10 rounded-[3rem] border border-zinc-900/50 bg-zinc-900/10 backdrop-blur-3xl min-h-[450px] relative overflow-hidden group transition-all duration-700 hover:border-violet-500/20">
      <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700 pointer-events-none">
        <Activity className="w-48 h-48 text-violet-500" />
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="space-y-2">
           <h2 className="text-2xl font-black text-white flex items-center gap-4 tracking-tighter">
              Performance Analytics
              <div className="w-2.5 h-2.5 rounded-full bg-violet-500 animate-pulse" />
           </h2>
           <p className="text-zinc-600 font-bold text-xs uppercase tracking-widest px-1">Live Telemetry & Sync Data</p>
        </div>
        
        <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-zinc-950 border border-zinc-900/50 text-[10px] font-black text-zinc-500 uppercase tracking-widest shadow-xl shadow-black/20 group/sync hover:border-violet-500/30 transition-all cursor-default">
           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
           Real-Time Synchronization
        </div>
      </div>

      <div className="h-64 flex items-end gap-3.5 justify-between px-2 pt-8">
         {data.map((h, i) => (
           <div key={i} className="flex-1 group/bar relative">
              <div className="absolute inset-0 bg-violet-500/20 blur-2xl opacity-0 group-hover/bar:opacity-30 transition-opacity" />
              <div 
                className="w-full bg-zinc-800/40 border border-zinc-800/50 rounded-xl transition-all duration-500 group-hover/bar:bg-violet-600 group-hover/bar:border-violet-500/50 group-hover/bar:h-[h+10%] cursor-pointer relative z-10"
                style={{ height: `${h}%` }}
              />
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-all duration-300 transform scale-75 group-hover/bar:scale-100 bg-violet-600 text-white text-[10px] px-3 py-1.5 rounded-xl font-black shadow-2xl shadow-violet-500/20 pointer-events-none z-20 flex items-center gap-2">
                <Sparkles className="w-3 h-3" />
                {h}%
              </div>
           </div>
         ))}
      </div>

      <div className="flex justify-between mt-10 px-4 text-[10px] font-black text-zinc-700 uppercase tracking-[0.3em] font-sans selection:bg-violet-500/20">
         {days.map(day => <span key={day}>{day}</span>)}
      </div>
    </div>
  );
}
