import IPlan from '@/services/plans/plan';

export interface PlanHook {
  plans: IPlan[];
  defaultPlan: IPlan;
  activePlan: IPlan;
}
