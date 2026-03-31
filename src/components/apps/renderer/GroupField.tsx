import React, { useState } from 'react';
import { Settings, Layers } from 'lucide-react';

import { FieldBase } from './FieldBase';
import { type AppSettingField } from '@/lib/types';
import { FieldRenderer } from './FieldRenderer';

interface GroupFieldProps {
    field: AppSettingField;
    value: any;
    onChange: (value: any) => void;
    depth?: number;
}

export const GroupField: React.FC<GroupFieldProps> = ({ field, value, onChange, depth = 0 }) => {
    const [isExpanded, setIsExpanded] = useState(true);

    const childFields = field.fields || field.children || [];
    const objValue = value || {};

    const icon = field.type === 'group' ? <Settings className="w-3.5 h-3.5" /> : <Layers className="w-3.5 h-3.5" />;

    return (
        <FieldBase
            field={field}
            icon={icon}
            depth={depth}
            collapsible
            isExpanded={isExpanded}
            onToggleExpand={() => setIsExpanded(!isExpanded)}
            description={field.description}
        >
            <div className="mt-4 space-y-4 pl-1">
                {childFields.map((f) => (
                    <FieldRenderer
                        key={f.id}
                        field={f}
                        value={objValue[f.id]}
                        onChange={(v) => onChange({ ...objValue, [f.id]: v })}
                        depth={depth + 1}
                    />
                ))}
            </div>
        </FieldBase>
    );
};
