import client from '@/lib/clients/graphql';

import GetPlansQuery from './graphql/getPlansQuery';
import IPlan from './plan';

export async function getPlans(): Promise<IPlan[]> {
  const plans = await client.fetch(GetPlansQuery);
  return plans as IPlan[];
}
