import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useWidgetDetails } from './WidgetDetailsContext';
import { cn } from '../../lib/utils';

export const WidgetRail = () => {
    const { tabs, activeTab, setActiveTab } = useWidgetDetails();

    return (
        <div className="w-14 shrink-0 border-r border-white/5 bg-black/40 flex flex-col items-center py-4 gap-4">
            <Link to="/widgets" className="p-2.5 mb-2 border border-white/5 rounded-xl bg-zinc-900/50 hover:bg-zinc-800 transition-all group text-zinc-500 hover:text-white">
                <ArrowLeft className="w-4 h-4" />
            </Link>

            <div className="w-8 h-[1px] bg-white/5 mb-2" />

            {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                    <div key={tab.id} className="relative group">
                        <button
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "p-3 rounded-xl transition-all duration-300 relative",
                                isActive
                                    ? "bg-violet-600 text-white shadow-lg shadow-violet-600/20"
                                    : "text-zinc-600 hover:text-zinc-300 hover:bg-white/5"
                            )}
                        >
                            <Icon className="w-4 h-4" />
                            {isActive && (
                                <div className="absolute right-[-7px] top-1/2 -translate-y-1/2 w-1 h-4 bg-violet-500 rounded-full" />
                            )}
                        </button>

                        <div className="absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 px-2 py-1 bg-zinc-900 border border-white/10 rounded-md text-[8px] font-bold text-white uppercase tracking-wider whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-50 translate-x-2 group-hover:translate-x-0">
                            {tab.label}
                            <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-zinc-900 border-l border-b border-white/10 rotate-45" />
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
