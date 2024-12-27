import { mutation } from 'astraql';

const UpdateWidgetMutation = mutation`
    updateWidget($id: String!, $payload: UpdateWidgetDTO!) {
        updateWidget(id: $id, payload: $payload) {
            _id
            autoUpdate
            displayName
            enabled
            service
            scopes
            settings
            templateId
            templateVersion
            token
        }
    }
`;

export default UpdateWidgetMutation;
