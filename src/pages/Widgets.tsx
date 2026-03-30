import { useEffect, useMemo, useState } from 'react';
import { Key, RotateCcw, CheckCircle2, XCircle, Save, Settings2 } from 'lucide-react';

import { appsService } from '../services/apps-service';
import { widgetsService } from '../services/widgets-service';
import type { Widget } from '../lib/types';
import { Skeleton } from '../components/ui/skeleton';
import { ErrorView } from '../components/ui/ErrorView';
import { SectionCard } from '../components/settings/SectionCard';
import { getError } from '../lib/utils';

type AppIntegrationProp = {
  provider: string;
  allow_multiple?: boolean;
  is_required?: boolean;
};

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
    case 'boolean':
      return false;
    case 'number':
      return 0;
    case 'select':
      return child.options?.[0]?.value ?? '';
    case 'text':
    default:
      return '';
  }
}

function capitalize(s: string): string {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function buildFlatSettings(appJson: any): Array<{
  key: string; // dotted key
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

function integrationsFromApp(appJson: any): AppIntegrationProp[] {
  return Array.isArray(appJson?.properties?.integrations)
    ? appJson.properties.integrations
    : [];
}

function WidgetCard({
  widget,
  onRefresh,
}: {
  widget: Widget;
  onRefresh: () => Promise<void>;
}) {
  const [appJson, setAppJson] = useState<any>(null);
  const [appLoading, setAppLoading] = useState(false);
  const [appError, setAppError] = useState<string | null>(null);

  const integrationProps = useMemo(() => integrationsFromApp(appJson), [appJson]);
  const flatSettings = useMemo(() => (appJson ? buildFlatSettings(appJson) : []), [appJson]);

  const [metaDraft, setMetaDraft] = useState<{
    display_name: string;
    enabled: boolean;
    integrations: string[];
  }>({
    display_name: widget.display_name,
    enabled: widget.enabled,
    integrations: widget.integrations ?? [],
  });

  const [settingsDraft, setSettingsDraft] = useState<Record<string, unknown>>({});
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [metaLoading, setMetaLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMetaDraft({
      display_name: widget.display_name,
      enabled: widget.enabled,
      integrations: widget.integrations ?? [],
    });
  }, [widget.id, widget.display_name, widget.enabled, widget.integrations]);

  useEffect(() => {
    let cancelled = false;
    const loadAppJson = async () => {
      if (!widget.app_id) return;
      setAppLoading(true);
      setAppError(null);
      try {
        const data = await appsService.getApp(widget.app_id);
        if (!cancelled) setAppJson(data);
      } catch (e) {
        if (!cancelled) setAppError(getError(e, 'Failed to load app.json'));
      } finally {
        if (!cancelled) setAppLoading(false);
      }
    };
    loadAppJson();
    return () => {
      cancelled = true;
    };
  }, [widget.app_id]);

  useEffect(() => {
    if (!appJson) return;
    const next = buildSettingsDraftFromWidgetAndApp(widget, flatSettings);
    setSettingsDraft(next);
  }, [appJson, widget.id]);

  const requiredIntegrationProviders = useMemo(() => {
    const req = integrationProps.filter((p) => p.is_required).map((p) => p.provider);
    return req;
  }, [integrationProps]);

  const hasMissingRequired = requiredIntegrationProviders.some((p) => !metaDraft.integrations.includes(p));

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

  const saveMeta = async () => {
    setError(null);
    setMetaLoading(true);
    try {
      await widgetsService.updateWidgetMeta(widget.id, {
        display_name: metaDraft.display_name,
        integrations: metaDraft.integrations,
        enabled: metaDraft.enabled,
      });
      await onRefresh();
    } catch (e) {
      setError(getError(e, 'Failed to update widget'));
    } finally {
      setMetaLoading(false);
    }
  };

  const saveSettings = async () => {
    setError(null);
    setSettingsLoading(true);
    try {
      await widgetsService.updateWidgetSettings(widget.id, settingsDraft);
      await onRefresh();
    } catch (e) {
      setError(getError(e, 'Failed to update widget settings'));
    } finally {
      setSettingsLoading(false);
    }
  };

  const rotateToken = async () => {
    setError(null);
    setMetaLoading(true);
    try {
      await widgetsService.rotateWidgetToken(widget.id);
      await onRefresh();
    } catch (e) {
      setError(getError(e, 'Failed to rotate token'));
    } finally {
      setMetaLoading(false);
    }
  };

  return (
    <div className="p-6 rounded-2xl border border-white/10 bg-zinc-900/30">
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-violet-400" />
              <div className="text-white font-bold">{metaDraft.display_name || widget.app_id}</div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md border border-zinc-700 bg-zinc-800 text-zinc-400">
                {widget.app_id}
              </span>
            </div>
            <div className="text-zinc-500 text-xs font-mono">Widget ID: {widget.id}</div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-zinc-400">Enabled</span>
            <input
              type="checkbox"
              checked={metaDraft.enabled}
              onChange={(e) => setMetaDraft((prev) => ({ ...prev, enabled: e.target.checked }))}
              className="accent-violet-500"
            />
            {metaDraft.enabled ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <XCircle className="w-4 h-4 text-rose-400" />
            )}
          </div>
        </div>

        {appLoading && (
          <div className="text-zinc-500 text-sm">Loading app.json...</div>
        )}

        {appError && (
          <div className="text-red-400 text-sm">{appError}</div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="flex flex-col gap-3">
            <label className="text-zinc-300 text-sm font-semibold">Display Name</label>
            <input
              value={metaDraft.display_name}
              onChange={(e) => setMetaDraft((prev) => ({ ...prev, display_name: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl bg-zinc-950/60 border border-white/10 text-zinc-200 focus:outline-none focus:ring-1 focus:ring-violet-500"
              placeholder="Widget display name"
            />

            <div className="flex flex-col gap-2">
              <div className="text-zinc-300 text-sm font-semibold">Integrations</div>
              {integrationProps.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {integrationProps.map((p) => {
                    const checked = metaDraft.integrations.includes(p.provider);
                    return (
                      <label key={p.provider} className="flex items-center gap-2 text-sm text-zinc-200 select-none">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            const next = e.target.checked
                              ? Array.from(new Set([...metaDraft.integrations, p.provider]))
                              : metaDraft.integrations.filter((x) => x !== p.provider);
                            setMetaDraft((prev) => ({ ...prev, integrations: next }));
                          }}
                          className="accent-violet-500"
                        />
                        <span className="font-semibold">{capitalize(p.provider)}</span>
                        {p.is_required && (
                          <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded border border-violet-500/30 text-violet-300 bg-violet-500/10">
                            required
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
              ) : (
                <input
                  value={metaDraft.integrations.join(', ')}
                  onChange={(e) => {
                    const next = e.target.value
                      .split(',')
                      .map((x) => x.trim())
                      .filter(Boolean);
                    setMetaDraft((prev) => ({ ...prev, integrations: next }));
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950/60 border border-white/10 text-zinc-200 focus:outline-none focus:ring-1 focus:ring-violet-500"
                  placeholder="twitch, youtube"
                />
              )}
              {hasMissingRequired && (
                <div className="text-rose-400 text-xs mt-1">
                  Missing required integrations: {requiredIntegrationProviders.filter((p) => !metaDraft.integrations.includes(p)).join(', ')}
                </div>
              )}
            </div>

            <button
              onClick={saveMeta}
              disabled={metaLoading || (hasMissingRequired && requiredIntegrationProviders.length > 0)}
              className="mt-2 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold transition-all active:scale-[0.99] disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {metaLoading ? 'Saving...' : 'Save Metadata'}
            </button>
          </div>

          <div className="flex flex-col gap-3">
            <div className="text-zinc-300 text-sm font-semibold">Token</div>
            <div className="rounded-xl border border-white/10 bg-zinc-950/60 p-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-mono text-zinc-200 break-all">{widget.token}</span>
                <button
                  onClick={rotateToken}
                  disabled={metaLoading}
                  className="inline-flex items-center justify-center px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-zinc-200 disabled:opacity-50"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
              <div className="text-[11px] text-zinc-500 mt-2 flex items-center gap-2">
                <Key className="w-3 h-3 text-violet-400" />
                Rotar token genera un token nuevo para este widget.
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <div className="text-zinc-300 text-sm font-semibold">Settings</div>
            <button
              onClick={saveSettings}
              disabled={settingsLoading || appLoading || !appJson}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold transition-all active:scale-[0.99] disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {settingsLoading ? 'Saving...' : 'Save Settings'}
            </button>
          </div>

          {!appJson && (
            <div className="text-zinc-500 text-sm">Loading schema...</div>
          )}

          {appJson && groupedSettings.length === 0 && (
            <div className="text-zinc-500 text-sm">No settings schema for this app.</div>
          )}

          {appJson && groupedSettings.length > 0 && (
            <div className="grid grid-cols-1 gap-4">
              {groupedSettings.map((group) => (
                <div key={group.groupId} className="rounded-2xl border border-white/10 bg-zinc-950/30 p-4">
                  {group.groupId !== '__root__' && (
                    <div className="mb-3 text-sm font-bold text-white">
                      {group.label || group.groupId}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {group.fields.map((field) => {
                      const child = field.child;
                      const dottedKey = field.key;
                      const val = settingsDraft[dottedKey];

                      if (child.type === 'boolean') {
                        const checked = Boolean(val);
                        return (
                          <label key={dottedKey} className="flex items-center gap-3 p-3 rounded-xl border border-white/10 bg-zinc-900/30">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={(e) => setSettingsDraft((prev) => ({ ...prev, [dottedKey]: e.target.checked }))}
                              className="accent-violet-500"
                            />
                            <div className="flex flex-col">
                              <span className="text-sm font-semibold text-white">{child.label || child.id}</span>
                              {child.description && <span className="text-xs text-zinc-500">{child.description}</span>}
                            </div>
                          </label>
                        );
                      }

                      if (child.type === 'select') {
                        return (
                          <div key={dottedKey} className="p-3 rounded-xl border border-white/10 bg-zinc-900/30">
                            <div className="text-sm font-semibold text-white mb-2">{child.label || child.id}</div>
                            <select
                              value={typeof val === 'string' ? val : String(val ?? '')}
                              onChange={(e) => setSettingsDraft((prev) => ({ ...prev, [dottedKey]: e.target.value }))}
                              className="w-full px-3 py-2 rounded-xl bg-zinc-950/60 border border-white/10 text-zinc-200 focus:outline-none focus:ring-1 focus:ring-violet-500"
                            >
                              {(child.options ?? []).map((o) => (
                                <option key={o.value} value={o.value}>
                                  {o.label || o.value}
                                </option>
                              ))}
                            </select>
                            {child.description && <div className="text-xs text-zinc-500 mt-2">{child.description}</div>}
                          </div>
                        );
                      }

                      if (child.type === 'number') {
                        const min = typeof child.num_min === 'number' ? child.num_min : 0;
                        const max = typeof child.num_max === 'number' ? child.num_max : 100;
                        const step = typeof child.slider_step === 'number' ? child.slider_step : 1;
                        const asSlider = child.render_as === 'slider';
                        const n = stripMaybeNumber(val);
                        const current = n ?? (typeof child.default === 'number' ? child.default : 0);

                        return (
                          <div key={dottedKey} className="p-3 rounded-xl border border-white/10 bg-zinc-900/30">
                            <div className="flex items-center justify-between gap-3 mb-2">
                              <div className="text-sm font-semibold text-white">{child.label || child.id}</div>
                              <div className="text-xs font-mono text-zinc-300">{current}</div>
                            </div>
                            {asSlider ? (
                              <input
                                type="range"
                                min={min}
                                max={max}
                                step={step}
                                value={current}
                                onChange={(e) => {
                                  const num = Number(e.target.value);
                                  setSettingsDraft((prev) => ({ ...prev, [dottedKey]: num }));
                                }}
                                className="w-full accent-violet-500"
                              />
                            ) : (
                              <input
                                type="number"
                                min={min}
                                max={max}
                                step={step}
                                value={current}
                                onChange={(e) => {
                                  const num = Number(e.target.value);
                                  setSettingsDraft((prev) => ({ ...prev, [dottedKey]: num }));
                                }}
                                className="w-full px-3 py-2 rounded-xl bg-zinc-950/60 border border-white/10 text-zinc-200 focus:outline-none focus:ring-1 focus:ring-violet-500"
                              />
                            )}
                            {child.description && <div className="text-xs text-zinc-500 mt-2">{child.description}</div>}
                          </div>
                        );
                      }

                      // Default: text
                      return (
                        <div key={dottedKey} className="p-3 rounded-xl border border-white/10 bg-zinc-900/30">
                          <div className="text-sm font-semibold text-white mb-2">{child.label || child.id}</div>
                          <input
                            value={typeof val === 'string' ? val : String(val ?? '')}
                            onChange={(e) => setSettingsDraft((prev) => ({ ...prev, [dottedKey]: e.target.value }))}
                            className="w-full px-3 py-2 rounded-xl bg-zinc-950/60 border border-white/10 text-zinc-200 focus:outline-none focus:ring-1 focus:ring-violet-500"
                          />
                          {child.description && <div className="text-xs text-zinc-500 mt-2">{child.description}</div>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="text-red-400 text-sm">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function WidgetsPage() {
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await widgetsService.listWidgets();
      setWidgets(data);
    } catch (e) {
      setError(getError(e, 'Failed to load widgets'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  if (error) {
    return (
      <div className="space-y-6 animate-in fade-in duration-700">
        <ErrorView
          message={error}
          onRetry={refresh}
          title="Failed to Load Widgets"
        />
      </div>
    );
  }

  if (isLoading && widgets.length === 0) {
    return (
      <div className="space-y-12 animate-in fade-in duration-700">
        <SectionCard title="Widget Instances" subtitle="Manage your installed apps, settings, integrations, and tokens." icon={Key}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <Skeleton key={i} className="h-[520px] w-full rounded-[2rem] bg-zinc-900" />
            ))}
          </div>
        </SectionCard>
      </div>
    );
  }

  return (
    <SectionCard
      title="Widget Instances"
      subtitle="Install apps, manage their settings, integrations, and rotate access tokens."
      icon={Key}
    >
      <div className="flex flex-col gap-4">
        {widgets.length === 0 ? (
          <div className="p-6 rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/40 flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800">
              <Settings2 className="w-5 h-5 text-violet-500" />
            </div>
            <div className="mt-4 text-zinc-500 text-sm font-medium">
              No widgets installed yet.
            </div>
            <div className="text-zinc-600 text-xs mt-2">
              Go to <span className="text-violet-400 font-semibold">Apps</span> to install your first app.
            </div>
          </div>
        ) : (
          widgets.map((w) => (
            <WidgetCard key={w.id} widget={w} onRefresh={refresh} />
          ))
        )}
      </div>
    </SectionCard>
  );
}

