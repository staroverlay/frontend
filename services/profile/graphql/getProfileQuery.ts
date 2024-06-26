import { query } from 'astraql';

const GetProfileQuery = query`
    getProfile($id: String!) {
        getProfile(id: $id) {
            _id
            avatar
            displayName
            roles
        }
    }
`;

export default GetProfileQuery;
