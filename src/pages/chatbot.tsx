import { MessageSquare, Shield, Sparkles, Zap } from 'lucide-react';
import { useState } from 'react';

import BotAutoTriggers from '@/chatbot/components/BotAutoTriggers';
import BotBannedWords from '@/chatbot/components/BotBannedWords';
import BotCustomCommands from '@/chatbot/components/BotCustomCommands';
import BotFeatures from '@/chatbot/components/BotFeatures';
import BotSettings from '@/chatbot/components/BotSettings';
import Container from '@/shared/components/Container';
import { Tab, Tabs } from '@/shared/components/Tabs';

export default function ChatbotPage() {
  const [activeTab, setActiveTab] = useState<string>('settings');
  const [isEnabled, setIsEnabled] = useState(true);

  const tabs: Tab[] = [
    { id: 'settings', label: 'Settings', icon: 'Settings' },
    { id: 'prebuilt', label: 'Prebuilt Commands', icon: 'Zap' },
    { id: 'commands', label: 'Custom Commands', icon: 'MessageSquare' },
    { id: 'triggers', label: 'Auto Triggers', icon: 'Bell' },
    { id: 'banned', label: 'Banned Words', icon: 'Shield' },
  ];

  const stats = [
    { label: 'Commands Used', value: '1,234', icon: MessageSquare },
    { label: 'Messages Moderated', value: '5,678', icon: Shield },
    { label: 'Active Commands', value: '42', icon: Zap },
    { label: 'AI Responses', value: '890', icon: Sparkles },
  ];

  return (
    <div className="bg-[#0a0a0f] text-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Chatbot Manager
            </h1>
            <p className="text-gray-400 mt-1">
              Customize your stream's chatbot behavior and commands
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span
                className={`h-2 w-2 rounded-full ${
                  isEnabled ? 'bg-green-400' : 'bg-red-400'
                }`}
              ></span>
              <span className="text-sm text-gray-400">
                {isEnabled ? 'Bot Active' : 'Bot Inactive'}
              </span>
            </div>
            <button
              onClick={() => setIsEnabled(!isEnabled)}
              className={`
                px-4 py-2 rounded-lg font-medium transition-colors
                ${
                  isEnabled
                    ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                    : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                }
              `}
            >
              {isEnabled ? 'Disable Bot' : 'Enable Bot'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Container key={index} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-purple-500/20 rounded-lg p-2">
                    <Icon className="h-5 w-5 text-purple-400" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-200">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
              </Container>
            );
          })}
        </div>

        <Container className="overflow-hidden">
          <div className="border-b border-white/5">
            <div className="flex space-x-1 p-1">
              <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'settings' && <BotSettings />}
            {activeTab === 'prebuilt' && <BotFeatures />}
            {activeTab === 'commands' && <BotCustomCommands />}
            {activeTab === 'triggers' && <BotAutoTriggers />}
            {activeTab === 'banned' && <BotBannedWords />}
          </div>
        </Container>
      </div>
    </div>
  );
}
