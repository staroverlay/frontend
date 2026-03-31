import React, { useState } from 'react';
import { Film, Music, Image as ImageIcon, Trash2, Eye, Play, Pause } from 'lucide-react';

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
    onDelete: (id: string) => void;
    formatBytes: (bytes: number) => string;
}

export const MediaCard: React.FC<MediaCardProps> = ({ upload, onDelete, formatBytes }) => {
    const [isHovering, setIsHovering] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = React.useRef<HTMLAudioElement>(null);

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
            className="group flex flex-col rounded-2xl bg-zinc-900 border border-white/5 overflow-hidden hover:border-violet-500/30 transition-all hover:shadow-xl hover:shadow-black/40"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => {
                setIsHovering(false);
                setIsPlaying(false);
                if (audioRef.current) {
                    audioRef.current.pause();
                    audioRef.current.currentTime = 0;
                }
            }}
        >
            <div className="aspect-square bg-zinc-950 relative overflow-hidden">
                {/* Unified Thumbnail View */}
                <img
                    src={upload.thumbnailUrl}
                    alt={upload.displayName}
                    className={`w-full h-full object-cover transition-all duration-500 ${isHovering && upload.type === 'video' ? 'opacity-0' : 'opacity-100 group-hover:scale-110'
                        }`}
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
                            <Music className="w-4 h-4 text-violet-400" />
                        </div>
                    </>
                )}

                {/* Type Indicator Icon (hidden on hover) */}
                <div className="absolute bottom-2 left-2 p-1.5 rounded-lg bg-black/50 backdrop-blur-md border border-white/10 group-hover:opacity-0 transition-opacity flex items-center gap-1.5 shadow-lg">
                    {upload.type === 'video' ? <Film className="w-3.5 h-3.5 text-amber-400" /> :
                        upload.type === 'audio' ? <Music className="w-3.5 h-3.5 text-violet-400" /> :
                            <ImageIcon className="w-3.5 h-3.5 text-blue-400" />}
                </div>

                {/* Action Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-3 p-4 backdrop-blur-[2px]">
                    <div className="flex items-center gap-2">
                        {upload.type === 'audio' ? (
                            <button
                                onClick={togglePlayback}
                                className="p-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white backdrop-blur-md transition-all active:scale-95 shadow-lg shadow-violet-900/40"
                                title={isPlaying ? "Pause" : "Play Preview"}
                            >
                                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                            </button>
                        ) : (
                            <a
                                href={upload.url}
                                target="_blank"
                                rel="noreferrer"
                                className="p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all active:scale-95 border border-white/10"
                                title="View Original"
                            >
                                <Eye className="w-5 h-5" />
                            </a>
                        )}
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                onDelete(upload.id);
                            }}
                            className="p-3 rounded-xl bg-rose-500/20 hover:bg-rose-500/40 text-rose-200 backdrop-blur-md transition-all active:scale-95 border border-rose-500/10 shadow-lg shadow-red-900/20"
                            title="Delete"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="p-4 bg-zinc-900">
                <p className="text-sm font-bold text-white truncate mb-1" title={upload.displayName}>
                    {upload.displayName}
                </p>
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider">
                    <span className={`px-2 py-0.5 rounded ${upload.type === 'image' ? 'bg-blue-500/10 text-blue-400' :
                            upload.type === 'video' ? 'bg-amber-500/10 text-amber-400' :
                                'bg-violet-500/10 text-violet-400'
                        }`}>
                        {upload.type === 'audio' && isPlaying ? 'Playing...' : upload.type}
                    </span>
                    <span className="text-zinc-500">{formatBytes(upload.sizeBytes)}</span>
                </div>
            </div>
        </div>
    );
};
