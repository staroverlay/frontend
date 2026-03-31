import React from 'react';

import { type AppSettingField } from '@/lib/types';
import { TextField } from './TextField';
import { NumberField } from './NumberField';
import { BooleanField } from './BooleanField';
import { ColorField } from './ColorField';
import { MediaField } from './MediaField';
import { RewardField } from './RewardField';
import { GroupField } from './GroupField';
import { ListField } from './ListField';
import { MapField } from './MapField';

interface FieldRendererProps {
    field: AppSettingField;
    value: any;
    onChange: (value: any) => void;
    depth?: number;
}

export const FieldRenderer: React.FC<FieldRendererProps> = ({ field, value, onChange, depth = 0 }) => {
    const type = field.type;

    switch (type) {
        case 'group':
        case 'object':
            return <GroupField field={field} value={value} onChange={onChange} depth={depth} />;

        case 'list':
            return <ListField field={field} value={value} onChange={onChange} depth={depth} />;

        case 'map':
            return <MapField field={field} value={value} onChange={onChange} depth={depth} />;

        case 'boolean':
            return <BooleanField field={field} value={value} onChange={onChange} depth={depth} />;

        case 'number':
            return <NumberField field={field} value={value} onChange={onChange} depth={depth} />;

        case 'color':
            return <ColorField field={field} value={value} onChange={onChange} depth={depth} />;

        case 'media':
        case 'media:image':
        case 'media:video':
        case 'media:audio':
            return <MediaField field={field} value={value} onChange={onChange} depth={depth} />;

        case 'channel-reward':
            return <RewardField field={field} value={value} onChange={onChange} depth={depth} />;

        case 'text':
        case 'select':
        default:
            return <TextField field={field} value={value} onChange={onChange} depth={depth} />;
    }
};
