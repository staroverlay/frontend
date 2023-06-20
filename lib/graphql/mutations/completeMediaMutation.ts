import { mutation } from "astraql";

const CompleteMediaMutation = mutation`
    completeMedia($payload: CompleteMediaDTO!) {
        completeMedia(payload: $payload) {
            _id
            name
            resourceId
            size
            type
            uploadId
        }
    }
`;

export default CompleteMediaMutation;
