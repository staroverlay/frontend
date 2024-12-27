import { Membership } from '@staroverlay/sdk';

import client from '@/lib/clients/graphql';
import GetMyMembershipQuery from './graphql/getMyMembershipQuery';

export async function getMyMembership(): Promise<Membership | null> {
  const membership = await client.fetch(GetMyMembershipQuery);
  return membership as Membership | null;
}
