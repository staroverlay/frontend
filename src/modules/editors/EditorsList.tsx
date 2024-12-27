import { Clock, Shield, X } from 'lucide-react';

const editors = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Admin',
    status: 'active',
    joinedAt: '2024-01-15'
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'Editor',
    status: 'pending',
    invitedAt: '2024-03-10'
  }
];

export default function EditorsList() {
  const handleRemoveEditor = (id: number) => {
    // Handle editor removal
    console.log('Remove editor:', id);
  };

  const handleCancelInvite = (id: number) => {
    // Handle invitation cancellation
    console.log('Cancel invite:', id);
  };

  return (
    <div className="divide-y divide-white/5">
      {editors.map((editor) => (
        <div
          key={editor.id}
          className="flex items-center justify-between p-4"
        >
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
              <span className="text-purple-400 font-medium">
                {editor.name.charAt(0)}
              </span>
            </div>
            <div>
              <h3 className="text-gray-200 font-medium">{editor.name}</h3>
              <p className="text-gray-400 text-sm">{editor.email}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-purple-400" />
              <span className="text-sm text-gray-400">{editor.role}</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {editor.status === 'pending' ? (
              <>
                <div className="flex items-center space-x-1 text-yellow-400">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">Pending</span>
                </div>
                <button
                  onClick={() => handleCancelInvite(editor.id)}
                  className="flex items-center space-x-1 text-red-400 hover:text-red-300"
                >
                  <X className="h-4 w-4" />
                  <span className="text-sm">Cancel</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => handleRemoveEditor(editor.id)}
                className="flex items-center space-x-1 text-red-400 hover:text-red-300"
              >
                <X className="h-4 w-4" />
                <span className="text-sm">Remove</span>
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}