import Button from '@/shared/components/Button';
import Container from '@/shared/components/Container';
import { Template } from '@staroverlay/sdk';
import { ArrowRight } from 'lucide-react';

const apps: Template[] = [
  {
    _id: '1',
    creatorId: 'creator_123',
    description:
      'Customizable alerts for donations, subscriptions, and follows',
    lastVersion: '1.0.0',
    lastVersionId: 'v1',
    name: 'Alert Box Pro',
    price: 0,
    service: 'twitch',
    storeDescription: 'Premium alert system for streamers',
    thumbnail: '/thumbnail_2.jpg',
    visibility: 'public',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    category: 'alerts',
  },
  {
    _id: '2',
    creatorId: 'creator_123',
    description:
      'Stylish overlay for your stream chat with customizable themes',
    lastVersion: '1.0.0',
    lastVersionId: 'v1',
    name: 'Chat Overlay',
    price: 5.99,
    service: 'twitch',
    storeDescription: 'Enhance your chat with custom themes',
    thumbnail: '/thumbnail.jpg',
    visibility: 'public',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    category: 'alerts',
  },
  {
    _id: '3',
    creatorId: 'creator_123',
    description: 'Track your streaming goals with beautiful progress bars',
    lastVersion: '1.0.0',
    lastVersionId: 'v1',
    name: 'Goal Tracker',
    price: 2.99,
    service: 'twitch',
    storeDescription: 'Track and display your goals live',
    thumbnail: '/thumbnail_3.jpg',
    visibility: 'public',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    category: 'alerts',
  },
];

export default function FeaturedApps() {
  return (
    <Container>
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-200">Featured Apps</h2>
          <Button rightIcon={<ArrowRight className="h-4 w-4" />}>
            View all
          </Button>
        </div>
      </div>

      <div className="p-6 grid gap-6">
        {apps.map((app) => (
          <div key={app._id} className="flex space-x-4">
            <img
              src={app.thumbnail}
              alt={app.name}
              className="w-20 h-20 rounded-lg object-cover"
            />

            <div className="flex-1">
              <h3 className="font-medium text-gray-200">{app.name}</h3>
              <p className="text-sm text-gray-400 mt-1">{app.description}</p>

              <div className="flex items-center space-x-4 mt-2">
                <span className="text-sm text-gray-400">5 users</span>
                <span className="text-sm text-gray-400">★ 4.9</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
}
