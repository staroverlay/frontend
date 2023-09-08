import client from '../graphql/client';
import EmitDebugEventMutation from '../graphql/mutations/emitDebugEventMutation';
import EmitSettingsUpdateMutation from '../graphql/mutations/emitSettingsUpdateMutation';
import IWidget from '../interfaces/widget';

export async function emitDebugEvent(widget: IWidget, eventName: string) {
  await client.fetch(EmitDebugEventMutation, {
    widgetId: widget._id,
    eventName,
  });
}

export async function emitSettingsUpdate(widget: IWidget) {
  await client.fetch(EmitSettingsUpdateMutation, {
    widgetId: widget._id,
    settings: JSON.stringify(widget.settings || {}),
  });
}
