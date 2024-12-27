import { Edit2, Plus, Trash2 } from 'lucide-react';

const rewards = [
  {
    id: 1,
    name: 'Highlight Message',
    cost: 500,
    icon: '💬',
    enabled: true,
  },
  {
    id: 2,
    name: 'Play Sound Effect',
    cost: 1000,
    icon: '🔊',
    enabled: true,
  },
  {
    id: 3,
    name: 'Choose Game',
    cost: 5000,
    icon: '🎮',
    enabled: false,
  },
];

export default function DashChannelPoints() {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-white/5">
        <button className="flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors">
          <Plus className="h-4 w-4" />
          <span>New Reward</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {rewards.map((reward) => (
            <div
              key={reward.id}
              className={`
                flex items-center space-x-4 p-4 rounded-lg
                ${reward.enabled ? 'bg-white/5' : 'bg-white/5 opacity-60'}
              `}
            >
              <div className="w-10 h-10 flex items-center justify-center bg-purple-500/20 rounded-lg text-xl">
                {reward.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-gray-200 font-medium">{reward.name}</h3>
                <p className="text-purple-400 text-sm">
                  {reward.cost.toLocaleString()} points
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 transition-colors">
                  <Edit2 className="h-4 w-4" />
                </button>
                <button className="p-2 hover:bg-white/10 rounded-lg text-red-400 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
