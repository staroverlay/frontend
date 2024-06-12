import { PropsWithChildren, useEffect, useState } from 'react';

import Loading from '@/components/layout/loading';
import useAuth from '@/hooks/useAuth';
import { getAcquisitions } from '@/services/acquisition';
import Acquisition from '@/services/acquisition/acquisition';

import { AcquisitionsContext } from './acquisitions-context';

export function AcquisitionsProvider({ children }: PropsWithChildren) {
  const { user } = useAuth();
  const [acquisitions, setAcquisitions] = useState<Acquisition[]>([]);
  const [fetched, setFetched] = useState(false);

  const addAcquisition = (ac: Acquisition) => {
    setAcquisitions([...acquisitions, ac]);
  };

  const isAcquired = (productType: string, productId: string) => {
    return acquisitions.some(
      (ac) => ac.productType === productType && ac.productId === productId,
    );
  };

  useEffect(() => {
    const fetchIntegrations = async () => {
      const newAccs = await getAcquisitions();
      setAcquisitions(newAccs || []);
      setFetched(true);
    };

    if (user) {
      fetchIntegrations();
    } else if (!fetched) {
      setFetched(true);
    }
  }, [user, fetched]);

  return (
    <AcquisitionsContext.Provider
      value={{
        acquisitions,
        addAcquisition,
        isAcquired,
      }}
    >
      <Loading loaded={fetched} message={'Loading acquisitions'}>
        {children}
      </Loading>
    </AcquisitionsContext.Provider>
  );
}
