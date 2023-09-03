import { query } from 'astraql';

const getCurrentUserQuery = query`
    getCurrentUser {
        getCurrentUser {
            _id
            username
            avatar
            email
            isCreator
            isEmailVerified
            createdAt
            updatedAt
        }
    }
`;

export default getCurrentUserQuery;
