import { Check, Monitor, Moon, Sun } from 'lucide-react';
import { useState } from 'react';

const themes = [
  { id: 'dark', name: 'Dark', icon: Moon },
  { id: 'light', name: 'Light', icon: Sun },
  { id: 'system', name: 'System', icon: Monitor },
];

export default function AppearanceSettingsTab() {
  const [selectedTheme, setSelectedTheme] = useState('dark');

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-200 mb-6">
        Appearance Preferences
      </h2>

      <div className="grid grid-cols-3 gap-4 max-w-xl">
        {themes.map((theme) => {
          const Icon = theme.icon;
          const isSelected = selectedTheme === theme.id;

          return (
            <button
              key={theme.id}
              onClick={() => setSelectedTheme(theme.id)}
              className={`
                relative p-4 rounded-lg border transition-all
                ${
                  isSelected
                    ? 'bg-purple-500/20 border-purple-500/50'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }
              `}
            >
              {isSelected && (
                <div className="absolute top-2 right-2">
                  <Check className="h-4 w-4 text-purple-400" />
                </div>
              )}
              <div className="flex flex-col items-center">
                <Icon
                  className={`h-6 w-6 mb-2 ${
                    isSelected ? 'text-purple-400' : 'text-gray-400'
                  }`}
                />
                <span
                  className={`text-sm font-medium ${
                    isSelected ? 'text-purple-400' : 'text-gray-300'
                  }`}
                >
                  {theme.name}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-8">
        <h3 className="text-sm font-medium text-gray-300 mb-4">
          Custom Colors
        </h3>
        <div className="grid grid-cols-6 gap-2 max-w-xs">
          {['purple', 'blue', 'green', 'yellow', 'red', 'pink'].map((color) => (
            <button
              key={color}
              className={`
                w-8 h-8 rounded-full border-2 transition-all
                bg-${color}-500 border-${color}-500/50
                hover:border-${color}-500
              `}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
