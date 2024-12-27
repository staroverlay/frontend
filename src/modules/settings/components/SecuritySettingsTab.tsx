import {
  AlertTriangle,
  Key,
  Loader2,
  LogOut,
  Shield,
  Terminal,
} from 'lucide-react';
import { useState } from 'react';

const sessions = [
  {
    id: 1,
    device: 'Chrome on MacOS',
    location: 'San Francisco, US',
    lastActive: 'Active now',
    current: true,
  },
  {
    id: 2,
    device: 'Firefox on Windows',
    location: 'London, UK',
    lastActive: '2 hours ago',
  },
  {
    id: 3,
    device: 'Safari on iPhone',
    location: 'Paris, FR',
    lastActive: '1 day ago',
  },
];

export default function SecuritySettingsTab() {
  const [loading, setLoading] = useState<string | null>(null);
  const [showTokens, setShowTokens] = useState(false);
  const [tokens] = useState(['sk_live_123...abc', 'sk_test_456...xyz']);

  const handleChangePassword = async () => {
    setLoading('password');
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(null);
  };

  const handleLogoutSession = async (id: number) => {
    setLoading(`session-${id}`);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(null);
  };

  const handleLogoutAll = async () => {
    setLoading('all-sessions');
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(null);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-gray-200 mb-6">
          Change Password
        </h2>
        <div className="max-w-md">
          <button
            onClick={handleChangePassword}
            disabled={loading === 'password'}
            className="flex items-center space-x-2 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 rounded-lg px-4 py-2 font-medium transition-colors"
          >
            {loading === 'password' ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Key className="h-5 w-5" />
                <span>Change Password</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-200 mb-6">
          Developer Tokens
        </h2>
        <div className="space-y-4">
          <button
            onClick={() => setShowTokens(!showTokens)}
            className="flex items-center space-x-2 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 rounded-lg px-4 py-2 font-medium transition-colors"
          >
            <Terminal className="h-5 w-5" />
            <span>{showTokens ? 'Hide' : 'Show'} API Tokens</span>
          </button>

          {showTokens && (
            <div className="space-y-2">
              {tokens.map((token, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
                >
                  <code className="text-sm text-gray-400">{token}</code>
                  <button className="text-red-400 hover:text-red-300 text-sm">
                    Revoke
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-200 mb-6">
          Active Sessions
        </h2>
        <div className="space-y-4">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
            >
              <div>
                <h3 className="text-gray-200 font-medium flex items-center space-x-2">
                  <span>{session.device}</span>
                  {session.current && (
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
                      Current
                    </span>
                  )}
                </h3>
                <p className="text-sm text-gray-400">
                  {session.location} • {session.lastActive}
                </p>
              </div>

              {!session.current && (
                <button
                  onClick={() => handleLogoutSession(session.id)}
                  disabled={loading === `session-${session.id}`}
                  className="flex items-center space-x-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors"
                >
                  {loading === `session-${session.id}` ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </>
                  )}
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={handleLogoutAll}
          disabled={loading === 'all-sessions'}
          className="mt-4 flex items-center space-x-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg px-4 py-2 font-medium transition-colors"
        >
          {loading === 'all-sessions' ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <Shield className="h-5 w-5" />
              <span>Logout All Other Sessions</span>
            </>
          )}
        </button>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-red-400 mb-6">Danger Zone</h2>
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-red-400 font-medium">Delete Account</h3>
              <p className="text-sm text-red-300/70 mt-1">
                Once you delete your account, there is no going back. Please be
                certain.
              </p>
              <button className="mt-4 bg-red-500 hover:bg-red-600 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
