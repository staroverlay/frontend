import React, { useState } from 'react';
import { Map as MapIcon, Trash2 } from 'lucide-react';
import { FieldBase } from './FieldBase';
import { type AppSettingField } from '../../../lib/types';
import { FieldRenderer } from './FieldRenderer';
import { TextField } from './TextField';

interface MapFieldProps {
    field: AppSettingField;
    value: any;
    onChange: (value: any) => void;
    depth?: number;
}

export const MapField: React.FC<MapFieldProps> = ({ field, value, onChange, depth = 0 }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const mapValue = (value && typeof value === 'object') ? value : {};
    const keys = Object.keys(mapValue);
    const valueSchema = field.value_schema;
    const valueType = field.type || 'text';

    return (
        <FieldBase
            field={field}
            icon={<MapIcon className="w-3.5 h-3.5" />}
            depth={depth}
            collapsible
            isExpanded={isExpanded}
            onToggleExpand={() => setIsExpanded(!isExpanded)}
            description={field.description}
        >
            <div className="mt-4 space-y-2">
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
                                    />
                                ) : (
                                    <TextField
                                        field={{ id: key, type: valueType as any, label: '' }}
                                        value={mapValue[key]}
                                        onChange={(v) => onChange({ ...mapValue, [key]: v })}
                                        depth={depth + 1}
                                    />
                                )}
                            </div>
                            <button
                                onClick={() => {
                                    const next = { ...mapValue };
                                    delete next[key];
                                    onChange(next);
                                }}
                                className="p-1.5 rounded-lg bg-rose-500/10 text-rose-500 opacity-0 group-hover/item:opacity-100 transition-all hover:bg-rose-500/20 shrink-0 mt-1"
                            >
                                <Trash2 className="w-2.5 h-2.5" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </FieldBase>
    );
};
