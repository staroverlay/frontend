import { PropsWithChildren, useEffect, useState } from 'react';

import IMembership from '@/lib/interfaces/membership';
import { getMyMembership } from '@/lib/services/membership-service';
import { MembershipContext } from './membership-context';
import Loading from '@/components/layout/loading';

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
