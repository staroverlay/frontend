import { GraphQLRequest } from 'astraql';
import { useEffect, useState } from 'react';

import client from '@/lib/clients/graphql';
import IDictionary from '@/lib/IDictionary';

type UseQueryHook<T> = {
  data: T | null;
  error: Error | null;
  loading: boolean;
};

const useQuery = <T>(
  request: GraphQLRequest,
  variables?: IDictionary,
): UseQueryHook<T> => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    client
      .fetch(request, variables)
      .then((data) => setData(data as T))
      .catch(setError)
      .finally(() => setLoading(false));
  }, [request, variables]);

  return {
    data,
    error,
    loading,
  };
};

export default useQuery;
