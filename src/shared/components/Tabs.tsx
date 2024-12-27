import * as LucideIcons from 'lucide-react';
import { ElementType } from 'react';

export interface Tab {
  id: string;
  label: string;
  icon: keyof typeof LucideIcons;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
}

export function Tabs({ tabs, activeTab, onChange }: TabsProps) {
  return (
    <div className="p-2 border-b border-white/5">
      <div className="flex space-x-1 p-1">
        {tabs.map((tab) => {
          const Icon: ElementType = LucideIcons[tab.icon] as ElementType;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`
                flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${
                  activeTab === tab.id
                    ? 'bg-purple-500/20 text-purple-400'
                    : 'text-gray-400 hover:text-gray-300 hover:bg-white/5'
                }
              `}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
