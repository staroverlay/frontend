import ServiceType from "./service-type";
import ITemplateField from "./template-field";
import TemplateScope from "./template-scope";
import TemplateVisibility from "./template-visibility";

export default interface ITemplate {
  _id: string;
  author: string;
  name: string;
  description?: string;
  scopes?: TemplateScope[];
  service?: ServiceType;
  html: string;
  fields?: ITemplateField[];
  visibility: TemplateVisibility;
}

export type ITemplateRaw = ITemplate & {
  fields?: string;
};
