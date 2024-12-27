import { Loader2, Save } from 'lucide-react';
import { useState } from 'react';

import AppReleaseOverviewTab from '@/app-releases/components/AppReleaseOverviewTab';
import AppReleaseSchemaTab from '@/app-releases/components/AppReleaseSchemaTab';
import Container from '@/shared/components/Container';
import { Tabs } from '@/shared/components/Tabs';

export default function AppReleaseEditorPage() {
  const [activeTab, setActiveTab] = useState('basic');
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
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
              New Release
            </h1>
            <p className="text-gray-400 mt-1">
              Create a new version of your application
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
              { id: 'basic', label: 'Basic Info', icon: 'Info' },
              { id: 'config', label: 'Config Schema', icon: 'Code' },
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />

          <div className="p-6">
            {activeTab === 'basic' && (
              <AppReleaseOverviewTab onChange={handleChange} />
            )}
            {activeTab === 'config' && (
              <AppReleaseSchemaTab onChange={handleChange} />
            )}
          </div>
        </Container>
      </div>
    </div>
  );
}
