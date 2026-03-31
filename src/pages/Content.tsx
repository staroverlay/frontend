import { MediaLibrary } from '../components/media/MediaLibrary';

export default function Content() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500 overflow-hidden h-full flex flex-col">
            <div className="flex flex-col gap-2 shrink-0">
                <h1 className="text-3xl font-black tracking-tight text-white">Content Gallery</h1>
                <p className="text-zinc-400 text-sm">Manage your uploaded media for StarOverlay widgets.</p>
            </div>

            <div className="flex-1 min-h-0">
                <MediaLibrary />
            </div>
        </div>
    );
}
