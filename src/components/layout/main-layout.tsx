import { useState } from 'react';
import { useAuth } from '../../hooks/use-auth';
import { useProfile } from '../../hooks/use-profile';
import {
  LogOut, LayoutDashboard, Grid, Layers,
  Menu, X, FolderHeart, Bell, ChevronDown, User as UserIcon,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';

type Channel = 'alpha' | 'beta' | 'test' | 'stage' | 'dev' | 'prod';

const navigation = [
  { name: 'Overview', href: '/', icon: LayoutDashboard },
  { name: 'My Widgets', href: '/widgets', icon: Layers },
  { name: 'Explore', href: '/apps', icon: Grid },
  { name: 'Media', href: '/content', icon: FolderHeart },
];

export function MainLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, logout } = useAuth();
  const { profile } = useProfile();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  if (!isAuthenticated) return <>{children}</>;

  const isWidgetDetail = /^\/widgets\/[a-zA-Z0-9-]+$/.test(location.pathname);

  const displayName = profile?.displayName || user?.email?.split('@')[0] || 'User';
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <div className="flex flex-col min-h-screen bg-surface-base text-content-secondary font-sans selection:bg-brand-primary/30 selection:text-brand-accent relative overflow-x-hidden">

      {/* ── Channel Banner ─────────────────────────────────────────────── */}
      {(() => {
        const channel: Channel = (import.meta.env.VITE_APP_CHANNEL ?? (import.meta.env.DEV ? 'dev' : 'prod')) as Channel;
        const map: Record<string, { bg: string; label: string }> = {
          alpha: { bg: 'bg-status-error/90', label: 'ALPHA ACCESS — Unstable features ahead' },
          beta: { bg: 'bg-status-warning/90', label: 'BETA CHANNEL — Early access features' },
          test: { bg: 'bg-pink-600/90', label: 'TEST CHANNEL — Data may be wiped at any time' },
          stage: { bg: 'bg-pink-600/90', label: 'STAGING CHANNEL' },
          dev: { bg: 'bg-status-info/90', label: 'DEVELOPMENT BRANCH' },
        };
        const cfg = map[channel];
        if (!cfg) return null;
        return (
          <div className={cn('w-full py-1.5 text-center text-[11px] font-black tracking-[0.2em] uppercase z-50', cfg.bg)}>
            {cfg.label}
          </div>
        );
      })()}

      {/* ── Ambient blobs ───────────────────────────────────────────────── */}
      <div className="fixed top-[-10%] left-[-10%] w-[45%] h-[55%] rounded-full bg-brand-primary/8 blur-[130px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[50%] rounded-full bg-brand-secondary/8 blur-[130px] pointer-events-none z-0" />

      {/* ── Top Navbar ─────────────────────────────────────────────────── */}
      {!isWidgetDetail && (
        <header className="fixed top-8 left-0 right-0 z-40 w-full flex items-center justify-center pointer-events-none">
          <div className="flex items-center justify-between w-[calc(100%-2rem)] px-4 py-2 rounded-3xl pointer-events-auto">

            {/* LEFT — Logo */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-content-dimmed hover:text-content-primary hover:bg-white/5 transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              <Link to="/" className="flex items-center gap-2.5 select-none pl-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center shadow-lg shadow-brand-primary/20">
                  <span className="text-white font-black text-sm">S</span>
                </div>
                <span className="text-base font-black tracking-tight text-white hidden sm:block">
                  Star<span className="text-lavender">Overlay</span>
                </span>
              </Link>
            </div>

            {/* CENTER — Refined Island Navigation */}
            <nav className="hidden lg:flex items-center gap-1 bg-white/[0.03] border border-white/[0.05] rounded-full px-1.5 py-1.5 backdrop-blur-2xl">
              {navigation.map((item) => {
                const isActive =
                  item.href === '/'
                    ? location.pathname === '/'
                    : location.pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      'flex items-center gap-2.5 px-6 py-2.5 rounded-full text-[13px] font-bold transition-all duration-300 whitespace-nowrap group',
                      isActive
                        ? 'bg-white/[0.08] text-white shadow-xl shadow-black/20 border border-white/[0.05]'
                        : 'text-content-dimmed hover:text-content-primary'
                    )}
                  >
                    <item.icon className={cn('w-4 h-4 shrink-0 transition-colors', isActive ? 'text-lavender' : 'text-content-dimmed group-hover:text-content-primary')} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* RIGHT — Bell + avatar menu */}
            <div className="flex items-center gap-2">
              {/* Bell */}
              <button
                className="relative w-9 h-9 rounded-xl border border-white/[0.06] bg-surface-panel/60 flex items-center justify-center text-content-dimmed hover:text-content-primary hover:border-white/10 transition-all"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
              </button>

              {/* User menu */}
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-xl border border-white/[0.06] bg-surface-panel/60 hover:border-white/10 hover:bg-surface-elevated/60 transition-all"
                >
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center text-white text-[10px] font-black shrink-0">
                    {initials}
                  </div>
                  <span className="hidden sm:block text-xs font-semibold text-content-secondary max-w-[90px] truncate">
                    {displayName}
                  </span>
                  <ChevronDown className={cn('w-3 h-3 text-content-dimmed transition-transform duration-200', isUserMenuOpen && 'rotate-180')} />
                </button>

                {/* Dropdown */}
                {isUserMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)} />
                    <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-52 rounded-2xl border border-white/[0.08] bg-surface-panel/90 backdrop-blur-2xl shadow-xl shadow-black/40 overflow-hidden">
                      <div className="px-4 py-3 border-b border-white/[0.05]">
                        <p className="text-[10px] uppercase font-black text-brand-primary/60 tracking-widest leading-none mb-1">Signed in as</p>
                        <p className="text-sm font-bold text-content-primary truncate">{displayName}</p>
                        <p className="text-xs text-content-dimmed truncate mt-0.5">{user?.email}</p>
                      </div>
                      <div className="p-1.5">
                        <Link
                          to="/settings"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm text-content-muted hover:text-content-primary hover:bg-white/5 transition-colors"
                        >
                          <UserIcon className="w-4 h-4" />
                          Profile & Settings
                        </Link>
                      </div>
                      <div className="p-1.5 pt-0 border-t border-white/[0.05]">
                        <button
                          onClick={() => { setIsUserMenuOpen(false); logout(); }}
                          className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm text-content-dimmed hover:text-status-error hover:bg-status-error/5 transition-colors mt-1"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>
      )}

      {/* ── Mobile nav overlay ─────────────────────────────────────────── */}
      {!isWidgetDetail && (
        <div
          className={cn(
            'fixed inset-0 top-[60px] bg-surface-base/97 backdrop-blur-2xl lg:hidden transition-all duration-300 z-30 p-6 flex flex-col gap-2',
            isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          )}
        >
          {navigation.map((item) => {
            const isActive =
              item.href === '/' ? location.pathname === '/' : location.pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  'flex items-center gap-4 px-5 py-3.5 rounded-2xl text-sm font-bold transition-all border',
                  isActive
                    ? 'text-brand-primary bg-brand-primary/8 border-brand-primary/15'
                    : 'text-content-muted hover:text-content-secondary hover:bg-white/3 border-transparent'
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}
          <div className="mt-auto pt-6 border-t border-white/[0.05]">
            <button
              onClick={logout}
              className="flex items-center gap-3 w-full px-5 py-3.5 rounded-2xl text-sm font-bold text-content-dimmed hover:text-status-error hover:bg-status-error/5 transition-colors border border-transparent"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        </div>
      )}

      {/* ── Main Content ───────────────────────────────────────────────── */}
      <main className="flex-1 overflow-x-hidden relative z-10">
        {isWidgetDetail ? (
          children
        ) : (
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-10">
            {children}
          </div>
        )}
      </main>
    </div>
  );
}
