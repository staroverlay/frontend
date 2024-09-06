import { mutation } from 'astraql';

const CreateTokenMutation = mutation`
    createToken($payload: CreateTokenDTO!) {
        createToken(payload: $payload)
    }
`;

export default CreateTokenMutation;
