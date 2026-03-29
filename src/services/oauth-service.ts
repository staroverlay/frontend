import api from '../lib/api-client';
import {
  type AuthResponse, type OAuthInitiateResponse
} from '../lib/types';

export const oauthService = {
  async initiateLogin(provider: string): Promise<OAuthInitiateResponse> {
    const { data } = await api.post(`/oauth/${provider}/login`);
    return data;
  },

  async initiateConnect(provider: string): Promise<OAuthInitiateResponse> {
    const { data } = await api.post(`/integrations/${provider}/connect`);
    return data;
  },

  async handleCallback(provider: string, data: { code: string; state: string }): Promise<AuthResponse | { connected: true; provider: string; username: string }> {
    const { data: result } = await api.post(`/oauth/callback/${provider}`, data);
    return result;
  },
};
