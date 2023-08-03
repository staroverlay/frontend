import { mutation } from "astraql";

const RemoveIntegrationMutation = mutation`
    removeIntegration($id: String!) {
        removeIntegration(id: $id)
    }
`;

export default RemoveIntegrationMutation;
