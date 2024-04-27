import { query } from 'astraql';

const GetTemplateVersionQuery = query`
    getTemplateVersion($id: String!) {
        getTemplateVersion(id: $id) {
            _id
            templateId
            html
            scopes
            version
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
        }
    }
`;

export default GetTemplateVersionQuery;
