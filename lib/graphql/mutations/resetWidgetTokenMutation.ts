import { mutation } from 'astraql';

const ResetWidgetTokenMutation = mutation`
    resetWidgetToken($id: String!) {
        resetWidgetToken(id: $id) {
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

export default ResetWidgetTokenMutation;
