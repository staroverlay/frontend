import React from 'react';
import { cn } from '../../lib/utils';

interface SectionCardProps {
  title: string;
  subtitle?: string;
  icon: React.ElementType;
  badge?: string;
  children: React.ReactNode;
  className?: string;
}

export function SectionCard({
  title,
  subtitle,
  icon: Icon,
  badge,
  children,
  className,
}: SectionCardProps) {
  return (
    <section className={cn(
      "p-6 rounded-2xl border bg-surface-card border-border-subtle transition-all hover:border-brand-primary/30",
      className
    )}>

      <div className="relative z-10">
        <div className="flex flex-col gap-1 mb-6">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-surface-panel text-content-muted border border-border-default">
              <Icon className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-content-primary">
              {title}
            </h2>
            {badge && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md border border-border-default bg-surface-panel text-content-muted">
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-content-dimmed text-sm ml-9">
              {subtitle}
            </p>
          )}
        </div>

        {children}
      </div>
    </section>
  );
}
