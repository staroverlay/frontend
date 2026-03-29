import api from '../lib/api-client';
import {
  type AuthResponse, type OAuthInitiateResponse
} from '../lib/types';

export const oauthService = {
  async initiateLogin(provider: string): Promise<OAuthInitiateResponse> {
    const { data } = await api.post(`/oauth/login/${provider}`);
    return data;
  },

  async handleCallback(provider: string, params: { code: string; state: string }): Promise<AuthResponse | { connected: true; provider: string; username: string }> {
    const { data } = await api.get(`/oauth/callback/${provider}`, { params });
    return data;
  },
};
