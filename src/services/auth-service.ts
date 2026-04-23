import api from '../lib/api-client';
import type {
  AuthResponse,
  BasicResponse,
  User,
  LoginPayload,
  RegisterPayload,
  VerifyEmailPayload,
  ChangePasswordPayload
} from '../lib/types';

export const authService = {
  async register(body: RegisterPayload): Promise<BasicResponse & { userId: string }> {
    const { data } = await api.post('/auth/register', body);
    return data;
  },

  async verifyEmail(body: VerifyEmailPayload): Promise<BasicResponse> {
    const { data } = await api.post('/auth/verify-email', body);
    return data;
  },

  async resendVerification(body: { email: string }): Promise<BasicResponse> {
    const { data } = await api.post('/auth/resend-verification', body);
    return data;
  },

  async login(body: LoginPayload): Promise<AuthResponse> {
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

  async changePassword(body: ChangePasswordPayload): Promise<BasicResponse> {
    const { data } = await api.post('/auth/change-password', body);
    return data;
  },

  async getMe(): Promise<User> {
    const { data } = await api.get('/auth/me');
    return data;
  },
};
