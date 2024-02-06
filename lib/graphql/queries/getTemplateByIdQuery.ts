import { query } from 'astraql';

const GetTemplateByIDQuery = query`
    getTemplateById($id: String!) {
        getTemplateById(id: $id) {
            _id
            author {
                id
                username
                avatar
            }
            name
            description
            scopes
            service
            html
            fields
            visibility
            version
        }
    }
`;

export default GetTemplateByIDQuery;
