import api from '../lib/api-client';
import type { BasicResponse, Session } from '../lib/types';

export const sessionsService = {
  async listSessions(): Promise<Session[]> {
    const { data } = await api.get('/sessions');
    return data.sessions;
  },

  async revokeSession(id: string): Promise<BasicResponse> {
    const { data } = await api.delete(`/sessions/${id}`);
    return data;
  },
};
