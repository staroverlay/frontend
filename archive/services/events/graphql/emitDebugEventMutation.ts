import { mutation } from 'astraql';

const EmitDebugEventMutation = mutation`
    emitDebugEvent($widgetId: String!, $eventName: String!) {
        emitDebugEvent(widgetId: $widgetId, eventName: $eventName)
    }
`;

export default EmitDebugEventMutation;
