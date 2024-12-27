import { UserPlus, Users } from 'lucide-react';

import EditorsList from '@/editors/EditorsList';
import InviteEditorModal from '@/editors/InviteEditorModal';
import useDisclosure from '@/shared/hooks/useDisclosure';

export default function EditorsPage() {
  const inviteEditorHandler = useDisclosure();

  return (
    <>
      <div className="max-w-5xl mx-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Editors Management
            </h1>
            <p className="text-gray-400 mt-1">
              Manage your app editors and collaborators
            </p>
          </div>

          <button
            onClick={() => inviteEditorHandler.open()}
            className="flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg px-4 py-2 font-medium transition-colors"
          >
            <UserPlus className="h-5 w-5" />
            <span>Invite Editor</span>
          </button>
        </div>

        <div className="glass rounded-xl">
          <div className="p-6 border-b border-white/5">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-purple-400" />
              <h2 className="text-lg font-medium text-gray-200">
                Active Editors
              </h2>
            </div>
          </div>

          <EditorsList />
        </div>
      </div>

      <InviteEditorModal
        onClose={inviteEditorHandler.close}
        isOpen={inviteEditorHandler.isOpen}
      />
    </>
  );
}
