import { Switch } from '@/shared/components/Switch';
import { ArrowDown, ArrowUp, Plus, X } from 'lucide-react';

interface WidgetSettingsTabProps {
  onChange: () => void;
}

const CATEGORIES = [
  {
    id: 'general',
    label: 'General',
    settings: [
      {
        id: 'title',
        type: 'string',
        label: 'Alert Title',
        value: 'New Subscriber!',
      },
      {
        id: 'duration',
        type: 'number',
        label: 'Duration (seconds)',
        value: 5,
      },
      {
        id: 'enabled',
        type: 'boolean',
        label: 'Enable Sound',
        value: true,
      },
    ],
  },
  {
    id: 'style',
    label: 'Style',
    settings: [
      {
        id: 'theme',
        type: 'enum',
        label: 'Theme',
        value: 'dark',
        options: ['dark', 'light', 'custom'],
      },
      {
        id: 'animation',
        type: 'enum',
        label: 'Animation',
        value: 'fade',
        options: ['fade', 'slide', 'bounce'],
      },
    ],
  },
  {
    id: 'media',
    label: 'Media',
    settings: [
      {
        id: 'images',
        type: 'array',
        label: 'Alert Images',
        value: ['image1.png', 'image2.png'],
      },
      {
        id: 'sounds',
        type: 'map',
        label: 'Alert Sounds',
        value: {
          sub: 'sub.mp3',
          donation: 'donation.mp3',
        },
      },
    ],
  },
];

export default function WidgetSettingsTab({
  onChange,
}: WidgetSettingsTabProps) {
  const renderField = (setting: any) => {
    switch (setting.type) {
      case 'string':
        return (
          <input
            type="text"
            value={setting.value}
            onChange={onChange}
            className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-4 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={setting.value}
            onChange={onChange}
            className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-4 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
          />
        );

      case 'boolean':
        return <Switch checked={setting.value} onChange={onChange} />;

      case 'enum':
        return (
          <select
            value={setting.value}
            onChange={onChange}
            className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-4 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
          >
            {setting.options.map((option: string) => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>
        );

      case 'array':
        return (
          <div className="space-y-2">
            {setting.value.map((item: string, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={item}
                  onChange={onChange}
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg py-2 px-4 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                />
                <button className="p-2 hover:bg-white/5 rounded-lg text-gray-400">
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button className="p-2 hover:bg-white/5 rounded-lg text-gray-400">
                  <ArrowDown className="h-4 w-4" />
                </button>
                <button className="p-2 hover:bg-white/5 rounded-lg text-red-400">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            <button className="flex items-center space-x-2 text-sm text-purple-400 hover:text-purple-300">
              <Plus className="h-4 w-4" />
              <span>Add Item</span>
            </button>
          </div>
        );

      case 'map':
        return (
          <div className="space-y-2">
            {Object.entries(setting.value).map(
              ([key, value]: [string, any], index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={key}
                    placeholder="Key"
                    onChange={onChange}
                    className="w-1/3 bg-white/5 border border-white/10 rounded-lg py-2 px-4 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  />
                  <input
                    type="text"
                    value={value}
                    placeholder="Value"
                    onChange={onChange}
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg py-2 px-4 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  />
                  <button className="p-2 hover:bg-white/5 rounded-lg text-red-400">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ),
            )}
            <button className="flex items-center space-x-2 text-sm text-purple-400 hover:text-purple-300">
              <Plus className="h-4 w-4" />
              <span>Add Field</span>
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 h-[600px] overflow-y-auto pr-4">
      {CATEGORIES.map((category) => (
        <div key={category.id}>
          <h3 className="text-lg font-medium text-gray-200 mb-4">
            {category.label}
          </h3>
          <div className="space-y-6">
            {category.settings.map((setting) => (
              <div key={setting.id}>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {setting.label}
                </label>
                {renderField(setting)}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
