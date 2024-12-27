import {
  Bell,
  MessageSquare,
  Music,
  Radio,
  Share2,
  Sparkles,
  Target,
} from 'lucide-react';

const categories = [
  { id: 'all', name: 'All', icon: Sparkles },
  { id: 'alerts', name: 'Alerts', icon: Bell },
  { id: 'chat', name: 'Chat', icon: MessageSquare },
  { id: 'goals', name: 'Goals', icon: Target },
  { id: 'overlays', name: 'Overlays', icon: Radio },
  { id: 'music', name: 'Music', icon: Music },
  { id: 'social', name: 'Social', icon: Share2 },
];

interface AppCategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function AppCategoryFilter({
  selectedCategory,
  onSelectCategory,
}: AppCategoryFilterProps) {
  return (
    <div className="flex items-center justify-between mt-8 mb-6">
      <div className="flex items-center space-x-4 justify-center w-full">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className="flex flex-col items-center group"
          >
            <div
              className={`
              p-3 rounded-full transition-all duration-200
              ${
                selectedCategory === category.id
                  ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-purple-400'
              }
            `}
            >
              <category.icon className="h-5 w-5" />
            </div>
            <span
              className={`
              mt-2 text-xs transition-colors duration-200
              ${
                selectedCategory === category.id
                  ? 'text-purple-400'
                  : 'text-gray-500'
              }
            `}
            >
              {category.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
