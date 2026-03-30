import api from '../lib/api-client';
import type { BasicResponse, Widget } from '../lib/types';

export const widgetsService = {
  async listWidgets(): Promise<Widget[]> {
    const { data } = await api.get('/widgets');
    return data.widgets as Widget[];
  },

  async getWidget(id: string): Promise<Widget> {
    const { data } = await api.get(`/widgets/${id}`);
    return data.widget as Widget;
  },

  async createWidget(input: { app_id: string; integrations: string[]; display_name?: string }): Promise<Widget> {
    const { data } = await api.post('/widgets', input);
    return data.widget as Widget;
  },

  async updateWidgetMeta(
    widgetId: string,
    input: { display_name?: string; integrations?: string[]; enabled?: boolean }
  ): Promise<Widget> {
    const { data } = await api.patch(`/widgets/${widgetId}`, input);
    return data.widget as Widget;
  },

  async updateWidgetSettings(widgetId: string, settings: Record<string, unknown>): Promise<Widget> {
    const { data } = await api.patch(`/widgets/${widgetId}/settings`, settings);
    return data.widget as Widget;
  },

  async rotateWidgetToken(widgetId: string): Promise<{ token: string } & BasicResponse> {
    const { data } = await api.post(`/widgets/${widgetId}/token/rotate`);
    return data as { token: string } & BasicResponse;
  },

  async deleteWidget(id: string): Promise<BasicResponse> {
    const { data } = await api.delete(`/widgets/${id}`);
    return data as BasicResponse;
  },
};

