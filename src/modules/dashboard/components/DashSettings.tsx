import Container from '@/shared/components/Container';
import { Eye, EyeOff, GripHorizontal, X } from 'lucide-react';
import { useState } from 'react';

interface WidgetState {
  id: string;
  visible: boolean;
  minimized: boolean;
  position: number;
}

interface DashSettingsProps {
  widgets: WidgetState[];
  onClose: () => void;
  onUpdateLayout: (widgets: WidgetState[]) => void;
}

export default function DashSettings({
  widgets,
  onClose,
  onUpdateLayout,
}: DashSettingsProps) {
  const [localWidgets, setLocalWidgets] = useState(widgets);

  const handleVisibilityToggle = (id: string) => {
    setLocalWidgets(
      localWidgets.map((widget) =>
        widget.id === id ? { ...widget, visible: !widget.visible } : widget,
      ),
    );
  };

  const handlePositionChange = (id: string, direction: 'up' | 'down') => {
    const index = localWidgets.findIndex((w) => w.id.toString() === id);
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === localWidgets.length - 1)
    )
      return;

    const newWidgets = [...localWidgets];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newWidgets[index], newWidgets[targetIndex]] = [
      newWidgets[targetIndex],
      newWidgets[index],
    ];

    setLocalWidgets(
      newWidgets.map((widget, i) => ({ ...widget, position: i })),
    );
  };

  const handleSave = () => {
    onUpdateLayout(localWidgets);
    onClose();
  };

  const widgetNames = {
    activity: 'Activity Feed',
    chat: 'Stream Chat',
    pending: 'Pending Events',
    actions: 'Quick Actions',
    points: 'Channel Points',
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Container className="w-full max-w-lg mx-4">
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h3 className="text-lg font-semibold text-gray-200">
            Dashboard Layout
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {localWidgets.map((widget) => (
              <div
                key={widget.id}
                className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg"
              >
                <GripHorizontal className="h-5 w-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-gray-200 font-medium">
                    {widgetNames[widget.id as keyof typeof widgetNames]}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleVisibilityToggle(widget.id)}
                    className="p-2 hover:bg-white/10 rounded-lg text-gray-400"
                  >
                    {widget.visible ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    onClick={() => handlePositionChange(widget.id, 'up')}
                    disabled={widget.position === 0}
                    className="p-2 hover:bg-white/10 rounded-lg text-gray-400 disabled:opacity-50"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => handlePositionChange(widget.id, 'down')}
                    disabled={widget.position === localWidgets.length - 1}
                    className="p-2 hover:bg-white/10 rounded-lg text-gray-400 disabled:opacity-50"
                  >
                    ↓
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 p-6 border-t border-white/5">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-400 hover:text-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-purple-500 hover:bg-purple-600 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors"
          >
            Save Layout
          </button>
        </div>
      </Container>
    </div>
  );
}
