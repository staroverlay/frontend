import api from '../lib/api-client';
import type { BasicResponse, Profile } from '../lib/types';

export const profilesService = {
  async getProfile(): Promise<Profile> {
    const { data } = await api.get('/profile');
    return data;
  },

  async upsertProfile(body: { displayName: string }): Promise<Profile> {
    const { data } = await api.put('/profile', body);
    return data.profile;
  },

  async deleteProfile(): Promise<BasicResponse> {
    const { data } = await api.delete('/profile');
    return data;
  },
};
