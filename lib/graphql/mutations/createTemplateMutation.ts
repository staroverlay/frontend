import { mutation } from 'astraql';

const CreateTemplateMutation = mutation`
    createTemplate($payload: CreateTemplateDTO!) {
        createTemplate(payload: $payload) {
            _id
            author {
                id
                username
                avatar
            }
            name
            description
            storeDescription
            thumbnail
            thumbnailResourceId
            price
            scopes
            service
            html
            fields
            visibility
            version
        }
    }
`;

export default CreateTemplateMutation;
