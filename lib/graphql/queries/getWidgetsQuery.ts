import { query } from "astraql";

const GetWidgetsQuery = query`
    getWidgets {
        getWidgets {
            _id
            displayName
            userId
            enabled
            token
            templateId
            templateRaw
            settings
        }
    }
`;

export default GetWidgetsQuery;
