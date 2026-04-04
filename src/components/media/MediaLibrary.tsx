import React, { useEffect, useState, useRef, useMemo } from 'react';
import { UploadCloud, Image as ImageIcon, Loader2, AlertCircle, Search, SortAsc, ChevronDown, X } from 'lucide-react';
import { UploadsService } from '../../services/uploads.service';
import { useSubscriptionStore } from '../../stores/subscription-store';
import { MediaCard } from './MediaCard';

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
                UploadsService.getQuota(),
                UploadsService.listUploads(),
            ]);
            setQuota(quotaData);
            setUploads(uploadsData);
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

            await UploadsService.uploadFile(file, (p) => setUploadProgress(p));
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
            await UploadsService.deleteUpload(id);
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
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
            </div>
        );
    }

    const quotaPercent = quota ? (quota.usedBytes / quota.maxBytes) * 100 : 0;

    return (
        <div className="space-y-6 flex flex-col h-full bg-black/20 overflow-hidden">
            {error && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 mx-1">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <div className="flex-1 text-xs">
                        <p className="font-bold">Action Failed</p>
                        <p className="opacity-80">{error}</p>
                    </div>
                    <button onClick={() => setError('')} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}
            <div className="flex flex-col gap-4 shrink-0">
                <div className="flex items-center justify-between px-1">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">Plan Quota</h2>
                    {plan && (
                        <span className="text-[10px] font-black uppercase tracking-widest text-violet-500/60 bg-violet-500/5 px-2 py-0.5 rounded-full border border-violet-500/10">
                            {plan.name} Tier
                        </span>
                    )}
                </div>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1">
                        <div className="relative flex-1 max-w-xs group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500 group-focus-within:text-violet-400 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-zinc-900 border border-white/5 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-violet-500/40 transition-all font-sans"
                            />
                        </div>

                        <div className="flex items-center bg-zinc-950/50 p-1 rounded-xl border border-white/5">
                            {(['all', 'image', 'video', 'audio'] as const).map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setFilterType(t)}
                                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tight transition-all ${filterType === t
                                        ? 'bg-zinc-800 text-white shadow-sm'
                                        : 'text-zinc-500 hover:text-zinc-300'
                                        }`}
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
                                className="appearance-none bg-zinc-900 border border-white/5 rounded-xl py-2 pl-8 pr-8 text-[11px] font-bold text-zinc-400 focus:outline-none focus:ring-1 focus:ring-violet-500/40 transition-all cursor-pointer"
                            >
                                <option value="date-newest">Newest</option>
                                <option value="date-oldest">Oldest</option>
                                <option value="name-az">A-Z</option>
                                <option value="name-za">Z-A</option>
                                <option value="size-largest">Largest</option>
                                <option value="size-smallest">Smallest</option>
                            </select>
                            <SortAsc className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600 pointer-events-none" />
                            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600 pointer-events-none" />
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
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-[11px] font-black uppercase tracking-widest transition-all disabled:opacity-50 disabled:pointer-events-none shadow-lg shadow-violet-950/20 active:scale-95"
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
                    <div className="flex flex-col gap-2 px-1">
                        <div className="flex items-center gap-3">
                            <div className="flex-1 h-1 bg-zinc-900 rounded-full overflow-hidden border border-white/5">
                                <div
                                    className={`h-full transition-all duration-500 ${(quota.usedBytes / quota.maxBytes) >= 0.9 ? 'bg-amber-500' : 'bg-violet-600'}`}
                                    style={{ width: `${Math.min(100, quotaPercent)}%` }}
                                />
                            </div>
                            <span className="text-[9px] font-black uppercase text-zinc-500 tabular-nums min-w-[100px] text-right">
                                <span className="text-zinc-400 mr-1">{formatBytes(quota.usedBytes)}</span> / {formatBytes(quota.maxBytes)}
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex-1 h-1 bg-zinc-900 rounded-full overflow-hidden border border-white/5">
                                <div
                                    className={`h-full transition-all duration-500 ${(quota.usedCount / quota.maxCount) >= 0.9 ? 'bg-amber-500' : 'bg-violet-600'}`}
                                    style={{ width: `${Math.min(100, (quota.usedCount / quota.maxCount) * 100)}%` }}
                                />
                            </div>
                            <span className="text-[9px] font-black uppercase text-zinc-500 tabular-nums min-w-[100px] text-right">
                                <span className="text-zinc-400 mr-1">{quota.usedCount}</span> / {quota.maxCount} Files
                            </span>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex-1 overflow-y-auto min-h-0 scrollbar-hide">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 py-1 px-1">
                    {filteredAndSortedUploads.length === 0 ? (
                        <div className="col-span-full flex flex-col items-center justify-center text-zinc-600 bg-zinc-950/40 rounded-2xl border border-white/5 border-dashed p-12">
                            <ImageIcon className="w-8 h-8 opacity-20 mb-4" />
                            <p className="text-[11px] font-black uppercase tracking-widest text-zinc-500">No media found</p>
                        </div>
                    ) : (
                        filteredAndSortedUploads.map((upload: UploadItem) => (
                            <MediaCard
                                key={upload.id}
                                upload={upload}
                                onDelete={allowDelete ? handleDelete : undefined}
                                onSelect={onSelect}
                                formatBytes={formatBytes}
                                isSelected={selectedId === upload.id}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
