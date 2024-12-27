import { DollarSign, Gift, Heart, Star } from 'lucide-react';

const events = [
  {
    id: 1,
    type: 'subscription',
    icon: Star,
    user: 'JohnDoe',
    message: 'subscribed with Prime',
    time: '2 minutes ago',
    highlight: true,
  },
  {
    id: 2,
    type: 'donation',
    icon: DollarSign,
    user: 'StreamSupporter',
    message: 'donated $10',
    time: '5 minutes ago',
    highlight: true,
  },
  {
    id: 3,
    type: 'follow',
    icon: Heart,
    user: 'NewViewer123',
    message: 'followed the channel',
    time: '10 minutes ago',
    highlight: false,
  },
  {
    id: 4,
    type: 'gift',
    icon: Gift,
    user: 'GenerousUser',
    message: 'gifted 5 subs to the community',
    time: '15 minutes ago',
    highlight: true,
  },
];

export default function DashActivityFeed() {
  return (
    <div className="h-full overflow-y-auto p-4">
      <div className="space-y-4">
        {events.map((event) => {
          const Icon = event.icon;
          return (
            <div
              key={event.id}
              className={`
                flex items-center space-x-4 p-4 rounded-lg transition-colors
                ${event.highlight ? 'bg-purple-500/10' : 'bg-white/5'}
              `}
            >
              <div
                className={`
                p-2 rounded-full
                ${
                  event.highlight
                    ? 'bg-purple-500/20 text-purple-400'
                    : 'bg-white/10 text-gray-400'
                }
              `}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-gray-200 font-medium truncate">
                  {event.user}
                </p>
                <p className="text-gray-400 text-sm">{event.message}</p>
              </div>
              <span className="text-gray-500 text-sm whitespace-nowrap">
                {event.time}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
