import { query } from "astraql";

const GetUserIntegrationsQuery = query`
    getUserIntegrations {
        getUserIntegrations {
            _id
            avatar
            integrationId
            username
            type
        }
    }
`;

export default GetUserIntegrationsQuery;
