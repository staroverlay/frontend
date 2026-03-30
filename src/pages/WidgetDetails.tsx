import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    RotateCcw, Save, Settings2, ArrowLeft, Loader2,
    AlertCircle, Copy, Check, ExternalLink, Eye, EyeOff, LayoutPanelLeft
} from 'lucide-react';

import { appsService } from '../services/apps-service';
import { widgetsService } from '../services/widgets-service';
import type { Widget } from '../lib/types';
import { getError, cn } from '../lib/utils';

type AppSettingChild = {
    id: string;
    type: 'text' | 'number' | 'boolean' | 'select' | string;
    label?: string;
    description?: string;
    default?: unknown;
    num_type?: 'integer' | string;
    num_min?: number;
    num_max?: number;
    render_as?: string;
    slider_step?: number;
    options?: Array<{ value: string; label?: string }>;
};

function stripMaybeNumber(v: unknown): number | null {
    if (typeof v === 'number' && Number.isFinite(v)) return v;
    if (typeof v === 'string' && v.trim().length > 0) {
        const n = Number(v);
        if (Number.isFinite(n)) return n;
    }
    return null;
}

function getByDottedPath(obj: unknown, dottedPath: string): unknown {
    if (!obj || typeof obj !== 'object') return undefined;
    const parts = dottedPath.split('.');
    let cur: any = obj;
    for (const part of parts) {
        if (cur == null) return undefined;
        cur = cur[part];
    }
    return cur;
}

function getDefaultValueForChild(child: AppSettingChild): unknown {
    if (child.default !== undefined) return child.default;
    switch (child.type) {
        case 'boolean': return false;
        case 'number': return 0;
        case 'select': return child.options?.[0]?.value ?? '';
        case 'text':
        default: return '';
    }
}

function buildFlatSettings(appJson: any): Array<{
    key: string;
    groupId?: string;
    groupLabel?: string;
    child: AppSettingChild;
}> {
    const settingsDefs = Array.isArray(appJson?.settings) ? appJson.settings : [];
    const flat: Array<{
        key: string;
        groupId?: string;
        groupLabel?: string;
        child: AppSettingChild;
    }> = [];

    for (const def of settingsDefs) {
        if (def?.type === 'group' && Array.isArray(def?.children) && typeof def?.id === 'string') {
            const groupId = def.id as string;
            const groupLabel = typeof def.label === 'string' ? def.label : undefined;
            for (const child of def.children as AppSettingChild[]) {
                if (!child?.id) continue;
                flat.push({
                    key: `${groupId}.${child.id}`,
                    groupId,
                    groupLabel,
                    child,
                });
            }
        } else if (typeof def?.id === 'string' && typeof def?.type === 'string') {
            flat.push({
                key: def.id,
                child: def as AppSettingChild,
            });
        }
    }

    return flat;
}

function buildSettingsDraftFromWidgetAndApp(widget: Widget, flatSettings: ReturnType<typeof buildFlatSettings>) {
    const draft: Record<string, unknown> = {};
    for (const field of flatSettings) {
        const existingVal = getByDottedPath(widget.settings, field.key);
        draft[field.key] = existingVal !== undefined ? existingVal : getDefaultValueForChild(field.child);
    }
    return draft;
}

export default function WidgetDetails() {
    const { id } = useParams<{ id: string }>();
    const [widget, setWidget] = useState<Widget | null>(null);
    const [widgetLoading, setWidgetLoading] = useState(true);
    const [widgetError, setWidgetError] = useState<string | null>(null);

    const [appJson, setAppJson] = useState<any>(null);

    const [activeTab, setActiveTab] = useState<'overview' | 'settings'>('overview');
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

    const loadWidget = async () => {
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
    };

    useEffect(() => {
        loadWidget();
    }, [id]);

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

    const flatSettings = useMemo(() => (appJson ? buildFlatSettings(appJson) : []), [appJson]);

    useEffect(() => {
        if (!appJson || !widget) return;
        const next = buildSettingsDraftFromWidgetAndApp(widget, flatSettings);
        setSettingsDraft(next);
    }, [appJson, widget?.id]);

    const integrationProps = useMemo(() =>
        Array.isArray(appJson?.properties?.integrations) ? appJson.properties.integrations : [],
        [appJson]
    );

    const requiredIntegrationProviders = useMemo(() => {
        return integrationProps.filter((p: any) => p.is_required).map((p: any) => p.provider);
    }, [integrationProps]);

    const hasMissingRequired = requiredIntegrationProviders.some((p: string) => !metaDraft.integrations.includes(p));

    const groupedSettings = useMemo(() => {
        const out = new Map<string, { label?: string; fields: typeof flatSettings }>();
        for (const field of flatSettings) {
            const groupId = field.groupId ?? '__root__';
            const label = field.groupLabel;
            if (!out.has(groupId)) out.set(groupId, { label, fields: [] as any });
            out.get(groupId)!.fields.push(field as any);
        }
        return Array.from(out.entries()).map(([groupId, g]) => ({ groupId, label: g.label, fields: g.fields }));
    }, [flatSettings]);

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

    const widgetUrl = widget ? `${WIDGET_SERVER}/${widget.app_id}?token=${widget.token}` : '';
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
            <aside className="w-full lg:w-[360px] flex flex-col border-b lg:border-b-0 lg:border-r border-white/5 bg-zinc-950/80 backdrop-blur-3xl z-20 shrink-0 lg:h-full order-2 lg:order-1">
                <div className="p-4 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link to="/widgets" className="p-1.5 border border-white/5 rounded-lg bg-zinc-900/50 hover:bg-zinc-800 transition-all group">
                            <ArrowLeft className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white" />
                        </Link>
                        <div>
                            <h1 className="text-sm font-black text-white leading-none">Settings</h1>
                            <p className="text-[9px] uppercase font-bold text-violet-500/80 tracking-widest mt-1 truncate max-w-[120px]">{widget.app_id}</p>
                        </div>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${widget.enabled ? 'bg-emerald-500' : 'bg-rose-500'} shadow-[0_0_8px_rgba(16,185,129,0.3)]`} />
                </div>

                {/* Tabs Navigation */}
                <div className="flex p-1 gap-1 border-b border-white/5 bg-zinc-950/40 shrink-0">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={cn(
                            "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[10px] font-black transition-all",
                            activeTab === 'overview' ? "bg-white/5 text-white" : "text-zinc-600 hover:text-zinc-400"
                        )}
                    >
                        <LayoutPanelLeft className="w-3.5 h-3.5" />
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={cn(
                            "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[10px] font-black transition-all",
                            activeTab === 'settings' ? "bg-white/5 text-white" : "text-zinc-600 hover:text-zinc-400"
                        )}
                    >
                        <Settings2 className="w-3.5 h-3.5" />
                        Settings
                    </button>
                </div>

                {/* Content Area - Scrollable */}
                <div className="flex-1 overflow-y-auto scrollbar-hide p-5 pb-24 lg:pb-32 bg-black/20 lg:bg-transparent">
                    {activeTab === 'overview' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-left-2 duration-300">
                            <div className="space-y-2.5">
                                <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest px-1">Identification</label>
                                <div className="bg-zinc-900/40 border border-white/5 rounded-xl p-4 gap-4 flex flex-col">
                                    <div className="space-y-1.5">
                                        <span className="text-[10px] font-bold text-zinc-500">Public Name</span>
                                        <input
                                            value={metaDraft.display_name}
                                            onChange={e => setMetaDraft(p => ({ ...p, display_name: e.target.value }))}
                                            className="w-full bg-zinc-950 border border-white/5 rounded-lg px-4 py-2.5 text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-violet-500/40 transition-all font-sans"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest px-1">Linked Integrations</label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
                                    {integrationProps.map((p: any) => {
                                        const isChecked = metaDraft.integrations.includes(p.provider);
                                        return (
                                            <button
                                                key={p.provider}
                                                onClick={() => {
                                                    const next = isChecked ? metaDraft.integrations.filter(x => x !== p.provider) : [...new Set([...metaDraft.integrations, p.provider])];
                                                    setMetaDraft(prev => ({ ...prev, integrations: next }));
                                                }}
                                                className={cn(
                                                    "flex items-center justify-between p-3 rounded-xl border transition-all",
                                                    isChecked ? "bg-violet-600/10 border-violet-500/20 text-violet-400" : "bg-zinc-900/40 border-white/5 text-zinc-700 hover:border-white/10"
                                                )}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={cn("w-1.5 h-1.5 rounded-full", isChecked ? "bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.6)]" : "bg-zinc-800")} />
                                                    <span className="text-[10px] font-black uppercase tracking-tight">{p.provider}</span>
                                                </div>
                                                {p.is_required && <span className="text-[7px] font-black bg-rose-500/20 text-rose-500 px-1.5 py-0.5 rounded uppercase">Req.</span>}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="pt-4 fixed lg:sticky bottom-0 left-0 right-0 lg:relative bg-zinc-950/80 backdrop-blur-xl border-t border-white/5 lg:border-t-0 mt-auto px-5 lg:px-0 py-4 lg:py-0 z-10 w-full lg:w-auto">
                                <button
                                    onClick={() => saveMeta()}
                                    disabled={metaLoading || hasMissingRequired}
                                    className="w-full py-4 bg-violet-600 hover:bg-violet-500 disabled:opacity-30 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-violet-600/10 flex items-center justify-center gap-2 active:scale-95"
                                >
                                    {metaLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    Save Profile
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-left-2 duration-300">
                            {!appJson ? (
                                <div className="py-20 text-center flex flex-col items-center gap-4">
                                    <Loader2 className="w-6 h-6 text-zinc-800 animate-spin" />
                                    <p className="text-[9px] font-black uppercase tracking-widest text-zinc-700">Loading Schema...</p>
                                </div>
                            ) : groupedSettings.length === 0 ? (
                                <div className="py-20 text-center">
                                    <p className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest">No parameters available.</p>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-6">
                                    {groupedSettings.map(group => (
                                        <div key={group.groupId} className="space-y-3">
                                            {group.groupId !== '__root__' && (
                                                <div className="px-1 text-[9px] font-black text-violet-500/60 uppercase tracking-[0.2em]">{group.label || group.groupId}</div>
                                            )}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
                                                {group.fields.map(field => {
                                                    const child = field.child;
                                                    const key = field.key;
                                                    const val = settingsDraft[key];

                                                    if (child.type === 'boolean') {
                                                        return (
                                                            <label key={key} className="flex items-center justify-between p-3.5 bg-zinc-900/40 border border-white/5 rounded-xl cursor-pointer hover:bg-zinc-900/60 transition-all">
                                                                <div className="flex flex-col gap-0.5">
                                                                    <span className="text-[10px] font-black uppercase text-zinc-200">{child.label || child.id}</span>
                                                                    {child.description && <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-tight">{child.description}</span>}
                                                                </div>
                                                                <input
                                                                    type="checkbox"
                                                                    checked={Boolean(val)}
                                                                    onChange={e => setSettingsDraft(p => ({ ...p, [key]: e.target.checked }))}
                                                                    className="w-4 h-4 accent-violet-600 bg-zinc-900 border-white/10 rounded-md cursor-pointer"
                                                                />
                                                            </label>
                                                        );
                                                    }

                                                    if (child.type === 'select') {
                                                        return (
                                                            <div key={key} className="p-3.5 bg-zinc-900/40 border border-white/5 rounded-xl">
                                                                <span className="block text-[10px] font-black uppercase text-zinc-200 mb-2.5 px-1">{child.label || child.id}</span>
                                                                <select
                                                                    value={String(val ?? '')}
                                                                    onChange={e => setSettingsDraft(p => ({ ...p, [key]: e.target.value }))}
                                                                    className="w-full bg-zinc-950 border border-white/10 p-2.5 rounded-lg text-[11px] font-bold text-zinc-400 focus:outline-none focus:ring-1 focus:ring-violet-500/40"
                                                                >
                                                                    {(child.options ?? []).map(o => <option key={o.value} value={o.value}>{o.label || o.value}</option>)}
                                                                </select>
                                                            </div>
                                                        );
                                                    }

                                                    if (child.type === 'number') {
                                                        const n = stripMaybeNumber(val) ?? (typeof child.default === 'number' ? child.default : 0);
                                                        return (
                                                            <div key={key} className="p-3.5 bg-zinc-900/40 border border-white/5 rounded-xl space-y-3">
                                                                <div className="flex justify-between items-center px-1">
                                                                    <span className="text-[10px] font-black uppercase text-zinc-200">{child.label || child.id}</span>
                                                                    <span className="text-[9px] font-bold text-violet-500/80 px-2 py-0.5 bg-violet-600/5 rounded-md border border-violet-500/10">{n}</span>
                                                                </div>
                                                                {child.render_as === 'slider' ? (
                                                                    <input
                                                                        type="range"
                                                                        min={child.num_min ?? 0}
                                                                        max={child.num_max ?? 100}
                                                                        step={child.slider_step ?? 1}
                                                                        value={n}
                                                                        onChange={e => setSettingsDraft(p => ({ ...p, [key]: Number(e.target.value) }))}
                                                                        className="w-full h-1 bg-zinc-950 rounded-lg appearance-none cursor-pointer accent-violet-600"
                                                                    />
                                                                ) : (
                                                                    <input
                                                                        type="number"
                                                                        value={n}
                                                                        onChange={e => setSettingsDraft(p => ({ ...p, [key]: Number(e.target.value) }))}
                                                                        className="w-full bg-zinc-950 border border-white/10 p-2.5 rounded-lg text-[11px] font-bold text-zinc-400 focus:outline-none focus:ring-1 focus:ring-violet-500/40"
                                                                    />
                                                                )}
                                                            </div>
                                                        );
                                                    }

                                                    return (
                                                        <div key={key} className="p-3.5 bg-zinc-900/40 border border-white/5 rounded-xl">
                                                            <span className="block text-[10px] font-black uppercase text-zinc-200 mb-2 px-1">{child.label || child.id}</span>
                                                            <input
                                                                value={String(val ?? '')}
                                                                onChange={e => setSettingsDraft(p => ({ ...p, [key]: e.target.value }))}
                                                                className="w-full bg-zinc-950 border border-white/10 p-2.5 rounded-lg text-[11px] font-bold text-zinc-400 focus:outline-none focus:ring-1 focus:ring-violet-500/40"
                                                            />
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}

                                    <div className="pt-4 fixed lg:sticky bottom-0 left-0 right-0 lg:relative bg-zinc-950/80 backdrop-blur-xl border-t border-white/5 lg:border-t-0 mt-auto px-5 lg:px-0 py-4 lg:py-0 z-10 w-full lg:w-auto">
                                        <button
                                            onClick={saveSettings}
                                            disabled={settingsLoading}
                                            className="w-full py-4 bg-violet-600 hover:bg-violet-500 disabled:opacity-30 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-violet-600/10 flex items-center justify-center gap-2 active:scale-95"
                                        >
                                            {settingsLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                            Apply Parameters
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {error && (
                        <div className="mt-4 p-3 bg-red-600/5 border border-red-500/10 rounded-xl flex items-center gap-2.5">
                            <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                            <p className="text-[9px] font-bold text-red-500/80 uppercase tracking-tight leading-tight">{error}</p>
                        </div>
                    )}
                </div>
            </aside>

            {/* Main Column: Preview & Top Bar */}
            <main className="flex-1 relative flex flex-col overflow-hidden bg-black order-1 lg:order-2 h-[50vh] lg:h-auto">
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
