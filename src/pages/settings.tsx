import AccountSettingsTab from '@/settings/components/AccountSettingsTab';
import AppearanceSettingsTab from '@/settings/components/AppearanceSettingsTab';
import IntegrationsSettingsTab from '@/settings/components/IntegrationsSettingsTab';
import InvitationsSettingsTab from '@/settings/components/InvitationsSettingsTab';
import SecuritySettingsTab from '@/settings/components/SecuritySettingsTab';
import Container from '@/shared/components/Container';
import { Tab, Tabs } from '@/shared/components/Tabs';
import { useState } from 'react';

const tabs: Tab[] = [
  { id: 'account', label: 'Account', icon: 'User' },
  { id: 'integrations', label: 'Integrations', icon: 'Link' },
  { id: 'security', label: 'Security', icon: 'Shield' },
  { id: 'theme', label: 'Theme', icon: 'Palette' },
  { id: 'invitations', label: 'Invitations', icon: 'Users' },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('account');

  return (
    <div className="bg-[#0a0a0f] text-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-gray-400 mt-1">
            Manage your account settings and preferences
          </p>
        </div>

        <Container>
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

          <div className="p-6">
            {activeTab === 'account' && <AccountSettingsTab />}
            {activeTab === 'integrations' && <IntegrationsSettingsTab />}
            {activeTab === 'security' && <SecuritySettingsTab />}
            {activeTab === 'theme' && <AppearanceSettingsTab />}
            {activeTab === 'invitations' && <InvitationsSettingsTab />}
          </div>
        </Container>
      </div>
    </div>
  );
}
