import { Eye, EyeOff } from 'lucide-react';
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';

interface AppEditorStoreTabProps {
  onChange: () => void;
}

export default function AppEditorStoreTab({
  onChange,
}: AppEditorStoreTabProps) {
  const [markdown, setMarkdown] = useState('');
  const [showPreview, setShowPreview] = useState(true);

  const handleMarkdownChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdown(e.target.value);
    onChange();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-200">Store Description</h2>
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="flex items-center space-x-2 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
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
        className={`grid ${showPreview ? 'grid-cols-2' : 'grid-cols-1'} gap-6`}
      >
        <div className="h-[600px]">
          <textarea
            value={markdown}
            onChange={handleMarkdownChange}
            placeholder="Write your store description in Markdown..."
            className="w-full h-full bg-white/5 border border-white/10 rounded-lg p-4 text-gray-100 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20"
          />
        </div>

        {showPreview && (
          <div className="h-[600px] overflow-y-auto">
            <div className="prose prose-invert max-w-none p-4 bg-white/5 rounded-lg">
              <ReactMarkdown>{markdown}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
