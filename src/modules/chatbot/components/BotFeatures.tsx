import {
  Bell,
  Brain,
  Clock,
  Globe,
  MessageSquare,
  Radio,
  User,
} from 'lucide-react';
import React, { useState } from 'react';

interface PrebuiltCommand {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  enabled: boolean;
  category: 'stream' | 'utility' | 'social';
  cooldown: number;
}

export default function BotFeatures() {
  const [commands, setCommands] = useState<PrebuiltCommand[]>([
    {
      id: 'game',
      name: '!game',
      description: 'Change or display current stream category',
      icon: Radio,
      enabled: true,
      category: 'stream',
      cooldown: 30,
    },
    {
      id: 'title',
      name: '!title',
      description: 'Change or display stream title',
      icon: MessageSquare,
      enabled: true,
      category: 'stream',
      cooldown: 30,
    },
    {
      id: 'followage',
      name: '!followage',
      description: 'Check how long a user has been following',
      icon: User,
      enabled: true,
      category: 'social',
      cooldown: 15,
    },
    {
      id: 'brb',
      name: '!brb',
      description: 'Set a BRB status with optional duration',
      icon: Clock,
      enabled: true,
      category: 'stream',
      cooldown: 60,
    },
    {
      id: 'remind',
      name: '!remind',
      description: 'Set a reminder for a user',
      icon: Bell,
      enabled: true,
      category: 'utility',
      cooldown: 30,
    },
    {
      id: 'gpt',
      name: '!gpt',
      description: 'Ask ChatGPT a question',
      icon: Brain,
      enabled: true,
      category: 'utility',
      cooldown: 60,
    },
    {
      id: 'time',
      name: '!time',
      description: 'Check time for streamer or specific user',
      icon: Clock,
      enabled: true,
      category: 'utility',
      cooldown: 15,
    },
    {
      id: 'timezone',
      name: '!timezone',
      description: 'Set or check timezone settings',
      icon: Globe,
      enabled: true,
      category: 'utility',
      cooldown: 30,
    },
  ]);

  const [editingCommand, setEditingCommand] = useState<string | null>(null);

  const categories = {
    stream: 'Stream Management',
    utility: 'Utility Commands',
    social: 'Social Features',
  };

  const handleToggle = (id: string) => {
    setCommands(
      commands.map((cmd) =>
        cmd.id === id ? { ...cmd, enabled: !cmd.enabled } : cmd,
      ),
    );
  };

  const handleCooldownChange = (id: string, cooldown: number) => {
    setCommands(
      commands.map((cmd) => (cmd.id === id ? { ...cmd, cooldown } : cmd)),
    );
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-200 mb-6">
        Prebuilt Commands
      </h2>

      {Object.entries(categories).map(([category, label]) => (
        <div key={category} className="mb-8">
          <h3 className="text-sm font-medium text-gray-400 mb-4">{label}</h3>
          <div className="space-y-4">
            {commands
              .filter((cmd) => cmd.category === category)
              .map((command) => {
                const Icon = command.icon;
                const isEditing = editingCommand === command.id;

                return (
                  <div
                    key={command.id}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="bg-purple-500/20 p-2 rounded-lg">
                        <Icon className="h-5 w-5 text-purple-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-200">
                          {command.name}
                        </h4>
                        <p className="text-sm text-gray-400 mt-1">
                          {command.description}
                        </p>
                        {isEditing ? (
                          <div className="mt-2 flex items-center space-x-2">
                            <input
                              type="number"
                              value={command.cooldown}
                              onChange={(e) =>
                                handleCooldownChange(
                                  command.id,
                                  parseInt(e.target.value),
                                )
                              }
                              className="w-20 bg-white/5 border border-white/10 rounded-lg py-1 px-2 text-sm text-gray-100"
                              min="0"
                            />
                            <span className="text-sm text-gray-400">
                              seconds cooldown
                            </span>
                            <button
                              onClick={() => setEditingCommand(null)}
                              className="text-sm text-purple-400 hover:text-purple-300"
                            >
                              Save
                            </button>
                          </div>
                        ) : (
                          <div className="mt-2 flex items-center space-x-2">
                            <span className="text-sm text-gray-500">
                              {command.cooldown}s cooldown
                            </span>
                            <button
                              onClick={() => setEditingCommand(command.id)}
                              className="text-sm text-purple-400 hover:text-purple-300"
                            >
                              Edit
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <button
                        onClick={() => handleToggle(command.id)}
                        className={`
                          relative inline-flex h-6 w-11 items-center rounded-full
                          ${command.enabled ? 'bg-purple-500' : 'bg-gray-700'}
                        `}
                      >
                        <span
                          className={`
                            inline-block h-4 w-4 transform rounded-full bg-white transition
                            ${
                              command.enabled
                                ? 'translate-x-6'
                                : 'translate-x-1'
                            }
                          `}
                        />
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      ))}
    </div>
  );
}
