import { mutation } from "astraql";

const CreateTwitchIntegrationMutation = mutation`
    createTwitchIntegration($code: String!) {
        createTwitchIntegration(code: $code) {
            _id
            avatar
            integrationId
            username
            type
        }
    }
`;

export default CreateTwitchIntegrationMutation;
