import { EyeOff, ExternalLink } from 'lucide-react';
import { useWidgetDetails } from './WidgetDetailsContext';
import { WidgetPreviewHeader } from './WidgetPreviewHeader';

export const WidgetPreviewArea = () => {
    const { widget } = useWidgetDetails();

    if (!widget) return null;

    const WIDGET_SERVER = import.meta.env.VITE_APP_WIDGET_SERVER || 'http://localhost:4000';
    const widgetUrl = `${WIDGET_SERVER}/widget/${widget.app_id}?token=${widget.token}`;
    const previewUrl = `${widgetUrl}&ispreview=true`;

    return (
        <main className="flex-1 relative flex flex-col overflow-hidden bg-black order-1 lg:order-none h-[50vh] lg:h-auto">
            <WidgetPreviewHeader />

            <div className="flex-1 relative flex items-center justify-center min-h-[300px]">
                {/* Background Pattern */}
                <div
                    className="absolute inset-0 z-0 opacity-[0.05]"
                    style={{
                        backgroundImage: `
              linear-gradient(45deg, #FFF 25%, transparent 25%), 
              linear-gradient(-45deg, #FFF 25%, transparent 25%), 
              linear-gradient(45deg, transparent 75%, #FFF 75%), 
              linear-gradient(-45deg, transparent 75%, #FFF 75%)
            `,
                        backgroundSize: '40px 40px',
                        backgroundPosition: '0 0, 0 20px, 20px -20px, -20px 0px'
                    }}
                />

                {/* Iframe Container */}
                <div className="relative z-10 w-full h-full flex items-center justify-center">
                    {widget && widget.enabled ? (
                        <iframe
                            src={previewUrl}
                            className="w-full h-full border-none pointer-events-none transition-all duration-1000"
                            style={{ filter: 'drop-shadow(0 0 50px rgba(0,0,0,0.5))' }}
                            title="Widget Preview"
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center p-6 lg:p-12 bg-black/40 backdrop-blur-md rounded-2xl lg:rounded-3xl border border-white/5 animate-in fade-in zoom-in-95 duration-500 mx-4">
                            <div className="p-6 lg:p-8 bg-zinc-900/40 rounded-full border border-white/5 mb-6 lg:mb-8">
                                <EyeOff className="w-10 h-10 lg:w-12 lg:h-12 text-zinc-800" />
                            </div>
                            <h2 className="text-lg lg:text-xl font-black text-white uppercase tracking-tighter mb-2">Overlay Off-Air</h2>
                            <p className="text-xs lg:text-sm font-medium text-zinc-600 max-w-[240px] leading-relaxed">The overlay output is currently disabled. Toggle the master switch above to go live.</p>
                        </div>
                    )}
                </div>

                <button
                    className="absolute bottom-4 right-4 lg:bottom-6 lg:right-6 p-2 lg:p-3 bg-zinc-950/80 backdrop-blur-xl border border-white/10 rounded-xl lg:rounded-2xl hover:bg-zinc-800 transition-all text-zinc-400 hover:text-white group z-20"
                    onClick={() => window.open(widgetUrl, '_blank')}
                    title="Open in new tab"
                >
                    <ExternalLink className="w-3.5 h-3.5 lg:w-4 h-4 group-hover:scale-110 transition-transform" />
                </button>
            </div>
        </main>
    );
};
