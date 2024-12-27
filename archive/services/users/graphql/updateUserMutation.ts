import { mutation } from 'astraql';

const UpdateUserMutation = mutation`
    updateUser($payload: UpdateUserDTO!) {
        updateUser(payload: $payload) {
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

export default UpdateUserMutation;
