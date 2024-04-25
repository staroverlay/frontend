import { mutation } from 'astraql';

const UpdateTemplateMutation = mutation`
    updateTemplate($id: String!, $payload: UpdateTemplateDTO!) {
        updateTemplate(id: $id, payload: $payload) {
            _id
            creatorId
            description
            lastVersion
            lastVersionId
            name
            price
            service
            storeDescription
            thumbnail
            visibility
        }
    }
`;

export default UpdateTemplateMutation;
