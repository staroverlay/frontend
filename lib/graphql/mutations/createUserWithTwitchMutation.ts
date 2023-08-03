import { mutation } from "astraql";

const CreateUserWithTwitchMutation = mutation`
    createUserWithTwitch($code: String!) {
        createUserWithTwitch(code: $code) {
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

export default CreateUserWithTwitchMutation;
