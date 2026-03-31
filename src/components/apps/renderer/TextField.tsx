import React from 'react';
import { Type, ListIcon } from 'lucide-react';
import { FieldBase } from './FieldBase';
import { type AppSettingField } from '@/lib/types';

interface TextFieldProps {
    field: AppSettingField;
    value: any;
    onChange: (value: any) => void;
    depth?: number;
}

export const TextField: React.FC<TextFieldProps> = ({ field, value, onChange, depth }) => {
    const isSelect = field.type === 'select';

    return (
        <FieldBase
            field={field}
            icon={isSelect ? <ListIcon className="w-3.5 h-3.5" /> : <Type className="w-3.5 h-3.5" />}
            depth={depth}
            description={field.description}
        >
            {isSelect ? (
                <select
                    value={value || field.default || ''}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full bg-zinc-900/40 border border-white/5 rounded-lg px-2.5 py-1.5 text-[9.5px] font-bold text-zinc-300 focus:outline-none focus:ring-1 focus:ring-violet-500/40 transition-all font-sans appearance-none"
                >
                    {(field.options || []).map((opt: any) => (
                        <option key={opt.value} value={opt.value} className="bg-zinc-950 text-white">
                            {opt.label}
                        </option>
                    ))}
                </select>
            ) : (
                <input
                    value={String(value || '')}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={`Enter ${field.label || field.id}...`}
                    className="w-full bg-zinc-900/40 border border-white/5 rounded-lg px-2.5 py-1.5 text-[9.5px] font-bold text-zinc-300 focus:outline-none focus:ring-1 focus:ring-violet-500/40 transition-all font-sans"
                />
            )}
        </FieldBase>
    );
};
