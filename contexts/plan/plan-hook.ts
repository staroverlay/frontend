import IPlan from '@/lib/interfaces/plan';

export interface PlanHook {
  plans: IPlan[];
  defaultPlan: IPlan;
  activePlan: IPlan;
}
