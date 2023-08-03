import { query } from "astraql";

const GetMyMembershipQuery = query`
    getMyMembership {
        getMyMembership {
            _id
            planId
            startDate
            endDate
        }
    }
`;

export default GetMyMembershipQuery;
