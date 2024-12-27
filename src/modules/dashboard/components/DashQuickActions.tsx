import { BarChart2, Gift, Monitor, Timer, Users } from 'lucide-react';

const actions = [
  {
    id: 'roulette',
    name: 'Item Roulette',
    icon: Gift,
    color: 'purple',
  },
  {
    id: 'raffle',
    name: 'Chat Raffle',
    icon: Gift,
    color: 'green',
  },
  {
    id: 'screenshare',
    name: 'Screen Sharing',
    icon: Monitor,
    color: 'blue',
  },
  {
    id: 'poll',
    name: 'Create Poll',
    icon: BarChart2,
    color: 'yellow',
  },
  {
    id: 'prediction',
    name: 'Prediction',
    icon: Timer,
    color: 'pink',
  },
  {
    id: 'shoutout',
    name: 'Shoutout',
    icon: Users,
    color: 'orange',
  },
];

export default function DashQuickActions() {
  return (
    <div className="h-full p-4">
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              className={`
                flex items-center space-x-3 p-4 rounded-lg transition-colors
                bg-${action.color}-500/10 hover:bg-${action.color}-500/20
                text-${action.color}-400
              `}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{action.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
