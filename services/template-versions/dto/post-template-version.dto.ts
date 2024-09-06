import { SettingsScope, TemplateFieldGroup } from '@staroverlay/sdk';

export default interface PostTemplateVersionDTO {
  fields?: TemplateFieldGroup[];
  html?: string;
  scopes?: SettingsScope[];
  version?: string;
}
