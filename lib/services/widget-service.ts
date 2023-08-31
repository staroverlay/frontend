import client from "../graphql/client";
import CreateWidgetMutation from "../graphql/mutations/createWidgetMutation";
import GetWidgetsQuery from "../graphql/queries/getWidgetsQuery";
import IDictionary from "../interfaces/shared/IDictionary";
import IWidget, { IWidgetCreatePayload } from "../interfaces/widget";

export async function createWidget(
  payload: IWidgetCreatePayload
): Promise<IWidget> {
  const fixedPayload: IDictionary = { ...payload };

  if (fixedPayload.settings && typeof fixedPayload != "string") {
    fixedPayload.settings = JSON.stringify(fixedPayload.settings);
  }

  return (await client.fetch(CreateWidgetMutation, {
    payload: fixedPayload,
  })) as IWidget;
}

export async function getMyWidgets(): Promise<IWidget[]> {
  const widgets = await client.fetch(GetWidgetsQuery);
  return widgets as IWidget[];
}
