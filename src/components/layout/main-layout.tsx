import { useAuth } from '../../hooks/use-auth';
import { useProfile } from '../../hooks/use-profile';
import { LogOut, LayoutDashboard, Settings, User as UserIcon, Grid } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, logout } = useAuth();
  const { profile } = useProfile();
  const location = useLocation();

  if (!isAuthenticated) return <>{children}</>;

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Explore Apps', href: '/apps', icon: Grid },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-violet-500/30 selection:text-violet-200 [scrollbar-gutter:stable] relative">
      {/* Background Effects from Auth */}
      <div className="fixed top-[0%] left-[-10%] w-[40%] h-[50%] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[50%] rounded-full bg-fuchsia-600/10 blur-[120px] pointer-events-none z-0" />
      
      {/* Top Navbar */}
      <header className="h-14 border-b border-white/5 bg-zinc-950/20 backdrop-blur-xl flex items-center justify-between px-6 fixed top-0 w-full z-50 transition-colors">
        <div className="flex items-center gap-3">
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
        </div>

        <nav className="flex items-center gap-1">
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

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 pr-4 border-r border-zinc-800">
            <div className="text-right hidden md:block">
              <p className="text-sm font-bold text-white leading-tight">{profile?.displayName || user?.email.split('@')[0]}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400">
               <UserIcon className="w-4 h-4" />
            </div>
          </div>
          <button
            onClick={logout}
            className="text-zinc-500 hover:text-zinc-200 transition-colors flex items-center gap-2 text-sm font-semibold"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden relative z-10 pt-14">
        <div className="max-w-6xl mx-auto p-6 md:p-10">
          {children}
        </div>
      </main>
    </div>
  );
}
