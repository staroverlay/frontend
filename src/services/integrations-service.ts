import api from '../lib/api-client';
import type { BasicResponse, Integration, OAuthInitiateResponse } from '../lib/types';

export const integrationsService = {
  async listIntegrations(): Promise<Integration[]> {
    const { data } = await api.get('/integrations');
    return data.integrations;
  },

  async getIntegration(provider: string): Promise<Integration> {
    const { data } = await api.get(`/integrations/${provider}`);
    return data.integration;
  },

  async updateIntegration(provider: string, body: { displayName?: string | null; allowOauthLogin?: boolean }): Promise<Integration> {
    const { data } = await api.patch(`/integrations/${provider}`, body);
    return data.integration;
  },

  async refreshIntegration(provider: string): Promise<BasicResponse & { accessToken: string }> {
    const { data } = await api.post(`/integrations/${provider}/refresh`);
    return data;
  },

  async disconnectIntegration(provider: string): Promise<BasicResponse> {
    const { data } = await api.delete(`/integrations/${provider}`);
    return data;
  },

  async initiateConnect(provider: string): Promise<OAuthInitiateResponse> {
    const { data } = await api.post(`/integrations/connect/${provider}`);
    return data;
  },

  async getChannelRewards(integrationId: string): Promise<{ id: string; title: string; cost: number; color: string; icon: string | null }[]> {
    const { data } = await api.get(`/integrations/rewards/${integrationId}`);
    return data.rewards;
  },
};
