import React from 'react';
import { useAuth } from '../../hooks/use-auth';
import { useProfile } from '../../hooks/use-profile';
import { Button } from '../ui/button';
import { LogOut, LayoutDashboard, Settings, User as UserIcon, Share2 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, logout } = useAuth();
  const { profile } = useProfile();
  const location = useLocation();

  if (!isAuthenticated) return <>{children}</>;

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Integrations', href: '/integrations', icon: Share2 },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-blue-500/30 selection:text-blue-200">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-900 bg-zinc-950/50 backdrop-blur-xl flex flex-col items-stretch pt-8 pb-4">
        <div className="px-6 mb-8 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20" />
          <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-zinc-100 to-zinc-400">
            StarOverlay
          </h1>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative',
                  isActive 
                    ? 'bg-blue-600/10 text-blue-400' 
                    : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900'
                )}
              >
                <item.icon className={cn('w-4.5 h-4.5', isActive ? 'text-blue-500' : 'text-zinc-600 group-hover:text-zinc-400')} />
                {item.name}
                {isActive && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-blue-500 rounded-l-full shadow-[0_0_12px_rgba(59,130,246,0.5)]" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto px-4 pt-4 border-t border-zinc-900">
          <div className="flex items-center gap-3 px-3 py-3 mb-2">
            <div className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400">
               <UserIcon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{profile?.displayName || user?.email}</p>
              <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">Early Access</p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-zinc-500 hover:text-red-400 hover:bg-red-500/5 group"
            onClick={logout}
          >
            <LogOut className="w-4.5 h-4.5 group-hover:text-red-500" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900/40 via-zinc-950 to-zinc-950">
        <div className="p-8 max-w-7xl mx-auto min-h-full">
           {children}
        </div>
      </main>
    </div>
  );
}
