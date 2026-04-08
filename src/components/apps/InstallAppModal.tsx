import { useState, useMemo, useEffect } from 'react';
import { integrationsService } from '../../services/integrations-service';
import { widgetsService } from '../../services/widgets-service';
import { type Integration } from '../../lib/types';
import { appsService, type AppManifest } from '../../services/apps-service';
import { X, Sparkles, Loader2, AlertCircle, Check, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';

interface InstallAppModalProps {
    app: AppManifest;
    isOpen: boolean;
    onClose: () => void;
}

export function InstallAppModal({ app, isOpen, onClose }: InstallAppModalProps) {
    const navigate = useNavigate();
    const [integrations, setIntegrations] = useState<Integration[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isInstalling, setIsInstalling] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [displayName, setDisplayName] = useState(app.name);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const [fullApp, setFullApp] = useState<AppManifest | null>(null);

    useEffect(() => {
        if (!isOpen) return;
        setIsLoading(true);
        setError(null);

        Promise.all([
            integrationsService.listIntegrations(),
            appsService.getApp(app.id)
        ])
            .then(([ints, manifest]) => {
                setIntegrations(ints);
                setFullApp(manifest);
                setDisplayName(manifest.name);
            })
            .catch(err => {
                console.error(err);
                setError('Failed to load required data.');
            })
            .finally(() => setIsLoading(false));
    }, [isOpen, app.id]);

    const appIntegrations = useMemo(() => fullApp?.properties?.integrations ?? [], [fullApp]);

    const compatibleIntegrations = useMemo(() => {
        const supportedProviders = appIntegrations.map((p: any) => p.provider.toLowerCase());
        return integrations.filter(i => supportedProviders.includes(i.provider.toLowerCase()));
    }, [integrations, appIntegrations]);

    const requiredProviders = useMemo(() =>
        appIntegrations.filter((p: any) => p.is_required).map((p: any) => p.provider.toLowerCase()),
        [appIntegrations]
    );

    useEffect(() => {
        // Auto-select valid integrations if they are the only ones for a required provider
        const initialSelected = compatibleIntegrations
            .filter(i => requiredProviders.includes(i.provider))
            .map(i => i.id);
        setSelectedIds(initialSelected);
    }, [compatibleIntegrations, requiredProviders]);

    const canInstall = useMemo(() => {
        // Check if all required providers have at least one integration selected
        const selectedProviders = compatibleIntegrations
            .filter(i => selectedIds.includes(i.id))
            .map(i => i.provider);

        return requiredProviders.every(rp => selectedProviders.includes(rp)) && displayName.trim().length > 0;
    }, [requiredProviders, selectedIds, compatibleIntegrations, displayName]);

    if (!isOpen) return null;

    const handleInstall = async () => {
        if (!canInstall || isInstalling) return;
        setIsInstalling(true);
        setError(null);
        try {
            await widgetsService.createWidget({
                app_id: app.id,
                integrations: selectedIds,
                display_name: displayName,
            });
            onClose();
            navigate('/widgets');
        } catch (err: any) {
            setError(err?.response?.data?.error || err?.message || 'Installation failed.');
        } finally {
            setIsInstalling(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-surface-base/80 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-lg bg-surface-card border border-border-default rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="p-6 md:p-8 border-b border-border-subtle flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-content-primary leading-none uppercase tracking-tight">Install App</h2>
                            <p className="text-[10px] font-black text-content-dimmed uppercase tracking-widest mt-1.5">{app.name}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-content-dimmed hover:text-content-primary transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 md:p-8 space-y-8">
                    {/* Display Name */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-content-dimmed uppercase tracking-[0.2em] px-1">Widget Display Name</label>
                        <input
                            value={displayName}
                            onChange={e => setDisplayName(e.target.value)}
                            placeholder="e.g. My Twitch Overlay"
                            className="w-full bg-surface-base border border-border-subtle rounded-2xl px-5 py-4 text-sm font-bold text-content-primary placeholder:text-content-dimmed focus:outline-none focus:ring-1 focus:ring-brand-primary/40 transition-all uppercase tracking-tight"
                        />
                    </div>

                    {/* Integrations Selection */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-1">
                            <label className="text-[10px] font-black text-content-dimmed uppercase tracking-[0.2em]">Connect Integrations</label>
                            {requiredProviders.length > 0 && (
                                <span className="text-[8px] font-black bg-status-error/10 text-status-error border border-status-error/20 px-2 py-0.5 rounded uppercase tracking-tighter">
                                    Required: {requiredProviders.join(', ')}
                                </span>
                            )}
                        </div>

                        {isLoading ? (
                            <div className="py-12 flex flex-col items-center justify-center gap-3 bg-surface-base/30 rounded-3xl border border-dashed border-border-subtle">
                                <Loader2 className="w-6 h-6 text-brand-primary animate-spin" />
                                <p className="text-[10px] font-black text-content-dimmed uppercase tracking-widest">Scanning Connections...</p>
                            </div>
                        ) : compatibleIntegrations.length === 0 ? (
                            <div className="p-6 text-center bg-surface-base/30 rounded-3xl border border-dashed border-status-error/20 space-y-4">
                                <AlertCircle className="w-8 h-8 text-status-error mx-auto opacity-50" />
                                <div className="space-y-1">
                                    <p className="text-sm font-bold text-content-secondary">No compatible integrations found</p>
                                    <p className="text-xs text-content-dimmed leading-relaxed">
                                        This app requires {requiredProviders.join(' or ')}. Please connect them in your settings first.
                                    </p>
                                </div>
                                <button
                                    onClick={() => navigate('/settings/integrations')}
                                    className="text-[10px] font-black text-brand-primary uppercase tracking-widest hover:text-brand-accent transition-colors"
                                >
                                    Go to Settings
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {compatibleIntegrations.map(integration => {
                                    const isSelected = selectedIds.includes(integration.id);
                                    return (
                                        <button
                                            key={integration.id}
                                            onClick={() => {
                                                const next = isSelected
                                                    ? selectedIds.filter(id => id !== integration.id)
                                                    : [...selectedIds, integration.id];
                                                setSelectedIds(next);
                                            }}
                                            className={cn(
                                                "w-full flex items-center justify-between p-4 rounded-2xl border transition-all text-left",
                                                isSelected
                                                    ? "bg-brand-primary/10 border-brand-primary/30 text-content-primary"
                                                    : "bg-surface-base/50 border-border-subtle text-content-muted hover:border-border-default hover:bg-surface-base"
                                            )}
                                        >
                                            <div className="flex items-center gap-4">
                                                <img
                                                    src={integration.providerAvatarUrl || ''}
                                                    className="w-10 h-10 rounded-xl bg-surface-card border border-border-subtle shadow-premium"
                                                    alt=""
                                                    onError={e => e.currentTarget.style.display = 'none'}
                                                />
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-tight">{integration.displayName || integration.providerUsername}</p>
                                                    <p className="text-[9px] font-bold text-content-dimmed uppercase tracking-widest mt-0.5">{integration.provider} • {integration.providerUserId}</p>
                                                </div>
                                            </div>
                                            <div className={cn(
                                                "w-6 h-6 rounded-lg border flex items-center justify-center transition-colors",
                                                isSelected ? "bg-brand-primary border-brand-primary text-white" : "border-border-default"
                                            )}>
                                                {isSelected && <Check className="w-3.5 h-3.5" />}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className="p-4 bg-status-error/5 border border-status-error/10 rounded-2xl flex items-start gap-3">
                            <AlertCircle className="w-4 h-4 text-status-error shrink-0 mt-0.5" />
                            <p className="text-[10px] font-bold text-status-error/80 uppercase tracking-tight leading-relaxed">{error}</p>
                        </div>
                    )}

                    <div className="pt-2">
                        <button
                            onClick={handleInstall}
                            disabled={!canInstall || isInstalling}
                            className="w-full py-5 bg-brand-primary hover:bg-brand-primary/90 disabled:opacity-30 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl shadow-brand-primary/10 flex items-center justify-center gap-3 active:scale-95"
                        >
                            {isInstalling ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                            Confirm Installation
                        </button>
                        {!canInstall && !isLoading && compatibleIntegrations.length > 0 && (
                            <p className="text-center text-[9px] font-black text-content-dimmed uppercase tracking-widest mt-4 flex items-center justify-center gap-1.5 opacity-60">
                                <Info className="w-3 h-3" />
                                Select all required integrations to proceed
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
