import { mutation } from 'astraql';

const CreateUserMutation = mutation`
    createUser($payload: CreateUserDTO!) {
        createUser(payload: $payload) {
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

export default CreateUserMutation;
