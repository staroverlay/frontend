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
                        "relative w-8 h-4 rounded-full transition-all duration-300 outline-none hover:ring-4 hover:ring-brand-primary/5 border",
                        val ? "bg-brand-primary border-brand-primary" : "bg-surface-base border-border-subtle"
                    )}
                >
                    <div className={cn(
                        "absolute top-0.75 w-2.5 h-2.5 rounded-full bg-white transition-all duration-300 shadow-sm",
                        val ? "left-4.75" : "left-0.75 bg-content-muted"
                    )} />
                </button>
            ) : (
                <div className="flex gap-2 items-center">
                    <input
                        type="checkbox"
                        checked={val}
                        onChange={(e) => onChange(e.target.checked)}
                        className="w-3.5 h-3.5 rounded border-border-subtle bg-surface-base text-brand-primary focus:ring-brand-primary/40 cursor-pointer"
                    />
                    <span className="text-[9px] font-black text-content-dimmed uppercase tracking-widest">{val ? 'On' : 'Off'}</span>
                </div>
            )}
        </FieldBase>
    );
};
