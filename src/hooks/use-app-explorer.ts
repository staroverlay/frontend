import { useEffect, useMemo } from 'react';

import { useAppsStore } from '../stores/apps-store';

export interface AppExplorerFilters {
  category?: string;
  search?: string;
  compatibleWith?: string;
}

export function useAppExplorer(filters?: AppExplorerFilters) {
  const { apps, isLoading, error, fetchApps } = useAppsStore();

  useEffect(() => {
    fetchApps();
  }, [fetchApps]);

  const filteredApps = useMemo(() => {
    return apps.filter((app) => {
      if (filters?.category && app.category !== filters.category) return false;
      if (filters?.search && !app.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters?.compatibleWith && !app.compatible_with.includes(filters.compatibleWith)) return false;
      return true;
    });
  }, [apps, filters]);

  return {
    apps: filteredApps,
    isLoading,
    error,
  };
}
