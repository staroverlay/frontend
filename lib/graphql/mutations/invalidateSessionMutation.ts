import { mutation } from "astraql";

const InvalidateSessionMutation = mutation`
    invalidateSession {
        invalidateSession
    }
`;

export default InvalidateSessionMutation;
