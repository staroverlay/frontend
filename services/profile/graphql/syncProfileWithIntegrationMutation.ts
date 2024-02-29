import { mutation } from 'astraql';

const SyncProfileWithIntegrationMutation = mutation`
    syncProfileWithIntegration($id: String!) {
        syncProfileWithIntegration(id: $id) {
            _id
            avatar
            displayName
            roles
            userId
        }
    }
`;

export default SyncProfileWithIntegrationMutation;
