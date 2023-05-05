import { query } from "astraql";

const getCurrentUserQuery = query`
    getCurrentUser {
        getCurrentUser {
            id
            username
            avatar
            role
        }
    }
`;

export default getCurrentUserQuery;
