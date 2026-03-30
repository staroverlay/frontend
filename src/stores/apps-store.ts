import { create } from 'zustand';
import { appsService, type AppManifest } from '../services/apps-service';

interface AppsState {
  apps: AppManifest[];
  isLoading: boolean;
  error: Error | null;
  hasLoaded: boolean;
  fetchApps: () => Promise<void>;
}

export const useAppsStore = create<AppsState>((set, get) => ({
  apps: [],
  isLoading: false,
  error: null,
  hasLoaded: false,

  fetchApps: async () => {
    if (get().hasLoaded || get().isLoading) return;

    set({ isLoading: true, error: null });

    try {
      const apps = await appsService.getApps();
      set({ apps, isLoading: false, hasLoaded: true });
    } catch (error) {
      set({ error: error as Error, isLoading: false });
    }
  }
}));
