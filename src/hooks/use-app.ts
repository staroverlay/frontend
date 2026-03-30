import { useState, useEffect } from 'react';
import { appsService, type AppManifest } from '../services/apps-service';

export function useApp(appId: string) {
  const [app, setApp] = useState<AppManifest | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!appId) return;

    let isMounted = true;

    const loadApp = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await appsService.getApp(appId);
        if (isMounted) {
          setApp(data);
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err as Error);
          setIsLoading(false);
        }
      }
    };

    loadApp();

    return () => {
      isMounted = false;
    };
  }, [appId]);

  return [app, isLoading, error] as const;
}
