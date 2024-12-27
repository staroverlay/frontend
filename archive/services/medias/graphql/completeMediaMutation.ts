import { mutation } from 'astraql';

const CompleteMediaMutation = mutation`
    completeMedia($payload: CompleteMediaDTO!) {
        completeMedia(payload: $payload) {
            _id
            name
            size
            type
            uploadId
        }
    }
`;

export default CompleteMediaMutation;
