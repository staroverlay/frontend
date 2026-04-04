import { Layers, Files, Cable, Users } from 'lucide-react';
import { StatCard } from './StatCard';

interface DashboardStatsProps {
    widgetsCount: number;
    widgetLimit: number;
    uploadsCount: number;
    filesLimit: number;
    integrationsCount: number;
    editorsLimit: number;
}

export const DashboardStats = ({
    widgetsCount,
    widgetLimit,
    uploadsCount,
    filesLimit,
    integrationsCount,
    editorsLimit
}: DashboardStatsProps) => {
    const stats = [
        { name: 'Widget Slots', value: `${widgetsCount} / ${widgetLimit}`, change: 'Current Usage', icon: Layers },
        { name: 'File Uploads', value: `${uploadsCount} / ${filesLimit}`, change: 'Storage Usage', icon: Files },
        { name: 'Integrations', value: `${integrationsCount}`, change: 'Connected Accounts', icon: Cable },
        { name: 'Editors', value: `0 / ${editorsLimit}`, change: 'Coming Soon', icon: Users },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
    );
};
