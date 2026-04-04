import { create } from 'zustand';
import { subscriptionService, type Plan, type UserSubscription } from '../services/subscription-service';

interface SubscriptionState {
    subscription: UserSubscription | null;
    plans: Plan[];
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchSubscription: () => Promise<void>;
    getPlan: () => Plan | undefined;
}

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
    subscription: null,
    plans: [],
    isLoading: false,
    error: null,

    fetchSubscription: async () => {
        set({ isLoading: true, error: null });
        try {
            const [sub, allPlans] = await Promise.all([
                subscriptionService.getCurrentSubscription(),
                subscriptionService.getPlans()
            ]);
            set({ subscription: sub, plans: allPlans, isLoading: false });
        } catch (e) {
            set({ error: 'Failed to load subscription data', isLoading: false });
        }
    },

    getPlan: () => {
        const { subscription, plans } = get();
        if (plans.length === 0) return undefined;
        return plans.find(p => p.id === subscription?.planId) || plans.find(p => p.id === 'free');
    }
}));
