import IDictionary from "./shared/IDictionary";
import ITemplate from "./template";
import TemplateScope from "./template-scope";

export default interface IWidget {
  _id: string;
  displayName: string;
  userId: string;
  enabled: boolean;
  token: string;
  template: ITemplate;
  templateId: string;
  templateRaw: string;
  settings?: IDictionary;
  scopes: TemplateScope[];
}
