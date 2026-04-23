import React from 'react';
import { cn } from '../../lib/utils';

interface PageHeaderProps {
    icon: React.ReactNode;
    title: string;
    highlight?: string;
    description: string;
    actions?: React.ReactNode;
    className?: string;
}

export function PageHeader({ icon, title, highlight, description, actions, className }: PageHeaderProps) {
    return (
        <div className={cn('relative flex flex-col md:flex-row md:items-end justify-between gap-6 mt-12 pb-8 mb-2', className)}>
            {/* Left: text */}
            <div className="flex flex-col gap-3">
                {/* Icon badge */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary shrink-0">
                        {icon}
                    </div>
                    <div className="h-px flex-1 bg-gradient-to-r from-brand-primary/20 to-transparent max-w-[120px]" />
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-black tracking-tight text-content-primary leading-none m-0">
                    {title}
                    {highlight && (
                        <span className="text-brand-primary"> {highlight}</span>
                    )}
                </h1>

                {/* Description */}
                <p className="text-content-dimmed text-sm md:text-base max-w-lg leading-relaxed">
                    {description}
                </p>
            </div>

            {/* Right: actions */}
            {actions && (
                <div className="flex items-center gap-3 shrink-0">
                    {actions}
                </div>
            )}
        </div>
    );
}
