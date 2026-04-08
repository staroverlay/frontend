import { Link } from 'react-router-dom';
import { AppWindow, ArrowRight, Layers } from 'lucide-react';
import type { AppManifest } from '../../services/apps-service';

export const DashboardRecentApps = ({ apps }: { apps: AppManifest[] }) => {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2 text-content-secondary">
                    <AppWindow className="w-5 h-5 text-brand-primary" />
                    <h3 className="font-bold">Last Apps <span className="text-content-dimmed text-sm font-normal">from Explore</span></h3>
                </div>
                <Link to="/apps" className="text-xs font-bold text-brand-primary hover:text-brand-accent flex items-center gap-1 transition-colors">
                    View All <ArrowRight className="w-3 h-3" />
                </Link>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 px-1 custom-scrollbar snap-x">
                {apps.map(app => (
                    <Link key={app.id} to={`/apps/${app.id}`} className="snap-start shrink-0 w-72 bg-surface-card border border-border-subtle rounded-2xl p-4 hover:border-brand-primary/30 hover:bg-surface-panel transition-all flex items-start gap-4 group">
                        <div className="w-12 h-12 rounded-xl bg-surface-base flex shrink-0 items-center justify-center p-2 group-hover:scale-110 transition-transform">
                            <img src={import.meta.env.VITE_APP_WIDGET_SERVER ? `${import.meta.env.VITE_APP_WIDGET_SERVER}/apps/${app.id}/icon.png` : `http://localhost:4000/apps/${app.id}/icon.png`} alt="" className="w-full h-full object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.classList.remove('hidden'); }} />
                            <Layers className="w-6 h-6 text-content-dimmed hidden" />
                        </div>
                        <div>
                            <h4 className="text-content-secondary font-bold text-sm truncate">{app.name}</h4>
                            <p className="text-content-dimmed text-xs mt-1 line-clamp-2">{app.description}</p>
                        </div>
                    </Link>
                ))}
                {apps.length === 0 && (
                    <div className="text-content-dimmed text-sm py-4 w-full text-center border rounded-2xl border-dashed border-border-default">No apps available in explore.</div>
                )}
            </div>
        </div>
    );
};
