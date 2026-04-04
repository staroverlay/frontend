import type { AppManifest } from '../../services/apps-service';

interface AppHeaderBannerProps {
    app: AppManifest;
    id: string;
}

export const AppHeaderBanner = ({ app, id }: AppHeaderBannerProps) => {
    const WIDGET_SERVER = import.meta.env.VITE_APP_WIDGET_SERVER || 'http://localhost:4000';

    return (
        <div className="relative w-full h-64 md:h-80 rounded-3xl overflow-hidden bg-zinc-950 border border-white/10 mb-8 shadow-2xl">
            <img
                src={`${WIDGET_SERVER}/apps/${id}/thumbnail.jpg`}
                className="w-full h-full object-cover opacity-60"
                alt={`${app.name} cover`}
                onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://placehold.co/1200x400/1a1a1c/4c1d95?text=${app.name.charAt(0)}`;
                }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent flex flex-col justify-end p-8 md:p-12">
                <div className="flex items-center gap-3 mb-3 relative z-10 w-full">
                    <span className="px-3 py-1 bg-violet-500/20 text-violet-300 rounded-full text-xs font-black uppercase tracking-widest border border-violet-500/30">
                        {app.category}
                    </span>
                    <span className="px-3 py-1 bg-zinc-900/80 backdrop-blur-md text-zinc-300 rounded-full text-xs font-bold font-mono border border-white/10">
                        v{app.version}
                    </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-white mb-2 leading-tight">{app.name}</h1>
                <p className="text-zinc-300 text-lg md:text-xl max-w-2xl text-shadow-sm">{app.description}</p>
            </div>
        </div>
    );
};
