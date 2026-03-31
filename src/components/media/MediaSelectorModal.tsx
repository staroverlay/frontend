import { X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { MediaLibrary } from './MediaLibrary';
import type { UploadItem } from './MediaLibrary';

interface MediaSelectorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (upload: UploadItem) => void;
    title?: string;
    filterType?: 'all' | 'image' | 'video' | 'audio';
    selectedId?: string;
}

export const MediaSelectorModal: React.FC<MediaSelectorModalProps> = ({
    isOpen,
    onClose,
    onSelect,
    title = 'Select Media',
    filterType = 'all',
    selectedId
}) => {
    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10 animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

            <div className="relative w-full max-w-5xl h-full max-h-[85vh] bg-zinc-950 border border-white/10 rounded-[2rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between shrink-0">
                    <div>
                        <h2 className="text-xl font-black text-white leading-none">{title}</h2>
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1.5">Galleries & Uploads</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/5 rounded-xl transition-all text-zinc-500 hover:text-white"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-hidden p-6">
                    <MediaLibrary
                        onSelect={(u) => {
                            onSelect(u);
                            onClose();
                        }}
                        filterType={filterType}
                        selectedId={selectedId}
                    />
                </div>
            </div>
        </div>,
        document.body
    );
};
