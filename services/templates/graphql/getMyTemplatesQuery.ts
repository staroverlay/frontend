import { query } from 'astraql';

const GetMyTemplatesQuery = query`
    getMyTemplates {
        getMyTemplates {
            _id
            creatorId
            description
            lastVersion
            lastVersionId
            name
            price
            service
            storeDescription
            thumbnail
            visibility
        }
    }
`;

export default GetMyTemplatesQuery;
