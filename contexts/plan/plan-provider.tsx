import { PropsWithChildren, useEffect, useState } from 'react';

import Loading from '@/components/layout/loading';
import useMembership from '@/hooks/useMembership';
import { getPlans } from '@/services/plans';
import IPlan from '@/services/plans/plan';

import { PlanContext } from './plan-context';

export function PlanProvider({ children }: PropsWithChildren) {
  const { membership } = useMembership();

  const [plans, setPlans] = useState<IPlan[]>([]);
  const [fetched, setFetched] = useState(false);

  const defaultPlan = plans.find((plan) => plan.isDefault) as IPlan;
  const activePlan = membership
    ? (plans.find((plan) => plan._id == membership.planId) as IPlan)
    : defaultPlan;

  useEffect(() => {
    setFetched(true);
  }, [plans]);

  useEffect(() => {
    if (!fetched) {
      getPlans().then(setPlans);
    }
  }, [fetched]);

  return (
    <PlanContext.Provider
      value={{
        activePlan,
        defaultPlan,
        plans,
      }}
    >
      <Loading loaded={fetched} message={'Loading plans'}>
        {children}
      </Loading>
    </PlanContext.Provider>
  );
}
