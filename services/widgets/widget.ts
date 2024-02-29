import SettingsScope from '@/services/shared/settings-scope';
import TemplateVersion from '@/services/templates/template-version';

import IDictionary from '../../lib/IDictionary';
import ServiceType from '../shared/service-type';

export default interface IWidget {
  _id: string;
  autoUpdate: boolean;
  displayName: string;
  enabled: boolean;
  service: ServiceType;
  scopes: SettingsScope[];
  settings?: IDictionary;
  templateId: string;
  templateVersion?: TemplateVersion;
  token: string;
  userId: string;
}
