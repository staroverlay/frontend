import client from '@/lib/clients/graphql';

import { emitSettingsUpdate } from '../events';
import WidgetCreatePayload from './dtos/create-widget.dto';
import WidgetUpdatePayload from './dtos/update-widget.dto';
import CreateWidgetMutation from './graphql/createWidgetMutation';
import DeleteWidgetMutation from './graphql/deleteWidgetMutation';
import GetWidgetsQuery from './graphql/getWidgetsQuery';
import ResetWidgetTokenMutation from './graphql/resetWidgetTokenMutation';
import UpdateWidgetMutation from './graphql/updateWidgetMutation';
import IWidget from './widget';

export async function createWidget(
  payload: WidgetCreatePayload,
): Promise<IWidget> {
  const widget = await client.fetch(CreateWidgetMutation, { payload });
  return widget as IWidget;
}

export async function deleteWidget(widget: IWidget): Promise<boolean> {
  const result = await client.fetch(DeleteWidgetMutation, { id: widget._id });
  return result as unknown as boolean;
}

export async function getMyWidgets(): Promise<IWidget[]> {
  const widgets = await client.fetch(GetWidgetsQuery);
  return widgets as IWidget[];
}

export async function updateWidget(
  widget: IWidget,
  payload: WidgetUpdatePayload,
): Promise<IWidget> {
  const newWidget = (await client.fetch(UpdateWidgetMutation, {
    id: widget._id,
    payload,
  })) as IWidget;
  await emitSettingsUpdate(newWidget);
  return newWidget;
}

export async function resetWidgetToken(widget: IWidget): Promise<IWidget> {
  const payload = { id: widget._id };
  const newWidget = await client.fetch(ResetWidgetTokenMutation, payload);
  return newWidget as IWidget;
}
