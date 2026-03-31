import { create } from 'zustand';
import { integrationsService } from '../services/integrations-service';

interface Reward {
    id: string;
    title: string;
    cost: number;
    color: string;
    icon: string | null;
}

interface RewardsState {
    // Cache of rewards by integration ID
    cache: Record<string, Reward[]>;
    loading: Record<string, boolean>;
    errors: Record<string, string | null>;

    // Actions
    fetchRewards: (integrationId: string) => Promise<void>;
    getReward: (integrationId: string, rewardId: string) => Reward | null;
}

export const useRewardsStore = create<RewardsState>((set, get) => ({
    cache: {},
    loading: {},
    errors: {},

    fetchRewards: async (integrationId: string) => {
        // Don't fetch if already loading or already in cache
        const state = get();
        if (!integrationId || state.loading[integrationId] || state.cache[integrationId]) return;

        set((s) => ({
            loading: { ...s.loading, [integrationId]: true },
            errors: { ...s.errors, [integrationId]: null },
        }));

        try {
            const rewards = await integrationsService.getChannelRewards(integrationId);
            set((s) => ({
                cache: { ...s.cache, [integrationId]: rewards },
            }));
        } catch (e) {
            set((s) => ({
                errors: { ...s.errors, [integrationId]: 'Failed to fetch rewards' },
            }));
        } finally {
            set((s) => ({
                loading: { ...s.loading, [integrationId]: false },
            }));
        }
    },

    getReward: (integrationId, rewardId) => {
        const rewards = get().cache[integrationId] || [];
        return rewards.find(r => r.id === rewardId) || null;
    }
}));
