import Container from '@/shared/components/Container';
import { Calendar, CreditCard } from 'lucide-react';

interface BillingCardProps {
  className?: string;
  plan: {
    nextBilling: string;
  };
}

export default function BillingCard({
  className = '',
  plan,
}: BillingCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Container className={`p-6 ${className}`}>
      <h3 className="font-medium text-gray-200 mb-6">Payment Information</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-start space-x-4">
          <div className="bg-purple-500/20 rounded-lg p-2">
            <CreditCard className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Payment Method</p>
            <div className="flex items-center space-x-2 mt-1">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png"
                alt="Mastercard"
                className="h-8"
              />
              <span className="text-gray-300">•••• 4242</span>
            </div>
            <button className="text-sm text-purple-400 hover:text-purple-300 mt-2">
              Update payment method
            </button>
          </div>
        </div>

        <div className="flex items-start space-x-4">
          <div className="bg-purple-500/20 rounded-lg p-2">
            <Calendar className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Next Billing Date</p>
            <p className="text-gray-200 mt-1">{formatDate(plan.nextBilling)}</p>
            <button className="text-sm text-purple-400 hover:text-purple-300 mt-2">
              View billing history
            </button>
          </div>
        </div>
      </div>
    </Container>
  );
}
