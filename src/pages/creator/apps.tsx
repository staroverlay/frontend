import { Plus, Search } from 'lucide-react';
import { useState } from 'react';

import AppCard from '@/apps/components/AppCard';
import { Template } from '@staroverlay/sdk';

type Visibility = 'public' | 'unlisted' | 'private';
type PriceFilter = 'all' | 'free' | 'paid';

const applications: Template[] = [
  {
    _id: '1',
    name: 'Stream Overlay Pro',
    description: 'Professional overlay with customizable themes and animations',
    thumbnail:
      'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80',
    price: 0,
    visibility: 'public',
    category: 'overlay',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    service: 'twitch',
    storeDescription: 'Enhance your stream with custom themes and animations',
    lastVersion: '1.0.0',
    creatorId: 'creator_123',
    lastVersionId: 'v1',
  },
  {
    _id: '2',
    name: 'Stream Overlay Pro',
    description: 'Professional overlay with customizable themes and animations',
    thumbnail:
      'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80',
    price: 0,
    visibility: 'public',
    category: 'overlay',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    service: 'twitch',
    storeDescription: 'Enhance your stream with custom themes and animations',
    lastVersion: '1.0.0',
    creatorId: 'creator_123',
    lastVersionId: 'v1',
  },
  {
    _id: '3',
    name: 'Stream Overlay Pro',
    description: 'Professional overlay with customizable themes and animations',
    thumbnail:
      'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80',
    price: 0,
    visibility: 'public',
    category: 'overlay',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    service: 'twitch',
    storeDescription: 'Enhance your stream with custom themes and animations',
    lastVersion: '1.0.0',
    creatorId: 'creator_123',
    lastVersionId: 'v1',
  },
];

export default function AppsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [visibilityFilter, setVisibilityFilter] = useState<Visibility | 'all'>(
    'all',
  );
  const [priceFilter, setPriceFilter] = useState<PriceFilter>('all');

  const filteredApps = applications.filter((app) => {
    const matchesSearch = app.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesVisibility =
      visibilityFilter === 'all' || app.visibility === visibilityFilter;
    const matchesPrice =
      priceFilter === 'all' ||
      (priceFilter === 'free' && !app.price) ||
      (priceFilter === 'paid' && app.price);

    return matchesSearch && matchesVisibility && matchesPrice;
  });
  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
            My Applications
          </h1>
          <p className="text-gray-400 mt-1">
            Manage and monitor your published applications
          </p>
        </div>

        <button className="flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg px-4 py-2 font-medium transition-colors">
          <Plus className="h-5 w-5" />
          <span>Create Application</span>
        </button>
      </div>

      <div className="flex items-center space-x-4 mb-6">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search applications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
        </div>

        <select
          value={visibilityFilter}
          onChange={(e) =>
            setVisibilityFilter(e.target.value as Visibility | 'all')
          }
          className="bg-white/5 border border-white/10 rounded-lg py-2 px-4 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
        >
          <option value="all">All Visibility</option>
          <option value="public">Public</option>
          <option value="unlisted">Unlisted</option>
          <option value="private">Private</option>
        </select>

        <select
          value={priceFilter}
          onChange={(e) => setPriceFilter(e.target.value as PriceFilter)}
          className="bg-white/5 border border-white/10 rounded-lg py-2 px-4 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
        >
          <option value="all">All Prices</option>
          <option value="free">Free</option>
          <option value="paid">Paid</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredApps.map((app) => (
          <AppCard key={app._id} app={app} />
        ))}
      </div>
    </div>
  );
}
