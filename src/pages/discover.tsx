import { ChevronDown, Clock, Sparkles, Zap } from 'lucide-react';
import { useState } from 'react';

import Container from '@/shared/components/Container';
import { Template } from '@staroverlay/sdk';
import AppCategoryFilter from '../modules/apps/components/AppCategoryFilter';
import AppGrid from '../modules/apps/components/AppGrid';

const apps: Template[] = [
  {
    _id: '1',
    creatorId: 'creator_123',
    description:
      'Customizable alerts for donations, subscriptions, and follows',
    lastVersion: '1.0.0',
    lastVersionId: 'v1',
    name: 'Alert Box Pro',
    price: 0,
    service: 'twitch',
    storeDescription: 'Premium alert system for streamers',
    thumbnail: '/thumbnail_2.jpg',
    visibility: 'public',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    category: 'alerts',
  },
  {
    _id: '2',
    creatorId: 'creator_123',
    description:
      'Stylish overlay for your stream chat with customizable themes',
    lastVersion: '1.0.0',
    lastVersionId: 'v1',
    name: 'Chat Overlay',
    price: 5.99,
    service: 'twitch',
    storeDescription: 'Enhance your chat with custom themes',
    thumbnail: '/thumbnail.jpg',
    visibility: 'public',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    category: 'alerts',
  },
  {
    _id: '3',
    creatorId: 'creator_123',
    description: 'Track your streaming goals with beautiful progress bars',
    lastVersion: '1.0.0',
    lastVersionId: 'v1',
    name: 'Goal Tracker',
    price: 2.99,
    service: 'twitch',
    storeDescription: 'Track and display your goals live',
    thumbnail: '/thumbnail_3.jpg',
    visibility: 'public',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    category: 'alerts',
  },
  {
    _id: '4',
    creatorId: 'creator_123',
    description: 'Display your streaming schedule with timezone support',
    lastVersion: '1.0.0',
    lastVersionId: 'v1',
    name: 'Stream Schedule',
    price: 3.99,
    service: 'twitch',
    storeDescription: 'Show your streaming schedule',
    thumbnail: '/thumbnail_4.jpg',
    visibility: 'public',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    category: 'alerts',
  },
  {
    _id: '5',
    creatorId: 'creator_123',
    description: 'Show your social media links with animated icons',
    lastVersion: '1.0.0',
    lastVersionId: 'v1',
    name: 'Social Media Bar',
    price: 1.99,
    service: 'twitch',
    storeDescription: 'Link to all your social media',
    thumbnail: '/thumbnail_5.jpg',
    visibility: 'public',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    category: 'alerts',
  },
  {
    _id: '6',
    creatorId: 'creator_123',
    description: 'Display current playing track with Spotify integration',
    lastVersion: '1.0.0',
    lastVersionId: 'v1',
    name: 'Music Player',
    price: 4.99,
    service: 'twitch',
    storeDescription: 'Display current song on stream',
    thumbnail: '/thumbnail_6.jpg',
    visibility: 'public',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    category: 'alerts',
  },
];

const sortOptions = [
  { id: 'trending', name: 'Trending', icon: Zap },
  { id: 'new', name: 'New releases', icon: Sparkles },
  { id: 'updated', name: 'Recently updated', icon: Clock },
];

export default function DiscoverPage() {
  // Category.
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Sorting.
  const [sortBy, setSortBy] = useState('trending');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const selectedSort =
    sortOptions.find((option) => option.id === sortBy) || sortOptions[0];

  // Filtering and sorting
  const filteredApps = apps
    .filter((template) => {
      if (selectedCategory === 'all') {
        return true;
      }
      return template.category === selectedCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'trending') {
        return 1;
      }
      if (sortBy === 'new') {
        return (
          new Date(b.createdAt).getTime() - new Date(a.updatedAt).getTime()
        );
      }
      if (sortBy === 'updated') {
        return (
          new Date(b.createdAt).getTime() - new Date(a.updatedAt).getTime()
        );
      }
      return 0;
    });

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="glass-card rounded-xl p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-indigo-500/10"></div>
        <div className="relative">
          <h1 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
            Discover Streaming Tools
          </h1>
          <p className="text-gray-300">
            Enhance your streams with our collection of widgets and
            applications. Browse through popular tools or create your own.
          </p>
        </div>
      </div>

      <AppCategoryFilter
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <div className="mt-8">
        <div className="w-full flex justify-between">
          <h2 className="text-xl font-semibold text-purple-300 mb-6">
            Popular Widgets & Apps
          </h2>

          <div className="relative">
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="flex items-center space-x-2 px-4 py-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <selectedSort.icon className="h-4 w-4 text-purple-400" />
              <span className="text-gray-300 text-sm">{selectedSort.name}</span>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </button>

            {isSortOpen && (
              <Container className="absolute right-0 mt-2 w-48 py-1 z-10">
                {sortOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => {
                      setSortBy(option.id);
                      setIsSortOpen(false);
                    }}
                    className={`
                  w-full flex items-center px-4 py-2 text-sm
                  ${
                    sortBy === option.id
                      ? 'text-purple-400 bg-white/5'
                      : 'text-gray-300 hover:bg-white/5'
                  }
                `}
                  >
                    <option.icon className="h-4 w-4 mr-3" />
                    <span>{option.name}</span>
                  </button>
                ))}
              </Container>
            )}
          </div>
        </div>

        <AppGrid sortBy={sortBy} apps={filteredApps} />
      </div>
    </div>
  );
}
