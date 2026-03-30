import { Loader2, AlertTriangle, X } from 'lucide-react';

interface DeleteConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    isDeleting?: boolean;
}

export function DeleteConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    isDeleting
}: DeleteConfirmModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-md bg-zinc-900 border border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                <div className="p-8 text-center">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-rose-500/10 flex items-center justify-center text-rose-500 mx-auto mb-6">
                        <AlertTriangle className="w-8 h-8" />
                    </div>

                    <h2 className="text-xl font-black text-white mb-2 uppercase tracking-tight">{title}</h2>
                    <p className="text-zinc-500 text-sm leading-relaxed mb-8">{message}</p>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={onConfirm}
                            disabled={isDeleting}
                            className="w-full py-4 bg-rose-600 hover:bg-rose-500 disabled:opacity-30 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-rose-600/10 flex items-center justify-center gap-2 active:scale-95"
                        >
                            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                            Delete Permanently
                        </button>
                        <button
                            onClick={onClose}
                            disabled={isDeleting}
                            className="w-full py-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all active:scale-95"
                        >
                            Cancel
                        </button>
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 text-zinc-600 hover:text-white transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
