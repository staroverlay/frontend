import { Link } from 'react-router-dom';
import type { AppManifest } from '../../services/apps-service';

interface AppCardProps {
  app: AppManifest;
}

export function AppCard({ app }: AppCardProps) {
  const WIDGET_SERVER = import.meta.env.VITE_APP_WIDGET_SERVER || 'http://localhost:4000';

  return (
    <Link
      to={`/apps/${app.id}`}
      className="group relative flex flex-col rounded-3xl bg-zinc-900/40 border border-white/5 overflow-hidden hover:bg-zinc-800/60 hover:border-violet-500/30 transition-all duration-300 shadow-lg shadow-black/20 block"
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0" />
      
      {/* Thumbnail Header */}
      <div className="h-40 w-full bg-zinc-950 relative overflow-hidden border-b border-white/5 z-0">
        <img
          src={`${WIDGET_SERVER}/${app.id}/thumbnail.jpg`}
          alt={`${app.name} thumbnail`}
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://placehold.co/600x400/1a1a1c/4c1d95?text=${app.name.charAt(0)}`;
          }}
        />
        
        <div className="absolute top-4 left-4">
          <div className="bg-zinc-950/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-1.5 shadow-xl">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
            <span className="text-[10px] font-black text-zinc-200 uppercase tracking-widest">{app.version}</span>
          </div>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-6 relative z-10 flex flex-col flex-1">
        <h3 className="text-xl font-black text-white mb-2 group-hover:text-violet-200 transition-colors">{app.name}</h3>
        <p className="text-zinc-400 text-sm leading-relaxed line-clamp-2 flex-1 mb-4">
          {app.description}
        </p>
        
        <div className="flex justify-between items-center mt-auto">
          <div className="flex gap-2 flex-wrap">
            {app.compatible_with?.map((platform) => (
              <span key={platform} className="text-[9px] font-black uppercase tracking-widest bg-violet-500/10 text-violet-400 px-2.5 py-1 rounded border border-violet-500/20">
                {platform}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
