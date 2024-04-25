import { mutation } from 'astraql';

const SyncProfileWithIntegrationMutation = mutation`
    syncProfileWithIntegration($id: String!) {
        syncProfileWithIntegration(id: $id) {
            _id
            avatar
            displayName
            roles
        }
    }
`;

export default SyncProfileWithIntegrationMutation;
