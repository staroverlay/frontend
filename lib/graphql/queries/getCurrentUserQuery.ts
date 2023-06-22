import { query } from "astraql";

const getCurrentUserQuery = query`
    getCurrentUser {
        getCurrentUser {
            id
            avatar
            isCreator
            email
            username
        }
    }
`;

export default getCurrentUserQuery;
