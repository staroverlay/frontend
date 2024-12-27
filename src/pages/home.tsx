import FeaturedApps from '@/home/components/FeaturedApps';
import QuickActions from '@/home/components/QuickActions';
import QuickStats from '@/home/components/QuickStats';
import Heading from '@/shared/components/Heading';

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="mb-8">
        <Heading>Welcome, Sammwy.</Heading>
        <p className="text-gray-400 mt-1">
          Here's what's happing with your apps
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <QuickStats />
          <FeaturedApps />
        </div>

        <div className="space-y-8">
          <QuickActions />
        </div>
      </div>
    </div>
  );
}
