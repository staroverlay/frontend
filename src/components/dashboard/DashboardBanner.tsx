import { LayoutDashboard } from 'lucide-react';
import type { Profile, User } from '../../lib/types';

interface DashboardBannerProps {
    planName?: string;
    profile?: Profile | null;
    user?: User | null;
}

export const DashboardBanner = ({ planName, profile, user }: DashboardBannerProps) => {
    return (
        <div className="flex flex-col sm:flex-row items-center justify-between bg-zinc-900/50 border border-violet-500/20 backdrop-blur-md rounded-2xl p-4 gap-4">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center text-violet-400">
                    <LayoutDashboard className="w-5 h-5" />
                </div>
                <div>
                    <h2 className="text-white font-bold tracking-tight">Active Plan: <span className="text-violet-400 uppercase tracking-widest text-xs ml-1">{planName || 'Free Tier'}</span></h2>
                    <p className="text-zinc-400 text-xs mt-0.5">Welcome back, {profile?.displayName || user?.email.split('@')[0]}!</p>
                </div>
            </div>
            <button disabled className="px-5 py-2 bg-zinc-800 text-zinc-500 rounded-xl text-xs font-black uppercase tracking-widest border border-white/5 cursor-not-allowed">
                Update Plan (Coming Soon)
            </button>
        </div>
    );
};
