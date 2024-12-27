import { mutation } from 'astraql';

const CreateUserMutation = mutation`
    createUser($payload: CreateUserDTO!) {
        createUser(payload: $payload) {
            _id
            email
            isCreator
            isEmailVerified
            createdAt
            updatedAt
        }
    }
`;

export default CreateUserMutation;
