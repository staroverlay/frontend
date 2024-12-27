import { BrandTwitch, BrandYoutube } from '@/shared/icons/BrandIcons';
import { Link, Loader2, Unlink } from 'lucide-react';
import React from 'react';

const integrations = [
  {
    id: 'twitch',
    name: 'Twitch',
    icon: BrandTwitch,
    connected: true,
    username: 'johndoe',
    color: 'purple',
  },
  {
    id: 'youtube',
    name: 'YouTube',
    icon: BrandYoutube,
    connected: false,
    color: 'red',
  },
  {
    id: 'kick',
    name: 'Kick',
    icon: BrandTwitch, // Using Twitch icon as placeholder
    connected: false,
    color: 'green',
  },
];

export default function IntegrationsSettingsTab() {
  const [loading, setLoading] = React.useState<string | null>(null);

  const handleConnect = async (id: string) => {
    setLoading(id);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(null);
  };

  const handleDisconnect = async (id: string) => {
    setLoading(id);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(null);
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-200 mb-6">
        Connected Services
      </h2>

      <div className="space-y-4">
        {integrations.map((integration) => {
          const Icon = integration.icon;
          const isLoading = loading === integration.id;

          return (
            <div
              key={integration.id}
              className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`p-2 bg-${integration.color}-500/20 rounded-lg`}
                >
                  <Icon className={`h-6 w-6 text-${integration.color}-400`} />
                </div>
                <div>
                  <h3 className="text-gray-200 font-medium">
                    {integration.name}
                  </h3>
                  {integration.connected && (
                    <p className="text-sm text-gray-400">
                      Connected as @{integration.username}
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={() =>
                  integration.connected
                    ? handleDisconnect(integration.id)
                    : handleConnect(integration.id)
                }
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                  ${
                    integration.connected
                      ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                      : 'bg-purple-500/10 text-purple-400 hover:bg-purple-500/20'
                  }
                `}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : integration.connected ? (
                  <>
                    <Unlink className="h-4 w-4" />
                    <span>Disconnect</span>
                  </>
                ) : (
                  <>
                    <Link className="h-4 w-4" />
                    <span>Connect</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
