import client from '../../lib/clients/graphql';
import IWidget from '../widgets/widget';
import EmitDebugEventMutation from './graphql/emitDebugEventMutation';
import EmitSettingsUpdateMutation from './graphql/emitSettingsUpdateMutation';

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
