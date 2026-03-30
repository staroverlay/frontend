import { Compass } from 'lucide-react';

interface AppsHeaderProps {
  title: string;
  highlightedText: string;
  description: string;
}

export function AppsHeader({ title, highlightedText, description }: AppsHeaderProps) {
  return (
    <div className="flex flex-col gap-3 relative">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-violet-500/10 rounded-2xl border border-violet-500/20 flex items-center justify-center shrink-0">
          <Compass className="w-6 h-6 text-violet-400" />
        </div>
        <h1 className="text-4xl font-black text-white tracking-tight leading-tight m-0">
          {title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">{highlightedText}</span>
        </h1>
      </div>
      <p className="text-zinc-400 text-lg max-w-2xl pl-[4.5rem]">
        {description}
      </p>

      {/* Global ambient glow for header */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/10 rounded-full blur-[100px] pointer-events-none z-0" />
    </div>
  );
}
