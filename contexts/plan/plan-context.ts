import IPlan from "@/lib/interfaces/plan";
import React from "react";
import { PlanHook } from "./plan-hook";

const DUMMY_PLAN: IPlan = {
  _id: "",
  discountYearly: 0,
  isDefault: false,
  maxEditors: 0,
  maxStorageItems: 0,
  maxStorageSize: 0,
  maxWidgets: 0,
  name: "",
  perkDesignLibrary: false,
  perkModChat: false,
  price: 0,
};

export const PlanContext = React.createContext<PlanHook>({
  activePlan: DUMMY_PLAN,
  defaultPlan: DUMMY_PLAN,
  plans: [],
});
