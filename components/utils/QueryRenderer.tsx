import { GraphQLRequest } from 'astraql';
import { ReactNode, useEffect, useState } from 'react';

import IDictionary from '@/lib/interfaces/shared/IDictionary';

import client from '../../lib/graphql/client';

export interface QueryRendererProps {
  query: GraphQLRequest;
  variables?: IDictionary | null;
  onRender: (data: IDictionary) => ReactNode | null;
  onError?: (error: Error) => ReactNode | null;
  onLoading?: () => ReactNode | null;
}

export default function QueryRenderer({
  query,
  variables,
  onRender,
  onError,
  onLoading,
}: QueryRendererProps) {
  const [data, setData] = useState<any | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    client
      .fetch(query, variables || {})
      .then(setData)
      .catch(setError);
  }, [query, variables]);

  if (data && !error) {
    return onRender(data);
  } else if (error) {
    return onError ? onError(error) : null;
  } else {
    return onLoading ? onLoading() : null;
  }
}
