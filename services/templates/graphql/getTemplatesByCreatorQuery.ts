import { query } from 'astraql';

const GetTemplatesByCreatorQuery = query`
    getTemplatesByCreator($creatorId: String!) {
        getTemplatesByCreator(creatorId: $creatorId) {
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

export default GetTemplatesByCreatorQuery;
