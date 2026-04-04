import { Loader2 } from 'lucide-react';
import { useWidgetDetails } from './WidgetDetailsContext';
import { cn } from '../../lib/utils';
import type { Integration } from '../../lib/types';

export const WidgetMetaSettings = () => {
    const {
        metaDraft,
        setMetaDraft,
        loading,
        compatibleIntegrations,
        requiredIntegrationProviders
    } = useWidgetDetails();

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-left-2 duration-300">
            <div className="space-y-3">
                <label className="text-[7.5px] font-black text-zinc-600 uppercase tracking-widest px-1 flex items-center gap-2">
                    <span className="w-4 h-[1px] bg-zinc-800" />
                    Identity
                </label>
                <div className="space-y-1.5">
                    <span className="text-[8px] font-bold text-zinc-500 uppercase px-1">Display Name</span>
                    <input
                        value={metaDraft.display_name}
                        onChange={e => setMetaDraft(p => ({ ...p, display_name: e.target.value }))}
                        className="w-full bg-zinc-900/30 border border-white/5 rounded-xl px-3 py-2 text-[10px] font-bold text-white focus:outline-none focus:ring-1 focus:ring-violet-500/40 transition-all placeholder:text-zinc-700"
                        placeholder="My Awesome Widget"
                    />
                </div>
            </div>

            <div className="space-y-3 pt-2">
                <label className="text-[7.5px] font-black text-zinc-600 uppercase tracking-widest px-1 flex items-center gap-2">
                    <span className="w-4 h-[1px] bg-zinc-800" />
                    Connections
                </label>
                <div className="grid grid-cols-1 gap-1.5">
                    {loading.integrations ? (
                        <div className="py-6 flex flex-col items-center justify-center border border-dashed border-white/5 rounded-xl">
                            <Loader2 className="w-3 h-3 text-zinc-800 animate-spin" />
                        </div>
                    ) : compatibleIntegrations.length === 0 ? (
                        <div className="p-3 text-center border border-dashed border-rose-500/10 rounded-xl bg-rose-500/5">
                            <p className="text-[8px] font-bold text-rose-500/60 uppercase tracking-widest">No compatible connects</p>
                        </div>
                    ) : (
                        compatibleIntegrations.map((i: Integration) => {
                            const isChecked = metaDraft.integrations.includes(i.id);
                            const isRequired = requiredIntegrationProviders.includes((i.provider as string).toLowerCase());
                            return (
                                <button
                                    key={i.id}
                                    onClick={() => {
                                        const next = isChecked ? metaDraft.integrations.filter(x => x !== i.id) : [...new Set([...metaDraft.integrations, i.id])];
                                        setMetaDraft(prev => ({ ...prev, integrations: next }));
                                    }}
                                    className={cn(
                                        "flex items-center justify-between p-2.5 rounded-xl border transition-all text-left group",
                                        isChecked ? "bg-violet-600/10 border-violet-500/20 text-violet-400 shadow-lg shadow-violet-600/5" : "bg-zinc-900/20 border-white/5 text-zinc-500 hover:border-white/10 hover:text-zinc-300"
                                    )}
                                >
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        {i.providerAvatarUrl ? (
                                            <img src={i.providerAvatarUrl} className={cn("w-4.5 h-4.5 rounded-md bg-zinc-950 border border-white/5 transition-all outline outline-offset-1 outline-transparent group-hover:outline-white/10", isChecked ? "grayscale-0 opacity-100" : "grayscale opacity-40")} alt="" />
                                        ) : (
                                            <div className={cn("w-1.5 h-1.5 rounded-full", isChecked ? "bg-violet-500" : "bg-zinc-800")} />
                                        )}
                                        <div className="min-w-0">
                                            <span className="block text-[8.5px] font-black uppercase tracking-tight truncate leading-none mb-0.5">{i.displayName || i.providerUsername}</span>
                                            <span className="block text-[6px] font-bold text-zinc-600 uppercase tracking-widest leading-none">{i.provider}</span>
                                        </div>
                                    </div>
                                    {isRequired && !isChecked && <span className="text-[5.5px] font-black bg-rose-500/20 text-rose-500 px-1 py-0.5 rounded uppercase font-mono">REQ</span>}
                                </button>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};
