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
        "relative flex flex-col gap-1.5 py-2 px-1 transition-all group/field",
        depth > 0 && "py-1 px-1"
    );

    return (
        <div className={containerClasses}>
            <div
                className={cn(
                    "flex items-start justify-between gap-1.5 px-0.5",
                    collapsible && "cursor-pointer group"
                )}
                onClick={collapsible ? onToggleExpand : undefined}
            >
                <div className="flex gap-2 items-center">
                    <div className={cn(
                        "p-1 rounded-md text-zinc-600 transition-colors shrink-0",
                        (collapsible ? isExpanded : true) ? "text-violet-500" : "group-hover:text-zinc-300"
                    )}>
                        <div className="w-3 h-3 flex items-center justify-center">
                            {icon}
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[8.5px] font-black uppercase text-zinc-500 tracking-wider flex items-center gap-1 group-hover:text-zinc-300 transition-colors">
                            {label}
                            {collapsible && (
                                isExpanded ? <ChevronDown className="w-2.5 h-2.5 text-zinc-700" /> : <ChevronRight className="w-2.5 h-2.5 text-zinc-700" />
                            )}
                        </span>
                        {description && (
                            <span className="text-[7.5px] font-bold text-zinc-600 uppercase tracking-widest leading-tight mt-0.5 opacity-60">
                                {description}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {(!collapsible || isExpanded) && (
                <div className="animate-in fade-in slide-in-from-top-1 duration-200 mt-1">
                    {children}
                </div>
            )}
        </div>
    );
};
