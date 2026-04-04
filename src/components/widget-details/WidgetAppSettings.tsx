import { Loader2 } from 'lucide-react';
import { useWidgetDetails } from './WidgetDetailsContext';
import { AppSettingsProvider } from '../apps/AppSettingsContext';
import { FieldRenderer } from '../apps/renderer/FieldRenderer';
import { useAuthStore } from '../../stores/auth-store';

export const WidgetAppSettings = () => {
    const { user } = useAuthStore();
    const {
        appJson,
        activeTabData,
        settingsDraft,
        setSettingsDraft,
        metaDraft
    } = useWidgetDetails();

    if (!appJson) {
        return (
            <div className="py-12 text-center flex flex-col items-center gap-3">
                <Loader2 className="w-4 h-4 text-zinc-800 animate-spin" />
                <p className="text-[8px] font-black uppercase tracking-widest text-zinc-700">Syncing Schema...</p>
            </div>
        );
    }

    if (!activeTabData?.fields || activeTabData.fields.length === 0) {
        return (
            <div className="py-12 text-center">
                <p className="text-[8px] font-bold text-zinc-700 uppercase tracking-widest">Minimal Config</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-left-2 duration-300">
            <AppSettingsProvider
                userId={user?.id}
                integrationIds={metaDraft.integrations}
                values={settingsDraft}
                onChange={(id, val) => {
                    if (activeTabData.isGroup) {
                        const currentGroup = (settingsDraft[activeTabData.id] as any) || {};
                        setSettingsDraft(p => ({
                            ...p,
                            [activeTabData.id]: { ...currentGroup, [id]: val }
                        }));
                    } else {
                        setSettingsDraft(p => ({ ...p, [id]: val }));
                    }
                }}
            >
                <div className="space-y-4">
                    {activeTabData.fields.map((field: any) => (
                        <div key={field.id}>
                            <FieldRenderer
                                field={field}
                                value={activeTabData.isGroup ? (settingsDraft[activeTabData.id] as any)?.[field.id] : settingsDraft[field.id]}
                                onChange={(val) => {
                                    if (activeTabData.isGroup) {
                                        const currentGroup = (settingsDraft[activeTabData.id] as any) || {};
                                        setSettingsDraft(p => ({
                                            ...p,
                                            [activeTabData.id]: { ...currentGroup, [field.id]: val }
                                        }));
                                    } else {
                                        setSettingsDraft(p => ({ ...p, [field.id]: val }));
                                    }
                                }}
                            />
                        </div>
                    ))}
                </div>
            </AppSettingsProvider>
        </div>
    );
};
