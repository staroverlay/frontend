import React from 'react';
import { cn } from '../../lib/utils';

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle?: string;
    icon?: React.ReactNode;
    containerClassName?: string;
}

export function AuthLayout({ children, title, subtitle, icon, containerClassName }: AuthLayoutProps) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-surface-base px-4 relative overflow-hidden">
            {/* Immersive Cosmic Background */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-[10%] left-[10%] w-[30%] h-[30%] rounded-full bg-brand-primary/5 blur-[120px]" />
                <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] rounded-full bg-brand-secondary/5 blur-[120px]" />
            </div>

            {/* Floating Stars */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full bg-white animate-pulse"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            width: `${Math.random() * 2 + 1}px`,
                            height: `${Math.random() * 2 + 1}px`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${Math.random() * 3 + 2}s`
                        }}
                    />
                ))}
            </div>

            <div className={cn("w-full max-w-md relative z-10", containerClassName)}>
                <div className="mb-12 text-center animate-in fade-in slide-in-from-top-4 duration-700">
                    {icon && (
                        <div className="inline-flex w-16 h-16 rounded-3xl bg-surface-panel/50 border border-border-default text-brand-primary items-center justify-center mb-6 shadow-premium backdrop-blur-xl transition-all hover:scale-110">
                            {icon}
                        </div>
                    )}
                    <h1 className="text-4xl font-black tracking-tight text-content-primary mb-3 uppercase">{title}</h1>
                    {subtitle && <p className="text-content-muted font-medium">{subtitle}</p>}
                </div>

                <div className="glass-panel p-8 md:p-10 rounded-[2.5rem] shadow-premium animate-in fade-in zoom-in-95 duration-1000 border-border-subtle hover:border-brand-primary/20 transition-all duration-500 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    {children}
                </div>
            </div>
        </div>
    );
}
