import client from "../graphql/client";
import CreateWidgetMutation from "../graphql/mutations/createWidgetMutation";
import DeleteWidgetMutation from "../graphql/mutations/deleteWidgetMutation";
import GetWidgetsQuery from "../graphql/queries/getWidgetsQuery";
import IDictionary from "../interfaces/shared/IDictionary";
import IWidget from "../interfaces/widget";
import WidgetCreatePayload from "./dtos/widget-create-payload";

export async function createWidget(
  payload: WidgetCreatePayload
): Promise<IWidget> {
  const fixedPayload: IDictionary = { ...payload };
  return (await client.fetch(CreateWidgetMutation, {
    payload: fixedPayload,
  })) as IWidget;
}

export async function deleteWidget(widget: IWidget): Promise<boolean> {
  const result = await client.fetch(DeleteWidgetMutation, { id: widget._id });
  return result as unknown as boolean;
}

export async function getMyWidgets(): Promise<IWidget[]> {
  const widgets = await client.fetch(GetWidgetsQuery);
  return widgets as IWidget[];
}
