import { mutation } from 'astraql';

const UpdateUserMutation = mutation`
    updateUser($payload: UpdateUserDTO!) {
        updateUser(payload: $payload) {
            _id
            avatar
            email
            isCreator
            isEmailVerified
            username
            createdAt
            updatedAt
        }
    }
`;

export default UpdateUserMutation;
