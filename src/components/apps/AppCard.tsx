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
      className="group relative flex flex-col rounded-3xl bg-surface-card border border-border-subtle overflow-hidden hover:bg-surface-panel hover:border-brand-primary/30 transition-all duration-300 shadow-premium"
    >
      <Link to={`/apps/${app.id}`} className="absolute inset-0 z-0" />

      {/* Thumbnail Header */}
      <div className="h-50 w-full bg-surface-base relative overflow-hidden border-b border-border-subtle z-0 pointer-events-none">
        <img
          src={`${WIDGET_SERVER}/apps/${app.id}/thumbnail.jpg`}
          alt={`${app.name} thumbnail`}
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
          loading="lazy"
        />
      </div>

      {/* Content Body */}
      <div className="p-6 relative z-10 flex flex-col flex-1 pointer-events-none">
        <h3 className="text-xl font-black text-content-primary mb-2 group-hover:text-brand-accent transition-colors line-clamp-1 uppercase tracking-tight">{app.name}</h3>
        <p className="text-content-muted text-sm leading-relaxed line-clamp-2 flex-1 mb-6">
          {app.description}
        </p>

        <div className="flex justify-between items-center mt-auto pointer-events-auto">
          <div className="flex gap-1.5 flex-wrap">
            {app.compatible_with?.slice(0, 2).map((platform) => (
              <span key={platform} className="text-[8px] font-black uppercase tracking-widest bg-brand-primary/5 text-brand-primary/60 px-2 py-0.5 rounded border border-brand-primary/10">
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
            className="px-4 py-1.5 bg-brand-primary hover:bg-brand-primary/90 text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg shadow-brand-primary/20 transition-all active:scale-95"
          >
            Install
          </button>
        </div>
      </div>
    </div>
  );
}
