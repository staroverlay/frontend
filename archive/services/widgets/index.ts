import { Widget } from '@staroverlay/sdk';

import client from '@/lib/clients/graphql';
import WidgetCreatePayload from './dtos/create-widget.dto';
import WidgetUpdatePayload from './dtos/update-widget.dto';
import CreateWidgetMutation from './graphql/createWidgetMutation';
import DeleteWidgetMutation from './graphql/deleteWidgetMutation';
import GetWidgetsQuery from './graphql/getWidgetsQuery';
import ResetWidgetTokenMutation from './graphql/resetWidgetTokenMutation';
import UpdateWidgetMutation from './graphql/updateWidgetMutation';

export async function createWidget(
  payload: WidgetCreatePayload,
): Promise<Widget> {
  const widget = await client.fetch(CreateWidgetMutation, { payload });
  return widget as Widget;
}

export async function deleteWidget(widget: Widget): Promise<boolean> {
  const result = await client.fetch(DeleteWidgetMutation, { id: widget._id });
  return result as unknown as boolean;
}

export async function getMyWidgets(): Promise<Widget[]> {
  const widgets = await client.fetch(GetWidgetsQuery);
  return widgets as Widget[];
}

export async function updateWidget(
  widget: Widget,
  payload: WidgetUpdatePayload,
): Promise<Widget> {
  const newPayload: any = { ...payload };
  newPayload.settings = JSON.stringify(payload.settings);
  const newWidget = (await client.fetch(UpdateWidgetMutation, {
    id: widget._id,
    payload: newPayload,
  })) as Widget;
  return newWidget;
}

export async function resetWidgetToken(widget: Widget): Promise<Widget> {
  const payload = { id: widget._id };
  const newWidget = await client.fetch(ResetWidgetTokenMutation, payload);
  return newWidget as Widget;
}
