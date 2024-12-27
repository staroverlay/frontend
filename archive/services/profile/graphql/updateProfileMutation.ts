import { mutation } from 'astraql';

const UpdateProfileMutation = mutation`
    updateProfile($payload: UpdateProfileDTO!) {
        updateProfile(payload: $payload) {
            _id
            avatar
            displayName
            roles
        }
    }
`;

export default UpdateProfileMutation;
