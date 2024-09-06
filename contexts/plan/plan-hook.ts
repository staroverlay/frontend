import { Plan } from '@staroverlay/sdk';

export interface PlanHook {
  plans: Plan[];
  defaultPlan: Plan;
  activePlan: Plan;
}
