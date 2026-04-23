import { AlertCircle } from 'lucide-react';
import { useWidgetDetails } from './WidgetDetailsContext';
import { WidgetRail } from './WidgetRail';
import { WidgetSidebarHeader } from './WidgetSidebarHeader';
import { WidgetMetaSettings } from './WidgetMetaSettings';
import { WidgetAppSettings } from './WidgetAppSettings';
import { cn } from '../../lib/utils';

export const WidgetSidebar = () => {
    const {
        sidebarWidth,
        isResizing,
        activeTab,
        error
    } = useWidgetDetails();

    return (
        <aside
            className={cn(
                "w-full flex border-b lg:border-b-0 lg:border-r border-white/5 bg-zinc-950/80 backdrop-blur-3xl z-20 shrink-0 lg:h-full order-2 lg:order-none overflow-hidden transition-colors",
                isResizing && "border-violet-500/40 border-r-2"
            )}
            style={{ width: `${sidebarWidth}px`, maxWidth: '85vw' }}
        >
            <WidgetRail />

            <div className="flex-1 flex flex-col min-w-0 h-full">
                <WidgetSidebarHeader />

                <div className="flex-1 overflow-y-auto scrollbar-hide px-5 pb-8 py-5">
                    {activeTab === 'overview' ? (
                        <WidgetMetaSettings />
                    ) : (
                        <WidgetAppSettings />
                    )}

                    {error && (
                        <div className="p-3 bg-red-600/5 border border-red-500/10 rounded-xl flex items-center gap-3 mt-6">
                            <AlertCircle className="w-3 h-3 text-red-500 shrink-0" />
                            <p className="text-[7.5px] font-bold text-red-500 uppercase tracking-widest">{error}</p>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
};
