import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../hooks/use-app';
import { useAppPage } from '../hooks/use-app-page';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { InstallAppModal } from '../components/apps/InstallAppModal';
import { AppHeaderBanner } from '../components/apps/AppHeaderBanner';
import { AppSidebar } from '../components/apps/AppSidebar';
import { AppContent } from '../components/apps/AppContent';

export default function AppDetails() {
  const { id } = useParams<{ id: string }>();
  const [app, isAppLoading, appError] = useApp(id || '');
  const [page, isPageLoading, pageError] = useAppPage(id || '');

  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  if (isAppLoading || isPageLoading || !id) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
        <p className="text-zinc-500 font-medium">Loading application...</p>
      </div>
    );
  }

  if (appError || pageError || !app) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8 max-w-xl mx-auto text-center bg-red-500/5 border border-red-500/10 rounded-3xl">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-red-200 mb-2">Failed to load application</h2>
        <p className="text-red-400/80 mb-6">{appError?.message || pageError?.message || 'Application not found'}</p>
        <Link to="/apps" className="px-6 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl transition-colors font-medium">
          Return to Explorer
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto w-full pb-20 animate-in fade-in duration-500">
      <Link to="/apps" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-8 group">
        <div className="p-2 border border-white/10 rounded-xl bg-zinc-900/50 group-hover:bg-zinc-800 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </div>
        <span className="font-semibold text-sm">Back to Apps</span>
      </Link>

      <AppHeaderBanner app={app} id={id} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <AppContent page={page} />
        <AppSidebar app={app} id={id} onInstall={() => setIsInstallModalOpen(true)} />
      </div>

      <InstallAppModal
        app={app}
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />
    </div>
  );
}
