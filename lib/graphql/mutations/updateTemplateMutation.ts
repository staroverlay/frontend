import { mutation } from 'astraql';

const UpdateTemplateMutation = mutation`
    updateTemplate($id: String!, $payload: UpdateTemplateDTO!) {
        updateTemplate(id: $id, payload: $payload) {
            _id
            author {
                id
                username
                avatar
            }
            name
            description
            storeDescription
            price
            thumbnail
            thumbnailResourceId
            scopes
            service
            html
            fields
            visibility
        }
    }
`;

export default UpdateTemplateMutation;
