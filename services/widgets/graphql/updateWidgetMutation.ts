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
            templateVersion {
                _id
                templateId
                fields {
                    id
                    label
                    children {
                        id
                        label
                        description
                        type
                        required
                        string {
                            minLength
                            maxLength
                            default
                        }
                        number {
                            min
                            max
                            rangeSteps
                            display
                            type
                            default
                        }
                        boolean {
                            display
                            default
                        }
                        map {
                            minItems
                            maxItems
                            key
                            value
                        }
                        array {
                            minItems
                            maxItems
                            type
                        }
                        enum {
                            options {
                                value
                                label
                            }
                            display
                            default
                        }
                    }
                }
                html
                scopes
                version
            }
            token
            userId
        }
    }
`;

export default UpdateWidgetMutation;
