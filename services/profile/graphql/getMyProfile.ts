import { query } from 'astraql';

const GetMyProfileQuery = query`
    getMyProfile($id: String!) {
        getMyProfile(id: $id) {
            _id
            avatar
            displayName
            roles
            userId
        }
    }
`;

export default GetMyProfileQuery;
