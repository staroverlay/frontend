import ServiceType from '@/lib/interfaces/service-type';
import ITemplateFieldGroup from '@/lib/interfaces/templates/template-field-group';
import TemplateScope from '@/lib/interfaces/templates/template-scope';

export default interface TemplateUpdate {
  name?: string;
  description?: string;
  scopes?: TemplateScope[];
  service?: ServiceType;
  html?: string;
  fields?: ITemplateFieldGroup[];
  visibility?: string;
}
