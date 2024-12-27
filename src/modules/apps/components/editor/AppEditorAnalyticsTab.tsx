import { ArrowUp, Download, Eye, Users } from 'lucide-react';

const stats = [
  {
    id: 'total-uses',
    label: 'Total Uses',
    value: '12,345',
    change: '+12%',
    icon: Download,
    positive: true,
  },
  {
    id: 'page-views',
    label: 'Page Views',
    value: '45,678',
    change: '+8%',
    icon: Eye,
    positive: true,
  },
  {
    id: 'active-channels',
    label: 'Active Channels',
    value: '789',
    change: '-3%',
    icon: Users,
    positive: false,
  },
];

const channels = [
  {
    name: 'Sammwy',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
    uses: 1234,
    lastUsed: '2 hours ago',
  },
  {
    name: 'Sammwy',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
    uses: 987,
    lastUsed: '1 day ago',
  },
  {
    name: 'Sammwy',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
    uses: 654,
    lastUsed: '3 days ago',
  },
];

export default function AppEditorAnalyticsTab() {
  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.id}
              className="bg-white/5 rounded-lg p-6 border border-white/10"
            >
              <div className="flex items-center justify-between">
                <Icon className="h-5 w-5 text-purple-400" />
                <span
                  className={`
                  flex items-center text-sm
                  ${stat.positive ? 'text-green-400' : 'text-red-400'}
                `}
                >
                  <ArrowUp
                    className={`h-4 w-4 mr-1 ${!stat.positive && 'rotate-180'}`}
                  />
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-100 mt-4">
                {stat.value}
              </p>
              <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Top Channels */}
      <div>
        <h2 className="text-lg font-medium text-gray-200 mb-4">Top Channels</h2>
        <div className="bg-white/5 rounded-lg border border-white/10">
          <div className="p-4 border-b border-white/10">
            <div className="grid grid-cols-4 text-sm text-gray-400">
              <div>Channel</div>
              <div className="text-center">Total Uses</div>
              <div className="text-center">Last Used</div>
              <div className="text-right">Trend</div>
            </div>
          </div>
          <div className="divide-y divide-white/5">
            {channels.map((channel) => (
              <div key={channel.name} className="p-4">
                <div className="grid grid-cols-4 items-center">
                  <div className="flex items-center space-x-3">
                    <img
                      src={channel.avatar}
                      alt={channel.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="font-medium text-gray-200">
                      {channel.name}
                    </span>
                  </div>
                  <div className="text-center text-gray-300">
                    {channel.uses.toLocaleString()}
                  </div>
                  <div className="text-center text-gray-400">
                    {channel.lastUsed}
                  </div>
                  <div className="flex justify-end">
                    {/* Placeholder for trend chart */}
                    <div className="w-24 h-8 bg-purple-500/10 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
