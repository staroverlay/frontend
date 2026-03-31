import React from 'react';

import { useAuth } from '../../hooks/use-auth';
import { type AppSettingField } from '../../lib/types';
import { AppSettingsProvider } from './AppSettingsContext';
import { FieldRenderer } from './renderer/FieldRenderer';

interface AppSettingsProps {
    fields: AppSettingField[];
    values: Record<string, any>;
    onChange: (path: string, value: any) => void;
    integrationIds?: string[];
}

export const AppSettings: React.FC<AppSettingsProps> = ({ fields, values, onChange, integrationIds }) => {
    const { user } = useAuth();

    return (
        <AppSettingsProvider
            values={values}
            onChange={onChange}
            userId={user?.id}
            integrationIds={integrationIds}
        >
            <div className="space-y-4">
                {fields.map((field) => (
                    <div key={field.id}>
                        <FieldRenderer
                            field={field}
                            value={values[field.id]}
                            onChange={(val) => onChange(field.id, val)}
                        />
                    </div>
                ))}
            </div>
        </AppSettingsProvider>
    );
};
