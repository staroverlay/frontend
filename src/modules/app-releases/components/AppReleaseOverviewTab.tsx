import { Eye, EyeOff, Plus, Shield, X } from 'lucide-react';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

interface AppReleaseOverviewTabProps {
  onChange: () => void;
}

export default function AppReleaseOverviewTab({
  onChange,
}: AppReleaseOverviewTabProps) {
  const [showPreview, setShowPreview] = useState(true);
  const [version, setVersion] = useState('1.0.0');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [scopes, setScopes] = useState<string[]>([]);
  const [newScope, setNewScope] = useState('');

  const handleAddScope = () => {
    if (newScope && !scopes.includes(newScope)) {
      setScopes([...scopes, newScope]);
      setNewScope('');
      onChange();
    }
  };

  const handleRemoveScope = (scope: string) => {
    setScopes(scopes.filter((s) => s !== scope));
    onChange();
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Version
          </label>
          <input
            type="text"
            value={version}
            onChange={(e) => {
              setVersion(e.target.value);
              onChange();
            }}
            placeholder="1.0.0"
            className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-4 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Update Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              onChange();
            }}
            placeholder="What's new in this version?"
            className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-4 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-300">
            Update Description
          </label>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center space-x-2 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors"
          >
            {showPreview ? (
              <>
                <EyeOff className="h-4 w-4" />
                <span>Hide Preview</span>
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" />
                <span>Show Preview</span>
              </>
            )}
          </button>
        </div>

        <div
          className={`grid ${
            showPreview ? 'grid-cols-2' : 'grid-cols-1'
          } gap-6`}
        >
          <div className="h-[300px]">
            <textarea
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                onChange();
              }}
              placeholder="Write your update description in Markdown..."
              className="w-full h-full bg-white/5 border border-white/10 rounded-lg p-4 text-gray-100 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            />
          </div>

          {showPreview && (
            <div className="h-[300px] overflow-y-auto">
              <div className="prose prose-invert max-w-none p-4 bg-white/5 rounded-lg">
                <ReactMarkdown>{description}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-4">
          Required Permissions
        </label>

        <div className="flex items-center space-x-2 mb-4">
          <input
            type="text"
            value={newScope}
            onChange={(e) => setNewScope(e.target.value)}
            placeholder="Add permission scope (e.g., read.chat)"
            className="flex-1 bg-white/5 border border-white/10 rounded-lg py-2 px-4 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            onKeyPress={(e) => e.key === 'Enter' && handleAddScope()}
          />
          <button
            onClick={handleAddScope}
            className="flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg px-4 py-2 font-medium transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add</span>
          </button>
        </div>

        <div className="space-y-2">
          {scopes.map((scope) => (
            <div
              key={scope}
              className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
            >
              <div className="flex items-center space-x-2 text-sm">
                <Shield className="h-4 w-4 text-purple-400" />
                <span>{scope}</span>
              </div>
              <button
                onClick={() => handleRemoveScope(scope)}
                className="p-1 hover:bg-white/10 rounded-lg text-red-400"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
