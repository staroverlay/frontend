import { Membership } from '@staroverlay/sdk';
import { PropsWithChildren, useEffect, useState } from 'react';

import Loading from '@/components/layout/loading';
import { getMyMembership } from '@/services/memberships';

import { MembershipContext } from './membership-context';

export function MembershipProvider({ children }: PropsWithChildren) {
  const [membership, setMembership] = useState<Membership | null>(null);
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    setFetched(true);
  }, [membership]);

  useEffect(() => {
    if (!fetched) {
      getMyMembership().then(setMembership);
    }
  }, [fetched]);

  return (
    <MembershipContext.Provider value={{ membership }}>
      <Loading loaded={fetched} message={'Loading membership'}>
        {children}
      </Loading>
    </MembershipContext.Provider>
  );
}
