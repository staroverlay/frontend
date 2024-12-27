import { mutation } from 'astraql';

const CreateTemplateMutation = mutation`
    createTemplate($payload: CreateTemplateDTO!) {
        createTemplate(payload: $payload) {
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

export default CreateTemplateMutation;
