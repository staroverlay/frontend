import TemplateScope from '../../shared/settings-scope';
import ITemplateFieldGroup from '../template-field-group';

export default interface PostTemplateVersionDTO {
  fields?: ITemplateFieldGroup[];
  html?: string;
  scopes?: TemplateScope[];
  version?: string;
}
