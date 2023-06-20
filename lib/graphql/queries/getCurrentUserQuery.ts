import { query } from "astraql";

const getCurrentUserQuery = query`
    getCurrentUser {
        getCurrentUser {
            id
            username
            avatar
        }
    }
`;

export default getCurrentUserQuery;
