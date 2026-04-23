import React, { useEffect, useState, useRef, useMemo } from 'react';
import { UploadCloud, Image as ImageIcon, Loader2, Search, SortAsc, ChevronDown, X } from 'lucide-react';
import { uploadsService } from '../../services/uploads-service';
import { useSubscriptionStore } from '../../stores/subscription-store';
import { MediaCard } from './MediaCard';
import { EmptyState } from '../layouts/EmptyState';
import { ErrorView } from '../layouts/ErrorView';
import { cn } from '../../lib/utils';

export interface UploadItem {
    id: string;
    displayName: string;
    mimeType: string;
    type: 'image' | 'video' | 'audio';
    sizeBytes: number;
    url: string;
    thumbnailUrl: string;
    createdAt: string;
}

interface Quota {
    usedBytes: number;
    maxBytes: number;
    usedCount: number;
    maxCount: number;
}

type SortOption = 'date-newest' | 'date-oldest' | 'name-az' | 'name-za' | 'size-largest' | 'size-smallest';

interface MediaLibraryProps {
    onSelect?: (upload: UploadItem) => void;
    allowUpload?: boolean;
    allowDelete?: boolean;
    filterType?: 'all' | 'image' | 'video' | 'audio';
    selectedId?: string;
}

export const MediaLibrary: React.FC<MediaLibraryProps> = ({
    onSelect,
    allowUpload = true,
    allowDelete = true,
    filterType: initialFilterType = 'all',
    selectedId
}) => {
    const { getPlan } = useSubscriptionStore();
    const plan = getPlan();
    const [quota, setQuota] = useState<Quota | null>(null);
    const [uploads, setUploads] = useState<UploadItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Filter/Sort State
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'image' | 'video' | 'audio'>(initialFilterType);
    const [sortBy, setSortBy] = useState<SortOption>('date-newest');

    const fetchContent = async () => {
        try {
            setError('');
            const [quotaData, uploadsData] = await Promise.all([
                uploadsService.getQuota(),
                uploadsService.listUploads(),
            ]);
            setQuota(quotaData);
            setUploads(uploadsData.uploads || uploadsData); // Handle both {uploads: []} and []
        } catch (err: any) {
            setError(err.message || 'Failed to load content');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchContent();
    }, []);

    const filteredAndSortedUploads = useMemo(() => {
        let result = [...uploads];

        // Search
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(u => u.displayName.toLowerCase().includes(query));
        }

        // Filter
        if (filterType !== 'all') {
            result = result.filter(u => u.type === filterType);
        }

        // Sort
        result.sort((a, b) => {
            switch (sortBy) {
                case 'date-newest':
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                case 'date-oldest':
                    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                case 'name-az':
                    return a.displayName.localeCompare(b.displayName);
                case 'name-za':
                    return b.displayName.localeCompare(a.displayName);
                case 'size-largest':
                    return b.sizeBytes - a.sizeBytes;
                case 'size-smallest':
                    return a.sizeBytes - b.sizeBytes;
                default:
                    return 0;
            }
        });

        return result;
    }, [uploads, searchQuery, filterType, sortBy]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (quota) {
            if (quota.usedCount >= quota.maxCount) {
                setError('Storage full: Max files reached.');
                return;
            }
            if (quota.usedBytes + file.size > quota.maxBytes) {
                setError('Storage full: Size limit exceeded.');
                return;
            }
        }

        try {
            setIsUploading(true);
            setError('');
            setUploadProgress(0);

            await uploadsService.uploadFile(file, (p) => setUploadProgress(p));
            await fetchContent();
        } catch (err: any) {
            setError(err.message || 'Upload failed');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await uploadsService.deleteUpload(id);
            setUploads(uploads.filter((u: UploadItem) => u.id !== id));
            setQuota((prev: Quota | null) => prev ? {
                ...prev,
                usedCount: Math.max(0, prev.usedCount - 1),
                usedBytes: Math.max(0, prev.usedBytes - (uploads.find((x: UploadItem) => x.id === id)?.sizeBytes || 0))
            } : null);
        } catch (err: any) {
            setError(err.message || 'Delete failed');
        }
    };

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
                <p className="text-xs font-black uppercase tracking-widest text-content-dimmed">Accessing Vault...</p>
            </div>
        );
    }

    const quotaPercent = quota ? (quota.usedBytes / quota.maxBytes) * 100 : 0;

    return (
        <div className="space-y-6 flex flex-col h-full bg-surface-card/10 overflow-hidden">
            {error && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-status-error/10 border border-status-error/20 text-status-error mx-1 animate-in slide-in-from-top-2">
                    <ErrorView message={error} title="Action Failed" onRetry={fetchContent} />
                    <button onClick={() => setError('')} className="absolute top-4 right-4 p-1 hover:bg-white/10 rounded-lg transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            <div className="flex flex-col gap-4 shrink-0 px-2 pt-2">
                <div className="flex items-center justify-between">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-content-dimmed">Plan Quota</h2>
                    {plan && (
                        <span className="text-[10px] font-black uppercase tracking-widest text-brand-primary/60 bg-brand-primary/5 px-2 py-0.5 rounded-full border border-brand-primary/10">
                            {plan.name} Tier
                        </span>
                    )}
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1">
                        <div className="relative flex-1 max-w-xs group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-content-dimmed group-focus-within:text-brand-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Search repository..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-surface-panel/50 border border-border-subtle rounded-xl py-2 pl-9 pr-4 text-xs text-content-primary placeholder:text-content-dimmed focus:outline-none focus:ring-1 focus:ring-brand-primary/40 transition-all"
                            />
                        </div>

                        <div className="flex items-center bg-surface-panel/30 p-1 rounded-xl border border-border-subtle">
                            {(['all', 'image', 'video', 'audio'] as const).map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setFilterType(t)}
                                    className={cn(
                                        "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tight transition-all",
                                        filterType === t
                                            ? "bg-surface-elevated text-content-primary shadow-sm border border-white/[0.05]"
                                            : "text-content-dimmed hover:text-content-secondary"
                                    )}
                                >
                                    {t === 'all' ? 'All' : t === 'image' ? 'Images' : t === 'video' ? 'Videos' : 'Audio'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="relative group">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as SortOption)}
                                className="appearance-none bg-surface-panel/50 border border-border-subtle rounded-xl py-2 pl-8 pr-8 text-[11px] font-bold text-content-muted focus:outline-none focus:ring-1 focus:ring-brand-primary/40 transition-all cursor-pointer hover:border-brand-primary/20"
                            >
                                <option value="date-newest">Newest</option>
                                <option value="date-oldest">Oldest</option>
                                <option value="name-az">A-Z</option>
                                <option value="name-za">Z-A</option>
                                <option value="size-largest">Largest</option>
                                <option value="size-smallest">Smallest</option>
                            </select>
                            <SortAsc className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-content-dimmed pointer-events-none" />
                            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-content-dimmed pointer-events-none" />
                        </div>

                        {allowUpload && (
                            <div className="relative">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                                    disabled={isUploading}
                                    accept="image/*,video/*,audio/*"
                                />
                                <button
                                    disabled={isUploading}
                                    className="flex items-center gap-2 px-6 py-2 rounded-xl bg-brand-primary hover:bg-brand-primary/90 text-white text-[11px] font-black uppercase tracking-widest transition-all disabled:opacity-50 disabled:pointer-events-none shadow-lg shadow-brand-primary/20 active:scale-95"
                                >
                                    {isUploading ? (
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    ) : (
                                        <UploadCloud className="w-3.5 h-3.5" />
                                    )}
                                    {isUploading ? `${Math.round(uploadProgress)}%` : 'Upload'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {quota && allowUpload && (
                    <div className="flex flex-col gap-2.5 bg-surface-panel/20 p-3 rounded-2xl border border-border-subtle">
                        <div className="flex flex-col gap-1.5">
                            <div className="flex items-center justify-between px-0.5">
                                <span className="text-[9px] font-black uppercase text-content-dimmed tracking-wider">Storage Volume</span>
                                <span className="text-[9px] font-bold text-content-muted tabular-nums">
                                    <span className="text-content-primary">{formatBytes(quota.usedBytes)}</span> / {formatBytes(quota.maxBytes)}
                                </span>
                            </div>
                            <div className="h-1 w-full bg-surface-panel rounded-full overflow-hidden border border-white/[0.03]">
                                <div
                                    className={cn(
                                        "h-full transition-all duration-700 rounded-full",
                                        (quota.usedBytes / quota.maxBytes) >= 0.9 ? 'bg-status-warning' : 'bg-brand-primary'
                                    )}
                                    style={{ width: `${Math.min(100, quotaPercent)}%` }}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <div className="flex items-center justify-between px-0.5">
                                <span className="text-[9px] font-black uppercase text-content-dimmed tracking-wider">File Limit</span>
                                <span className="text-[9px] font-bold text-content-muted tabular-nums">
                                    <span className="text-content-primary">{quota.usedCount}</span> / {quota.maxCount} files
                                </span>
                            </div>
                            <div className="h-1 w-full bg-surface-panel rounded-full overflow-hidden border border-white/[0.03]">
                                <div
                                    className={cn(
                                        "h-full transition-all duration-700 rounded-full",
                                        (quota.usedCount / quota.maxCount) >= 0.9 ? 'bg-status-warning' : 'bg-brand-primary'
                                    )}
                                    style={{ width: `${Math.min(100, (quota.usedCount / quota.maxCount) * 100)}%` }}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex-1 overflow-y-auto min-h-0 px-2 pb-4 scrollbar-hide">
                {filteredAndSortedUploads.length === 0 ? (
                    <EmptyState
                        icon={ImageIcon}
                        title="Empty Library"
                        description={searchQuery ? "No files match your search criteria." : "You haven't uploaded any media yet. Files you upload will appear here."}
                        className="py-32"
                    />
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {filteredAndSortedUploads.map((upload: UploadItem) => (
                            <MediaCard
                                key={upload.id}
                                upload={upload}
                                onDelete={allowDelete ? handleDelete : undefined}
                                onSelect={onSelect}
                                formatBytes={formatBytes}
                                isSelected={selectedId === upload.id}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
