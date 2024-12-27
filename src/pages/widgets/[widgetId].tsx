import { useState } from 'react';

import Container from '@/shared/components/Container';
import { Tabs } from '@/shared/components/Tabs';
import WidgetInfoTab from '@/widgets/components/WidgetInfoTab';
import WidgetPreview from '@/widgets/components/WidgetPreview';
import WidgetSettingsTab from '@/widgets/components/WidgetSettingsTab';

export default function WidgetPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [previewKey, setPreviewKey] = useState(0);

  const handleSettingsChange = () => {
    setPreviewKey((prev) => prev + 1);
  };

  return (
    <div className="bg-[#0a0a0f] text-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
            Widget Configuration
          </h1>
          <p className="text-gray-400 mt-1">
            Customize your widget appearance and behavior
          </p>
        </div>

        {/* Tabs and Settings */}
        <Container>
          <Tabs
            tabs={[
              { id: 'overview', label: 'Overview', icon: 'Info' },
              { id: 'settings', label: 'Settings', icon: 'Settings' },
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />

          <div className="p-6">
            <div className="grid grid-cols-2 gap-8">
              {activeTab === 'overview' && (
                <WidgetInfoTab onChange={handleSettingsChange} />
              )}
              {activeTab === 'settings' && (
                <WidgetSettingsTab onChange={handleSettingsChange} />
              )}

              <Container className="p-4 h-[600px]">
                <WidgetPreview key={previewKey} />
              </Container>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}
