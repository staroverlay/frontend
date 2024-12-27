import { query } from 'astraql';

const GetTemplateByIDQuery = query`
    getTemplateById($id: String!) {
        getTemplateById(id: $id) {
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

export default GetTemplateByIDQuery;
