import client from '../../lib/clients/graphql';
import IWidget from '../widgets/widget';
import EmitDebugEventMutation from './graphql/emitDebugEventMutation';

export async function emitDebugEvent(widget: IWidget, eventName: string) {
  await client.fetch(EmitDebugEventMutation, {
    widgetId: widget._id,
    eventName,
  });
}
