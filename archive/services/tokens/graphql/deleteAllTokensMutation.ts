import { mutation } from 'astraql';

const DeleteAllTokensMutation = mutation`
    deleteAllTokens {
        deleteAllTokens
    }
`;

export default DeleteAllTokensMutation;
