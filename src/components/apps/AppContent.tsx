import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface AppContentProps {
    page?: string | null;
}

export const AppContent = ({ page }: AppContentProps) => {
    return (
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
    );
};
