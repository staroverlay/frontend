import { query } from 'astraql';

const GetTemplatesByAuthorQuery = query`
    getTemplatesByAuthor($authorId: String!) {
        getTemplatesByAuthor(authorId: $authorId) {
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

export default GetTemplatesByAuthorQuery;
