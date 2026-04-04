import { Eye, EyeOff, Check, Copy, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { useWidgetDetails } from './WidgetDetailsContext';
import { cn } from '../../lib/utils';

export const WidgetPreviewHeader = () => {
    const {
        widget,
        metaDraft,
        saveMeta,
        rotateToken
    } = useWidgetDetails();
    const [showUrl, setShowUrl] = useState(false);
    const [copied, setCopied] = useState(false);

    if (!widget) return null;

    const WIDGET_SERVER = import.meta.env.VITE_APP_WIDGET_SERVER || 'http://localhost:4000';
    const widgetUrl = `${WIDGET_SERVER}/widget/${widget.app_id}?token=${widget.token}`;

    const copyUrl = () => {
        navigator.clipboard.writeText(widgetUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <header className="min-h-16 lg:h-16 border-b border-white/5 bg-zinc-950/60 backdrop-blur-3xl flex flex-col lg:flex-row items-center justify-between px-4 lg:px-6 py-3 lg:py-0 z-10 shrink-0 gap-4 lg:gap-0 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
            <div className="flex items-center gap-3 lg:gap-4 flex-1 w-full lg:max-w-3xl">
                <div className="relative group flex-1 min-w-0">
                    <div className={cn(
                        "bg-zinc-900/60 border border-white/10 rounded-xl px-4 py-2.5 font-mono text-[10px] lg:text-[11px] text-zinc-400 transition-all duration-700 truncate",
                        !showUrl && "blur-[10px] select-none opacity-40 group-hover:opacity-60"
                    )}>
                        {widgetUrl || '------------------------------------------------------------'}
                    </div>

                    {!showUrl && (
                        <div className="absolute inset-0 flex items-center px-4 font-black text-[8px] lg:text-[9px] uppercase tracking-[0.2em] text-zinc-500 group-hover:text-zinc-300 transition-colors pointer-events-none">
                            <span className="hidden sm:inline">Overlay URL Locked</span>
                            <span className="sm:hidden">URL Hidden</span>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-1 lg:gap-1.5 shrink-0">
                    <button
                        onClick={() => setShowUrl(!showUrl)}
                        className="p-2.5 bg-zinc-900 border border-white/5 rounded-xl hover:bg-zinc-800 transition-all text-zinc-400 hover:text-white"
                        title={showUrl ? "Hide" : "Show"}
                    >
                        {showUrl ? <EyeOff className="w-3.5 h-3.5 lg:w-4 h-4" /> : <Eye className="w-3.5 h-3.5 lg:w-4 h-4" />}
                    </button>
                    <button
                        onClick={copyUrl}
                        className="flex items-center gap-2 px-3 lg:px-4 py-2.5 bg-zinc-900 border border-white/5 rounded-xl hover:bg-zinc-800 transition-all text-zinc-400 hover:text-white group"
                    >
                        {copied ? <Check className="w-3.5 h-3.5 lg:w-4 h-4 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 lg:w-4 h-4 group-hover:scale-110 transition-transform" />}
                        <span className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest hidden sm:block whitespace-nowrap">{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                    <button
                        onClick={rotateToken}
                        className="flex items-center gap-2 px-3 lg:px-4 py-2.5 bg-zinc-900 border border-white/5 rounded-xl hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/20 transition-all text-zinc-400 group"
                    >
                        <RotateCcw className="w-3.5 h-3.5 lg:w-4 h-4 group-hover:rotate-[-90deg] transition-transform" />
                        <span className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest hidden sm:block whitespace-nowrap">Rotate Token</span>
                    </button>
                </div>
            </div>

            <div className="flex items-center justify-between lg:justify-end gap-6 w-full lg:w-auto lg:ml-6 lg:border-l border-white/5 lg:pl-6 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="flex flex-col items-start lg:items-end">
                        <span className={cn(
                            "text-[9px] lg:text-[10px] font-black uppercase tracking-widest transition-colors",
                            widget.enabled ? "text-emerald-500" : "text-rose-500/70"
                        )}>
                            {widget.enabled ? "Enabled" : "Disabled"}
                        </span>
                    </div>
                    <button
                        onClick={() => saveMeta({ enabled: !metaDraft.enabled })}
                        className={cn(
                            "w-10 lg:w-11 h-5 lg:h-5.5 rounded-full relative transition-all duration-500 shadow-lg border",
                            metaDraft.enabled ? "bg-emerald-500 border-emerald-400/20" : "bg-zinc-800 border-white/5"
                        )}
                    >
                        <div className={cn(
                            "absolute top-0.5 lg:top-0.75 w-3.5 h-3.5 rounded-full bg-white transition-all shadow-sm",
                            metaDraft.enabled ? "right-1" : "left-1"
                        )} />
                    </button>
                </div>

                <div className="lg:hidden flex items-center gap-2 px-3 py-1.5 bg-zinc-900/50 border border-white/5 rounded-lg">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[8px] font-black uppercase text-zinc-500">Preview</span>
                </div>
            </div>
        </header>
    );
};
