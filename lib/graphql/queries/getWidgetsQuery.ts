import { query } from "astraql";

const GetWidgetsQuery = query`
    getWidgets {
        getWidgets {
            _id
            displayName
            userId
            enabled
            token
            template
            html
            scopes
            settings
        }
    }
`;

export default GetWidgetsQuery;
