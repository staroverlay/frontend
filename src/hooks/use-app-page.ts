import { useState, useEffect } from 'react';
import { appsService } from '../services/apps-service';

export function useAppPage(appId: string) {
  const [page, setPage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!appId) return;

    let isMounted = true;

    const loadPage = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await appsService.getAppPage(appId);
        if (isMounted) {
          setPage(data);
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err as Error);
          setIsLoading(false);
        }
      }
    };

    loadPage();

    return () => {
      isMounted = false;
    };
  }, [appId]);

  return [page, isLoading, error] as const;
}
