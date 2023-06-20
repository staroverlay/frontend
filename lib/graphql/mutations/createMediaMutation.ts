import { mutation } from "astraql";

const CreateMediaMutation = mutation`
    createMedia($payload: CreateMediaDTO!) {
        createMedia(payload: $CreateMediaDTO) {
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
