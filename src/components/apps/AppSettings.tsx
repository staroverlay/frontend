import React, { useState } from 'react';
import {
    ChevronDown, ChevronRight, Plus, Trash2,
    Image as ImageIcon, Video, Music, Palette,
    Type, Hash, CheckSquare, ListIcon, Layers,
    Map as MapIcon, Settings
} from 'lucide-react';
import type { AppSettingField, AppSettingType } from '../../lib/types';
import { cn } from '../../lib/utils';
import { MediaSelectorModal } from '../media/MediaSelectorModal';
import { useAuth } from '../../hooks/use-auth';

const MEDIA_BASE = import.meta.env.VITE_UPLOAD_SERVER || 'http://localhost:8787';

function parseMediaPath(path: any) {
    if (!path || typeof path !== 'string' || !path.startsWith('usercontent/')) return null;
    const parts = path.split('/');
    if (parts.length < 3) return null;
    const [_, userId, fileId] = parts;
    return {
        id: fileId,
        userId,
        url: `${MEDIA_BASE}/${path}`,
        thumbnailUrl: `${MEDIA_BASE}/${path}/thumbnail`
    };
}

interface AppSettingsProps {
    fields: AppSettingField[];
    values: Record<string, any>;
    onChange: (path: string, value: any) => void;
}

export const AppSettings: React.FC<AppSettingsProps> = ({ fields, values, onChange }) => {
    const { user } = useAuth();
    return (
        <div className="space-y-4">
            {fields.map((field) => (
                <div key={field.id}>
                    <FieldRenderer
                        field={field}
                        value={values[field.id]}
                        onChange={(val) => onChange(field.id, val)}
                        userId={user?.id}
                    />
                </div>
            ))}
        </div>
    );
};

interface FieldRendererProps {
    field: AppSettingField;
    value: any;
    onChange: (value: any) => void;
    depth?: number;
    userId?: string;
}

const FieldRenderer: React.FC<FieldRendererProps> = ({ field, value, onChange, depth = 0, userId }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [mediaModal, setMediaModal] = useState<{ open: boolean, filter: 'all' | 'image' | 'video' | 'audio' }>({
        open: false,
        filter: 'all'
    });

    const label = field.label || field.id;
    const description = field.description;

    const renderHeader = (icon: React.ReactNode, collapsible = false) => (
        <div
            className={cn(
                "flex items-start justify-between gap-1.5 mb-1.5 px-0.5",
                collapsible && "cursor-pointer group"
            )}
            onClick={collapsible ? () => setIsExpanded(!isExpanded) : undefined}
        >
            <div className="flex gap-2 items-center">
                <div className={cn(
                    "p-1.5 rounded-md border border-white/5 bg-zinc-950/40 text-zinc-500 transition-colors shrink-0",
                    isExpanded ? "text-violet-500 border-violet-500/20" : "group-hover:text-zinc-300"
                )}>
                    <div className="w-3 h-3 flex items-center justify-center">
                        {icon}
                    </div>
                </div>
                <div className="flex flex-col">
                    <span className="text-[9px] font-black uppercase text-zinc-400 tracking-wider flex items-center gap-1">
                        {label}
                        {collapsible && (
                            isExpanded ? <ChevronDown className="w-2.5 h-2.5 text-zinc-600" /> : <ChevronRight className="w-2.5 h-2.5 text-zinc-600" />
                        )}
                    </span>
                    {description && <span className="text-[7.5px] font-bold text-zinc-700 uppercase tracking-tight -mt-0.5">{description}</span>}
                </div>
            </div>
        </div>
    );

    const containerClasses = cn(
        "p-3 rounded-xl bg-zinc-900/30 border border-white/5 hover:bg-zinc-900/50 transition-all",
        depth > 0 && "p-2 bg-transparent border-white/[0.01]"
    );

    // RENDERING LOGIC BY TYPE
    switch (field.type) {
        case 'group':
        case 'object': {
            const childFields = field.fields || field.children || [];
            const objValue = value || {};
            return (
                <div className={containerClasses}>
                    {renderHeader(field.type === 'group' ? <Settings className="w-3.5 h-3.5" /> : <Layers className="w-3.5 h-3.5" />, true)}
                    {isExpanded && (
                        <div className="mt-4 space-y-4 pl-1">
                            {childFields.map((f) => (
                                <FieldRenderer
                                    key={f.id}
                                    field={f}
                                    value={objValue[f.id]}
                                    onChange={(v) => onChange({ ...objValue, [f.id]: v })}
                                    depth={depth + 1}
                                    userId={userId}
                                />
                            ))}
                        </div>
                    )}
                </div>
            );
        }

        case 'list': {
            const listValue = Array.isArray(value) ? value : [];
            const itemSchema = field.item_schema;
            const itemType = field.item_type || 'text';

            return (
                <div className={containerClasses}>
                    {renderHeader(<ListIcon className="w-3.5 h-3.5" />, true)}
                    {isExpanded && (
                        <div className="mt-4 space-y-3">
                            <div className="space-y-2">
                                {listValue.map((item, index) => (
                                    <div key={index} className="flex gap-2 items-start group/item">
                                        <div className="flex-1">
                                            {itemSchema ? (
                                                <FieldRenderer
                                                    field={{ ...itemSchema, id: `item-${index}`, label: `Item #${index + 1}` }}
                                                    value={item}
                                                    onChange={(v) => {
                                                        const next = [...listValue];
                                                        next[index] = v;
                                                        onChange(next);
                                                    }}
                                                    depth={depth + 1}
                                                    userId={userId}
                                                />
                                            ) : (
                                                <BasicInput
                                                    type={itemType as any}
                                                    value={item}
                                                    onChange={(v) => {
                                                        const next = [...listValue];
                                                        next[index] = v;
                                                        onChange(next);
                                                    }}
                                                />
                                            )}
                                        </div>
                                        <button
                                            onClick={() => {
                                                const next = [...listValue];
                                                next.splice(index, 1);
                                                onChange(next);
                                            }}
                                            className="p-2.5 rounded-xl bg-rose-500/10 text-rose-500 opacity-0 group-hover/item:opacity-100 transition-all hover:bg-rose-500/20"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={() => onChange([...listValue, itemSchema ? {} : ''])}
                                className="w-full py-2.5 rounded-xl border border-dashed border-white/5 bg-white/[0.02] hover:bg-white/[0.05] text-[9px] font-black uppercase text-zinc-500 hover:text-zinc-300 transition-all flex items-center justify-center gap-2"
                            >
                                <Plus className="w-3 h-3" /> Add Item
                            </button>
                        </div>
                    )}
                </div>
            );
        }

        case 'map': {
            const mapValue = (value && typeof value === 'object') ? value : {};
            const keys = Object.keys(mapValue);
            const valueSchema = field.value_schema;
            const valueType = field.type || 'text';

            return (
                <div className={containerClasses}>
                    {renderHeader(<MapIcon className="w-3.5 h-3.5" />, true)}
                    {isExpanded && (
                        <div className="mt-3 space-y-2">
                            <div className="space-y-1.5 px-1 pb-1 border-l border-white/5 ml-1.5">
                                {keys.map((key) => (
                                    <div key={key} className="flex gap-1.5 items-start group/item">
                                        <div className="w-1/3">
                                            <input
                                                value={key}
                                                readOnly
                                                className="w-full bg-zinc-950/50 border border-white/[0.03] rounded px-2 py-1 text-[9px] font-bold text-zinc-600 uppercase truncate"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            {valueSchema ? (
                                                <FieldRenderer
                                                    field={{ ...valueSchema, id: key, label: '' }}
                                                    value={mapValue[key]}
                                                    onChange={(v) => onChange({ ...mapValue, [key]: v })}
                                                    depth={depth + 1}
                                                    userId={userId}
                                                />
                                            ) : (
                                                <BasicInput
                                                    type={valueType as any}
                                                    value={mapValue[key]}
                                                    onChange={(v) => onChange({ ...mapValue, [key]: v })}
                                                />
                                            )}
                                        </div>
                                        <button
                                            onClick={() => {
                                                const next = { ...mapValue };
                                                delete next[key];
                                                onChange(next);
                                            }}
                                            className="p-1.5 rounded-lg bg-rose-500/10 text-rose-500 opacity-0 group-hover/item:opacity-100 transition-all hover:bg-rose-500/20 shrink-0"
                                        >
                                            <Trash2 className="w-2.5 h-2.5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-2 px-1">
                                <input
                                    placeholder="Add key..."
                                    className="flex-1 bg-zinc-950/50 border border-white/5 rounded-lg px-3 py-1.5 text-[9px] font-bold text-white focus:outline-none focus:ring-1 focus:ring-violet-500/40 transition-all"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            const k = e.currentTarget.value.trim();
                                            if (k && !mapValue[k]) {
                                                onChange({ ...mapValue, [k]: valueSchema ? {} : '' });
                                                e.currentTarget.value = '';
                                            }
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            );
        }

        case 'media:image':
        case 'media:video':
        case 'media:audio': {
            const filterMap: Record<string, 'all' | 'image' | 'video' | 'audio'> = {
                'media:image': 'image',
                'media:video': 'video',
                'media:audio': 'audio'
            };
            const filter = filterMap[field.type] || 'all';
            const icon = field.type === 'media:image' ? <ImageIcon className="w-3.5 h-3.5" /> :
                field.type === 'media:video' ? <Video className="w-3.5 h-3.5" /> : <Music className="w-3.5 h-3.5" />;

            const mediaData = parseMediaPath(value);

            return (
                <div className={containerClasses}>
                    {renderHeader(icon)}
                    <div className="flex gap-3 items-center">
                        {mediaData ? (
                            <div className="flex-1 flex items-center gap-2 bg-zinc-950 border border-white/5 rounded-lg p-1.5 pr-3 group/media relative overflow-hidden">
                                {mediaData.thumbnailUrl ? (
                                    <div className="w-8 h-8 rounded bg-zinc-900 border border-white/5 overflow-hidden">
                                        <img src={mediaData.thumbnailUrl} className="w-full h-full object-cover" alt="" />
                                    </div>
                                ) : (
                                    <div className="w-8 h-8 rounded bg-zinc-900 border border-white/5 flex items-center justify-center">
                                        {icon}
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="text-[8.5px] font-black text-white truncate uppercase tracking-tight leading-none mb-0.5">Asset Path</p>
                                    <p className="text-[6.5px] font-bold text-zinc-600 uppercase tracking-widest truncate leading-none">{value}</p>
                                </div>
                                <button
                                    onClick={() => onChange(null)}
                                    className="p-1.5 rounded-md bg-rose-500/10 text-rose-500 opacity-0 group-hover/media:opacity-100 transition-all hover:bg-rose-500/20"
                                >
                                    <Trash2 className="w-2.5 h-2.5" />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setMediaModal({ open: true, filter })}
                                className="flex-1 py-3 rounded-lg border border-dashed border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all flex flex-col items-center justify-center gap-1 group"
                            >
                                <span className="text-[8px] font-black uppercase text-zinc-500 tracking-[0.15em] group-hover:text-violet-400 transition-all">Select Media</span>
                            </button>
                        )}
                        <button
                            onClick={() => setMediaModal({ open: true, filter })}
                            className="p-3 bg-zinc-900 border border-white/5 rounded-lg text-zinc-500 hover:text-white transition-all shrink-0"
                            title="Media Library"
                        >
                            <Layers className="w-3 h-3" />
                        </button>
                    </div>

                    <MediaSelectorModal
                        isOpen={mediaModal.open}
                        filterType={mediaModal.filter}
                        onClose={() => setMediaModal({ ...mediaModal, open: false })}
                        onSelect={(u) => {
                            if (userId) {
                                onChange(`usercontent/${userId}/${u.id}`);
                            } else {
                                console.error('Cannot set media: No user logged in');
                            }
                        }}
                        selectedId={mediaData?.id}
                    />
                </div>
            );
        }

        case 'color': {
            return (
                <div className={containerClasses}>
                    {renderHeader(<Palette className="w-3.5 h-3.5" />)}
                    <div className="flex gap-2">
                        <div className="relative group/color w-10 h-10 shrink-0">
                            <input
                                type="color"
                                value={value || '#000000'}
                                onChange={(e) => onChange(e.target.value)}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div
                                className="w-full h-full rounded-lg border border-white/10 shadow-lg group-hover/color:scale-105 transition-transform"
                                style={{ backgroundColor: value || '#000000' }}
                            />
                        </div>
                        <input
                            value={String(value || '').toUpperCase()}
                            onChange={(e) => onChange(e.target.value)}
                            placeholder="#HEXCODE"
                            className="flex-1 bg-zinc-950 border border-white/5 rounded-lg px-3 py-2 text-[10px] font-mono font-bold text-zinc-400 focus:outline-none focus:ring-1 focus:ring-violet-500/40 transition-all"
                        />
                    </div>
                </div>
            );
        }

        case 'boolean': {
            const isSwitch = field.render_as === 'switch';
            return (
                <label className={cn(containerClasses, "flex items-center justify-between cursor-pointer")}>
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "p-2 rounded-lg border border-white/5 bg-zinc-950/50",
                            value ? "text-violet-500" : "text-zinc-600"
                        )}>
                            <CheckSquare className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase text-zinc-200 tracking-wider font-sans">{label}</span>
                            {description && <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-tight">{description}</span>}
                        </div>
                    </div>
                    {isSwitch ? (
                        <div
                            onClick={() => onChange(!value)}
                            className={cn(
                                "w-8 h-4 rounded-full relative transition-all duration-300 border",
                                value ? "bg-violet-600 border-violet-500/20" : "bg-zinc-800 border-white/5"
                            )}
                        >
                            <div className={cn(
                                "absolute top-0.5 w-2.5 h-2.5 rounded-full bg-white transition-all shadow-sm",
                                value ? "right-0.5" : "left-0.5"
                            )} />
                        </div>
                    ) : (
                        <input
                            type="checkbox"
                            checked={!!value}
                            onChange={(e) => onChange(e.target.checked)}
                            className="w-4.5 h-4.5 rounded-md border-white/10 bg-zinc-950 text-violet-600 focus:ring-violet-500/40"
                        />
                    )}
                </label>
            );
        }

        case 'select': {
            return (
                <div className={containerClasses}>
                    {renderHeader(<Layers className="w-3.5 h-3.5" />)}
                    <select
                        value={String(value || '')}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full bg-zinc-950 border border-white/5 px-3 py-2 rounded-lg text-[10px] font-bold text-zinc-400 focus:outline-none focus:ring-1 focus:ring-violet-500/40 transition-all font-sans appearance-none"
                    >
                        {(field.options || []).map(o => (
                            <option key={o.value} value={o.value}>{o.label || o.value}</option>
                        ))}
                    </select>
                </div>
            );
        }

        case 'number': {
            const n = typeof value === 'number' ? value : Number(value) || 0;
            const isSlider = field.render_as === 'slider';
            return (
                <div className={containerClasses}>
                    <div className="flex justify-between items-center mb-2">
                        {renderHeader(<Hash className="w-3.5 h-3.5" />)}
                        <span className="px-1.5 py-0.5 rounded-md bg-violet-600/10 border border-violet-500/20 text-[9px] font-black text-violet-400 font-mono">
                            {n}
                        </span>
                    </div>
                    {isSlider ? (
                        <input
                            type="range"
                            min={field.num_min ?? 0}
                            max={field.num_max ?? 100}
                            step={field.slider_step ?? 1}
                            value={n}
                            onChange={(e) => onChange(Number(e.target.value))}
                            className="w-full h-1 bg-zinc-950 rounded-lg appearance-none cursor-pointer accent-violet-600"
                        />
                    ) : (
                        <input
                            type="number"
                            value={n}
                            onChange={(e) => onChange(Number(e.target.value))}
                            className="w-full bg-zinc-950 border border-white/5 rounded-lg px-3 py-1.5 text-[10px] font-bold text-zinc-300 focus:outline-none focus:ring-1 focus:ring-violet-500/40 transition-all font-sans"
                        />
                    )}
                </div>
            );
        }

        default: {
            return (
                <div className={containerClasses}>
                    {renderHeader(<Type className="w-3.5 h-3.5" />)}
                    <input
                        value={String(value || '')}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={`Enter ${label}...`}
                        className="w-full bg-zinc-950 border border-white/5 rounded-lg px-3 py-2 text-[10px] font-bold text-zinc-300 focus:outline-none focus:ring-1 focus:ring-violet-500/40 transition-all font-sans"
                    />
                </div>
            );
        }
    }
};

const BasicInput: React.FC<{ type: AppSettingType, value: any, onChange: (v: any) => void }> = ({ type, value, onChange }) => {
    if (type === 'number') {
        return (
            <input
                type="number"
                value={value || 0}
                onChange={e => onChange(Number(e.target.value))}
                className="w-full bg-zinc-950/50 border border-white/5 rounded-lg px-3 py-1.5 text-[10px] font-bold text-zinc-300 focus:outline-none focus:ring-1 focus:ring-violet-500/40 font-sans"
            />
        );
    }
    if (type === 'boolean') {
        return (
            <div
                onClick={() => onChange(!value)}
                className={cn(
                    "w-8 h-4 rounded-full relative transition-all duration-300 border",
                    value ? "bg-violet-600 border-violet-500/20" : "bg-zinc-800 border-white/5"
                )}
            >
                <div className={cn(
                    "absolute top-0.5 w-2.5 h-2.5 rounded-full bg-white transition-all shadow-sm",
                    value ? "right-0.5" : "left-0.5"
                )} />
            </div>
        );
    }
    return (
        <input
            value={String(value || '')}
            onChange={e => onChange(e.target.value)}
            className="w-full bg-zinc-950/50 border border-white/5 rounded-lg px-3 py-1.5 text-[10px] font-bold text-zinc-300 focus:outline-none focus:ring-1 focus:ring-violet-500/40 font-sans"
        />
    );
};
