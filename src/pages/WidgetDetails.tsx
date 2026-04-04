import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { WidgetDetailsProvider, useWidgetDetails } from '../components/widget-details/WidgetDetailsContext';
import { WidgetSidebar } from '../components/widget-details/WidgetSidebar';
import { WidgetPreviewArea } from '../components/widget-details/WidgetPreviewArea';
import { cn } from '../lib/utils';

function WidgetDetailsContent() {
    const {
        loading,
        widgetError,
        widget,
        startResizing,
        isResizing
    } = useWidgetDetails();

    if (loading.widget) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-black gap-4 p-6">
                <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
                <p className="text-zinc-500 font-medium tracking-tight text-center">Loading Instance...</p>
            </div>
        );
    }

    if (widgetError || !widget) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-black p-6 text-center">
                <div className="max-w-md w-full bg-zinc-900/50 border border-red-500/10 p-8 lg:p-10 rounded-[2rem] lg:rounded-[2.5rem] backdrop-blur-2xl">
                    <AlertCircle className="w-12 h-12 lg:w-16 lg:h-16 text-red-500 mx-auto mb-6 opacity-80" />
                    <h2 className="text-xl lg:text-2xl font-black text-white mb-3">Widget not found</h2>
                    <p className="text-zinc-400 mb-8 leading-relaxed text-sm">{widgetError || 'Could not load instance.'}</p>
                    <Link to="/widgets" className="inline-flex items-center gap-2 px-6 lg:px-8 py-3 lg:py-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-2xl transition-all font-bold border border-white/5 text-sm">
                        <ArrowLeft className="w-4 h-4" />
                        Go Back
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row h-screen bg-black overflow-hidden font-sans">
            <WidgetSidebar />

            <div
                onMouseDown={startResizing}
                className={cn(
                    "hidden lg:block w-1.5 h-screen cursor-col-resize z-50 transition-all hover:bg-violet-500/20 active:bg-violet-500/40 relative shrink-0",
                    isResizing && "bg-violet-500/40"
                )}
                style={{ marginLeft: '-3px', marginRight: '-3px' }}
            />

            <WidgetPreviewArea />
        </div>
    );
}

export default function WidgetDetails() {
    return (
        <WidgetDetailsProvider>
            <WidgetDetailsContent />
        </WidgetDetailsProvider>
    );
}
