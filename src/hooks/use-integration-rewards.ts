import { useEffect } from 'react';

import { useRewardsStore } from '../store/use-rewards-store';

const EMPTY_REWARDS: any[] = [];

export function useIntegrationRewards(integrationId?: string | null) {
    const fetchRewards = useRewardsStore(s => s.fetchRewards);
    const rewards = useRewardsStore(s => s.cache[integrationId || ''] || EMPTY_REWARDS);
    const loading = useRewardsStore(s => s.loading[integrationId || ''] || false);
    const error = useRewardsStore(s => s.errors[integrationId || ''] || null);

    useEffect(() => {
        if (integrationId) {
            fetchRewards(integrationId);
        }
    }, [integrationId, fetchRewards]);

    return { rewards, loading, error };
}

export function useRewardInfo(integrationId?: string | null, rewardId?: string | null) {
    // Ensure we trigger the fetch even if we just want one reward info
    const { loading, error } = useIntegrationRewards(integrationId);
    const reward = useRewardsStore(s => (integrationId && rewardId) ? s.getReward(integrationId, rewardId) : null);

    return { reward, loading, error };
}
