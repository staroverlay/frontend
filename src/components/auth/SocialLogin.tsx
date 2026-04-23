import { Video, Monitor, PlayCircle } from 'lucide-react';
import { useAuth } from '../../hooks/use-auth';

export function SocialLogin() {
    const { initiateOAuthLogin, isLoading } = useAuth();

    return (
        <div className="mt-10">
            <div className="relative flex items-center justify-center mb-8">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border-subtle" />
                </div>
                <span className="relative bg-surface-card backdrop-blur-md px-4 text-[10px] text-content-dimmed font-black uppercase tracking-widest">
                    Or connect via
                </span>
            </div>

            <div className="grid grid-cols-1 gap-3">
                <button
                    className="w-full h-13 flex items-center justify-center gap-3 rounded-2xl bg-[#9146ff] hover:bg-[#a970ff] text-white transition-all shadow-lg shadow-[#9146ff]/10 active:scale-[0.98] font-bold disabled:opacity-50"
                    onClick={() => initiateOAuthLogin('twitch')}
                    disabled={isLoading}
                >
                    <Video className="w-5 h-5" />
                    <span className="text-sm">Twitch</span>
                </button>

                <div className="grid grid-cols-2 gap-3">
                    <button
                        className="h-13 flex items-center justify-center gap-2 rounded-2xl bg-surface-panel border border-border-subtle text-content-secondary hover:bg-surface-elevated hover:text-content-primary transition-all active:scale-[0.98] font-bold disabled:opacity-50"
                        onClick={() => initiateOAuthLogin('kick')}
                        disabled={isLoading}
                    >
                        <Monitor className="w-4 h-4" />
                        <span className="text-sm">Kick</span>
                    </button>
                    <button
                        className="h-13 flex items-center justify-center gap-2 rounded-2xl bg-surface-panel border border-border-subtle text-content-secondary hover:bg-surface-elevated hover:text-content-primary transition-all active:scale-[0.98] font-bold disabled:opacity-50"
                        onClick={() => initiateOAuthLogin('youtube')}
                        disabled={isLoading}
                    >
                        <PlayCircle className="w-4 h-4" />
                        <span className="text-sm">YouTube</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
