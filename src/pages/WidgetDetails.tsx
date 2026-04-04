import {
    RotateCcw, Save, Settings2, ArrowLeft, Loader2,
    AlertCircle, Copy, Check, ExternalLink, Eye, EyeOff, LayoutPanelLeft,
    Sliders, Palette, Bell, Volume2, Shield, Zap, User, Image,
    MessageSquare, Type, Layout, AppWindow, Package, Globe, Heart, Activity, Hash
} from 'lucide-react';
import { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';

import { appsService } from '../services/apps-service';
import { widgetsService } from '../services/widgets-service';
import { integrationsService } from '../services/integrations-service';
import type { Widget, Integration, AppJson, AppSettingField } from '../lib/types';
import { getError, cn } from '../lib/utils';
import { FieldRenderer } from '../components/apps/renderer/FieldRenderer';
import { useAuthStore } from '../stores/auth-store';
import { AppSettingsProvider } from '../components/apps/AppSettingsContext';

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

export default function WidgetDetails() {
    const { user } = useAuthStore();
    const { id } = useParams<{ id: string }>();
    const [widget, setWidget] = useState<Widget | null>(null);
    const [widgetLoading, setWidgetLoading] = useState(true);
    const [widgetError, setWidgetError] = useState<string | null>(null);
    const [integrations, setIntegrations] = useState<Integration[]>([]);
    const [integrationsLoading, setIntegrationsLoading] = useState(true);

    const [appJson, setAppJson] = useState<AppJson | null>(null);

    const [activeTab, setActiveTab] = useState<string>('overview');

    // Sidebar Resizer
    const [sidebarWidth, setSidebarWidth] = useState(400);
    const [isResizing, setIsResizing] = useState(false);
    const isResizingRef = useRef(false);

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

    const [showUrl, setShowUrl] = useState(false);
    const [copied, setCopied] = useState(false);

    const [metaDraft, setMetaDraft] = useState<{
        display_name: string;
        enabled: boolean;
        integrations: string[];
    }>({
        display_name: '',
        enabled: true,
        integrations: [],
    });

    const [settingsDraft, setSettingsDraft] = useState<Record<string, unknown>>({});
    const [settingsLoading, setSettingsLoading] = useState(false);
    const [metaLoading, setMetaLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const WIDGET_SERVER = import.meta.env.VITE_APP_WIDGET_SERVER || 'http://localhost:4000';

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
                integrations: data.integrations ?? [],
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
            .filter(i => metaDraft.integrations.includes(i.id))
            .map(i => (i.provider as string).toLowerCase());
        return requiredIntegrationProviders.some((p: string) => !selectedProviders.includes(p));
    }, [requiredIntegrationProviders, compatibleIntegrations, metaDraft.integrations]);

    // Compute dynamic tabs based on app settings
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
                // If there are root fields, add a "Settings" tab.
                // We'll put it after Overview but before other groups if it's the "main" config
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

    const saveMeta = async (nextMeta?: Partial<typeof metaDraft>) => {
        if (!widget) return;
        setError(null);
        setMetaLoading(true);
        const payload = {
            display_name: nextMeta?.display_name ?? metaDraft.display_name,
            integrations: nextMeta?.integrations ?? metaDraft.integrations,
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

    const widgetUrl = widget ? `${WIDGET_SERVER}/widget/${widget.app_id}?token=${widget.token}` : '';
    const previewUrl = widget ? `${widgetUrl}&ispreview=true` : '';

    const copyUrl = () => {
        navigator.clipboard.writeText(widgetUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (widgetLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-black gap-4 p-6">
                <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
                <p className="text-zinc-500 font-medium tracking-tight text-center">Loading Instance...</p>
            </div>
        );
    }

    if (widgetError || !widget) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-black p-6 text-center">
                <div className="max-w-md w-full bg-zinc-900/50 border border-red-500/10 p-8 lg:p-10 rounded-[2rem] lg:rounded-[2.5rem] backdrop-blur-2xl">
                    <AlertCircle className="w-12 h-12 lg:w-16 lg:h-16 text-red-500 mx-auto mb-6 opacity-80" />
                    <h2 className="text-xl lg:text-2xl font-black text-white mb-3">Widget not found</h2>
                    <p className="text-zinc-400 mb-8 leading-relaxed text-sm">{widgetError || 'Could not load instance.'}</p>
                    <Link to="/widgets" className="inline-flex items-center gap-2 px-6 lg:px-8 py-3 lg:py-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-2xl transition-all font-bold border border-white/5 text-sm">
                        <ArrowLeft className="w-4 h-4" />
                        Go Back
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row h-screen bg-black overflow-hidden font-sans">
            {/* Settings Sidebar - Full Width on Mobile, Sidebar on Desktop */}
            <aside
                className={cn(
                    "w-full flex border-b lg:border-b-0 lg:border-r border-white/5 bg-zinc-950/80 backdrop-blur-3xl z-20 shrink-0 lg:h-full order-2 lg:order-none overflow-hidden transition-colors",
                    isResizing && "border-violet-500/40 border-r-2"
                )}
                style={{ width: `${sidebarWidth}px`, maxWidth: '85vw' }}
            >
                {/* Left Rail Icons */}
                <div className="w-14 shrink-0 border-r border-white/5 bg-black/40 flex flex-col items-center py-4 gap-4">
                    <Link to="/widgets" className="p-2.5 mb-2 border border-white/5 rounded-xl bg-zinc-900/50 hover:bg-zinc-800 transition-all group text-zinc-500 hover:text-white">
                        <ArrowLeft className="w-4 h-4" />
                    </Link>

                    <div className="w-8 h-[1px] bg-white/5 mb-2" />

                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <div key={tab.id} className="relative group">
                                <button
                                    onClick={() => setActiveTab(tab.id)}
                                    className={cn(
                                        "p-3 rounded-xl transition-all duration-300 relative",
                                        isActive
                                            ? "bg-violet-600 text-white shadow-lg shadow-violet-600/20"
                                            : "text-zinc-600 hover:text-zinc-300 hover:bg-white/5"
                                    )}
                                >
                                    <Icon className="w-4 h-4" />
                                    {isActive && (
                                        <div className="absolute right-[-7px] top-1/2 -translate-y-1/2 w-1 h-4 bg-violet-500 rounded-full" />
                                    )}
                                </button>

                                {/* Tooltip */}
                                <div className="absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 px-2 py-1 bg-zinc-900 border border-white/10 rounded-md text-[8px] font-bold text-white uppercase tracking-wider whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-50 translate-x-2 group-hover:translate-x-0">
                                    {tab.label}
                                    <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-zinc-900 border-l border-b border-white/10 rotate-45" />
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Right Side: Header + Content */}
                <div className="flex-1 flex flex-col min-w-0 h-full">
                    <div className="p-4 border-b border-white/5 flex items-center justify-between bg-black/20 shrink-0">
                        <div className="min-w-0">
                            <h1 className="text-[10px] font-black text-white leading-none tracking-tight uppercase mb-1">{activeTabLabel}</h1>
                            <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest truncate">{widget.display_name || widget.app_id}</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className={`w-1.5 h-1.5 rounded-full ${widget.enabled ? 'bg-emerald-500' : 'bg-rose-500'} shadow-[0_0_8px_rgba(16,185,129,0.3)]`} />

                            {activeTab === 'overview' ? (
                                <button
                                    onClick={() => saveMeta()}
                                    disabled={metaLoading || hasMissingRequired}
                                    className="px-3 py-1.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-30 text-white text-[8px] font-black uppercase tracking-widest rounded-lg transition-all flex items-center gap-1.5 active:scale-95"
                                >
                                    {metaLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                                    Save
                                </button>
                            ) : (
                                <button
                                    onClick={saveSettings}
                                    disabled={settingsLoading}
                                    className="px-3 py-1.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-30 text-white text-[8px] font-black uppercase tracking-widest rounded-lg transition-all flex items-center gap-1.5 active:scale-95"
                                >
                                    {settingsLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                                    Apply
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto scrollbar-hide px-5 pb-8 py-5">
                        {activeTab === 'overview' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-left-2 duration-300">
                                <div className="space-y-3">
                                    <label className="text-[7.5px] font-black text-zinc-600 uppercase tracking-widest px-1 flex items-center gap-2">
                                        <span className="w-4 h-[1px] bg-zinc-800" />
                                        Identity
                                    </label>
                                    <div className="space-y-1.5">
                                        <span className="text-[8px] font-bold text-zinc-500 uppercase px-1">Display Name</span>
                                        <input
                                            value={metaDraft.display_name}
                                            onChange={e => setMetaDraft(p => ({ ...p, display_name: e.target.value }))}
                                            className="w-full bg-zinc-900/30 border border-white/5 rounded-xl px-3 py-2 text-[10px] font-bold text-white focus:outline-none focus:ring-1 focus:ring-violet-500/40 transition-all placeholder:text-zinc-700"
                                            placeholder="My Awesome Widget"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3 pt-2">
                                    <label className="text-[7.5px] font-black text-zinc-600 uppercase tracking-widest px-1 flex items-center gap-2">
                                        <span className="w-4 h-[1px] bg-zinc-800" />
                                        Connections
                                    </label>
                                    <div className="grid grid-cols-1 gap-1.5">
                                        {integrationsLoading ? (
                                            <div className="py-6 flex flex-col items-center justify-center border border-dashed border-white/5 rounded-xl">
                                                <Loader2 className="w-3 h-3 text-zinc-800 animate-spin" />
                                            </div>
                                        ) : compatibleIntegrations.length === 0 ? (
                                            <div className="p-3 text-center border border-dashed border-rose-500/10 rounded-xl bg-rose-500/5">
                                                <p className="text-[8px] font-bold text-rose-500/60 uppercase tracking-widest">No compatible connects</p>
                                            </div>
                                        ) : (
                                            compatibleIntegrations.map((i: Integration) => {
                                                const isChecked = metaDraft.integrations.includes(i.id);
                                                const isRequired = requiredIntegrationProviders.includes((i.provider as string).toLowerCase());
                                                return (
                                                    <button
                                                        key={i.id}
                                                        onClick={() => {
                                                            const next = isChecked ? metaDraft.integrations.filter(x => x !== i.id) : [...new Set([...metaDraft.integrations, i.id])];
                                                            setMetaDraft(prev => ({ ...prev, integrations: next }));
                                                        }}
                                                        className={cn(
                                                            "flex items-center justify-between p-2.5 rounded-xl border transition-all text-left group",
                                                            isChecked ? "bg-violet-600/10 border-violet-500/20 text-violet-400 shadow-lg shadow-violet-600/5" : "bg-zinc-900/20 border-white/5 text-zinc-500 hover:border-white/10 hover:text-zinc-300"
                                                        )}
                                                    >
                                                        <div className="flex items-center gap-2.5 min-w-0">
                                                            {i.providerAvatarUrl ? (
                                                                <img src={i.providerAvatarUrl} className={cn("w-4.5 h-4.5 rounded-md bg-zinc-950 border border-white/5 transition-all outline outline-offset-1 outline-transparent group-hover:outline-white/10", isChecked ? "grayscale-0 opacity-100" : "grayscale opacity-40")} alt="" />
                                                            ) : (
                                                                <div className={cn("w-1.5 h-1.5 rounded-full", isChecked ? "bg-violet-500" : "bg-zinc-800")} />
                                                            )}
                                                            <div className="min-w-0">
                                                                <span className="block text-[8.5px] font-black uppercase tracking-tight truncate leading-none mb-0.5">{i.displayName || i.providerUsername}</span>
                                                                <span className="block text-[6px] font-bold text-zinc-600 uppercase tracking-widest leading-none">{i.provider}</span>
                                                            </div>
                                                        </div>
                                                        {isRequired && !isChecked && <span className="text-[5.5px] font-black bg-rose-500/20 text-rose-500 px-1 py-0.5 rounded uppercase font-mono">REQ</span>}
                                                    </button>
                                                );
                                            })
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab !== 'overview' && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-left-2 duration-300">
                                {!appJson ? (
                                    <div className="py-12 text-center flex flex-col items-center gap-3">
                                        <Loader2 className="w-4 h-4 text-zinc-800 animate-spin" />
                                        <p className="text-[8px] font-black uppercase tracking-widest text-zinc-700">Syncing Schema...</p>
                                    </div>
                                ) : !activeTabData?.fields || activeTabData.fields.length === 0 ? (
                                    <div className="py-12 text-center">
                                        <p className="text-[8px] font-bold text-zinc-700 uppercase tracking-widest">Minimal Config</p>
                                    </div>
                                ) : (
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
                                            {activeTabData.fields.map((field) => (
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
                                )}
                            </div>
                        )}

                        {error && (
                            <div className="p-3 bg-red-600/5 border border-red-500/10 rounded-xl flex items-center gap-3 mt-6">
                                <AlertCircle className="w-3 h-3 text-red-500 shrink-0" />
                                <p className="text-[7.5px] font-bold text-red-500 uppercase tracking-widest">{error}</p>
                            </div>
                        )}
                    </div>
                </div>
            </aside>



            {/* Resize Handle for Desktop */}
            <div
                onMouseDown={startResizing}
                className={cn(
                    "hidden lg:block w-1.5 h-screen cursor-col-resize z-50 transition-all hover:bg-violet-500/20 active:bg-violet-500/40 relative shrink-0",
                    isResizing && "bg-violet-500/40"
                )}
                style={{ marginLeft: '-3px', marginRight: '-3px' }}
            />

            {/* Main Column: Preview & Top Bar */}
            <main className="flex-1 relative flex flex-col overflow-hidden bg-black order-1 lg:order-none h-[50vh] lg:h-auto">
                {/* Top Management Bar - Responsive */}
                <header className="min-h-16 lg:h-16 border-b border-white/5 bg-zinc-950/60 backdrop-blur-3xl flex flex-col lg:flex-row items-center justify-between px-4 lg:px-6 py-3 lg:py-0 z-10 shrink-0 gap-4 lg:gap-0 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
                    <div className="flex items-center gap-3 lg:gap-4 flex-1 w-full lg:max-w-3xl">
                        <div className="relative group flex-1 min-w-0">
                            <div className={cn(
                                "bg-zinc-900/60 border border-white/10 rounded-xl px-4 py-2.5 font-mono text-[10px] lg:text-[11px] text-zinc-400 transition-all duration-700 truncate",
                                !showUrl && "blur-[10px] select-none opacity-40 group-hover:opacity-60"
                            )}>
                                {widgetUrl || '------------------------------------------------------------'}
                            </div>

                            {!showUrl && (
                                <div className="absolute inset-0 flex items-center px-4 font-black text-[8px] lg:text-[9px] uppercase tracking-[0.2em] text-zinc-500 group-hover:text-zinc-300 transition-colors pointer-events-none">
                                    <span className="hidden sm:inline">Overlay URL Locked</span>
                                    <span className="sm:hidden">URL Hidden</span>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-1 lg:gap-1.5 shrink-0">
                            <button
                                onClick={() => setShowUrl(!showUrl)}
                                className="p-2.5 bg-zinc-900 border border-white/5 rounded-xl hover:bg-zinc-800 transition-all text-zinc-400 hover:text-white"
                                title={showUrl ? "Hide" : "Show"}
                            >
                                {showUrl ? <EyeOff className="w-3.5 h-3.5 lg:w-4 h-4" /> : <Eye className="w-3.5 h-3.5 lg:w-4 h-4" />}
                            </button>
                            <button
                                onClick={copyUrl}
                                className="flex items-center gap-2 px-3 lg:px-4 py-2.5 bg-zinc-900 border border-white/5 rounded-xl hover:bg-zinc-800 transition-all text-zinc-400 hover:text-white group"
                            >
                                {copied ? <Check className="w-3.5 h-3.5 lg:w-4 h-4 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 lg:w-4 h-4 group-hover:scale-110 transition-transform" />}
                                <span className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest hidden sm:block whitespace-nowrap">{copied ? 'Copied' : 'Copy'}</span>
                            </button>
                            <button
                                onClick={rotateToken}
                                className="flex items-center gap-2 px-3 lg:px-4 py-2.5 bg-zinc-900 border border-white/5 rounded-xl hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/20 transition-all text-zinc-400 group"
                            >
                                <RotateCcw className="w-3.5 h-3.5 lg:w-4 h-4 group-hover:rotate-[-90deg] transition-transform" />
                                <span className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest hidden sm:block whitespace-nowrap">Rotate Token</span>
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between lg:justify-end gap-6 w-full lg:w-auto lg:ml-6 lg:border-l border-white/5 lg:pl-6 shrink-0">
                        <div className="flex items-center gap-4">
                            <div className="flex flex-col items-start lg:items-end">
                                <span className={cn(
                                    "text-[9px] lg:text-[10px] font-black uppercase tracking-widest transition-colors",
                                    widget.enabled ? "text-emerald-500" : "text-rose-500/70"
                                )}>
                                    {widget.enabled ? "Enabled" : "Disabled"}
                                </span>
                            </div>
                            <button
                                onClick={() => saveMeta({ enabled: !metaDraft.enabled })}
                                className={cn(
                                    "w-10 lg:w-11 h-5 lg:h-5.5 rounded-full relative transition-all duration-500 shadow-lg border",
                                    metaDraft.enabled ? "bg-emerald-500 border-emerald-400/20" : "bg-zinc-800 border-white/5"
                                )}
                            >
                                <div className={cn(
                                    "absolute top-0.5 lg:top-0.75 w-3.5 h-3.5 rounded-full bg-white transition-all shadow-sm",
                                    metaDraft.enabled ? "right-1" : "left-1"
                                )} />
                            </button>
                        </div>

                        <div className="lg:hidden flex items-center gap-2 px-3 py-1.5 bg-zinc-900/50 border border-white/5 rounded-lg">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[8px] font-black uppercase text-zinc-500">Preview</span>
                        </div>
                    </div>
                </header>

                {/* Hero Preview Area */}
                <div className="flex-1 relative flex items-center justify-center min-h-[300px]">
                    {/* Background Pattern */}
                    <div
                        className="absolute inset-0 z-0 opacity-[0.05]"
                        style={{
                            backgroundImage: `
                  linear-gradient(45deg, #FFF 25%, transparent 25%), 
                  linear-gradient(-45deg, #FFF 25%, transparent 25%), 
                  linear-gradient(45deg, transparent 75%, #FFF 75%), 
                  linear-gradient(-45deg, transparent 75%, #FFF 75%)
                `,
                            backgroundSize: '40px 40px',
                            backgroundPosition: '0 0, 0 20px, 20px -20px, -20px 0px'
                        }}
                    />

                    {/* Iframe Container */}
                    <div className="relative z-10 w-full h-full flex items-center justify-center">
                        {widget && widget.enabled ? (
                            <iframe
                                src={previewUrl}
                                className="w-full h-full border-none pointer-events-none transition-all duration-1000"
                                style={{ filter: 'drop-shadow(0 0 50px rgba(0,0,0,0.5))' }}
                                title="Widget Preview"
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center text-center p-6 lg:p-12 bg-black/40 backdrop-blur-md rounded-2xl lg:rounded-3xl border border-white/5 animate-in fade-in zoom-in-95 duration-500 mx-4">
                                <div className="p-6 lg:p-8 bg-zinc-900/40 rounded-full border border-white/5 mb-6 lg:mb-8">
                                    <EyeOff className="w-10 h-10 lg:w-12 lg:h-12 text-zinc-800" />
                                </div>
                                <h2 className="text-lg lg:text-xl font-black text-white uppercase tracking-tighter mb-2">Overlay Off-Air</h2>
                                <p className="text-xs lg:text-sm font-medium text-zinc-600 max-w-[240px] leading-relaxed">The overlay output is currently disabled. Toggle the master switch above to go live.</p>
                            </div>
                        )}
                    </div>

                    <button
                        className="absolute bottom-4 right-4 lg:bottom-6 lg:right-6 p-2 lg:p-3 bg-zinc-950/80 backdrop-blur-xl border border-white/10 rounded-xl lg:rounded-2xl hover:bg-zinc-800 transition-all text-zinc-400 hover:text-white group z-20"
                        onClick={() => window.open(widgetUrl, '_blank')}
                        title="Open in new tab"
                    >
                        <ExternalLink className="w-3.5 h-3.5 lg:w-4 h-4 group-hover:scale-110 transition-transform" />
                    </button>
                </div>
            </main>
        </div>
    );
}
