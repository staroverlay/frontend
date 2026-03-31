import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import { type AppSettingField } from '@/lib/types';

interface FieldBaseProps {
    field: AppSettingField;
    icon: React.ReactNode;
    children: React.ReactNode;
    depth?: number;
    collapsible?: boolean;
    description?: string;
    isExpanded?: boolean;
    onToggleExpand?: () => void;
}

export const FieldBase: React.FC<FieldBaseProps> = ({
    field,
    icon,
    children,
    depth = 0,
    collapsible = false,
    description,
    isExpanded = true,
    onToggleExpand
}) => {
    const label = field.label || field.id;

    const containerClasses = cn(
        "relative flex flex-col gap-2 p-4 rounded-3xl bg-zinc-950/20 border border-white/[0.03] transition-all hover:bg-zinc-950/40 hover:border-white/[0.06] group/field",
        depth > 0 && "p-2 bg-transparent border-white/[0.01]"
    );

    return (
        <div className={containerClasses}>
            <div
                className={cn(
                    "flex items-start justify-between gap-1.5 mb-1.5 px-0.5",
                    collapsible && "cursor-pointer group"
                )}
                onClick={collapsible ? onToggleExpand : undefined}
            >
                <div className="flex gap-2 items-center">
                    <div className={cn(
                        "p-1.5 rounded-md border border-white/5 bg-zinc-950/40 text-zinc-500 transition-colors shrink-0",
                        (collapsible ? isExpanded : true) ? "text-violet-500 border-violet-500/20" : "group-hover:text-zinc-300"
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
                        {description && (
                            <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest leading-tight mt-0.5">
                                {description}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {(!collapsible || isExpanded) && (
                <div className="animate-in fade-in slide-in-from-top-1 duration-200">
                    {children}
                </div>
            )}
        </div>
    );
};
