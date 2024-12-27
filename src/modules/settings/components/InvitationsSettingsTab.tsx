import { Check, Clock, Loader2, Mail, X } from 'lucide-react';
import React from 'react';

const sentInvitations = [
  {
    id: 1,
    email: 'editor@example.com',
    role: 'Editor',
    status: 'pending',
    sent: '2 days ago',
  },
  {
    id: 2,
    email: 'mod@example.com',
    role: 'Moderator',
    status: 'accepted',
    sent: '5 days ago',
  },
];

const receivedInvitations = [
  {
    id: 3,
    from: 'Sammwy',
    role: 'Editor',
    status: 'pending',
    received: '1 day ago',
  },
];

export default function InvitationsSettingsTab() {
  const [loading, setLoading] = React.useState<string | null>(null);

  const handleAction = async (id: number, action: string) => {
    setLoading(`${action}-${id}`);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(null);
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const colors = {
      pending: 'yellow',
      accepted: 'green',
      declined: 'red',
    }[status];

    const Icon = {
      pending: Clock,
      accepted: Check,
      declined: X,
    }[status];

    return (
      <span
        className={`
        flex items-center space-x-1 text-xs px-2 py-0.5 rounded-full
        bg-${colors}-500/20 text-${colors}-400
      `}
      >
        <Icon className="h-3 w-3" />
        <span className="capitalize">{status}</span>
      </span>
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-gray-200 mb-6">
          Sent Invitations
        </h2>
        <div className="space-y-4">
          {sentInvitations.map((invitation) => (
            <div
              key={invitation.id}
              className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
            >
              <div>
                <div className="flex items-center space-x-3">
                  <h3 className="text-gray-200 font-medium">
                    {invitation.email}
                  </h3>
                  <StatusBadge status={invitation.status} />
                </div>
                <p className="text-sm text-gray-400">
                  Invited as {invitation.role} • {invitation.sent}
                </p>
              </div>

              {invitation.status === 'pending' && (
                <button
                  onClick={() => handleAction(invitation.id, 'cancel')}
                  disabled={loading === `cancel-${invitation.id}`}
                  className="flex items-center space-x-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors"
                >
                  {loading === `cancel-${invitation.id}` ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <X className="h-4 w-4" />
                      <span>Cancel</span>
                    </>
                  )}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-200 mb-6">
          Received Invitations
        </h2>
        <div className="space-y-4">
          {receivedInvitations.map((invitation) => (
            <div
              key={invitation.id}
              className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
            >
              <div>
                <div className="flex items-center space-x-3">
                  <h3 className="text-gray-200 font-medium">
                    {invitation.from}
                  </h3>
                  <StatusBadge status={invitation.status} />
                </div>
                <p className="text-sm text-gray-400">
                  Inviting you as {invitation.role} • {invitation.received}
                </p>
              </div>

              {invitation.status === 'pending' && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleAction(invitation.id, 'accept')}
                    disabled={loading === `accept-${invitation.id}`}
                    className="flex items-center space-x-1 bg-green-500/10 text-green-400 hover:bg-green-500/20 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors"
                  >
                    {loading === `accept-${invitation.id}` ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Check className="h-4 w-4" />
                        <span>Accept</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleAction(invitation.id, 'decline')}
                    disabled={loading === `decline-${invitation.id}`}
                    className="flex items-center space-x-1 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors"
                  >
                    {loading === `decline-${invitation.id}` ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <X className="h-4 w-4" />
                        <span>Decline</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-200 mb-6">
          Send New Invitation
        </h2>
        <form className="max-w-md space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                placeholder="Enter email address"
              />
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
            </div>
          </div>

          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Role
            </label>
            <select
              id="role"
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-4 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            >
              <option value="editor">Editor</option>
              <option value="moderator">Moderator</option>
            </select>
          </div>

          <button
            type="submit"
            className="flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg px-4 py-2 font-medium transition-colors"
          >
            <Mail className="h-5 w-5" />
            <span>Send Invitation</span>
          </button>
        </form>
      </div>
    </div>
  );
}
