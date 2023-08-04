import { mutation } from "astraql";

const SyncProfileWithIntegrationMutation = mutation`
    syncProfileWithIntegration($id: String!) {
        syncProfileWithIntegration(id: $id) {
            _id
            username
            avatar
            email
            isCreator
            isEmailVerified
            createdAt
            updatedAt
        }
    }
`;

export default SyncProfileWithIntegrationMutation;
