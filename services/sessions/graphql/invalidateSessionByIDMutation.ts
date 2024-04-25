import { mutation } from 'astraql';

const InvalidateSessionByIDMutation = mutation`
    invalidateSessionByID($id: String!) {
        invalidateSessionByID(id: $id)
    }
`;

export default InvalidateSessionByIDMutation;
