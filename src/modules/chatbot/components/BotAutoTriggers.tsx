import {
  Gift,
  Heart,
  MessageSquare,
  Radio,
  Sparkles,
  Star,
} from 'lucide-react';
import React, { useState } from 'react';

interface Trigger {
  id: string;
  name: string;
  description: string;
  message: string;
  icon: React.ElementType;
  enabled: boolean;
  category: 'stream' | 'alerts' | 'social';
}

export default function BotAutoTriggers() {
  const [triggers, setTriggers] = useState<Trigger[]>([
    {
      id: 'stream-start',
      name: 'Stream Start',
      description: 'Message when stream goes live',
      message: '🎥 Stream is now live! Welcome everyone!',
      icon: Radio,
      enabled: true,
      category: 'stream',
    },
    {
      id: 'title-change',
      name: 'Title Change',
      description: 'Announce when stream title changes',
      message: '📢 Stream title has been updated to: {title}',
      icon: MessageSquare,
      enabled: true,
      category: 'stream',
    },
    {
      id: 'new-follower',
      name: 'New Follower',
      description: 'Welcome new followers',
      message: '💜 Thanks for following, {user}!',
      icon: Heart,
      enabled: true,
      category: 'alerts',
    },
    {
      id: 'new-sub',
      name: 'New Subscriber',
      description: 'Thank new subscribers',
      message: '✨ Welcome to the community, {user}! Thanks for subscribing!',
      icon: Star,
      enabled: true,
      category: 'alerts',
    },
    {
      id: 'resub',
      name: 'Resubscription',
      description: 'Thank returning subscribers',
      message: '🎉 Thanks for {months} months of support, {user}!',
      icon: Gift,
      enabled: true,
      category: 'alerts',
    },
    {
      id: 'bits',
      name: 'Bits Cheer',
      description: 'Thank viewers for cheering bits',
      message: '⚡ Thanks for the {amount} bits, {user}!',
      icon: Sparkles,
      enabled: true,
      category: 'alerts',
    },
  ]);

  const [editingTrigger, setEditingTrigger] = useState<string | null>(null);

  const categories = {
    stream: 'Stream Events',
    alerts: 'Alerts & Notifications',
    social: 'Social Interactions',
  };

  const handleToggle = (id: string) => {
    setTriggers(
      triggers.map((trigger) =>
        trigger.id === id ? { ...trigger, enabled: !trigger.enabled } : trigger,
      ),
    );
  };

  const handleMessageChange = (id: string, message: string) => {
    setTriggers(
      triggers.map((trigger) =>
        trigger.id === id ? { ...trigger, message } : trigger,
      ),
    );
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-200 mb-6">
        Auto Triggers
      </h2>

      {Object.entries(categories).map(([category, label]) => (
        <div key={category} className="mb-8">
          <h3 className="text-sm font-medium text-gray-400 mb-4">{label}</h3>
          <div className="space-y-4">
            {triggers
              .filter((trigger) => trigger.category === category)
              .map((trigger) => {
                const Icon = trigger.icon;
                const isEditing = editingTrigger === trigger.id;

                return (
                  <div key={trigger.id} className="p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="bg-purple-500/20 p-2 rounded-lg">
                          <Icon className="h-5 w-5 text-purple-400" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-200">
                            {trigger.name}
                          </h4>
                          <p className="text-sm text-gray-400">
                            {trigger.description}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleToggle(trigger.id)}
                        className={`
                          relative inline-flex h-6 w-11 items-center rounded-full
                          ${trigger.enabled ? 'bg-purple-500' : 'bg-gray-700'}
                        `}
                      >
                        <span
                          className={`
                            inline-block h-4 w-4 transform rounded-full bg-white transition
                            ${
                              trigger.enabled
                                ? 'translate-x-6'
                                : 'translate-x-1'
                            }
                          `}
                        />
                      </button>
                    </div>

                    {isEditing ? (
                      <div className="mt-4">
                        <textarea
                          value={trigger.message}
                          onChange={(e) =>
                            handleMessageChange(trigger.id, e.target.value)
                          }
                          className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-gray-100 h-24"
                          placeholder="Enter trigger message..."
                        />
                        <div className="flex justify-end mt-2">
                          <button
                            onClick={() => setEditingTrigger(null)}
                            className="text-sm text-purple-400 hover:text-purple-300"
                          >
                            Save Changes
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-sm text-gray-400">
                          {trigger.message}
                        </p>
                        <button
                          onClick={() => setEditingTrigger(trigger.id)}
                          className="text-sm text-purple-400 hover:text-purple-300"
                        >
                          Edit Message
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      ))}
    </div>
  );
}
