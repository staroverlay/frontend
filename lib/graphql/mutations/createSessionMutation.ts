import { mutation } from 'astraql';

const CreateSessionMutation = mutation`
    createSession($payload: CreateSessionDTO!) {
        createSession(payload: $payload) {
            session {
                _id
                token
            }
            user {
                _id
                username
                avatar
                email
                isCreator
                isEmailVerified
                createdAt
                updatedAt
            }
        }
    }
`;

export default CreateSessionMutation;
