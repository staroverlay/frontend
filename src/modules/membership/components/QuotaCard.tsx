import Container from '@/shared/components/Container';
import ProgressBar from '@/shared/components/ProgressBar';
import { LucideIcon } from 'lucide-react';

interface QuotaProps {
  quota: {
    used: number;
    total: number | string;
    unit?: string;
    icon: LucideIcon;
    name: string;
    description: string;
  };
}

export default function QuotaCard({ quota }: QuotaProps) {
  const { used, total, unit = '', icon: Icon, name, description } = quota;
  const percentage = typeof total === 'number' ? (used / total) * 100 : 0;
  const isNearLimit = typeof total === 'number' && used >= total * 0.9;
  const isUnlimited = total === 'Unlimited';

  return (
    <Container className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="bg-purple-500/20 rounded-lg p-2">
          <Icon className="h-5 w-5 text-purple-400" />
        </div>
        <span
          className={`text-sm font-medium ${
            isNearLimit ? 'text-red-400' : 'text-gray-400'
          }`}
        >
          {used}
          {unit} / {total}
          {unit}
        </span>
      </div>

      <h3 className="font-medium text-gray-200 mb-1">{name}</h3>
      <p className="text-sm text-gray-400 mb-4">{description}</p>

      {!isUnlimited && (
        <ProgressBar
          percentage={percentage}
          barClassName={isNearLimit ? 'bg-red-500' : 'bg-purple-500'}
        />
      )}
    </Container>
  );
}
