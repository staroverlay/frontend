import { query } from 'astraql';

const getCurrentUserQuery = query`
    getCurrentUser {
        getCurrentUser {
            _id
            email
            isCreator
            isEmailVerified
            profileId
            createdAt
            updatedAt
        }
    }
`;

export default getCurrentUserQuery;
