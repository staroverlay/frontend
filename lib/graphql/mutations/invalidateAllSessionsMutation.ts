import { mutation } from 'astraql';

const InvalidateAllSessionsMutation = mutation`
    invalidateAllSessions {
        invalidateAllSessions
    }
`;

export default InvalidateAllSessionsMutation;
