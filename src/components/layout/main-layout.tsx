import { useState } from 'react';
import { useAuth } from '../../hooks/use-auth';
import { useProfile } from '../../hooks/use-profile';
import { LogOut, LayoutDashboard, Settings, User as UserIcon, Grid, Layers, Menu, X, FolderHeart } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';

type Channel = "alpha" | "beta" | "test" | "stage" | "dev" | "prod";

export function MainLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, logout } = useAuth();
  const { profile } = useProfile();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!isAuthenticated) return <>{children}</>;

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Explore Apps', href: '/apps', icon: Grid },
    { name: 'Widgets', href: '/widgets', icon: Layers },
    { name: 'Content', href: '/content', icon: FolderHeart },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-violet-500/30 selection:text-violet-200 [scrollbar-gutter:stable] relative overflow-x-hidden">
      {/* Channel Banner */}
      {(() => {
        const channel: Channel = (import.meta.env.VITE_APP_CHANNEL ?? (import.meta.env.DEV ? "dev" : "prod")) as Channel;
        if (!channel) return null;

        let bg = '';
        let text = '';
        if (channel === 'alpha') {
          bg = 'bg-red-600/90';
          text = 'ALPHA ACCESS - Unstable features ahead';
        } else if (channel === 'beta') {
          bg = 'bg-yellow-600/90 text-yellow-50';
          text = 'BETA CHANNEL - Early access features';
        } else if (channel === 'test' || channel === 'stage') {
          bg = 'bg-pink-600/90';
          text = 'TEST CHANNEL - Data may be deleted at any time';
        } else if (channel === 'dev') {
          bg = 'bg-sky-500/90';
          text = 'DEVELOPMENT BRANCH';
        } else {
          return null;
        }

        return (
          <div className={cn("w-full py-1.5 text-center text-xs font-black tracking-widest uppercase shadow-sm z-50", bg)}>
            {text}
          </div>
        );
      })()}
      {/* Background Effects from Auth */}
      <div className="fixed top-[0%] left-[-10%] w-[40%] h-[50%] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[50%] rounded-full bg-fuchsia-600/10 blur-[120px] pointer-events-none z-0" />

      {/* Top Navbar */}
      {!location.pathname.match(/^\/widgets\/[a-zA-Z0-9-]+$/) && (
        <header className="h-16 border-b border-white/5 bg-zinc-950/20 backdrop-blur-xl flex items-center justify-between px-4 md:px-8 w-full z-40 transition-colors sticky top-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-zinc-400 hover:text-white transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <Link to="/" className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="StarOverlay"
                className="w-8 h-8 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const next = e.currentTarget.nextElementSibling;
                  if (next) next.classList.remove('hidden');
                }}
              />
              <div className="hidden w-8 h-8 rounded-xl bg-violet-600 shadow-lg shadow-violet-500/20 flex items-center justify-center">
                <span className="text-white font-black text-sm">S</span>
              </div>
              <span className="text-base font-black tracking-tight text-white">
                Star<span className="text-violet-500">Overlay</span>
              </span>
            </Link>
          </div>

          <nav className="hidden lg:flex items-center gap-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href || (item.href !== '/' && location.pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors',
                    isActive
                      ? 'text-violet-400 bg-violet-500/10'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 md:gap-4">
            <div className="flex items-center gap-3 pr-2 md:pr-4 md:border-r border-zinc-800">
              <div className="text-right hidden md:block">
                <p className="text-[10px] uppercase font-black text-violet-500/60 leading-none mb-1">User Profile</p>
                <p className="text-sm font-bold text-white leading-tight">{profile?.displayName || user?.email.split('@')[0]}</p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-400">
                <UserIcon className="w-4 h-4" />
              </div>
            </div>
            <button
              onClick={logout}
              className="p-2.5 bg-zinc-900 border border-white/5 rounded-xl text-zinc-500 hover:text-rose-400 hover:border-rose-500/20 transition-all flex items-center gap-2"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden lg:inline text-xs font-bold uppercase tracking-wider">Logout</span>
            </button>
          </div>

          {/* Mobile Navigation Dropdown */}
          <div className={cn(
            "fixed inset-0 top-16 bg-zinc-950/95 backdrop-blur-2xl lg:hidden transition-all duration-300 z-40 p-6 flex flex-col gap-2",
            isMobileMenuOpen ? "opacity-100 pointer-events-auto translate-y-0" : "opacity-0 pointer-events-none -translate-y-4"
          )}>
            {navigation.map((item) => {
              const isActive = location.pathname === item.href || (item.href !== '/' && location.pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-4 px-6 py-4 rounded-xl text-base font-bold transition-all border',
                    isActive
                      ? 'text-violet-400 bg-violet-600/10 border-violet-500/20'
                      : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900 border-transparent'
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}

            <div className="mt-auto pt-6 border-t border-white/5">
              <div className="p-4 rounded-2xl bg-zinc-900/50 border border-white/5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400">
                  <UserIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-black text-violet-500/60 leading-none mb-1">Signed in as</p>
                  <p className="text-sm font-bold text-white leading-tight">{profile?.displayName || user?.email.split('@')[0]}</p>
                </div>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className={cn(
        "flex-1 overflow-x-hidden relative z-10"
      )}>
        {location.pathname.match(/^\/widgets\/[a-zA-Z0-9-]+$/) ? (
          children
        ) : (
          <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-12">
            {children}
          </div>
        )}
      </main>
    </div>
  );
}
