import { Calendar, Download, Plus, Shield } from 'lucide-react';

const releases = [
  {
    version: '1.2.0',
    date: '2024-03-15',
    scopes: ['read.chat', 'write.chat', 'channel.manage'],
    downloads: 1234,
  },
  {
    version: '1.1.0',
    date: '2024-02-28',
    scopes: ['read.chat', 'write.chat'],
    downloads: 987,
  },
  {
    version: '1.0.0',
    date: '2024-02-01',
    scopes: ['read.chat'],
    downloads: 456,
  },
];

export default function AppEditorReleasesTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-200">Version History</h2>
        <button className="flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors">
          <Plus className="h-4 w-4" />
          <span>Create Release</span>
        </button>
      </div>

      <div className="space-y-4">
        {releases.map((release) => (
          <div
            key={release.version}
            className="bg-white/5 rounded-lg border border-white/10 p-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-100">
                  v{release.version}
                </h3>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{release.date}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Download className="h-4 w-4" />
                    <span>{release.downloads.toLocaleString()} downloads</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="flex items-center space-x-2 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 rounded-lg px-4 py-2 text-sm font-medium transition-colors">
                  <Shield className="h-4 w-4" />
                  <span>{release.scopes.length} Permissions</span>
                </button>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              {release.scopes.map((scope) => (
                <div
                  key={scope}
                  className="flex items-center space-x-2 text-sm text-gray-400"
                >
                  <Shield className="h-4 w-4 text-purple-400" />
                  <span>{scope}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
