import React, { createContext, useContext, useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { widgetsService } from '../../services/widgets-service';
import { appsService } from '../../services/apps-service';
import { integrationsService } from '../../services/integrations-service';
import { getError } from '../../lib/utils';
import type { Widget, Integration, AppJson, AppSettingField } from '../../lib/types';
import { Sliders, Settings2, Palette, Image, Volume2, Bell, Shield, Zap, User, MessageSquare, Type, Layout, AppWindow, Package, Globe, Heart, Activity, Hash, LayoutPanelLeft } from 'lucide-react';

const ICON_MAP: Record<string, any> = {
    general: Sliders,
    settings: Settings2,
    appearance: Palette,
    visuals: Image,
    audio: Volume2,
    volume: Volume2,
    notifications: Bell,
    security: Shield,
    advanced: Zap,
    profile: User,
    chat: MessageSquare,
    text: Type,
    layout: Layout,
    integrations: AppWindow,
    package: Package,
    globe: Globe,
    heart: Heart,
    activity: Activity,
    hash: Hash,
};

function getIcon(label: string, id: string) {
    const l = label.toLowerCase();
    const i = id.toLowerCase();
    for (const key in ICON_MAP) {
        if (l.includes(key) || i.includes(key)) return ICON_MAP[key];
    }
    return Settings2;
}

function buildSettingsDraftFromWidgetAndApp(widget: Widget, appJson: AppJson | null) {
    const draft: Record<string, unknown> = { ...widget.settings };
    const settingsDefs = Array.isArray(appJson?.settings) ? appJson.settings : [];

    const fillDefaults = (fields: AppSettingField[], target: Record<string, unknown>) => {
        for (const f of fields) {
            if (target[f.id] === undefined) {
                if (f.default !== undefined) target[f.id] = f.default;
                else if (f.type === 'boolean') target[f.id] = false;
                else if (f.type === 'number') target[f.id] = 0;
                else if (f.type === 'object') {
                    const obj = {} as Record<string, unknown>;
                    target[f.id] = obj;
                    fillDefaults(f.fields || f.children || [], obj);
                }
                else if (f.type === 'list') target[f.id] = [];
                else if (f.type === 'map') target[f.id] = {};
            } else if (f.type === 'object' && typeof target[f.id] === 'object' && target[f.id] !== null) {
                fillDefaults(f.fields || f.children || [], target[f.id] as Record<string, unknown>);
            }
        }
    };

    fillDefaults(settingsDefs, draft);
    return draft;
}

interface WidgetDetailsContextType {
    widget: Widget | null;
    appJson: AppJson | null;
    integrations: Integration[];
    loading: {
        widget: boolean;
        integrations: boolean;
        meta: boolean;
        settings: boolean;
    };
    error: string | null;
    setError: (err: string | null) => void;
    widgetError: string | null;
    activeTab: string;
    setActiveTab: (tab: string) => void;
    sidebarWidth: number;
    isResizing: boolean;
    startResizing: (e: React.MouseEvent) => void;
    metaDraft: {
        display_name: string;
        enabled: boolean;
        integration_ids: string[];
    };
    setMetaDraft: React.Dispatch<React.SetStateAction<{
        display_name: string;
        enabled: boolean;
        integration_ids: string[];
    }>>;
    settingsDraft: Record<string, unknown>;
    setSettingsDraft: React.Dispatch<React.SetStateAction<Record<string, unknown>>>;
    saveMeta: (nextMeta?: Partial<{ display_name: string; enabled: boolean; integration_ids: string[] }>) => Promise<void>;
    saveSettings: () => Promise<void>;
    rotateToken: () => Promise<void>;
    tabs: any[];
    activeTabLabel: string;
    activeTabData: any;
    compatibleIntegrations: Integration[];
    requiredIntegrationProviders: string[];
    hasMissingRequired: boolean;
}

const WidgetDetailsContext = createContext<WidgetDetailsContextType | undefined>(undefined);

export function WidgetDetailsProvider({ children }: { children: React.ReactNode }) {
    const { id } = useParams<{ id: string }>();
    const [widget, setWidget] = useState<Widget | null>(null);
    const [widgetLoading, setWidgetLoading] = useState(true);
    const [widgetError, setWidgetError] = useState<string | null>(null);
    const [integrations, setIntegrations] = useState<Integration[]>([]);
    const [integrationsLoading, setIntegrationsLoading] = useState(true);
    const [appJson, setAppJson] = useState<AppJson | null>(null);
    const [activeTab, setActiveTab] = useState<string>('overview');

    const [sidebarWidth, setSidebarWidth] = useState(400);
    const [isResizing, setIsResizing] = useState(false);
    const isResizingRef = useRef(false);

    const [metaDraft, setMetaDraft] = useState<{
        display_name: string;
        enabled: boolean;
        integration_ids: string[];
    }>({
        display_name: '',
        enabled: true,
        integration_ids: [],
    });

    const [settingsDraft, setSettingsDraft] = useState<Record<string, unknown>>({});
    const [settingsLoading, setSettingsLoading] = useState(false);
    const [metaLoading, setMetaLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadWidget = useCallback(async () => {
        if (!id) return;
        setWidgetLoading(true);
        setWidgetError(null);
        try {
            const data = await widgetsService.getWidget(id);
            setWidget(data);
            setMetaDraft({
                display_name: data.display_name,
                enabled: data.enabled,
                integration_ids: (data.integration_ids || []).map((i: any) => i.integrationId || i.id),
            });
        } catch (e) {
            setWidgetError(getError(e, 'Failed to load widget'));
        } finally {
            setWidgetLoading(false);
        }
    }, [id]);

    const loadIntegrations = useCallback(async () => {
        setIntegrationsLoading(true);
        try {
            const data = await integrationsService.listIntegrations();
            setIntegrations(data);
        } catch (e) {
            console.error('Failed to load integrations', e);
        } finally {
            setIntegrationsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadWidget();
        loadIntegrations();
    }, [loadWidget, loadIntegrations]);

    useEffect(() => {
        let cancelled = false;
        const loadAppJson = async () => {
            if (!widget?.app_id) return;
            try {
                const data = await appsService.getApp(widget.app_id);
                if (!cancelled) setAppJson(data);
            } catch (e) {
                console.error('Failed to load app.json', e);
            }
        };
        loadAppJson();
        return () => {
            cancelled = true;
        };
    }, [widget?.app_id]);

    useEffect(() => {
        if (!appJson || !widget) return;
        const next = buildSettingsDraftFromWidgetAndApp(widget, appJson);
        setSettingsDraft(next);
    }, [appJson, widget?.id]);

    const startResizing = useCallback((e: React.MouseEvent) => {
        isResizingRef.current = true;
        setIsResizing(true);
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
        e.preventDefault();
    }, []);

    const stopResizing = useCallback(() => {
        isResizingRef.current = false;
        setIsResizing(false);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
    }, []);

    const resize = useCallback((e: MouseEvent) => {
        if (isResizingRef.current) {
            const newWidth = e.clientX;
            const maxWidth = Math.min(window.innerWidth - 300, 800);
            if (newWidth >= 300 && newWidth <= maxWidth) {
                setSidebarWidth(newWidth);
            }
        }
    }, []);

    useEffect(() => {
        window.addEventListener("mousemove", resize);
        window.addEventListener("mouseup", stopResizing);
        return () => {
            window.removeEventListener("mousemove", resize);
            window.removeEventListener("mouseup", stopResizing);
        };
    }, [resize, stopResizing]);

    const saveMeta = async (nextMeta?: Partial<typeof metaDraft>) => {
        if (!widget) return;
        setError(null);
        setMetaLoading(true);
        const payload = {
            display_name: nextMeta?.display_name ?? metaDraft.display_name,
            integration_ids: nextMeta?.integration_ids ?? metaDraft.integration_ids,
            enabled: nextMeta?.enabled ?? metaDraft.enabled,
        };
        try {
            await widgetsService.updateWidgetMeta(widget.id, payload);
            await loadWidget();
        } catch (e) {
            setError(getError(e, 'Failed to update widget'));
        } finally {
            setMetaLoading(false);
        }
    };

    const saveSettings = async () => {
        if (!widget) return;
        setError(null);
        setSettingsLoading(true);
        try {
            await widgetsService.updateWidgetSettings(widget.id, settingsDraft);
            await loadWidget();
        } catch (e) {
            setError(getError(e, 'Failed to update widget settings'));
        } finally {
            setSettingsLoading(false);
        }
    };

    const rotateToken = async () => {
        if (!widget) return;
        setError(null);
        setMetaLoading(true);
        try {
            await widgetsService.rotateWidgetToken(widget.id);
            await loadWidget();
        } catch (e) {
            setError(getError(e, 'Failed to rotate token'));
        } finally {
            setMetaLoading(false);
        }
    };

    const { tabs, activeTabLabel } = useMemo(() => {
        const results: { id: string; label: string; icon: any; fields: AppSettingField[]; isGroup?: boolean }[] = [
            { id: 'overview', label: 'Profile', icon: LayoutPanelLeft, fields: [] }
        ];

        if (appJson?.settings) {
            const rootFields: AppSettingField[] = [];

            appJson.settings.forEach(f => {
                if (f.type === 'object' || f.type === 'group') {
                    results.push({
                        id: f.id,
                        label: f.label || f.id,
                        icon: getIcon(f.label || '', f.id),
                        fields: f.fields || f.children || [],
                        isGroup: true
                    });
                } else {
                    rootFields.push(f);
                }
            });

            if (rootFields.length > 0) {
                results.push({
                    id: 'root_settings',
                    label: 'Settings',
                    icon: Settings2,
                    fields: rootFields,
                    isGroup: false
                });
            }
        }

        const active = results.find(t => t.id === activeTab) || results[0];

        return { tabs: results, activeTabLabel: active.label };
    }, [appJson, activeTab]);

    const activeTabData = useMemo(() => tabs.find(t => t.id === activeTab) || tabs[0], [tabs, activeTab]);

    const integrationProps = useMemo(() =>
        Array.isArray(appJson?.properties?.integrations) ? appJson.properties.integrations : [],
        [appJson]
    );

    const requiredIntegrationProviders = useMemo(() => {
        return integrationProps.filter((p: { provider: string; is_required?: boolean }) => p.is_required).map((p: { provider: string }) => p.provider.toLowerCase());
    }, [integrationProps]);

    const compatibleIntegrations = useMemo(() => {
        if (!appJson) return [];
        const supportedProviders = integrationProps.map((p: { provider: string }) => p.provider.toLowerCase());
        return integrations.filter(i => supportedProviders.includes((i.provider as string).toLowerCase()));
    }, [integrations, appJson, integrationProps]);

    const hasMissingRequired = useMemo(() => {
        const selectedProviders = compatibleIntegrations
            .filter(i => metaDraft.integration_ids.includes(i.id))
            .map(i => (i.provider as string).toLowerCase());
        return requiredIntegrationProviders.some((p: string) => !selectedProviders.includes(p));
    }, [requiredIntegrationProviders, compatibleIntegrations, metaDraft.integration_ids]);

    return (
        <WidgetDetailsContext.Provider value={{
            widget,
            appJson,
            integrations,
            loading: {
                widget: widgetLoading,
                integrations: integrationsLoading,
                meta: metaLoading,
                settings: settingsLoading,
            },
            error,
            setError,
            widgetError,
            activeTab,
            setActiveTab,
            sidebarWidth,
            isResizing,
            startResizing,
            metaDraft,
            setMetaDraft,
            settingsDraft,
            setSettingsDraft,
            saveMeta,
            saveSettings,
            rotateToken,
            tabs,
            activeTabLabel,
            activeTabData,
            compatibleIntegrations,
            requiredIntegrationProviders,
            hasMissingRequired,
        }}>
            {children}
        </WidgetDetailsContext.Provider>
    );
}

export const useWidgetDetails = () => {
    const context = useContext(WidgetDetailsContext);
    if (context === undefined) {
        throw new Error('useWidgetDetails must be used within a WidgetDetailsProvider');
    }
    return context;
};
