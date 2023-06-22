import ServiceType from "./service-type";
import ITemplateField from "./template-field";
import TemplateScope from "./template-scope";

export default interface ITemplate {
  _id: string;
  author: string;
  name: string;
  description?: string;
  scopes: TemplateScope[];
  service: ServiceType;
  html: string;
  fields?: ITemplateField[];
  visibility: "public" | "unlisted" | "private";
}

export type ITemplateRaw = ITemplate & {
  fields?: string;
};
