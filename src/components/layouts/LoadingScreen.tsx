export function LoadingScreen({ message = "Loading account data..." }: { message?: string }) {
    return (
        <div className="min-h-screen bg-surface-base flex items-center justify-center relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-primary/5 blur-[100px] pointer-events-none" />
            <div className="flex flex-col items-center gap-8 relative z-10 animate-in fade-in zoom-in-95 duration-1000">
                <div className="relative">
                    <div className="absolute inset-0 bg-brand-primary/20 blur-2xl rounded-full animate-pulse" />
                    <div className="w-12 h-12 rounded-xl border-2 border-white/5 border-t-brand-primary animate-spin relative z-10" />
                </div>
                <div className="flex flex-col items-center gap-2">
                    <p className="text-content-muted text-sm font-medium tracking-wide animate-pulse">{message}</p>
                    <span className="text-[10px] font-bold text-brand-primary/40 uppercase tracking-[0.3em]">StarOverlay</span>
                </div>
            </div>
        </div>
    );
}
