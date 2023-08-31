import client from "../graphql/client";
import CreateWidgetMutation from "../graphql/mutations/createWidgetMutation";
import DeleteWidgetMutation from "../graphql/mutations/deleteWidgetMutation";
import GetWidgetsQuery from "../graphql/queries/getWidgetsQuery";
import IWidget from "../interfaces/widget";
import WidgetCreatePayload from "./dtos/widget-create-payload";

function fixWidget(widget: IWidget) {
  const raw = widget.settings as unknown as string;
  if (raw && typeof raw == "string") {
    widget.settings = JSON.parse(raw);
  }
  return widget;
}

export async function createWidget(
  payload: WidgetCreatePayload
): Promise<IWidget> {
  const widget = await client.fetch(CreateWidgetMutation, { payload });
  return fixWidget(widget as IWidget);
}

export async function deleteWidget(widget: IWidget): Promise<boolean> {
  const result = await client.fetch(DeleteWidgetMutation, { id: widget._id });
  return result as unknown as boolean;
}

export async function getMyWidgets(): Promise<IWidget[]> {
  const widgets = await client.fetch(GetWidgetsQuery);
  return widgets.map(fixWidget) as IWidget[];
}
