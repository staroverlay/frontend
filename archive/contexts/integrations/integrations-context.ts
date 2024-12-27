import { Integration, IntegrationType } from '@staroverlay/sdk';
import React from 'react';

import { IntegrationsHook } from './integrations-hook';

export const IntegrationsContext = React.createContext<IntegrationsHook>({
  integrations: [],
  addIntegration: (integration: Integration) => {},
  updateIntegration: (integration: Integration) => {},
  removeIntegration: (integration: Integration | string) => {},
  getIntegration: (type: IntegrationType) => null,
});
