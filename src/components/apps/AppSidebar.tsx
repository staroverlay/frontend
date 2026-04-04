import { HardDrive, Tag, Calendar, Sparkles } from 'lucide-react';
import type { AppManifest } from '../../services/apps-service';

interface AppSidebarProps {
    app: AppManifest;
    id: string;
    onInstall: () => void;
}

export const AppSidebar = ({ app, id, onInstall }: AppSidebarProps) => {
    return (
        <div className="flex flex-col gap-6">
            <div className="bg-zinc-900/30 border border-white/5 rounded-3xl p-6 backdrop-blur-xl shrink-0 h-fit">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <HardDrive className="w-5 h-5 text-violet-400" />
                    App Details
                </h3>

                <div className="flex flex-col gap-5">
                    <div className="flex items-start gap-4">
                        <Tag className="w-5 h-5 text-zinc-500 mt-0.5" />
                        <div>
                            <div className="text-sm font-semibold text-white mb-1">Compatible Platforms</div>
                            <div className="flex flex-wrap gap-2">
                                {app.compatible_with?.map(platform => (
                                    <span key={platform} className="text-[10px] font-black tracking-widest uppercase bg-zinc-800 text-zinc-300 px-2 py-1 rounded">
                                        {platform === 'twitch' ? 'Twitch' : platform === 'kick' ? 'Kick' : platform === 'youtube' ? 'YouTube' : platform}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <Calendar className="w-5 h-5 text-zinc-500 mt-0.5" />
                        <div>
                            <div className="text-sm font-semibold text-white mb-1">Last Updated</div>
                            <div className="text-sm text-zinc-400">
                                {new Date(app.updated_at).toLocaleDateString(undefined, {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="w-5 h-5 text-zinc-500 mt-0.5 flex items-center justify-center font-bold font-mono text-xs">ID</div>
                        <div>
                            <div className="text-sm font-semibold text-white mb-1">Developer ID</div>
                            <div className="text-xs font-mono text-zinc-400 bg-zinc-950 px-2 py-1 rounded border border-white/5 truncate max-w-[150px]">
                                {id}
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={onInstall}
                        className="w-full mt-4 py-4 bg-violet-600 hover:bg-violet-500 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all shadow-lg shadow-violet-600/20 active:scale-95 flex items-center justify-center gap-2"
                    >
                        <Sparkles className="w-4 h-4" />
                        Install App
                    </button>
                </div>
            </div>
        </div>
    );
};
