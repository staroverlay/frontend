import { create } from 'zustand';
import type { Integration } from '../lib/types';

interface IntegrationsState {
  integrations: Integration[];
  setIntegrations: (integrations: Integration[]) => void;
  updateIntegration: (integration: Integration) => void;
  removeIntegration: (provider: string) => void;
}

export const useIntegrationsStore = create<IntegrationsState>((set) => ({
  integrations: [],
  setIntegrations: (integrations) => set({ integrations }),
  updateIntegration: (updated) =>
    set((state) => ({
      integrations: state.integrations.map((i) => (i.provider === updated.provider ? updated : i)),
    })),
  removeIntegration: (provider) =>
    set((state) => ({
      integrations: state.integrations.filter((i) => i.provider !== provider),
    })),
}));
