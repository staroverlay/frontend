import { Check, Copy, RefreshCw, Shield } from 'lucide-react';
import { useState } from 'react';

import { Switch } from '@/shared/components/Switch';

interface WidgetInfoTabProps {
  onChange: () => void;
}

export default function WidgetInfoTab({ onChange }: WidgetInfoTabProps) {
  const [isActive, setIsActive] = useState(true);
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [copied, setCopied] = useState(false);
  const widgetUrl = 'https://overlay.example.com/widget/123';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(widgetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleManualUpdate = async () => {
    // Simulate update
    await new Promise((resolve) => setTimeout(resolve, 1000));
    onChange();
  };

  return (
    <div className="max-w-2xl space-y-8">
      {/* Display Name */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Display Name
        </label>
        <input
          type="text"
          className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-4 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
          placeholder="Enter widget name"
          defaultValue="Super Alerts"
        />
      </div>

      {/* Widget URL */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Widget URL
        </label>
        <div className="flex space-x-2">
          <input
            type="text"
            readOnly
            value={widgetUrl}
            className="flex-1 bg-white/5 border border-white/10 rounded-lg py-2 px-4 text-gray-100"
          />
          <button
            onClick={handleCopy}
            className="flex items-center space-x-2 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 rounded-lg px-4 py-2 font-medium transition-colors"
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Status Toggle */}
      <div>
        <div className="flex items-center justify-between">
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Widget Status
            </label>
            <p className="text-sm text-gray-400 mt-1">
              Enable or disable this widget
            </p>
          </div>
          <Switch checked={isActive} onChange={setIsActive} />
        </div>
      </div>

      {/* Auto Update Toggle */}
      <div>
        <div className="flex items-center justify-between">
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Auto Update
            </label>
            <p className="text-sm text-gray-400 mt-1">
              Automatically update widget when settings change
            </p>
          </div>
          <Switch checked={autoUpdate} onChange={setAutoUpdate} />
        </div>
        {!autoUpdate && (
          <button
            onClick={handleManualUpdate}
            className="mt-4 flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Update Widget</span>
          </button>
        )}
      </div>

      {/* Permissions */}
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <Shield className="h-5 w-5 text-purple-400" />
          <h3 className="text-lg font-medium text-gray-200">
            Permission Scopes
          </h3>
        </div>
        <div className="space-y-3">
          {['read.subs', 'read.cheer'].map((scope) => (
            <div
              key={scope}
              className="flex items-start space-x-3 p-4 bg-white/5 rounded-lg"
            >
              <input
                type="checkbox"
                id={scope}
                defaultChecked
                className="mt-1 w-4 h-4 rounded border-white/10 text-purple-500 focus:ring-purple-500/20"
              />
              <div>
                <label
                  htmlFor={scope}
                  className="block font-medium text-gray-200"
                >
                  {scope}
                </label>
                <p className="text-sm text-gray-400 mt-1">
                  Access information about your channel {scope.split('.')[1]}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
