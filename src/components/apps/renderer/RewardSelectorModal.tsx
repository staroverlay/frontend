import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Loader2, X, AlertCircle, ShoppingCart } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { integrationsService } from '../../../services/integrations-service';
import type { Integration } from '../../../lib/types';
import { useRewardsStore } from '../../../store/use-rewards-store';

interface RewardSelectorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (integrationId: string, rewardId: string) => void;
    integrationIds: string[];
    selectedReward?: string; // "integrationId:rewardId"
}

export const RewardSelectorModal: React.FC<RewardSelectorModalProps> = ({
    isOpen, onClose, onSelect, integrationIds, selectedReward
}) => {
    const fetchRewards = useRewardsStore(s => s.fetchRewards);
    const rewardsMap = useRewardsStore(s => s.cache);
    const loadingStates = useRewardsStore(s => s.loading);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [integrations, setIntegrations] = useState<Integration[]>([]);
    const [activeIntegrationId, setActiveIntegrationId] = useState<string | null>(null);

    useEffect(() => {
        if (!isOpen) return;
        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const all = await integrationsService.listIntegrations();
                const filtered = all.filter(i => (integrationIds || []).includes(i.id));
                setIntegrations(filtered);

                if (filtered.length > 0) {
                    if (selectedReward && selectedReward.includes(':')) {
                        const [id] = selectedReward.split(':');
                        setActiveIntegrationId(filtered.some(i => i.id === id) ? id : filtered[0].id);
                    } else {
                        setActiveIntegrationId(filtered[0].id);
                    }
                }

                // Batch fetch rewards for all integrations using the global store
                await Promise.all(filtered.map(i => fetchRewards(i.id)));
            } catch (e) {
                setError("Failed to load rewards");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [isOpen, integrationIds, selectedReward, fetchRewards]);

    if (!isOpen) return null;

    const activeRewards = activeIntegrationId ? (rewardsMap[activeIntegrationId] || []) : [];
    const isActiveLoading = activeIntegrationId ? loadingStates[activeIntegrationId] : false;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
            <div className="relative w-full max-w-2xl bg-zinc-950 border border-white/10 rounded-[2rem] shadow-2xl flex flex-col h-[600px] max-h-[80vh] overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-black text-white leading-none">Select Reward</h2>
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1.5">Channel Points & Redemptions</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl transition-all text-zinc-500 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {loading ? (
                    <div className="flex-1 flex flex-col items-center justify-center gap-3">
                        <Loader2 className="w-6 h-6 text-violet-500 animate-spin" />
                        <p className="text-[9px] font-black uppercase text-zinc-600 tracking-widest">Fetching Rewards...</p>
                    </div>
                ) : error ? (
                    <div className="flex-1 flex flex-col items-center justify-center gap-3 p-10 text-center">
                        <AlertCircle className="w-8 h-8 text-rose-500/50" />
                        <p className="text-sm font-bold text-zinc-400">{error}</p>
                    </div>
                ) : integrations.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center gap-3 p-10 text-center">
                        <ShoppingCart className="w-8 h-8 text-zinc-800" />
                        <p className="text-xs font-bold text-zinc-600 uppercase tracking-widest">No integrations connected to this widget</p>
                    </div>
                ) : (
                    <>
                        <div className="flex gap-1 p-2 bg-black/20 border-b border-white/5 overflow-x-auto scrollbar-hide">
                            {integrations.map(i => (
                                <button
                                    key={i.id}
                                    onClick={() => setActiveIntegrationId(i.id)}
                                    className={cn(
                                        "flex items-center gap-2 px-3 py-2 rounded-xl border transition-all shrink-0",
                                        activeIntegrationId === i.id
                                            ? "bg-violet-600/10 border-violet-500/30 text-white shadow-lg shadow-violet-600/5"
                                            : "border-transparent text-zinc-500 hover:text-zinc-300"
                                    )}
                                >
                                    {i.providerAvatarUrl && <img src={i.providerAvatarUrl} className="w-4 h-4 rounded-md border border-white/5" />}
                                    <span className="text-[9px] font-black uppercase tracking-tight">{i.displayName || i.providerUsername}</span>
                                </button>
                            ))}
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide relative">
                            {isActiveLoading && (
                                <div className="absolute inset-0 z-10 bg-zinc-950/40 backdrop-blur-[2px] flex flex-col items-center justify-center gap-3 animate-in fade-in duration-200">
                                    <Loader2 className="w-6 h-6 text-violet-500 animate-spin" />
                                    <p className="text-[8px] font-black uppercase text-zinc-400 tracking-widest">Syncing Rewards...</p>
                                </div>
                            )}

                            {activeRewards.length === 0 && !isActiveLoading ? (
                                <div className="py-20 text-center">
                                    <p className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest">No rewards found for this account</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {activeRewards.map(reward => {
                                        const isSelected = selectedReward === `${activeIntegrationId}:${reward.id}`;
                                        return (
                                            <button
                                                key={reward.id}
                                                onClick={() => {
                                                    onSelect(activeIntegrationId!, reward.id);
                                                    onClose();
                                                }}
                                                className={cn(
                                                    "flex items-center gap-3 p-3 rounded-2xl border transition-all text-left group",
                                                    isSelected
                                                        ? "bg-violet-600/15 border-violet-500/40 shadow-xl shadow-violet-600/5"
                                                        : "bg-zinc-900/30 border-white/5 hover:bg-zinc-900/60 hover:border-white/10"
                                                )}
                                            >
                                                <div
                                                    className="w-10 h-10 rounded-xl border border-white/10 flex-shrink-0 flex items-center justify-center overflow-hidden relative shadow-inner transition-transform group-hover:scale-105"
                                                    style={{ backgroundColor: reward.color || '#9146FF' }}
                                                >
                                                    {reward.icon ? (
                                                        <img src={reward.icon} className="w-full h-full object-contain p-2 drop-shadow-md" />
                                                    ) : (
                                                        <ShoppingCart className="w-5 h-5 text-white/40" />
                                                    )}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <h3 className={cn(
                                                        "text-[10px] font-black uppercase tracking-tight truncate leading-none mb-1",
                                                        isSelected ? "text-white" : "text-zinc-300 group-hover:text-white"
                                                    )}>{reward.title}</h3>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">{reward.cost} Pts</span>
                                                        {reward.color && (
                                                            <div className="w-2 h-2 rounded-full border border-white/10" style={{ backgroundColor: reward.color }} />
                                                        )}
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>,
        document.body
    );
};
