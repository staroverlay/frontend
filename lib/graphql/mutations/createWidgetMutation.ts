import { mutation } from 'astraql';

const CreateWidgetMutation = mutation`
    createWidget($payload: CreateWidgetDTO!) {
        createWidget(payload: $payload) {
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

export default CreateWidgetMutation;
