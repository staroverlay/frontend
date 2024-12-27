import { mutation } from 'astraql';

const ResetWidgetTokenMutation = mutation`
    resetWidgetToken($id: String!) {
        resetWidgetToken(id: $id) {
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

export default ResetWidgetTokenMutation;
