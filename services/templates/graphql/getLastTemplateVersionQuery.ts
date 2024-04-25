import { query } from 'astraql';

const GetLastTemplateVersionQuery = query`
    getLastTemplateVersion($id: String!) {
        getLastTemplateVersion(id: $id) {
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

export default GetLastTemplateVersionQuery;
