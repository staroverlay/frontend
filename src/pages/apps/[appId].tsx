import Container from '@/shared/components/Container';
import {
  AlertTriangle,
  ArrowRight,
  Check,
  Clock,
  Download,
  Shield,
  Star,
  X,
} from 'lucide-react';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

interface WidgetPermission {
  id: string;
  name: string;
  description: string;
  required: boolean;
}

const PERMISSIONS: WidgetPermission[] = [
  {
    id: 'read.subs',
    name: 'View Subscriptions',
    description: 'Access information about your channel subscribers',
    required: true,
  },
  {
    id: 'read.cheer',
    name: 'View Bits & Cheers',
    description: 'Access information about Bits usage in your channel',
    required: true,
  },
];

const WIDGET_DATA = {
  id: 'super-alerts',
  name: 'Super Alerts',
  description: `
# Super Alerts

Create stunning alerts for your stream with customizable animations and sound effects.

## Features

- 🎨 Fully customizable design
- 🎵 Custom sound support
- ⚡ Low latency alerts
- 🎮 Game-specific animations
- 📱 Mobile-responsive overlay

## Requirements

- Active Twitch account
- Streaming software (OBS, Streamlabs, etc.)
  `,
  creator: {
    name: 'Sammwy',
    verified: true,
  },
  stats: {
    uses: 25420,
    rating: 4.8,
    reviews: 342,
  },
  dates: {
    created: '2024-01-15',
    updated: '2024-03-10',
  },
  banner:
    'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?auto=format&fit=crop&w=1800&q=80',
  icon: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=300&q=80',
};

export default function AppPage() {
  const [showUseModal, setShowUseModal] = useState(false);
  const [showPermissions, setShowPermissions] = useState(false);
  const [widgetName, setWidgetName] = useState(WIDGET_DATA.name);
  const [acceptedPermissions, setAcceptedPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleUse = async () => {
    if (!showUseModal) {
      setShowUseModal(true);
      return;
    }

    if (!showPermissions) {
      setShowPermissions(true);
      return;
    }

    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    setShowUseModal(false);
    setShowPermissions(false);
  };

  const togglePermission = (permissionId: string) => {
    if (acceptedPermissions.includes(permissionId)) {
      setAcceptedPermissions(
        acceptedPermissions.filter((id) => id !== permissionId),
      );
    } else {
      setAcceptedPermissions([...acceptedPermissions, permissionId]);
    }
  };

  const allRequiredPermissionsAccepted = PERMISSIONS.filter(
    (p) => p.required,
  ).every((p) => acceptedPermissions.includes(p.id));

  return (
    <div className="bg-[#0a0a0f] text-gray-100">
      {/* Banner */}
      <div className="relative h-64 md:h-80">
        <img
          src={WIDGET_DATA.banner}
          alt={WIDGET_DATA.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] to-transparent"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-20 relative">
        {/* Icon and Title */}
        <div className="flex items-end space-x-6 mb-8">
          <div className="w-24 h-24 rounded-xl overflow-hidden ring-4 ring-purple-500/20 bg-[#0a0a0f]">
            <img
              src={WIDGET_DATA.icon}
              alt={WIDGET_DATA.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-100 flex items-center">
              {WIDGET_DATA.name}
              {WIDGET_DATA.creator.verified && (
                <span className="ml-2 text-purple-400">
                  <Check className="h-5 w-5" />
                </span>
              )}
            </h1>
            <p className="text-gray-400 mt-1">by {WIDGET_DATA.creator.name}</p>
          </div>
          <button
            onClick={() => setShowUseModal(true)}
            className="flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg px-6 py-3 font-medium transition-colors"
          >
            <span>Use Widget</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>

        {/* Stats */}
        <Container className="p-6 mb-8">
          <div className="grid grid-cols-4 gap-6">
            <div>
              <div className="flex items-center space-x-2 text-gray-400 mb-1">
                <Download className="h-4 w-4" />
                <span className="text-sm">Uses</span>
              </div>
              <p className="text-xl font-semibold text-gray-200">
                {WIDGET_DATA.stats.uses.toLocaleString()}
              </p>
            </div>
            <div>
              <div className="flex items-center space-x-2 text-gray-400 mb-1">
                <Star className="h-4 w-4" />
                <span className="text-sm">Rating</span>
              </div>
              <p className="text-xl font-semibold text-gray-200">
                {WIDGET_DATA.stats.rating} / 5
              </p>
            </div>
            <div>
              <div className="flex items-center space-x-2 text-gray-400 mb-1">
                <Clock className="h-4 w-4" />
                <span className="text-sm">Created</span>
              </div>
              <p className="text-xl font-semibold text-gray-200">
                {new Date(WIDGET_DATA.dates.created).toLocaleDateString()}
              </p>
            </div>
            <div>
              <div className="flex items-center space-x-2 text-gray-400 mb-1">
                <Clock className="h-4 w-4" />
                <span className="text-sm">Updated</span>
              </div>
              <p className="text-xl font-semibold text-gray-200">
                {new Date(WIDGET_DATA.dates.updated).toLocaleDateString()}
              </p>
            </div>
          </div>
        </Container>

        {/* Description */}
        <Container className="p-6 prose prose-invert max-w-none">
          <ReactMarkdown>{WIDGET_DATA.description}</ReactMarkdown>
        </Container>
      </div>

      {/* Use Modal */}
      {showUseModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Container className="w-full max-w-lg mx-4">
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h3 className="text-lg font-semibold text-gray-200">
                {showPermissions ? 'Required Permissions' : 'Add Widget'}
              </h3>
              <button
                onClick={() => {
                  setShowUseModal(false);
                  setShowPermissions(false);
                }}
                className="text-gray-400 hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6">
              {!showPermissions ? (
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="widgetName"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Widget Name
                    </label>
                    <input
                      type="text"
                      id="widgetName"
                      value={widgetName}
                      onChange={(e) => setWidgetName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-4 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                      placeholder="Enter widget name"
                    />
                  </div>
                  <p className="text-sm text-gray-400">
                    This name will be used to identify the widget in your
                    dashboard
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-yellow-200">
                        This widget requires access to certain features of your
                        Twitch account. Review and accept the permissions below
                        to continue.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {PERMISSIONS.map((permission) => (
                      <div
                        key={permission.id}
                        className="flex items-start space-x-3 p-4 bg-white/5 rounded-lg"
                      >
                        <div className="flex-shrink-0">
                          <input
                            type="checkbox"
                            id={permission.id}
                            checked={acceptedPermissions.includes(
                              permission.id,
                            )}
                            onChange={() => togglePermission(permission.id)}
                            className="w-4 h-4 rounded border-white/10 text-purple-500 focus:ring-purple-500/20"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor={permission.id}
                            className="block font-medium text-gray-200"
                          >
                            {permission.name}
                            {permission.required && (
                              <span className="ml-2 text-xs text-purple-400">
                                (Required)
                              </span>
                            )}
                          </label>
                          <p className="text-sm text-gray-400 mt-1">
                            {permission.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end space-x-3 p-6 border-t border-white/5">
              <button
                onClick={() => {
                  setShowUseModal(false);
                  setShowPermissions(false);
                }}
                className="px-4 py-2 text-sm text-gray-400 hover:text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleUse}
                disabled={
                  showPermissions
                    ? !allRequiredPermissionsAccepted || isLoading
                    : !widgetName
                }
                className="flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white"></div>
                    <span>Adding Widget...</span>
                  </div>
                ) : (
                  <>
                    {showPermissions ? (
                      <>
                        <Shield className="h-4 w-4" />
                        <span>Accept & Add Widget</span>
                      </>
                    ) : (
                      <>
                        <ArrowRight className="h-4 w-4" />
                        <span>Continue</span>
                      </>
                    )}
                  </>
                )}
              </button>
            </div>
          </Container>
        </div>
      )}
    </div>
  );
}
