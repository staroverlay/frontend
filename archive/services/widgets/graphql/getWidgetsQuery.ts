import { query } from 'astraql';

const GetWidgetsQuery = query`
    getWidgets {
        getWidgets {
            _id
            autoUpdate
            displayName
            enabled
            service
            scopes
            settings
            templateId
            templateVersion
            token
        }
    }
`;

export default GetWidgetsQuery;
