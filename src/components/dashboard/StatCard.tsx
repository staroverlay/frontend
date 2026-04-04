import React from 'react';
import { cn } from '../../lib/utils';

interface StatCardProps {
  name: string;
  value: string;
  change: string;
  icon: React.ElementType;
  className?: string;
}

export function StatCard({ name, value, change, icon: Icon, className }: StatCardProps) {
  const isPositive = change.startsWith('+');

  return (
    <div className={cn(
      'p-5 rounded-2xl border bg-zinc-900/40 transition-all hover:-translate-y-1 hover:shadow-lg',
      'border-zinc-800 hover:border-violet-500/30',
      className
    )}>
      <div className="flex justify-between items-start mb-4">
        <div className="p-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-400 group-hover:text-white transition-colors">
          <Icon className="w-5 h-5" />
        </div>
        <span className={cn(
          'text-xs font-semibold px-2 py-0.5 rounded-md border',
          isPositive ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-rose-400 bg-rose-500/10 border-rose-500/20'
        )}>
          {change}
        </span>
      </div>

      <div className="space-y-1">
        <p className="text-zinc-400 text-sm font-medium">{name}</p>
        <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
      </div>
    </div>
  );
}
