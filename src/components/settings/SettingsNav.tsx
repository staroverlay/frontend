import { Link, useLocation } from 'react-router-dom';
import { User, ShieldCheck, Monitor, Share2, type LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Tab {
    name: string;
    href: string;
    icon: LucideIcon;
}

const tabs: Tab[] = [
    { name: 'Profile', href: '/settings/profile', icon: User },
    { name: 'Integrations', href: '/settings/integrations', icon: Share2 },
    { name: 'Security', href: '/settings/security', icon: ShieldCheck },
    { name: 'Sessions', href: '/settings/sessions', icon: Monitor },
];

export const SettingsNav = () => {
    const location = useLocation();

    return (
        <aside className="w-full lg:w-64 shrink-0 -mx-4 md:mx-0">
            <nav className="flex lg:flex-col gap-1.5 bg-surface-card p-1.5 md:p-2 rounded-2xl border border-border-subtle overflow-x-auto lg:overflow-visible no-scrollbar px-4 md:px-2">
                {tabs.map((tab) => {
                    const isActive = location.pathname.startsWith(tab.href);
                    return (
                        <Link
                            key={tab.name}
                            to={tab.href}
                            className={cn(
                                'flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs md:text-sm font-black uppercase tracking-widest transition-all group shrink-0 lg:shrink border',
                                isActive
                                    ? 'bg-brand-primary/10 text-brand-primary border-brand-primary/20 shadow-premium'
                                    : 'text-content-dimmed hover:text-content-secondary hover:bg-surface-panel/50 border-transparent'
                            )}
                        >
                            <tab.icon className={cn('w-4 h-4', isActive ? 'text-brand-primary' : 'text-content-dimmed group-hover:text-content-secondary')} />
                            {tab.name}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
};
