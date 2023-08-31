import React from "react";
import { MembershipHook } from "./membership-hook";

export const MembershipContext = React.createContext<MembershipHook>({
  membership: null,
});
