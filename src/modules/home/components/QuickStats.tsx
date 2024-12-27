import Container from '@/shared/components/Container';
import { formatCurrency } from '@/shared/utils/formatUtils';
import { cn } from '@/shared/utils/styleUtils';
import { DollarSign, Package, TrendingUp, Users } from 'lucide-react';

const stats = [
  {
    label: 'Total Apps',
    value: '12,345',
    change: '+2',
    icon: Package,
    trend: 'up',
  },
  {
    label: 'Active Users',
    value: '2.4K',
    change: '+15%',
    icon: Users,
    trend: 'up',
  },
  {
    label: 'Monthly Revenue',
    value: formatCurrency(8381),
    change: '+23%',
    icon: DollarSign,
    trend: 'up',
  },
  {
    label: 'Growth Rate',
    value: '18%',
    change: '-2%',
    icon: TrendingUp,
    trend: 'down',
  },
];

export default function QuickStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {stats.map((stat) => (
        <Container key={stat.label} className="p-6">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <stat.icon className="h-5 w-5 text-purple-400" />
            </div>

            <span
              className={cn(
                'text-sm',
                stat.trend == 'up' ? 'text-green-400' : 'text-red-400',
              )}
            >
              {stat.change}
            </span>
          </div>

          <h3 className="text-2xl font-bold text-gray-200 mt-4">
            {stat.value}
          </h3>
          <p className="text-gray-400 text-sm">{stat.label}</p>
        </Container>
      ))}
    </div>
  );
}
