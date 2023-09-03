import ServiceType from '@/lib/interfaces/service-type';
import ITemplateField from '@/lib/interfaces/template-field';
import TemplateScope from '@/lib/interfaces/template-scope';

export default interface TemplateUpdate {
  name?: string;
  description?: string;
  scopes?: TemplateScope[];
  service?: ServiceType;
  html?: string;
  fields?: ITemplateField[];
  visibility?: string;
}
