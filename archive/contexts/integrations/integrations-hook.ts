import { Integration, IntegrationType } from '@staroverlay/sdk';

export interface IntegrationsHook {
  integrations: Integration[];
  addIntegration: (integration: Integration) => void;
  updateIntegration: (integration: Integration) => void;
  removeIntegration: (integration: Integration | string) => void;
  getIntegration: (type: IntegrationType) => Integration | null;
}
