import { Link } from 'react-router-dom';
import type { AppManifest } from '../../services/apps-service';

interface AppCardProps {
  app: AppManifest;
  onInstall: (app: AppManifest) => void;
}

export function AppCard({ app, onInstall }: AppCardProps) {
  const WIDGET_SERVER = import.meta.env.VITE_APP_WIDGET_SERVER || 'http://localhost:4000';

  return (
    <div
      className="group relative flex flex-col rounded-3xl bg-zinc-900/40 border border-white/5 overflow-hidden hover:bg-zinc-800/60 hover:border-violet-500/30 transition-all duration-300 shadow-lg shadow-black/20"
    >
      <Link to={`/apps/${app.id}`} className="absolute inset-0 z-0" />

      {/* Thumbnail Header */}
      <div className="h-50 w-full bg-zinc-950 relative overflow-hidden border-b border-white/5 z-0 pointer-events-none">
        <img
          src={`${WIDGET_SERVER}/${app.id}/meta/thumbnail.jpg`}
          alt={`${app.name} thumbnail`}
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
          loading="lazy"
        />

        <div className="absolute top-4 left-4">
          <div className="bg-zinc-950/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-1.5 shadow-xl">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
            <span className="text-[10px] font-black text-zinc-200 uppercase tracking-widest">{app.version}</span>
          </div>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-6 relative z-10 flex flex-col flex-1 pointer-events-none">
        <h3 className="text-xl font-black text-white mb-2 group-hover:text-violet-200 transition-colors line-clamp-1">{app.name}</h3>
        <p className="text-zinc-400 text-sm leading-relaxed line-clamp-2 flex-1 mb-6">
          {app.description}
        </p>

        <div className="flex justify-between items-center mt-auto pointer-events-auto">
          <div className="flex gap-1.5 flex-wrap">
            {app.compatible_with?.slice(0, 2).map((platform) => (
              <span key={platform} className="text-[8px] font-black uppercase tracking-widest bg-violet-500/5 text-violet-500/60 px-2 py-0.5 rounded border border-violet-500/10">
                {platform === 'twitch' ? 'Twitch' : platform === 'kick' ? 'Kick' : platform === 'youtube' ? 'YouTube' : platform}
              </span>
            ))}
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onInstall(app);
            }}
            className="px-4 py-1.5 bg-violet-600 hover:bg-violet-500 text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg shadow-violet-600/20 transition-all active:scale-95"
          >
            Install
          </button>
        </div>
      </div>
    </div>
  );
}
