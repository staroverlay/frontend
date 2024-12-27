import { Check, MessageSquare, Music, Video, X } from 'lucide-react';

const pendingEvents = [
  {
    id: 1,
    type: 'song',
    icon: Music,
    user: 'MusicLover',
    request: 'Never Gonna Give You Up - Rick Astley',
    time: '1 minute ago',
  },
  {
    id: 2,
    type: 'video',
    icon: Video,
    user: 'ClipMaster',
    request: 'Funny Gaming Moments Compilation',
    time: '3 minutes ago',
  },
  {
    id: 3,
    type: 'tts',
    icon: MessageSquare,
    user: 'ChatEnjoyer',
    request: 'Hello streamer, great content!',
    time: '5 minutes ago',
  },
];

export default function DashPendingEvents() {
  return (
    <div className="h-full overflow-y-auto p-4">
      <div className="space-y-4">
        {pendingEvents.map((event) => {
          const Icon = event.icon;
          return (
            <div
              key={event.id}
              className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg"
            >
              <div className="p-2 bg-white/10 rounded-full text-gray-400">
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <p className="text-gray-200 font-medium">{event.user}</p>
                  <span className="text-gray-500 text-sm">{event.time}</span>
                </div>
                <p className="text-gray-400 text-sm truncate">
                  {event.request}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 bg-green-500/10 hover:bg-green-500/20 rounded-lg text-green-400 transition-colors">
                  <Check className="h-5 w-5" />
                </button>
                <button className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
