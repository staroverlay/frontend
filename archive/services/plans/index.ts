import { Plan } from '@staroverlay/sdk';

import client from '@/lib/clients/graphql';
import GetPlansQuery from './graphql/getPlansQuery';

export async function getPlans(): Promise<Plan[]> {
  const plans = await client.fetch(GetPlansQuery);
  return plans as Plan[];
}
