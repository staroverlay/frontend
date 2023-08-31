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
            templateVersion
            settings
        }
    }
`;

export default GetWidgetsQuery;
