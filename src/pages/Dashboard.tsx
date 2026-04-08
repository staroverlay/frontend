import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/use-auth';
import { useProfile } from '../hooks/use-profile';
import { Skeleton } from '../components/ui/skeleton';
import { useSubscriptionStore } from '../stores/subscription-store';
import { widgetsService } from '../services/widgets-service';
import { appsService, type AppManifest } from '../services/apps-service';
import { integrationsService } from '../services/integrations-service';
import { UploadsService } from '../services/uploads.service';
import type { Widget, Integration } from '../lib/types';
import { DashboardBanner } from '../components/dashboard/DashboardBanner';
import { DashboardStats } from '../components/dashboard/DashboardStats';
import { DashboardRecentApps } from '../components/dashboard/DashboardRecentApps';
import { DashboardRecentWidgets } from '../components/dashboard/DashboardRecentWidgets';

export default function Dashboard() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { profile, isLoading: isProfileLoading } = useProfile();
  const { getPlan, isLoading: isPlanLoading } = useSubscriptionStore();
  const plan = getPlan();

  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [apps, setApps] = useState<AppManifest[]>([]);
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [uploadsCount, setUploadsCount] = useState(0);
  const [isDataLoading, setIsDataLoading] = useState(true);

  const fetchDashboardData = async () => {
    setIsDataLoading(true);
    try {
      const [w, a, i, u] = await Promise.all([
        widgetsService.listWidgets().catch(() => []),
        appsService.getApps().catch(() => []),
        integrationsService.listIntegrations().catch(() => []),
        UploadsService.listUploads().catch(() => ({ uploads: [] }))
      ]);
      setWidgets(w || []);
      setApps(a || []);
      setIntegrations(i || []);
      setUploadsCount(u?.uploads?.length || 0);
    } catch (e) {
      console.error(e);
    } finally {
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const isLoading = isAuthLoading || (isProfileLoading && !profile) || isPlanLoading || isDataLoading;

  if (isLoading) {
    return (
      <div className="space-y-12 animate-in fade-in duration-700">
        <Skeleton className="h-12 w-full bg-surface-panel rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-44 w-full rounded-3xl bg-surface-panel" />
          ))}
        </div>
        <Skeleton className="h-44 w-full rounded-3xl bg-surface-panel" />
      </div>
    );
  }

  const widgetLimit = plan?.limits?.widgets || 10;
  const filesLimit = plan?.limits?.files || 10;
  const editorsLimit = plan?.limits?.editors || 0;

  const recentApps = apps.slice(0, 5);
  const recentWidgets = [...widgets].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 4);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <DashboardBanner planName={plan?.name} profile={profile} user={user} />

      <DashboardStats
        widgetsCount={widgets.length}
        widgetLimit={widgetLimit}
        uploadsCount={uploadsCount}
        filesLimit={filesLimit}
        integrationsCount={integrations.length}
        editorsLimit={editorsLimit}
      />

      <DashboardRecentApps apps={recentApps} />

      <DashboardRecentWidgets widgets={recentWidgets} onDelete={fetchDashboardData} />
    </div>
  );
}
