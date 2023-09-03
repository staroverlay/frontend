import { useContext } from 'react';

import { PlanContext } from '@/contexts/plan/plan-context';

const usePlan = () => useContext(PlanContext);

export default usePlan;
