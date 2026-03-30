import { Link } from 'react-router-dom';
import type { Widget } from '../../lib/types';
import { Layers, Settings2, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface WidgetCardProps {
    widget: Widget;
}

export function WidgetCard({ widget }: WidgetCardProps) {
    const WIDGET_SERVER = import.meta.env.VITE_APP_WIDGET_SERVER || 'http://localhost:4000';
    const [copied, setCopied] = useState(false);

    const widgetUrl = `${WIDGET_SERVER}/${widget.app_id}?token=${widget.token}`;

    const copyUrl = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        navigator.clipboard.writeText(widgetUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Link
            to={`/widgets/${widget.id}`}
            className="group relative flex flex-col rounded-3xl bg-zinc-900/40 border border-white/5 overflow-hidden hover:bg-zinc-800/60 hover:border-violet-500/30 transition-all duration-300 shadow-lg shadow-black/20 block"
        >
            {/* Glow effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0" />

            {/* Thumbnail Header */}
            <div className="h-40 w-full bg-zinc-950 relative overflow-hidden border-b border-white/5 z-0">
                <img
                    src={`${WIDGET_SERVER}/${widget.app_id}/thumbnail.jpg`}
                    alt={`${widget.display_name || widget.app_id} thumbnail`}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                    loading="lazy"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://placehold.co/600x400/1a1a1c/4c1d95?text=${(widget.display_name || widget.app_id).charAt(0)}`;
                    }}
                />

                <div className="absolute top-4 left-4 flex gap-2">
                    <div className="bg-zinc-950/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-1.5 shadow-xl">
                        {widget.enabled ? (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                        ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]"></span>
                        )}
                        <span className="text-[10px] font-black text-zinc-200 uppercase tracking-widest">
                            {widget.enabled ? 'Active' : 'Disabled'}
                        </span>
                    </div>
                </div>

                <div className="absolute top-4 right-4">
                    <button
                        onClick={copyUrl}
                        className="bg-zinc-950/80 backdrop-blur-md p-2 rounded-xl border border-white/10 text-zinc-400 hover:text-white hover:border-violet-500/40 transition-all shadow-xl group/btn"
                        title="Copy Widget URL"
                    >
                        {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                </div>
            </div>

            {/* Content Body */}
            <div className="p-6 relative z-10 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-1">
                    <Layers className="w-3.5 h-3.5 text-violet-400" />
                    <span className="text-[10px] font-black text-violet-400/70 uppercase tracking-[0.2em]">{widget.app_id}</span>
                </div>

                <h3 className="text-xl font-black text-white mb-2 group-hover:text-violet-200 transition-colors">
                    {widget.display_name || widget.app_id}
                </h3>

                <div className="flex justify-between items-center mt-auto">
                    <div className="flex gap-2">
                        <span className="text-[9px] font-black uppercase tracking-widest bg-zinc-800 text-zinc-400 px-2.5 py-1 rounded border border-white/5">
                            ID: {widget.id.slice(0, 8)}...
                        </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-zinc-500 group-hover:text-violet-400 transition-colors">
                        <Settings2 className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Configure</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
