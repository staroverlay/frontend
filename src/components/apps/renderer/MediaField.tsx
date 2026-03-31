import React, { useState } from 'react';
import { Image as ImageIcon, Video, Music, Plus, Trash2, Settings } from 'lucide-react';

import { FieldBase } from './FieldBase';
import { type AppSettingField } from '@/lib/types';
import { MediaSelectorModal } from '../../media/MediaSelectorModal';
import { parseMediaPath } from './utils';
import { useCurrentAppSettings } from '../AppSettingsContext';

interface MediaFieldProps {
    field: AppSettingField;
    value: any;
    onChange: (value: any) => void;
    depth?: number;
}

export const MediaField: React.FC<MediaFieldProps> = ({ field, value, onChange, depth }) => {
    const [open, setOpen] = useState(false);
    const { userId } = useCurrentAppSettings();

    const filter = field.type.split(':')[1] as 'image' | 'video' | 'audio' || 'all';
    const currentMedia = parseMediaPath(value);

    const icon = field.type === 'media:image' ? <ImageIcon className="w-3.5 h-3.5" /> :
        field.type === 'media:video' ? <Video className="w-3.5 h-3.5" /> : <Music className="w-3.5 h-3.5" />;

    return (
        <FieldBase field={field} icon={icon} depth={depth} description={field.description}>
            <div className="w-full">
                {currentMedia ? (
                    <div className="flex items-center gap-3 bg-zinc-950/40 border border-white/5 rounded-xl p-2.5 group/media relative overflow-hidden transition-all hover:bg-zinc-950/60 hover:border-white/10">
                        <div
                            className="w-10 h-10 rounded-lg bg-zinc-900 border border-white/5 flex items-center justify-center overflow-hidden shrink-0 cursor-pointer hover:bg-zinc-800 transition-all"
                            onClick={() => setOpen(true)}
                        >
                            {field.type === 'media:image' ? (
                                <img src={currentMedia.thumbnailUrl || currentMedia.url} className="w-full h-full object-cover" />
                            ) : field.type === 'media:video' ? (
                                <Video className="w-4 h-4 text-zinc-500" />
                            ) : (
                                <Music className="w-4 h-4 text-zinc-500" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setOpen(true)}>
                            <p className="text-[10px] font-black text-white truncate uppercase tracking-tight leading-none mb-1">Asset Loaded</p>
                            <p className="text-[7.5px] font-bold text-zinc-500 uppercase tracking-widest truncate leading-none">{value}</p>
                        </div>
                        <div className="flex gap-1 shrink-0">
                            <button
                                onClick={() => setOpen(true)}
                                className="p-2 rounded-xl bg-white/5 text-zinc-500 opacity-0 group-hover/media:opacity-100 transition-all hover:bg-white/10 hover:text-white"
                                title="Change Media"
                            >
                                <Settings className="w-3.5 h-3.5" />
                            </button>
                            <button
                                onClick={() => onChange(null)}
                                className="p-2 rounded-xl bg-rose-500/10 text-rose-500 opacity-0 group-hover/media:opacity-100 transition-all hover:bg-rose-500/20 shadow-lg shadow-rose-500/5"
                                title="Remove Media"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => setOpen(true)}
                        className="w-full py-4 rounded-xl border border-dashed border-white/10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-violet-500/30 transition-all flex items-center justify-center gap-2 group"
                    >
                        <Plus className="w-3.5 h-3.5 text-zinc-600 group-hover:text-violet-500 transition-all" />
                        <span className="text-[9px] font-black uppercase text-zinc-500 tracking-[0.15em] group-hover:text-zinc-300 transition-all">Select Media</span>
                    </button>
                )}
            </div>

            <MediaSelectorModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onSelect={(u) => onChange(`usercontent/${userId}/${u.id}`)}
                filterType={filter}
                selectedId={currentMedia?.id}
                title={`Select ${filter.charAt(0).toUpperCase() + filter.slice(1)}`}
            />
        </FieldBase>
    );
};
