import React from 'react';
import { CheckSquare } from 'lucide-react';
import { FieldBase } from './FieldBase';
import { type AppSettingField } from '@/lib/types';
import { cn } from '../../../lib/utils';

interface BooleanFieldProps {
    field: AppSettingField;
    value: any;
    onChange: (value: any) => void;
    depth?: number;
}

export const BooleanField: React.FC<BooleanFieldProps> = ({ field, value, onChange, depth }) => {
    const isSwitch = field.render_as === 'switch';
    const val = !!(value ?? field.default);

    return (
        <FieldBase field={field} icon={<CheckSquare className="w-3.5 h-3.5" />} depth={depth} description={field.description}>
            {isSwitch ? (
                <button
                    onClick={() => onChange(!val)}
                    className={cn(
                        "relative w-10 h-5 rounded-full transition-all duration-300 outline-none hover:ring-4 hover:ring-violet-500/10",
                        val ? "bg-violet-600" : "bg-zinc-900 border border-white/5"
                    )}
                >
                    <div className={cn(
                        "absolute top-1 w-3 h-3 rounded-full bg-white transition-all duration-300 shadow-sm",
                        val ? "left-6" : "left-1 bg-zinc-600"
                    )} />
                </button>
            ) : (
                <div className="flex gap-2 items-center">
                    <input
                        type="checkbox"
                        checked={val}
                        onChange={(e) => onChange(e.target.checked)}
                        className="w-4 h-4 rounded border-white/5 bg-zinc-950 text-violet-600 focus:ring-violet-500/40 cursor-pointer"
                    />
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{val ? 'Enabled' : 'Disabled'}</span>
                </div>
            )}
        </FieldBase>
    );
};
