import { mutation } from 'astraql';

const CreateUserWithTwitchMutation = mutation`
    createUserWithTwitch($code: String!) {
        createUserWithTwitch(code: $code) {
            _id
            email
            isCreator
            isEmailVerified
            createdAt
            updatedAt
        }
    }
`;

export default CreateUserWithTwitchMutation;
