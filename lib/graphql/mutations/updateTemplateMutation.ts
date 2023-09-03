import { mutation } from 'astraql';

const UpdateTemplateMutation = mutation`
    updateTemplate($id: String!, $payload: UpdateTemplateDTO!) {
        updateTemplate(id: $id, payload: $payload) {
            _id
            author
            name
            description
            scopes
            service
            html
            fields
            visibility
        }
    }
`;

export default UpdateTemplateMutation;
