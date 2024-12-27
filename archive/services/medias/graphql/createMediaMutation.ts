import { mutation } from 'astraql';

const CreateMediaMutation = mutation`
    createMedia($payload: CreateMediaDTO!) {
        createMedia(payload: $payload) {
            _id
            name
            size
            type
            uploadId
            thumbnailUploadId
        }
    }
`;

export default CreateMediaMutation;
