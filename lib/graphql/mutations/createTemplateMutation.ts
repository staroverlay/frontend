import { mutation } from "astraql";

const CreateTemplateMutation = mutation`
    createTemplate($payload: CreateTemplateDTO!) {
        createTemplate(payload: $payload) {
            _id
            author
            name
            description
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
