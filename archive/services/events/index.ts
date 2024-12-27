import { Widget } from '@staroverlay/sdk';

import client from '@/lib/clients/graphql';
import EmitDebugEventMutation from './graphql/emitDebugEventMutation';

export async function emitDebugEvent(widget: Widget, eventName: string) {
  await client.fetch(EmitDebugEventMutation, {
    widgetId: widget._id,
    eventName,
  });
}
