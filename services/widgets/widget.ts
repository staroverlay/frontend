import SettingsScope from '@/services/shared/settings-scope';

import ServiceType from '../shared/service-type';

export default interface IWidget {
  _id: string;
  autoUpdate: boolean;
  displayName: string;
  enabled: boolean;
  service: ServiceType;
  scopes: SettingsScope[];
  settings?: string;
  templateId: string;
  templateVersion?: string;
  token: string;
  userId: string;
}
