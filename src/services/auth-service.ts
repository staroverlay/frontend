import api from '../lib/api-client';
import type { AuthResponse, BasicResponse, User } from '../lib/types';

export const authService = {
  async register(body: any): Promise<BasicResponse & { userId: string }> {
    const { data } = await api.post('/auth/register', body);
    return data;
  },

  async verifyEmail(body: any): Promise<BasicResponse> {
    const { data } = await api.post('/auth/verify-email', body);
    return data;
  },

  async resendVerification(): Promise<BasicResponse> {
    const { data } = await api.post('/auth/resend-verification');
    return data;
  },

  async login(body: any): Promise<AuthResponse> {
    const { data } = await api.post('/auth/login', body);
    return data;
  },

  async logout(): Promise<BasicResponse> {
    const { data } = await api.post('/auth/logout');
    return data;
  },

  async logoutAll(): Promise<BasicResponse> {
    const { data } = await api.post('/auth/logout-all');
    return data;
  },

  async changePassword(body: any): Promise<BasicResponse> {
    const { data } = await api.post('/auth/change-password', body);
    return data;
  },

  async getMe(): Promise<User> {
    const { data } = await api.get('/auth/me');
    return data;
  },
};
