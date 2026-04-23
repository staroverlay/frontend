import { MediaLibrary } from '../components/media/MediaLibrary';
import { PageHeader } from '../components/layouts/PageHeader';
import { FolderHeart, Upload } from 'lucide-react';

export default function Content() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500 overflow-hidden h-full flex flex-col">
            <PageHeader
                icon={<FolderHeart className="w-5 h-5" />}
                title="Content"
                highlight="Gallery"
                description="Upload and manage your media assets. Images and videos are instantly available to all your active widgets."
                actions={
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-surface-panel/80 hover:bg-surface-elevated border border-white/[0.07] text-content-muted hover:text-content-primary font-bold text-sm rounded-xl transition-all">
                        <Upload className="w-4 h-4" />
                        Upload
                    </button>
                }
            />

            <div className="flex-1 min-h-0">
                <MediaLibrary />
            </div>
        </div>
    );
}
