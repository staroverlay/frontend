import { mutation } from 'astraql';

const UpdateTokenMutation = mutation`
    updateToken($tokenId: String!, $payload: UpdateTokenDTO!) {
        updateToken(tokenId: $tokenId, payload: $payload)
    }
`;

export default UpdateTokenMutation;
