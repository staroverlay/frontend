import client from '../graphql/client';
import GetPlansQuery from '../graphql/queries/getPlansQuery';
import IPlan from '../interfaces/plan';

export async function getPlans(): Promise<IPlan[]> {
  const plans = await client.fetch(GetPlansQuery);
  return plans as IPlan[];
}
