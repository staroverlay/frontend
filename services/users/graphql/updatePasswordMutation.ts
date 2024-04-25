import { mutation } from 'astraql';

const UpdatePasswordMutation = mutation`
    updatePassword($payload: UpdatePasswordDTO!) {
        updatePassword(payload: $payload) {
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

export default UpdatePasswordMutation;
