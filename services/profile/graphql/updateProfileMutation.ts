import { query } from 'astraql';

const UpdateProfileMutation = query`
    updateProfile($payload: UpdateProfileDTO!) {
        updateProfile(payload: $payload) {
            _id
            avatar
            displayName
            roles
            userId
        }
    }
`;

export default UpdateProfileMutation;
