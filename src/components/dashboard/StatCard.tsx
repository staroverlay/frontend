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
      'p-5 rounded-2xl border bg-surface-card transition-all hover:-translate-y-1 hover:shadow-premium',
      'border-border-subtle hover:border-brand-primary/30',
      className
    )}>
      <div className="flex justify-between items-start mb-4">
        <div className="p-2.5 rounded-xl bg-surface-panel border border-border-default text-content-muted group-hover:text-content-primary transition-colors">
          <Icon className="w-5 h-5" />
        </div>
        <span className={cn(
          'text-xs font-semibold px-2 py-0.5 rounded-md border',
          isPositive ? 'text-status-success bg-status-success/10 border-status-success/20' : 'text-status-error bg-status-error/10 border-status-error/20'
        )}>
          {change}
        </span>
      </div>

      <div className="space-y-1">
        <p className="text-content-muted text-sm font-medium">{name}</p>
        <p className="text-3xl font-bold text-content-primary tracking-tight">{value}</p>
      </div>
    </div>
  );
}
