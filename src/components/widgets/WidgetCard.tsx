import { Link } from 'react-router-dom';
import type { Widget } from '../../lib/types';
import { Layers, Settings2, Copy, Check, MoreVertical, Trash2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { widgetsService } from '../../services/widgets-service';
import { DeleteConfirmModal } from '../common/DeleteConfirmModal';

interface WidgetCardProps {
    widget: Widget;
    onDelete?: () => void;
}

export function WidgetCard({ widget, onDelete }: WidgetCardProps) {
    const WIDGET_SERVER = import.meta.env.VITE_APP_WIDGET_SERVER || 'http://localhost:4000';
    const [copied, setCopied] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const widgetUrl = `${WIDGET_SERVER}/widget/${widget.app_id}?token=${widget.token}`;

    const copyUrl = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        navigator.clipboard.writeText(widgetUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await widgetsService.deleteWidget(widget.id);
            setShowDeleteModal(false);
            onDelete?.();
        } catch (e) {
            console.error('Failed to delete widget', e);
        } finally {
            setIsDeleting(false);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <Link
            to={`/widgets/${widget.id}`}
            className="group relative flex flex-col rounded-3xl bg-surface-card border border-border-subtle overflow-hidden hover:bg-surface-panel hover:border-brand-primary/30 transition-all duration-300 shadow-premium block"
        >
            {/* Glow effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0" />

            {/* Thumbnail Header */}
            <div className="h-50 w-full bg-surface-base relative overflow-hidden border-b border-border-subtle z-0">
                <img
                    src={`${WIDGET_SERVER}/apps/${widget.app_id}/thumbnail.jpg`}
                    alt={`${widget.display_name || widget.app_id} thumbnail`}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                    loading="lazy"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://placehold.co/600x400/1a1a1c/4c1d95?text=${(widget.display_name || widget.app_id).charAt(0)}`;
                    }}
                />

                <div className="absolute top-4 left-4 flex gap-2">
                    <div className="bg-surface-base/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-border-default flex items-center gap-1.5 shadow-xl">
                        {widget.enabled ? (
                            <span className="w-1.5 h-1.5 rounded-full bg-status-success shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                        ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-status-error shadow-[0_0_8px_rgba(244,63,94,0.8)]"></span>
                        )}
                        <span className="text-[10px] font-black text-content-secondary uppercase tracking-widest">
                            {widget.enabled ? 'Active' : 'Disabled'}
                        </span>
                    </div>
                </div>

                <div className="absolute top-4 right-4 flex gap-1.5" ref={menuRef}>
                    <button
                        onClick={copyUrl}
                        className="bg-surface-base/80 backdrop-blur-md p-2 rounded-xl border border-border-default text-content-muted hover:text-content-primary hover:border-brand-primary/40 transition-all shadow-xl group/btn"
                        title="Copy Widget URL"
                    >
                        {copied ? <Check className="w-4 h-4 text-status-success" /> : <Copy className="w-4 h-4" />}
                    </button>

                    <div className="relative">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setShowMenu(!showMenu);
                            }}
                            className="bg-surface-base/80 backdrop-blur-md p-2 rounded-xl border border-border-default text-content-muted hover:text-content-primary hover:border-status-error/40 transition-all shadow-xl group/btn"
                        >
                            <MoreVertical className="w-4 h-4" />
                        </button>

                        {showMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-surface-panel border border-border-default rounded-xl shadow-premium py-1 z-30 animate-in fade-in zoom-in-95 duration-200">
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setShowDeleteModal(true);
                                        setShowMenu(false);
                                    }}
                                    className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-status-error hover:bg-status-error/10 transition-colors"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    Delete Instance
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Content Body */}
            <div className="p-6 relative z-10 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-1">
                    <Layers className="w-3.5 h-3.5 text-brand-primary" />
                    <span className="text-[10px] font-black text-brand-primary/70 uppercase tracking-[0.2em]">{widget.app_id}</span>
                </div>

                <h3 className="text-xl font-black text-content-primary mb-2 group-hover:text-brand-accent transition-colors">
                    {widget.display_name || widget.app_id}
                </h3>

                <div className="flex justify-between items-center mt-auto">
                    <div className="flex gap-2">
                        <span className="text-[9px] font-black uppercase tracking-widest bg-surface-elevated text-content-muted px-2.5 py-1 rounded border border-border-subtle">
                            ID: {widget.id.slice(0, 8)}...
                        </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-content-dimmed group-hover:text-brand-primary transition-colors">
                        <Settings2 className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Configure</span>
                    </div>
                </div>
            </div>

            <DeleteConfirmModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
                title="Delete Widget?"
                message={`Are you sure you want to delete "${widget.display_name || widget.app_id}"? This action cannot be undone.`}
                isDeleting={isDeleting}
            />
        </Link>
    );
}
