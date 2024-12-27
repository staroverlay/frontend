import { mutation } from 'astraql';

const PostTemplateVersionMutation = mutation`
    postTemplateVersion($id: String!, $payload: PostTemplateVersionDTO!) {
        postTemplateVersion(id: $id, payload: $payload) {
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
    }
`;

export default PostTemplateVersionMutation;
