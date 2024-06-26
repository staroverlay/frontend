import IIntegration, {
  IntegrationType,
} from '@/services/integrations/integration';

export interface IntegrationsHook {
  integrations: IIntegration[];
  addIntegration: (integration: IIntegration) => void;
  updateIntegration: (integration: IIntegration) => void;
  removeIntegration: (integration: IIntegration | string) => void;
  getIntegration: (type: IntegrationType) => IIntegration | null;
}
