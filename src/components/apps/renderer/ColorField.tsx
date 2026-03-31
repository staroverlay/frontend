import React from 'react';
import { Palette } from 'lucide-react';
import { FieldBase } from './FieldBase';
import { type AppSettingField } from '@/lib/types';

interface ColorFieldProps {
    field: AppSettingField;
    value: any;
    onChange: (value: any) => void;
    depth?: number;
}

export const ColorField: React.FC<ColorFieldProps> = ({ field, value, onChange, depth }) => {
    return (
        <FieldBase field={field} icon={<Palette className="w-3.5 h-3.5" />} depth={depth} description={field.description}>
            <div className="flex gap-2.5">
                <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-white/5 ring-1 ring-black shadow-inner shadow-black/20 group-hover:border-white/10 transition-all shrink-0">
                    <input
                        type="color"
                        value={value || field.default || '#000000'}
                        onChange={(e) => onChange(e.target.value)}
                        className="absolute inset-[-4px] w-[calc(100%+8px)] h-[calc(100%+8px)] cursor-pointer"
                    />
                </div>
                <div className="flex-1">
                    <input
                        value={value || field.default || '#000000'}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full bg-zinc-900/40 border border-white/5 rounded-lg px-2.5 py-1.5 text-[9.5px] font-black uppercase text-white/50 focus:text-white transition-all font-mono tracking-widest focus:outline-none focus:ring-1 focus:ring-violet-500/40"
                        placeholder="#000000"
                    />
                </div>
            </div>
        </FieldBase>
    );
};
