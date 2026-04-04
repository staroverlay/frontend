import { Link } from 'react-router-dom';
import { AppWindow, ArrowRight, Layers } from 'lucide-react';
import type { AppManifest } from '../../services/apps-service';

export const DashboardRecentApps = ({ apps }: { apps: AppManifest[] }) => {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2 text-zinc-300">
                    <AppWindow className="w-5 h-5 text-violet-400" />
                    <h3 className="font-bold">Last Apps <span className="text-zinc-500 text-sm font-normal">from Explore</span></h3>
                </div>
                <Link to="/apps" className="text-xs font-bold text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors">
                    View All <ArrowRight className="w-3 h-3" />
                </Link>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 px-1 custom-scrollbar snap-x">
                {apps.map(app => (
                    <Link key={app.id} to={`/apps/${app.id}`} className="snap-start shrink-0 w-72 bg-zinc-900/40 border border-white/5 rounded-2xl p-4 hover:border-violet-500/30 hover:bg-zinc-900/80 transition-all flex items-start gap-4 group">
                        <div className="w-12 h-12 rounded-xl bg-zinc-950 flex shrink-0 items-center justify-center p-2 group-hover:scale-110 transition-transform">
                            <img src={import.meta.env.VITE_APP_WIDGET_SERVER ? `${import.meta.env.VITE_APP_WIDGET_SERVER}/apps/${app.id}/icon.png` : `http://localhost:4000/apps/${app.id}/icon.png`} alt="" className="w-full h-full object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.classList.remove('hidden'); }} />
                            <Layers className="w-6 h-6 text-zinc-700 hidden" />
                        </div>
                        <div>
                            <h4 className="text-zinc-200 font-bold text-sm truncate">{app.name}</h4>
                            <p className="text-zinc-500 text-xs mt-1 line-clamp-2">{app.description}</p>
                        </div>
                    </Link>
                ))}
                {apps.length === 0 && (
                    <div className="text-zinc-500 text-sm py-4 w-full text-center border rounded-2xl border-dashed border-white/10">No apps available in explore.</div>
                )}
            </div>
        </div>
    );
};
