import BillingCard from '@/membership/components/BillingCard';
import PlanCard from '@/membership/components/PlanCard';
import QuotaCard from '@/membership/components/QuotaCard';
import Button from '@/shared/components/Button';
import Container from '@/shared/components/Container';
import {
  AlertTriangle,
  Film,
  HardDrive,
  Radio,
  Shield,
  Sparkles,
  Users2,
  Zap,
} from 'lucide-react';

export default function MembershipPage() {
  const currentPlan = {
    name: 'Professional',
    price: 3.99,
    nextBilling: '2024-04-15',
    status: 'active',
  };

  const quotas = {
    widgets: {
      used: 8,
      total: 'Unlimited',
      icon: Radio,
      name: 'Active Widgets',
      description: 'Currently active stream widgets',
    },
    media: {
      used: 45,
      total: 100,
      icon: Film,
      name: 'Media Items',
      description: 'Uploaded images, videos, and audio',
    },
    storage: {
      used: 2.3,
      total: 5,
      unit: 'GB',
      icon: HardDrive,
      name: 'Storage Space',
      description: 'Total cloud storage usage',
    },
    moderators: {
      used: 3,
      total: 5,
      icon: Users2,
      name: 'Team Members',
      description: 'Active editors and moderators',
    },
    aiTokens: {
      used: 650,
      total: 1000,
      icon: Sparkles,
      name: 'AI Tokens',
      description: 'Monthly AI usage allocation',
    },
  };

  return (
    <div className="bg-[#0a0a0f] text-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Subscription Management
            </h1>
            <p className="text-gray-400 mt-1">
              Manage your plan and monitor resource usage
            </p>
          </div>

          <Button leftIcon={<Shield className="h-5 w-5" />}>
            <span>Upgrade Plan</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <PlanCard plan={currentPlan} />
          <BillingCard className="lg:col-span-2" plan={currentPlan} />
        </div>

        <h2 className="text-xl font-semibold text-gray-200 mb-6">
          Resource Usage & Quotas
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(quotas).map(([key, quota]) => (
            <QuotaCard key={key} quota={quota} />
          ))}
        </div>

        <div className="mt-12">
          <h2 className="text-xl font-semibold text-gray-200 mb-6">
            Plan Features
          </h2>

          <Container className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex items-start space-x-3">
                <div className="bg-purple-500/20 rounded-lg p-2">
                  <Zap className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-200">Real-time Apps</h3>
                  <p className="text-sm text-gray-400 mt-1">
                    Interactive streaming applications
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-purple-500/20 rounded-lg p-2">
                  <Users2 className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-200">Team Management</h3>
                  <p className="text-sm text-gray-400 mt-1">
                    Advanced moderator controls
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-purple-500/20 rounded-lg p-2">
                  <Sparkles className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-200">AI Features</h3>
                  <p className="text-sm text-gray-400 mt-1">
                    Advanced AI-powered tools
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </div>

        <div className="mt-12">
          <Container className="p-6 border border-red-500/20">
            <div className="flex items-start space-x-4">
              <div className="bg-red-500/20 rounded-lg p-2">
                <AlertTriangle className="h-5 w-5 text-red-400" />
              </div>
              <div>
                <h3 className="font-medium text-red-400">
                  Cancel Subscription
                </h3>
                <p className="text-sm text-gray-400 mt-1">
                  Your subscription will remain active until the end of the
                  current billing period.
                </p>
                <Button className="mt-4" variant="danger">
                  Cancel Plan
                </Button>
              </div>
            </div>
          </Container>
        </div>
      </div>
    </div>
  );
}
