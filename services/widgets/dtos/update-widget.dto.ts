import { SettingsScope } from '@staroverlay/sdk';

import IDictionary from '@/lib/IDictionary';

type WidgetUpdatePayload = {
  autoUpdate?: boolean;
  displayName?: string;
  enabled?: boolean;
  scopes?: SettingsScope[];
  settings?: IDictionary;
};

export default WidgetUpdatePayload;
