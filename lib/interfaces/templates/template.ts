import ServiceType from '../service-type';
import ITemplateFieldGroup from './template-field-group';
import TemplateScope from './template-scope';
import TemplateVisibility from './template-visibility';

export default interface ITemplate {
  _id: string;
  author: {
    id: string;
    username: string;
    avatar: string;
  };
  name: string;
  description?: string;
  scopes?: TemplateScope[];
  service?: ServiceType;
  html: string;
  fields?: ITemplateFieldGroup[];
  visibility: TemplateVisibility;
  version: number;
}

export type ITemplateRaw = ITemplate & {
  fields?: string;
};
