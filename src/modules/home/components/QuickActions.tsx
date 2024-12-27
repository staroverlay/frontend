import Container from '@/shared/components/Container';
import { BugOff, FileIcon, LucideIcon, Plus, Users } from 'lucide-react';

interface QuickActionButtonProps {
  onClick?: () => void;
  icon: LucideIcon;
  color: string;
  children: string;
}

const QuickActionButton = ({
  onClick,
  icon: Icon,
  color,
  children,
}: QuickActionButtonProps) => {
  return (
    <button
      className={`
      flex flex-col items-center justify-center p-4 rounded-lg transition-colors
      bg-${color}-500/10 hover:bg-${color}-500/20 text-${color}-400`}
      onClick={onClick}
    >
      <Icon className="h-6 w-6 mb-2" />
      <span className="text-sm font-medium">{children}</span>
    </button>
  );
};

export default function QuickActions() {
  return (
    <Container>
      <div className="p-4 border-b border-white/5">
        <h2 className="text-lg font-semibold text-gray-200">Quick Actions</h2>
      </div>

      <div className="p-4 grid grid-cols-2 gap-4">
        <QuickActionButton color="purple" icon={Plus}>
          Create App
        </QuickActionButton>

        <QuickActionButton color="red" icon={BugOff}>
          Toggle Widgets
        </QuickActionButton>

        <QuickActionButton color="sky" icon={FileIcon}>
          Upload Media
        </QuickActionButton>

        <QuickActionButton color="blue" icon={Users}>
          Add Editor
        </QuickActionButton>
      </div>
    </Container>
  );
}
