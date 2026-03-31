import React from 'react';
import { Hash } from 'lucide-react';
import { FieldBase } from './FieldBase';
import { type AppSettingField } from '@/lib/types';

interface NumberFieldProps {
    field: AppSettingField;
    value: any;
    onChange: (value: any) => void;
    depth?: number;
}

export const NumberField: React.FC<NumberFieldProps> = ({ field, value, onChange, depth }) => {
    const isSlider = field.render_as === 'slider';

    return (
        <FieldBase field={field} icon={<Hash className="w-3.5 h-3.5" />} depth={depth} description={field.description}>
            {isSlider ? (
                <div className="space-y-1.5 py-1">
                    <div className="flex justify-between items-center px-1">
                        <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{field.num_min ?? 0}</span>
                        <span className="text-[10px] font-black text-violet-500 font-mono tracking-tighter">{value || 0}</span>
                        <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{field.num_max ?? 100}</span>
                    </div>
                    <input
                        type="range"
                        min={field.num_min ?? 0}
                        max={field.num_max ?? 100}
                        step={field.slider_step || 1}
                        value={Number(value || 0)}
                        onChange={(e) => onChange(Number(e.target.value))}
                        className="w-full h-1 bg-zinc-950 border border-white/5 rounded-full appearance-none accent-violet-500 cursor-pointer"
                    />
                </div>
            ) : (
                <input
                    type="number"
                    min={field.num_min}
                    max={field.num_max}
                    value={Number(value || 0)}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-white/5 rounded-lg px-3 py-1.5 text-[10px] font-bold text-zinc-300 focus:outline-none focus:ring-1 focus:ring-violet-500/40 transition-all font-sans"
                />
            )}
        </FieldBase>
    );
};
