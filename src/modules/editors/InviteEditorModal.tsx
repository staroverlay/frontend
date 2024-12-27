import Modal from '@/shared/components/Modal';
import { Loader2, Mail } from 'lucide-react';
import { useState } from 'react';

interface InviteEditorModalProps {
  onClose: () => void;
  isOpen: boolean;
}

export default function InviteEditorModal({
  onClose,
  isOpen,
}: InviteEditorModalProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('editor');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal title="Invite Editor" onClose={onClose}>
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              placeholder="Enter email address"
              required
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
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-4 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
          >
            <option value="editor">Editor</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="flex items-center justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-400 hover:text-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading || !email}
            className="flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Mail className="h-4 w-4" />
                <span>Send Invitation</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
