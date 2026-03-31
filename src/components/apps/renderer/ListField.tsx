import React, { useState } from 'react';
import { ListIcon, Trash2, Plus } from 'lucide-react';

import { FieldBase } from './FieldBase';
import { type AppSettingField } from '@/lib/types';
import { FieldRenderer } from './FieldRenderer';
import { TextField } from './TextField';

interface ListFieldProps {
    field: AppSettingField;
    value: any;
    onChange: (value: any) => void;
    depth?: number;
}

export const ListField: React.FC<ListFieldProps> = ({ field, value, onChange, depth = 0 }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const listValue = Array.isArray(value) ? value : [];
    const itemSchema = field.item_schema;
    const itemType = field.item_type || 'text';

    return (
        <FieldBase
            field={field}
            icon={<ListIcon className="w-3.5 h-3.5" />}
            depth={depth}
            collapsible
            isExpanded={isExpanded}
            onToggleExpand={() => setIsExpanded(!isExpanded)}
            description={field.description}
        >
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
                                    />
                                ) : (
                                    <TextField
                                        field={{ id: `item-${index}`, type: itemType as any, label: '' }}
                                        value={item}
                                        onChange={(v) => {
                                            const next = [...listValue];
                                            next[index] = v;
                                            onChange(next);
                                        }}
                                        depth={depth + 1}
                                    />
                                )}
                            </div>
                            <button
                                onClick={() => {
                                    const next = [...listValue];
                                    next.splice(index, 1);
                                    onChange(next);
                                }}
                                className="p-2.5 rounded-xl bg-rose-500/10 text-rose-500 opacity-0 group-hover/item:opacity-100 transition-all hover:bg-rose-500/20 shrink-0 mt-1"
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
        </FieldBase>
    );
};
