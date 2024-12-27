import { mutation } from 'astraql';

const CreateWidgetMutation = mutation`
    createWidget($payload: CreateWidgetDTO!) {
        createWidget(payload: $payload) {
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

export default CreateWidgetMutation;
