import { type LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description?: string;
    action?: React.ReactNode;
    className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
    return (
        <div className={cn(
            "flex flex-col items-center justify-center py-20 px-6 rounded-3xl border border-dashed border-border-default bg-surface-card/20 text-center animate-in fade-in duration-700",
            className
        )}>
            <div className="w-16 h-16 bg-surface-panel/50 rounded-2xl flex items-center justify-center mb-6 text-content-dimmed border border-white/[0.03]">
                <Icon className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-content-secondary tracking-tight mb-2 uppercase">{title}</h3>
            {description && <p className="text-content-dimmed text-sm max-w-sm mx-auto mb-8 font-medium leading-relaxed">{description}</p>}
            {action && <div className="mt-2">{action}</div>}
        </div>
    );
}
