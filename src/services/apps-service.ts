import type { AppSettingField } from '../lib/types';

export interface AppManifest {
  id: string;
  name: string;
  description: string;
  version: string;
  category: string;
  compatible_with: string[];
  created_at: string;
  updated_at: string;
  properties?: {
    integrations?: Array<{
      provider: string;
      allow_multiple?: boolean;
      is_required?: boolean;
    }>;
  };
  settings?: AppSettingField[];
}

const BASE_URL = import.meta.env.VITE_APP_WIDGET_SERVER || "http://localhost:4000";

export const appsService = {
  async getApps(): Promise<AppManifest[]> {
    const response = await fetch(`${BASE_URL}/apps.json`);
    if (!response.ok) throw new Error("Failed to fetch apps list");
    return response.json();
  },

  async getApp(id: string): Promise<AppManifest> {
    const response = await fetch(`${BASE_URL}/${id}/app.json`);
    if (!response.ok) throw new Error("Failed to fetch app details");
    const app = await response.json();
    app.id = id;
    return app;
  },

  async getAppPage(id: string): Promise<string> {
    const response = await fetch(`${BASE_URL}/${id}/page.md`);
    if (!response.ok) throw new Error("Failed to fetch app page");
    return response.text();
  },
};
