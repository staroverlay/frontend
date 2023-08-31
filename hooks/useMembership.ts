import { useContext } from "react";

import { MembershipContext } from "@/contexts/membership";

const useMembership = () => useContext(MembershipContext);

export default useMembership;
