import { query } from 'astraql';

const GetMyProfileQuery = query`
    getMyProfile {
        getMyProfile {
            _id
            avatar
            displayName
            roles
        }
    }
`;

export default GetMyProfileQuery;
