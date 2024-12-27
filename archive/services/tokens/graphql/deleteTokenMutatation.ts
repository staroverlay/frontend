import { mutation } from 'astraql';

const DeleteTokenMutation = mutation`
    deleteToken($tokenId: String!) {
        deleteToken(tokenId: $tokenId)
    }
`;

export default DeleteTokenMutation;
