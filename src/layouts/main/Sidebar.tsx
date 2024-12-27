import {
  Activity,
  Bot,
  BoxIcon,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  FileText,
  Film,
  Home,
  Radio,
  ShoppingBag,
  Users,
  Users2,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const categories = [
  {
    title: 'Overview',
    items: [
      { name: 'Home', icon: Home, href: '/' },
      { name: 'Discover', icon: ShoppingBag, href: '/discover' },
      { name: 'Membership', icon: Users, href: '/membership' },
    ],
  },
  {
    title: 'Creator',
    items: [
      { name: 'My Applications', icon: FileText, href: '/creator/apps' },
      { name: 'Revenue', icon: DollarSign, href: '/creator/revenue' },
    ],
  },
  {
    title: 'Streaming',
    items: [
      { name: 'Applications', icon: BoxIcon, href: '/apps' },
      { name: 'My Widgets', icon: Radio, href: '/widgets' },
      { name: 'Manage Media', icon: Film, href: '/media' },
      { name: 'Dashboard', icon: Activity, href: '/stream-dashboard/0' },
      { name: 'Editor & Moderators', icon: Users2, href: '/editors' },
      { name: 'Chatbot', icon: Bot, href: '/chatbot' },
    ],
  },
];

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const { pathname } = useLocation();

  return (
    <div
      className={`glass fixed left-0 top-16 h-[calc(100vh-4rem)] transition-all duration-300 z-50 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <button
        onClick={onToggle}
        className="absolute -right-4 top-8 p-2 bg-purple-600 rounded-full shadow-lg hover:bg-purple-700 transition-colors z-50"
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </button>

      <div className="p-4 space-y-8 h-full">
        <div className="space-y-8">
          {categories.map((category) => (
            <div key={category.title}>
              {!isCollapsed && (
                <h2 className="text-gray-400 text-xs uppercase tracking-wider px-4 mb-2">
                  {category.title}
                </h2>
              )}
              <ul className="space-y-1">
                {category.items.map((item) => {
                  const active = item.href === pathname;

                  return (
                    <Link
                      to={`${item.href}`}
                      key={item.name}
                      className={`
                flex items-center px-2 py-2 rounded-lg transition-colors group text-sm
                ${
                  active
                    ? 'bg-purple-500/20 text-purple-300'
                    : 'text-gray-300 hover:bg-white/5'
                }
              `}
                    >
                      <item.icon
                        className={`
                    ${isCollapsed ? 'h-5 w-5' : 'h-4 w-4 mr-3'}
                    ${
                      active
                        ? 'text-purple-400'
                        : 'text-gray-400 group-hover:text-purple-400'
                    }
                  `}
                      />
                      {!isCollapsed && <span>{item.name}</span>}
                    </Link>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
