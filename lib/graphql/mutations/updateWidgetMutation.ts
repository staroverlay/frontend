import { mutation } from 'astraql';

const UpdateWidgetMutation = mutation`
    updateWidget($id: String!, $payload: UpdateWidgetDTO!) {
        updateWidget(id: $id, payload: $payload) {
            _id
            displayName
            userId
            enabled
            token
            templateId
            templateRaw
            scopes
            settings
        }
    }
`;

export default UpdateWidgetMutation;
