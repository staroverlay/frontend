import { mutation } from 'astraql';

const CreateSessionWithTwitchMutation = mutation`
    createSessionWithTwitch($code: String!) {
        createSessionWithTwitch(code: $code) {
            session {
                _id
                token
            }
            user {
                _id
                email
                isCreator
                isEmailVerified
                createdAt
                updatedAt
            }
        }
    }
`;

export default CreateSessionWithTwitchMutation;
