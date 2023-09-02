import client from "../graphql/client";
import CreateWidgetMutation from "../graphql/mutations/createWidgetMutation";
import DeleteWidgetMutation from "../graphql/mutations/deleteWidgetMutation";
import UpdateWidgetMutation from "../graphql/mutations/updateWidgetMutation";
import GetWidgetsQuery from "../graphql/queries/getWidgetsQuery";
import IDictionary from "../interfaces/shared/IDictionary";
import ITemplate from "../interfaces/template";
import IWidget from "../interfaces/widget";
import WidgetCreatePayload from "./dtos/widget-create-payload";
import WidgetUpdatePayload from "./dtos/widget-update-payload";

function fixWidget(widget: IWidget) {
  // Fix settings
  const raw = widget.settings as unknown as string;
  if (raw && typeof raw == "string") {
    widget.settings = JSON.parse(raw);
  }

  // Fix template
  const templateRaw = widget.templateRaw as unknown as string;
  const templateParsed = JSON.parse(templateRaw) as ITemplate;
  widget.template = templateParsed;

  // Fix template fields
  const templateFields = widget.template?.fields;
  if (templateFields && typeof templateFields == "string") {
    widget.template.fields = JSON.parse(templateFields);
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

export async function updateWidget(
  widget: IWidget,
  update: WidgetUpdatePayload
) {
  const payload: IDictionary = { ...update };

  if (payload.settings && typeof payload.settings != "string") {
    payload.settings = JSON.stringify(payload.settings);
  }

  const newWidget = await client.fetch(UpdateWidgetMutation, {
    id: widget._id,
    payload,
  });

  return fixWidget(newWidget as IWidget);
}
