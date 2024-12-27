import DashActivityFeed from '@/dashboard/components/DashActivityFeed';
import DashChannelPoints from '@/dashboard/components/DashChannelPoints';
import DashChatEmbed from '@/dashboard/components/DashChatEmbed';
import DashPendingEvents from '@/dashboard/components/DashPendingEvents';
import DashQuickActions from '@/dashboard/components/DashQuickActions';
import DashSettings from '@/dashboard/components/DashSettings';
import Container from '@/shared/components/Container';
import { Maximize2, Minimize2, Settings, X } from 'lucide-react';
import { useState } from 'react';

type WidgetKey = 'activity' | 'chat' | 'pending' | 'actions' | 'points';

interface WidgetState {
  id: WidgetKey;
  visible: boolean;
  minimized: boolean;
  position: number;
}

export default function DashboardPage() {
  const [widgets, setWidgets] = useState<WidgetState[]>([
    { id: 'activity', visible: true, minimized: false, position: 0 },
    { id: 'chat', visible: true, minimized: false, position: 1 },
    { id: 'pending', visible: true, minimized: false, position: 2 },
    { id: 'actions', visible: true, minimized: false, position: 3 },
    { id: 'points', visible: true, minimized: false, position: 4 },
  ]);
  const [showSettings, setShowSettings] = useState(false);

  const toggleWidget = (id: WidgetKey, property: 'visible' | 'minimized') => {
    setWidgets(
      widgets.map((widget) =>
        widget.id === id
          ? { ...widget, [property]: !widget[property] }
          : widget,
      ),
    );
  };

  const updateLayout = (newLayout: WidgetState[]) => {
    setWidgets(newLayout);
  };

  const renderWidget = (widget: WidgetState) => {
    if (!widget.visible) return null;

    const components = {
      activity: <DashActivityFeed />,
      chat: <DashChatEmbed />,
      pending: <DashPendingEvents />,
      actions: <DashQuickActions />,
      points: <DashChannelPoints />,
    };

    const titles = {
      activity: 'Activity Feed',
      chat: 'Stream Chat',
      pending: 'Pending Events',
      actions: 'Quick Actions',
      points: 'Channel Points',
    };

    return (
      <Container
        key={widget.id}
        className="flex flex-col"
        style={{ height: widget.minimized ? 'auto' : '600px' }}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          <h2 className="text-lg font-medium text-gray-200">
            {titles[widget.id]}
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => toggleWidget(widget.id, 'minimized')}
              className="p-1.5 hover:bg-white/5 rounded-lg text-gray-400"
            >
              {widget.minimized ? (
                <Maximize2 className="h-4 w-4" />
              ) : (
                <Minimize2 className="h-4 w-4" />
              )}
            </button>
            <button
              onClick={() => toggleWidget(widget.id, 'visible')}
              className="p-1.5 hover:bg-white/5 rounded-lg text-gray-400"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        {!widget.minimized && (
          <div className="flex-1 overflow-hidden">{components[widget.id]}</div>
        )}
      </Container>
    );
  };

  const visibleWidgets = widgets.filter((w) => w.visible);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Stream Dashboard
            </h1>
            <p className="text-gray-400 mt-1">Monitor and manage your stream</p>
          </div>
          <button
            onClick={() => setShowSettings(true)}
            className="flex items-center space-x-2 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 rounded-lg px-4 py-2 font-medium transition-colors"
          >
            <Settings className="h-5 w-5" />
            <span>Dashboard Settings</span>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {visibleWidgets
            .sort((a, b) => a.position - b.position)
            .map(renderWidget)}
        </div>
      </div>

      {showSettings && (
        <DashSettings
          widgets={widgets}
          onClose={() => setShowSettings(false)}
          onUpdateLayout={updateLayout}
        />
      )}
    </div>
  );
}
