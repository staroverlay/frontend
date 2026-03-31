import React, { createContext, useContext } from 'react';

interface AppSettingsContextType {
    values: Record<string, any>;
    onChange: (path: string, value: any) => void;
    userId?: string;
    integrationIds?: string[];
}

const AppSettingsContext = createContext<AppSettingsContextType | undefined>(undefined);

export const AppSettingsProvider: React.FC<{
    children: React.ReactNode,
    values: Record<string, any>,
    onChange: (path: string, value: any) => void,
    userId?: string,
    integrationIds?: string[]
}> = ({ children, values, onChange, userId, integrationIds }) => {
    return (
        <AppSettingsContext.Provider value={{ values, onChange, userId, integrationIds }}>
            {children}
        </AppSettingsContext.Provider>
    );
};

export const useCurrentAppSettings = () => {
    const context = useContext(AppSettingsContext);
    if (!context) {
        throw new Error('useCurrentAppSettings must be used within an AppSettingsProvider');
    }
    return context;
};
