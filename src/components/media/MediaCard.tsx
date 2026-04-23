import React, { useRef, useState } from 'react';
import { Film, Music, Image as ImageIcon, Trash2, Eye, Play, Pause } from 'lucide-react';
import { cn } from '../../lib/utils';

interface MediaCardProps {
    upload: {
        id: string;
        displayName: string;
        mimeType: string;
        type: 'image' | 'video' | 'audio';
        url: string;
        thumbnailUrl: string;
        sizeBytes: number;
        createdAt: string;
    };
    onDelete?: (id: string) => void;
    onSelect?: (upload: MediaCardProps['upload']) => void;
    formatBytes: (bytes: number) => string;
    isSelected?: boolean;
}

export const MediaCard: React.FC<MediaCardProps> = ({ upload, onDelete, onSelect, formatBytes, isSelected }) => {
    const [isHovering, setIsHovering] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    const togglePlayback = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <div
            className={cn(
                "group flex flex-col rounded-2xl bg-surface-card border transition-all hover:shadow-premium overflow-hidden",
                isSelected ? "border-brand-primary ring-2 ring-brand-primary/20" : "border-border-subtle hover:border-brand-primary/30"
            )}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => {
                setIsHovering(false);
                setIsPlaying(false);
                if (audioRef.current) {
                    audioRef.current.pause();
                    audioRef.current.currentTime = 0;
                }
            }}
            onClick={() => onSelect?.(upload)}
        >
            <div className={cn("aspect-square bg-surface-base relative overflow-hidden", onSelect ? "cursor-pointer" : "")}>
                {/* Unified Thumbnail View */}
                <img
                    src={upload.thumbnailUrl}
                    alt={upload.displayName}
                    className={cn(
                        "w-full h-full object-cover transition-all duration-500",
                        isHovering && upload.type === 'video' ? "opacity-0" : "opacity-100 group-hover:scale-110"
                    )}
                    loading="lazy"
                />

                {/* Video Hover Preview */}
                {upload.type === 'video' && isHovering && (
                    <video
                        src={upload.url}
                        className="absolute inset-0 w-full h-full object-cover animate-in fade-in duration-300"
                        preload="metadata"
                        autoPlay
                        muted
                        loop
                    />
                )}

                {/* Audio Helper */}
                {upload.type === 'audio' && (
                    <>
                        <audio ref={audioRef} src={upload.url} loop onEnded={() => setIsPlaying(false)} />
                        <div className="absolute top-2 left-2 p-1.5 rounded-lg bg-black/50 backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Music className="w-4 h-4 text-brand-primary" />
                        </div>
                    </>
                )}

                {/* Type Indicator Icon (hidden on hover) */}
                <div className="absolute bottom-2 left-2 p-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 group-hover:opacity-0 transition-opacity flex items-center gap-1.5 shadow-lg">
                    {upload.type === 'video' ? <Film className="w-3.5 h-3.5 text-status-warning" /> :
                        upload.type === 'audio' ? <Music className="w-3.5 h-3.5 text-brand-primary" /> :
                            <ImageIcon className="w-3.5 h-3.5 text-status-info" />}
                </div>

                {/* Action Overlay */}
                <div className="absolute inset-0 bg-surface-base/80 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-3 p-4 backdrop-blur-[2px]">
                    <div className="flex items-center gap-2">
                        {upload.type === 'audio' ? (
                            <button
                                onClick={togglePlayback}
                                className="p-3 rounded-xl bg-brand-primary hover:bg-brand-primary/90 text-white backdrop-blur-md transition-all active:scale-95 shadow-lg shadow-brand-primary/40"
                                title={isPlaying ? "Pause" : "Play Preview"}
                            >
                                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                            </button>
                        ) : (
                            <a
                                href={upload.url}
                                target="_blank"
                                rel="noreferrer"
                                className="p-3 rounded-xl bg-white/10 hover:bg-white/20 text-content-primary backdrop-blur-md transition-all active:scale-95 border border-white/10"
                                title="View Original"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Eye className="w-5 h-5" />
                            </a>
                        )}
                        {onDelete && (
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onDelete(upload.id);
                                }}
                                className="p-3 rounded-xl bg-status-error/10 hover:bg-status-error/20 text-status-error backdrop-blur-md transition-all active:scale-95 border border-status-error/20 shadow-lg shadow-status-error/10"
                                title="Delete"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="p-4 bg-surface-card">
                <p className="text-sm font-bold text-content-primary truncate mb-1" title={upload.displayName}>
                    {upload.displayName}
                </p>
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider">
                    <span className={cn(
                        "px-2 py-0.5 rounded border",
                        upload.type === 'image' ? "bg-status-info/10 text-status-info border-status-info/20" :
                            upload.type === 'video' ? "bg-status-warning/10 text-status-warning border-status-warning/20" :
                                "bg-brand-primary/10 text-brand-primary border-brand-primary/20"
                    )}>
                        {upload.type === 'audio' && isPlaying ? 'Playing...' : upload.type}
                    </span>
                    <span className="text-content-dimmed font-medium">{formatBytes(upload.sizeBytes)}</span>
                </div>
            </div>
        </div>
    );
};
