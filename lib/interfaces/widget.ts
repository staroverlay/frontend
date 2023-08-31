import IDictionary from "./shared/IDictionary";
import TemplateScope from "./template-scope";

export default interface IWidget {
  _id: string;
  displayName: string;
  userId: string;
  enabled: boolean;
  token: string;
  template: string;
  html: string;
  scopes?: TemplateScope[];
  settings?: IDictionary;
}

export type IWidgetCreatePayload = Omit<
  IWidget,
  "userId" | "enabled" | "token" | "html" | "scopes" | "_id"
>;
