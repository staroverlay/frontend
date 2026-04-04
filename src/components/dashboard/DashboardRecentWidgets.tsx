import { Link } from 'react-router-dom';
import { Clock, ArrowRight } from 'lucide-react';
import type { Widget } from '../../lib/types';
import { WidgetCard } from '../widgets/WidgetCard';

interface DashboardRecentWidgetsProps {
    widgets: Widget[];
    onDelete: () => void;
}

export const DashboardRecentWidgets = ({ widgets, onDelete }: DashboardRecentWidgetsProps) => {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2 text-zinc-300">
                    <Clock className="w-5 h-5 text-violet-400" />
                    <h3 className="font-bold">Last Widgets <span className="text-zinc-500 text-sm font-normal">Quick Access</span></h3>
                </div>
                <Link to="/widgets" className="text-xs font-bold text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors">
                    Manage Widgets <ArrowRight className="w-3 h-3" />
                </Link>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 px-1 custom-scrollbar snap-x">
                {widgets.map(w => (
                    <div key={w.id} className="snap-start shrink-0 w-80 lg:w-96">
                        <WidgetCard widget={w} onDelete={onDelete} />
                    </div>
                ))}
                {widgets.length === 0 && (
                    <div className="text-zinc-500 text-sm py-8 w-full text-center border rounded-2xl border-dashed border-white/10 bg-zinc-900/20">
                        You haven't installed any widgets yet.
                    </div>
                )}
            </div>
        </div>
    );
};
