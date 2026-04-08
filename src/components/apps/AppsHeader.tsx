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
        <div className="w-12 h-12 bg-brand-primary/10 rounded-2xl border border-brand-primary/20 flex items-center justify-center shrink-0">
          <Compass className="w-6 h-6 text-brand-primary" />
        </div>
        <h1 className="text-4xl font-black text-content-primary tracking-tight leading-tight m-0 uppercase">
          {title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">{highlightedText}</span>
        </h1>
      </div>
      <p className="text-content-muted text-base md:text-lg max-w-2xl md:pl-[4.5rem]">
        {description}
      </p>

      {/* Global ambient glow for header */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 rounded-full blur-[100px] pointer-events-none z-0" />
    </div>
  );
}
