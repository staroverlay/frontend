import api from '../lib/api-client';

export interface PlanLimits {
    file_storage: number;
    files: number;
    widgets: number;
    same_integration: number;
    editors: number;
}

export interface Plan {
    id: string;
    name: string;
    price: number;
    limits: PlanLimits;
}

export interface UserSubscription {
    id: string;
    userId: string;
    planId: string;
    expiresAt: string | null;
    active: boolean;
    createdAt: string;
    updatedAt: string;
}

export const subscriptionService = {
    async getPlans(): Promise<Plan[]> {
        const { data } = await api.get<Plan[]>('/subscription/plans');
        return data;
    },

    async getCurrentSubscription(): Promise<UserSubscription | null> {
        const { data } = await api.get<UserSubscription | null>('/subscription/current');
        return data;
    },
};
