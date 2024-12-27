import { query } from 'astraql';

const GetMyTokensQuery = query`
    getMyTokens {
        getMyTokens {
            _id
            name
            createdAt
            updatedAt
        }
    }
`;

export default GetMyTokensQuery;
