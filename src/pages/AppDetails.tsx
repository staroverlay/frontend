import { useParams, Link } from 'react-router-dom';
import { useApp } from '../hooks/use-app';
import { useAppPage } from '../hooks/use-app-page';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, Loader2, AlertCircle, Calendar, Tag, HardDrive } from 'lucide-react';

export default function AppDetails() {
  const { id } = useParams<{ id: string }>();
  const [app, isAppLoading, appError] = useApp(id || '');
  const [page, isPageLoading, pageError] = useAppPage(id || '');

  const WIDGET_SERVER = import.meta.env.VITE_APP_WIDGET_SERVER || 'http://localhost:4000';

  if (isAppLoading || isPageLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
        <p className="text-zinc-500 font-medium">Loading application...</p>
      </div>
    );
  }

  if (appError || pageError || !app) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8 max-w-xl mx-auto text-center bg-red-500/5 border border-red-500/10 rounded-3xl">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-red-200 mb-2">Failed to load application</h2>
        <p className="text-red-400/80 mb-6">{appError?.message || pageError?.message || 'Application not found'}</p>
        <Link to="/apps" className="px-6 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl transition-colors font-medium">
          Return to Explorer
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto w-full pb-20 animate-in fade-in duration-500">
      <Link to="/apps" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-8 group">
        <div className="p-2 border border-white/10 rounded-xl bg-zinc-900/50 group-hover:bg-zinc-800 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </div>
        <span className="font-semibold text-sm">Back to Apps</span>
      </Link>

      {/* Header Banner */}
      <div className="relative w-full h-64 md:h-80 rounded-3xl overflow-hidden bg-zinc-950 border border-white/10 mb-8 shadow-2xl">
        <img
          src={`${WIDGET_SERVER}/${app.id}/thumbnail.jpg`}
          className="w-full h-full object-cover opacity-60"
          alt={`${app.name} cover`}
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://placehold.co/1200x400/1a1a1c/4c1d95?text=${app.name.charAt(0)}`;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent flex flex-col justify-end p-8 md:p-12">
          <div className="flex items-center gap-3 mb-3 relative z-10 w-full">
            <span className="px-3 py-1 bg-violet-500/20 text-violet-300 rounded-full text-xs font-black uppercase tracking-widest border border-violet-500/30">
              {app.category}
            </span>
            <span className="px-3 py-1 bg-zinc-900/80 backdrop-blur-md text-zinc-300 rounded-full text-xs font-bold font-mono border border-white/10">
              v{app.version}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-2 leading-tight">{app.name}</h1>
          <p className="text-zinc-300 text-lg md:text-xl max-w-2xl text-shadow-sm">{app.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content (Markdown) */}
        <div className="lg:col-span-2 bg-zinc-900/30 border border-white/5 rounded-3xl p-8 backdrop-blur-xl">
          <div className="prose prose-invert prose-violet max-w-none 
                          prose-headings:font-black prose-headings:tracking-tight prose-headings:text-white
                          prose-a:text-violet-400 hover:prose-a:text-violet-300 prose-p:text-zinc-300 prose-li:text-zinc-300
                          prose-pre:bg-zinc-950 prose-pre:border prose-pre:border-white/10
                          prose-strong:text-white prose-hr:border-white/10
                          prose-img:rounded-2xl prose-img:border prose-img:border-white/10">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {page || '*No additional information provided for this app.*'}
            </ReactMarkdown>
          </div>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-6">
          <div className="bg-zinc-900/30 border border-white/5 rounded-3xl p-6 backdrop-blur-xl">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-violet-400" />
              App Details
            </h3>

            <div className="flex flex-col gap-5">
              <div className="flex items-start gap-4">
                <Tag className="w-5 h-5 text-zinc-500 mt-0.5" />
                <div>
                  <div className="text-sm font-semibold text-white mb-1">Compatible Platforms</div>
                  <div className="flex flex-wrap gap-2">
                    {app.compatible_with?.map(platform => (
                      <span key={platform} className="text-[10px] font-black tracking-widest uppercase bg-zinc-800 text-zinc-300 px-2 py-1 rounded">
                        {platform}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Calendar className="w-5 h-5 text-zinc-500 mt-0.5" />
                <div>
                  <div className="text-sm font-semibold text-white mb-1">Last Updated</div>
                  <div className="text-sm text-zinc-400">
                    {new Date(app.updated_at).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-5 h-5 text-zinc-500 mt-0.5 flex items-center justify-center font-bold font-mono text-xs">ID</div>
                <div>
                  <div className="text-sm font-semibold text-white mb-1">Developer ID</div>
                  <div className="text-xs font-mono text-zinc-400 bg-zinc-950 px-2 py-1 rounded border border-white/5">
                    {app.id}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Mock Install Button */}
          <button className="w-full py-4 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-2xl shadow-lg shadow-violet-600/20 transition-all active:scale-95 flex items-center justify-center gap-2">
            Install App
          </button>
        </div>
      </div>
    </div>
  );
}
