import useDisclosure from '@/shared/hooks/useDisclosure';
import { formatCurrency } from '@/shared/utils/formatUtils';
import { Template } from '@staroverlay/sdk';
import {
  Download,
  Eye,
  EyeOff,
  Globe,
  Heart,
  MoreVertical,
  Share2,
  Star,
} from 'lucide-react';
import AppCardMenu from './AppCardMenu';

interface AppCardProps {
  app: Template;
  view?: 'user' | 'dashboard';
}

export default function AppCard({ app, view }: AppCardProps) {
  const visibilityIcon = {
    public: <Globe className="h-4 w-4 text-green-400" />,
    unlisted: <Eye className="h-4 w-4 text-yellow-400" />,
    private: <EyeOff className="h-4 w-4 text-red-400" />,
  };
  const menuHandler = useDisclosure();

  const isDashboard = view === 'dashboard';

  return (
    <div key={app._id} className="glass-card rounded-xl overflow-hidden group">
      <div className="relative h-48">
        <img
          src={app.thumbnail}
          alt={app.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

        {isDashboard && (
          <div className="absolute top-4 right-4">
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  menuHandler.open();
                }}
                className="p-2 bg-black/20 hover:bg-black/40 rounded-lg backdrop-blur-sm transition-colors"
              >
                <MoreVertical className="h-4 w-4 text-white" />
              </button>
              {menuHandler.isOpen && (
                <AppCardMenu
                  appId={app._id}
                  onAction={() => {}}
                  onClose={() => menuHandler.close()}
                />
              )}
            </div>
          </div>
        )}

        <span className="absolute bottom-4 left-4 px-2 py-1 bg-purple-500/20 backdrop-blur-sm rounded-full text-xs text-purple-200">
          {app.category}
        </span>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-semibold text-purple-200 mb-2">
          {app.name}
        </h3>

        <div className="flex items-center space-x-2">
          {visibilityIcon[app.visibility]}
          <span className="text-sm text-gray-400">
            {app.price ? formatCurrency(app.price) : 'Free'}
          </span>
        </div>

        <p className="text-sm text-gray-400 mb-4">{app.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-400 mr-1" />
              <span className="text-sm text-gray-300">{0}</span>
            </div>
            <div className="flex items-center">
              <Download className="h-4 w-4 text-gray-400 mr-1" />
              <span className="text-sm text-gray-300">{0}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
              <Heart className="h-4 w-4 text-gray-400 hover:text-red-400" />
            </button>
            <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
              <Share2 className="h-4 w-4 text-gray-400 hover:text-purple-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
