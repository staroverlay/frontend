import React from 'react';

import IIntegration, {
  IntegrationType,
} from '@/services/integrations/integration';
import { IntegrationsHook } from './integrations-hook';

export const IntegrationsContext = React.createContext<IntegrationsHook>({
  integrations: [],
  addIntegration: (integration: IIntegration) => {},
  updateIntegration: (integration: IIntegration) => {},
  removeIntegration: (integration: IIntegration | string) => {},
  getIntegration: (type: IntegrationType) => null,
});
