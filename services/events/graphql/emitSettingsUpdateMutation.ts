import { mutation } from 'astraql';

const EmitSettingsUpdateMutation = mutation`
    emitSettingsUpdate($widgetId: String!, $settings: String!) {
        emitSettingsUpdate(widgetId: $widgetId, settings: $settings)
    }
`;

export default EmitSettingsUpdateMutation;
