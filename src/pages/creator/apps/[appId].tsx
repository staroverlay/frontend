import { Loader2, Save } from 'lucide-react';
import { useState } from 'react';

import AppEditorAnalyticsTab from '@/apps/components/editor/AppEditorAnalyticsTab';
import AppEditorOverviewTab from '@/apps/components/editor/AppEditorOverviewTab';
import AppEditorReleasesTab from '@/apps/components/editor/AppEditorReleasesTab';
import AppEditorStoreTab from '@/apps/components/editor/AppEditorStoreTab';
import Container from '@/shared/components/Container';
import { Tabs } from '@/shared/components/Tabs';

export default function AppEditorPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    setHasChanges(false);
  };

  const handleChange = () => {
    setHasChanges(true);
  };

  return (
    <div className="text-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              App Editor
            </h1>
            <p className="text-gray-400 mt-1">
              Configure and manage your application
            </p>
          </div>

          <button
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            className={`
              flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors
              ${
                hasChanges
                  ? 'bg-purple-500 hover:bg-purple-600 text-white'
                  : 'bg-white/5 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            {isSaving ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Save className="h-5 w-5" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>

        <Container>
          <Tabs
            tabs={[
              { id: 'overview', label: 'Overview', icon: 'AArrowDown' },
              { id: 'store', label: 'Store Page', icon: 'AArrowDown' },
              { id: 'analytics', label: 'Analytics', icon: 'AArrowDown' },
              { id: 'releases', label: 'Releases', icon: 'AArrowDown' },
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />

          <div className="p-6">
            {activeTab === 'overview' && (
              <AppEditorOverviewTab onChange={handleChange} />
            )}
            {activeTab === 'store' && (
              <AppEditorStoreTab onChange={handleChange} />
            )}
            {activeTab === 'analytics' && <AppEditorAnalyticsTab />}
            {activeTab === 'releases' && <AppEditorReleasesTab />}
          </div>
        </Container>
      </div>
    </div>
  );
}
