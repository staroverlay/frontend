import React, { useEffect, useState, useRef, useMemo } from 'react';
import { UploadCloud, Image as ImageIcon, Trash2, File as FileIcon, Loader2, AlertCircle, Search, Filter, SortAsc, Music, Film, ChevronDown, X } from 'lucide-react';
import { UploadsService } from '../services/uploads.service';

interface Quota {
    usedBytes: number;
    maxBytes: number;
    usedCount: number;
    maxCount: number;
}

interface UploadItem {
    id: string;
    displayName: string;
    mimeType: string;
    type: 'image' | 'video' | 'audio';
    sizeBytes: number;
    url: string;
    thumbnailUrl: string;
    createdAt: string;
}

type SortOption = 'date-newest' | 'date-oldest' | 'name-az' | 'name-za' | 'size-largest' | 'size-smallest';

export default function Content() {
    const [quota, setQuota] = useState<Quota | null>(null);
    const [uploads, setUploads] = useState<UploadItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Filter/Sort State
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'image' | 'video' | 'audio'>('all');
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
            setUploads(uploads.filter((u) => u.id !== id));
            setQuota((prev) => prev ? {
                ...prev,
                usedCount: Math.max(0, prev.usedCount - 1),
                usedBytes: Math.max(0, prev.usedBytes - (uploads.find(x => x.id === id)?.sizeBytes || 0))
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
    const countPercent = quota ? (quota.usedCount / quota.maxCount) * 100 : 0;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-black tracking-tight text-white">Content Gallery</h1>
                <p className="text-zinc-400">Manage your uploaded media for StarOverlay widgets.</p>
            </div>

            {error && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <div className="flex-1">
                        <p className="text-sm font-bold">Action Failed</p>
                        <p className="text-xs opacity-80">{error}</p>
                    </div>
                    <button onClick={() => setError('')} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {quota && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-6 rounded-2xl bg-zinc-900 border border-white/5 space-y-4">
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Storage Space</p>
                                <p className="text-2xl font-black text-white mt-1">
                                    {formatBytes(quota.usedBytes)} <span className="text-zinc-500 text-lg">/ {formatBytes(quota.maxBytes)}</span>
                                </p>
                            </div>
                            <UploadCloud className="w-8 h-8 text-violet-500/50" />
                        </div>
                        <div className="h-2 w-full bg-zinc-950 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-violet-600 to-fuchsia-600 transition-all duration-500"
                                style={{ width: `${Math.min(100, quotaPercent)}%` }}
                            />
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-zinc-900 border border-white/5 space-y-4">
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-sm font-bold text-zinc-400 uppercase tracking-wider">File Count</p>
                                <p className="text-2xl font-black text-white mt-1">
                                    {quota.usedCount} <span className="text-zinc-500 text-lg">/ {quota.maxCount} files</span>
                                </p>
                            </div>
                            <FileIcon className="w-8 h-8 text-fuchsia-500/50" />
                        </div>
                        <div className="h-2 w-full bg-zinc-950 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-fuchsia-600 to-rose-600 transition-all duration-500"
                                style={{ width: `${Math.min(100, countPercent)}%` }}
                            />
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col gap-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                        <div className="relative flex-1 max-w-md group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-violet-400 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search by filename..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-zinc-900 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 transition-all"
                            />
                        </div>

                        <div className="flex items-center bg-zinc-950/50 p-1 rounded-xl border border-white/5">
                            {(['all', 'image', 'video', 'audio'] as const).map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setFilterType(t)}
                                    className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${filterType === t
                                            ? 'bg-zinc-800 text-white shadow-sm'
                                            : 'text-zinc-500 hover:text-zinc-300'
                                        }`}
                                >
                                    {t === 'all' ? 'All' : t === 'image' ? 'Images' : t === 'video' ? 'Videos' : 'Audio'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative group">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as SortOption)}
                                className="appearance-none bg-zinc-900 border border-white/5 rounded-xl py-2.5 pl-10 pr-10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 transition-all cursor-pointer"
                            >
                                <option value="date-newest">Date: Newest</option>
                                <option value="date-oldest">Date: Oldest</option>
                                <option value="name-az">Name: A-Z</option>
                                <option value="name-za">Name: Z-A</option>
                                <option value="size-largest">Size: Largest</option>
                                <option value="size-smallest">Size: Smallest</option>
                            </select>
                            <SortAsc className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                        </div>

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
                                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold transition-all disabled:opacity-50 disabled:pointer-events-none shadow-lg shadow-violet-900/20"
                            >
                                {isUploading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        {Math.round(uploadProgress)}%
                                    </>
                                ) : (
                                    <>
                                        <UploadCloud className="w-4 h-4" />
                                        Upload
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 min-h-[300px]">
                    {filteredAndSortedUploads.length === 0 ? (
                        <div className="col-span-full flex flex-col items-center justify-center text-zinc-500 bg-zinc-900/30 rounded-3xl border border-white/5 border-dashed p-12">
                            <div className="bg-zinc-900 p-4 rounded-2xl mb-4 border border-white/5">
                                {searchQuery ? <Search className="w-8 h-8 opacity-20" /> : <ImageIcon className="w-8 h-8 opacity-20" />}
                            </div>
                            <p className="font-bold text-white mb-1">
                                {searchQuery ? 'No matches found' : 'No files yet'}
                            </p>
                            <p className="text-sm opacity-60">
                                {searchQuery ? 'Try matching another filename' : 'Upload your first image, video or audio file'}
                            </p>
                        </div>
                    ) : (
                        filteredAndSortedUploads.map((upload) => (
                            <div key={upload.id} className="group flex flex-col rounded-2xl bg-zinc-900 border border-white/5 overflow-hidden hover:border-violet-500/30 transition-all hover:shadow-xl hover:shadow-black/40">
                                <div className="aspect-square bg-zinc-950 relative overflow-hidden">
                                    {upload.type === 'image' ? (
                                        <img
                                            src={upload.thumbnailUrl}
                                            alt={upload.displayName}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            loading="lazy"
                                        />
                                    ) : upload.type === 'video' ? (
                                        <div className="w-full h-full flex flex-col">
                                            <video
                                                src={upload.url}
                                                className="w-full h-full object-cover group-hover:opacity-50 transition-opacity"
                                                preload="metadata"
                                                onMouseEnter={(e) => e.currentTarget.play().catch(() => { })}
                                                onMouseLeave={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
                                                muted
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:opacity-0 transition-opacity">
                                                <Film className="w-10 h-10 text-white/20" />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900 border-b border-white/5">
                                            <div className="w-16 h-16 rounded-full bg-violet-500/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                                <Music className="w-8 h-8 text-violet-400" />
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-violet-500/50">Audio File</span>
                                        </div>
                                    )}

                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-3 p-4 backdrop-blur-[2px]">
                                        <div className="flex items-center gap-2">
                                            <a
                                                href={upload.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all active:scale-95"
                                                title="View Full"
                                            >
                                                {upload.type === 'audio' ? <Music className="w-5 h-5" /> : <ImageIcon className="w-5 h-5" />}
                                            </a>
                                            <button
                                                onClick={() => handleDelete(upload.id)}
                                                className="p-3 rounded-xl bg-rose-500/20 hover:bg-rose-500/40 text-rose-200 backdrop-blur-md transition-all active:scale-95"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 bg-zinc-900">
                                    <p className="text-sm font-bold text-white truncate mb-1" title={upload.displayName}>
                                        {upload.displayName}
                                    </p>
                                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider">
                                        <span className={`px-2 py-0.5 rounded ${upload.type === 'image' ? 'bg-blue-500/10 text-blue-400' :
                                                upload.type === 'video' ? 'bg-amber-500/10 text-amber-400' :
                                                    'bg-violet-500/10 text-violet-400'
                                            }`}>
                                            {upload.type}
                                        </span>
                                        <span className="text-zinc-500">{formatBytes(upload.sizeBytes)}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
