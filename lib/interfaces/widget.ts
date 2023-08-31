import IDictionary from "./shared/IDictionary";
import TemplateScope from "./template-scope";

export default interface IWidget {
  _id: string;
  displayName: string;
  userId: string;
  enabled: boolean;
  token: string;
  templateId: string;
  templateRaw: string;
  templateVersion: number;
  settings?: IDictionary;
  scopes: TemplateScope[];
}
