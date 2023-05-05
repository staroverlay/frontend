import { mutation } from "astraql";

const CreateSessionMutation = mutation`
    login($access_token: String!, $refresh_token: String!) {
        login(access_token: $access_token, refresh_token: $refresh_token) {
            session {
                token
            }
            user {
                id
                username
                avatar
                role
            }
        }
    }
`;

export default CreateSessionMutation;
