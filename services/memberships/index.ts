import client from '@/lib/clients/graphql';

import GetMyMembershipQuery from './graphql/getMyMembershipQuery';
import IMembership from './membership';

export async function getMyMembership(): Promise<IMembership | null> {
  const membership = await client.fetch(GetMyMembershipQuery);
  return membership as IMembership | null;
}
