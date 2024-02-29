import { PropsWithChildren, useEffect, useState } from 'react';

import Loading from '@/components/layout/loading';
import { getMyMembership } from '@/services/memberships';
import IMembership from '@/services/memberships/membership';

import { MembershipContext } from './membership-context';

export function MembershipProvider({ children }: PropsWithChildren) {
  const [membership, setMembership] = useState<IMembership | null>(null);
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
