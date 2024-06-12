import TemplateScope from '../shared/settings-scope';
import ITemplateFieldGroup from './template-field-group';

export default interface TemplateVersion {
  _id: string;
  templateId: string;
  fields: ITemplateFieldGroup[];
  html: string;
  scopes?: TemplateScope[];
  version: string;
}
