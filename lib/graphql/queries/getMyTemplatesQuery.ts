import { query } from 'astraql';

const GetMyTemplatesQuery = query`
    getMyTemplates {
        getMyTemplates {
            _id
            author {
                id
                username
                avatar
            }
            name
            description
            storeDescription
            price
            thumbnail
            thumbnailResourceId
            scopes
            service
            html
            fields
            visibility
            version
        }
    }
`;

export default GetMyTemplatesQuery;
