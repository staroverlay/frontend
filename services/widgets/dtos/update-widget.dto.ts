import IDictionary from '@/lib/IDictionary';
import SettingsScope from '@/services/shared/settings-scope';

type WidgetUpdatePayload = {
  autoUpdate?: boolean;
  displayName?: string;
  enabled?: boolean;
  scopes?: SettingsScope[];
  settings?: IDictionary;
};

export default WidgetUpdatePayload;
