import React, { useState, useMemo } from 'react';
import { ShoppingCart, Trash2, Plus } from 'lucide-react';

import { FieldBase } from './FieldBase';
import { type AppSettingField } from '@/lib/types';
import { RewardSelectorModal } from './RewardSelectorModal';
import { useCurrentAppSettings } from '../AppSettingsContext';
import { useRewardInfo } from '@/hooks/use-integration-rewards';

interface RewardFieldProps {
    field: AppSettingField;
    value: any;
    onChange: (value: any) => void;
    depth?: number;
}

export const RewardField: React.FC<RewardFieldProps> = ({ field, value, onChange, depth }) => {
    const { integrationIds } = useCurrentAppSettings();
    const [open, setOpen] = useState(false);

    // Extract integrationId and rewardId from the stored value "integrationId:rewardId"
    const { integrationId, rewardId } = useMemo(() => {
        if (typeof value === 'string' && value.includes(':')) {
            const [iId, rId] = value.split(':');
            return { integrationId: iId, rewardId: rId };
        }
        return { integrationId: null, rewardId: null };
    }, [value]);

    const { reward, loading } = useRewardInfo(integrationId, rewardId);

    return (
        <FieldBase field={field} icon={<ShoppingCart className="w-3.5 h-3.5" />} depth={depth} description={field.description}>
            <div className="w-full">
                {value ? (
                    <div className="flex items-center gap-2.5 bg-zinc-900/40 border border-white/5 rounded-xl p-1.5 group/reward relative overflow-hidden transition-all hover:bg-zinc-900/50 hover:border-white/10">
                        <div
                            className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center overflow-hidden shrink-0 cursor-pointer relative shadow-inner"
                            style={{ backgroundColor: reward?.color || '#9146FF' }}
                            onClick={() => setOpen(true)}
                        >
                            {reward?.icon ? (
                                <img src={reward.icon} className="w-full h-full object-contain p-1.5 drop-shadow-md" />
                            ) : (
                                <ShoppingCart className="w-3.5 h-3.5 text-white/40" />
                            )}
                            {loading && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                    <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setOpen(true)}>
                            <p className="text-[9.5px] font-black text-white truncate uppercase tracking-tight leading-none mb-0.5">
                                {reward?.title || 'Loading Reward...'}
                            </p>
                            <p className="text-[7.5px] font-bold text-zinc-500 uppercase tracking-widest truncate leading-none opacity-60">
                                {reward?.cost ? `${reward.cost} Pts` : value}
                            </p>
                        </div>
                        <button
                            onClick={() => onChange(null)}
                            className="p-1.5 rounded-lg bg-rose-500/10 text-rose-500 opacity-0 group-hover/reward:opacity-100 transition-all hover:bg-rose-500/20 shadow-lg shadow-rose-500/5 shrink-0"
                            title="Remove Reward"
                        >
                            <Trash2 className="w-3 h-3" />
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => setOpen(true)}
                        className="w-full py-3 rounded-xl border border-dashed border-white/10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-violet-500/30 transition-all flex items-center justify-center gap-2 group"
                    >
                        <Plus className="w-3 h-3 text-zinc-700 group-hover:text-violet-500 transition-all" />
                        <span className="text-[8.5px] font-black uppercase text-zinc-600 tracking-[0.1em] group-hover:text-zinc-400 transition-all">Select Reward</span>
                    </button>
                )}
            </div>

            {integrationIds && (
                <RewardSelectorModal
                    isOpen={open}
                    onClose={() => setOpen(false)}
                    integrationIds={integrationIds}
                    selectedReward={value}
                    onSelect={(iId, rId) => onChange(`${iId}:${rId}`)}
                />
            )}
        </FieldBase>
    );
};
