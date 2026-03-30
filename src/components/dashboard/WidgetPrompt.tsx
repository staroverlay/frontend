import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

export function WidgetPrompt() {
  return (
    <div className="p-10 rounded-[3rem] border border-zinc-900/50 bg-zinc-950/20 backdrop-blur-3xl relative flex flex-col items-center justify-center text-center group overflow-hidden transition-all duration-700 hover:border-violet-500/20 hover:bg-violet-500/5 selection:bg-violet-500/30">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(139,92,246,0.08)_0%,_transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center mb-8 shadow-2xl shadow-violet-500/30 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 relative">
         <Sparkles className="w-10 h-10 text-white" />
         <div className="absolute inset-0 rounded-3xl animate-pulse blur-xl opacity-40 bg-fuchsia-500" />
      </div>

      <div className="relative z-10 space-y-4">
        <h3 className="text-2xl font-black text-white tracking-tighter uppercase px-4">
          Custom <span className="text-violet-500">Node</span> System
        </h3>
        <p className="text-zinc-600 text-xs font-bold font-sans selection:text-white mb-8 max-w-[240px] leading-relaxed mx-auto uppercase tracking-widest px-2 opacity-80 group-hover:opacity-100 transition-opacity">
          Personalize your overlay environment with advanced custom animations and submodules.
        </p>
        <button className="w-full flex items-center justify-center gap-3 py-4 bg-zinc-900 hover:bg-violet-600 border border-zinc-800 hover:border-violet-500 text-zinc-500 hover:text-white rounded-2xl text-[10px] font-black tracking-[0.2em] uppercase transition-all active:scale-[0.98] shadow-2xl shadow-black/40 group-hover:shadow-violet-900/20">
          Access Modules
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
