import { Template } from '@staroverlay/sdk';

import AppCard from './AppCard';

interface AppGridProps {
  apps: Template[];
  sortBy: string;
}

export default function AppGrid({ apps }: AppGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {apps.map((app) => (
        <AppCard key={app._id} app={app} />
      ))}
    </div>
  );
}
