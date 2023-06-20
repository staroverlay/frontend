import { mutation } from "astraql";

const CreateMediaMutation = mutation`
    createMedia($payload: CreateMediaDTO!) {
        createMedia(payload: $payload) {
            _id
            name
            resourceId
            size
            type
            uploadId
        }
    }
`;

export default CreateMediaMutation;
