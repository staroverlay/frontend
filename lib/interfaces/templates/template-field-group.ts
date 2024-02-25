import ITemplateField from './template-field';

export default interface ITemplateFieldGroup {
  id: string;
  label: string;
  children: ITemplateField[];
}
