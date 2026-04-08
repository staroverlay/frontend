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

            <div className="relative w-full max-w-md bg-surface-card border border-border-default rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                <div className="p-8 text-center">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-status-error/10 flex items-center justify-center text-status-error mx-auto mb-6">
                        <AlertTriangle className="w-8 h-8" />
                    </div>

                    <h2 className="text-xl font-black text-content-primary mb-2 uppercase tracking-tight">{title}</h2>
                    <p className="text-content-dimmed text-sm leading-relaxed mb-8">{message}</p>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={onConfirm}
                            disabled={isDeleting}
                            className="w-full py-4 bg-status-error hover:bg-status-error/90 disabled:opacity-30 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-status-error/10 flex items-center justify-center gap-2 active:scale-95"
                        >
                            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                            Delete Permanently
                        </button>
                        <button
                            onClick={onClose}
                            disabled={isDeleting}
                            className="w-full py-4 bg-surface-elevated hover:bg-surface-panel text-content-muted text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all active:scale-95 border border-border-subtle"
                        >
                            Cancel
                        </button>
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 text-content-dimmed hover:text-content-primary transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
