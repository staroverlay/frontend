import { Loader2, Save } from 'lucide-react';
import { useWidgetDetails } from './WidgetDetailsContext';

export const WidgetSidebarHeader = () => {
    const {
        activeTabLabel,
        widget,
        activeTab,
        saveMeta,
        saveSettings,
        loading,
        hasMissingRequired
    } = useWidgetDetails();

    if (!widget) return null;

    return (
        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-black/20 shrink-0">
            <div className="min-w-0">
                <h1 className="text-[10px] font-black text-white leading-none tracking-tight uppercase mb-1">{activeTabLabel}</h1>
                <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest truncate">{widget.display_name || widget.app_id}</p>
            </div>

            <div className="flex items-center gap-3">
                <div className={`w-1.5 h-1.5 rounded-full ${widget.enabled ? 'bg-emerald-500' : 'bg-rose-500'} shadow-[0_0_8px_rgba(16,185,129,0.3)]`} />

                {activeTab === 'overview' ? (
                    <button
                        onClick={() => saveMeta()}
                        disabled={loading.meta || hasMissingRequired}
                        className="px-3 py-1.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-30 text-white text-[8px] font-black uppercase tracking-widest rounded-lg transition-all flex items-center gap-1.5 active:scale-95"
                    >
                        {loading.meta ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                        Save
                    </button>
                ) : (
                    <button
                        onClick={saveSettings}
                        disabled={loading.settings}
                        className="px-3 py-1.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-30 text-white text-[8px] font-black uppercase tracking-widest rounded-lg transition-all flex items-center gap-1.5 active:scale-95"
                    >
                        {loading.settings ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                        Apply
                    </button>
                )}
            </div>
        </div>
    );
};
