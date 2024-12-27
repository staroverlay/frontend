import Container from '@/shared/components/Container';
import IconButton from '@/shared/components/IconButton';
import {
  Bell,
  ChevronDown,
  LogOut,
  Search,
  Settings,
  Star,
  User,
} from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  return (
    <nav className="h-16 glass border-b border-white/5 fixed top-0 left-0 right-0 z-50">
      <div className="h-full px-4 flex items-center justify-between">
        <div className="flex items-center space-x-2 w-64 px-4">
          <Star className="h-6 w-6 text-purple-400" />
          <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
            StarOverlay
          </span>
        </div>

        <div className="flex-1 flex justify-center max-w-2xl">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search widgets, apps, and more..."
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <IconButton
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              variant="ghost"
              hasNotification={true}
            >
              <Bell className="h-5 w-5 text-gray-300" />
            </IconButton>

            {isNotificationsOpen && (
              <Container className="absolute right-0 mt-2 w-80 py-2">
                <div className="px-4 py-2 border-b border-white/5">
                  <h3 className="font-semibold text-purple-300">
                    Notifications
                  </h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  <div className="px-4 py-3 hover:bg-white/5">
                    <p className="text-sm text-gray-300">
                      New follower: @sammwy
                    </p>
                    <span className="text-xs text-gray-500">2 minutes ago</span>
                  </div>
                  <div className="px-4 py-3 hover:bg-white/5">
                    <p className="text-sm text-gray-300">
                      Widget update available
                    </p>
                    <span className="text-xs text-gray-500">1 hour ago</span>
                  </div>
                </div>
              </Container>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-3 hover:bg-white/5 rounded-lg p-2"
            >
              <img
                src="https://static-cdn.jtvnw.net/jtv_user_pictures/4e44f403-b0b8-4b93-aa69-ac32db3aefc2-profile_image-70x70.png"
                alt="Profile"
                className="h-8 w-8 rounded-full object-cover ring-2 ring-purple-500/20"
              />
              <span className="font-medium text-gray-300">Sammwy</span>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>

            {isProfileOpen && (
              <Container className="absolute right-0 mt-2 w-48 py-1">
                <a
                  href="#"
                  className="flex items-center px-4 py-2 text-gray-300 hover:bg-white/5"
                >
                  <User className="h-4 w-4 mr-3" />
                  <span>Profile</span>
                </a>
                <a
                  href="#"
                  className="flex items-center px-4 py-2 text-gray-300 hover:bg-white/5"
                >
                  <Settings className="h-4 w-4 mr-3" />
                  <span>Settings</span>
                </a>
                <hr className="my-1 border-white/5" />
                <a
                  href="#"
                  className="flex items-center px-4 py-2 text-red-400 hover:bg-white/5"
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  <span>Logout</span>
                </a>
              </Container>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
