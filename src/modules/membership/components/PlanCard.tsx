import Container from '@/shared/components/Container';
import { Check, Shield } from 'lucide-react';

interface PlanCardProps {
  plan: {
    name: string;
    price: number;
    status: string;
  };
}

export default function PlanCard({ plan }: PlanCardProps) {
  return (
    <Container className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="bg-purple-500/20 rounded-lg p-2">
          <Shield className="h-5 w-5 text-purple-400" />
        </div>
        <span className="text-sm px-2 py-1 bg-green-500/20 text-green-400 rounded-full">
          Active
        </span>
      </div>

      <h2 className="text-2xl font-bold text-gray-200 mb-1">{plan.name}</h2>
      <p className="text-gray-400 mb-6">${plan.price}/month</p>

      <ul className="space-y-3">
        <li className="flex items-center text-sm text-gray-300">
          <Check className="h-4 w-4 text-green-400 mr-2" />
          Unlimited Widgets
        </li>
        <li className="flex items-center text-sm text-gray-300">
          <Check className="h-4 w-4 text-green-400 mr-2" />
          5GB Storage Space
        </li>
        <li className="flex items-center text-sm text-gray-300">
          <Check className="h-4 w-4 text-green-400 mr-2" />
          Real-time Applications
        </li>
        <li className="flex items-center text-sm text-gray-300">
          <Check className="h-4 w-4 text-green-400 mr-2" />
          Priority Support
        </li>
      </ul>
    </Container>
  );
}
