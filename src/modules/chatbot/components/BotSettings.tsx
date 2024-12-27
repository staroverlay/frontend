import { Bot, MessageSquare, Save, Shield } from 'lucide-react';
import { useState } from 'react';

export default function BotSettings() {
  const [settings, setSettings] = useState({
    botName: 'StreamBot',
    prefix: '!',
    caseSensitive: false,
    cooldownMessage: true,
    unknownCommandMessage: true,
    moderationLevel: 'medium',
    language: 'en',
    maxMessageLength: 500,
    spamProtection: true,
    linkProtection: true,
    capsProtection: true,
    emoteLimit: 5,
    symbolLimit: 15,
  });

  const handleChange = (key: string, value: any) => {
    setSettings({ ...settings, [key]: value });
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-200 mb-6">Bot Settings</h2>

      <div className="space-y-8">
        <div className="glass rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-purple-500/20 p-2 rounded-lg">
              <Bot className="h-5 w-5 text-purple-400" />
            </div>
            <h3 className="font-medium text-gray-200">General Settings</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Bot Name
              </label>
              <input
                type="text"
                value={settings.botName}
                onChange={(e) => handleChange('botName', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Command Prefix
              </label>
              <input
                type="text"
                value={settings.prefix}
                onChange={(e) => handleChange('prefix', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Language
              </label>
              <select
                value={settings.language}
                onChange={(e) => handleChange('language', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-gray-100"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Max Message Length
              </label>
              <input
                type="number"
                value={settings.maxMessageLength}
                onChange={(e) =>
                  handleChange('maxMessageLength', parseInt(e.target.value))
                }
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-gray-100"
              />
            </div>
          </div>
        </div>

        <div className="glass rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-purple-500/20 p-2 rounded-lg">
              <MessageSquare className="h-5 w-5 text-purple-400" />
            </div>
            <h3 className="font-medium text-gray-200">Message Settings</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-300">
                  Case Sensitive Commands
                </h4>
                <p className="text-sm text-gray-400">
                  Commands will be case sensitive
                </p>
              </div>
              <button
                onClick={() =>
                  handleChange('caseSensitive', !settings.caseSensitive)
                }
                className={`
                  relative inline-flex h-6 w-11 items-center rounded-full
                  ${settings.caseSensitive ? 'bg-purple-500' : 'bg-gray-700'}
                `}
              >
                <span
                  className={`
                    inline-block h-4 w-4 transform rounded-full bg-white transition
                    ${
                      settings.caseSensitive ? 'translate-x-6' : 'translate-x-1'
                    }
                  `}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-300">
                  Cooldown Messages
                </h4>
                <p className="text-sm text-gray-400">
                  Show cooldown notifications
                </p>
              </div>
              <button
                onClick={() =>
                  handleChange('cooldownMessage', !settings.cooldownMessage)
                }
                className={`
                  relative inline-flex h-6 w-11 items-center rounded-full
                  ${settings.cooldownMessage ? 'bg-purple-500' : 'bg-gray-700'}
                `}
              >
                <span
                  className={`
                    inline-block h-4 w-4 transform rounded-full bg-white transition
                    ${
                      settings.cooldownMessage
                        ? 'translate-x-6'
                        : 'translate-x-1'
                    }
                  `}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-300">
                  Unknown Command Response
                </h4>
                <p className="text-sm text-gray-400">
                  Reply when command is not found
                </p>
              </div>
              <button
                onClick={() =>
                  handleChange(
                    'unknownCommandMessage',
                    !settings.unknownCommandMessage,
                  )
                }
                className={`
                  relative inline-flex h-6 w-11 items-center rounded-full
                  ${
                    settings.unknownCommandMessage
                      ? 'bg-purple-500'
                      : 'bg-gray-700'
                  }
                `}
              >
                <span
                  className={`
                    inline-block h-4 w-4 transform rounded-full bg-white transition
                    ${
                      settings.unknownCommandMessage
                        ? 'translate-x-6'
                        : 'translate-x-1'
                    }
                  `}
                />
              </button>
            </div>
          </div>
        </div>

        <div className="glass rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-purple-500/20 p-2 rounded-lg">
              <Shield className="h-5 w-5 text-purple-400" />
            </div>
            <h3 className="font-medium text-gray-200">Protection Settings</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Moderation Level
              </label>
              <select
                value={settings.moderationLevel}
                onChange={(e) =>
                  handleChange('moderationLevel', e.target.value)
                }
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-gray-100"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="strict">Strict</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Emote Limit
              </label>
              <input
                type="number"
                value={settings.emoteLimit}
                onChange={(e) =>
                  handleChange('emoteLimit', parseInt(e.target.value))
                }
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Symbol Limit
              </label>
              <input
                type="number"
                value={settings.symbolLimit}
                onChange={(e) =>
                  handleChange('symbolLimit', parseInt(e.target.value))
                }
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-gray-100"
              />
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-300">
                  Spam Protection
                </h4>
                <p className="text-sm text-gray-400">Prevent message spam</p>
              </div>
              <button
                onClick={() =>
                  handleChange('spamProtection', !settings.spamProtection)
                }
                className={`
                  relative inline-flex h-6 w-11 items-center rounded-full
                  ${settings.spamProtection ? 'bg-purple-500' : 'bg-gray-700'}
                `}
              >
                <span
                  className={`
                    inline-block h-4 w-4 transform rounded-full bg-white transition
                    ${
                      settings.spamProtection
                        ? 'translate-x-6'
                        : 'translate-x-1'
                    }
                  `}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-300">
                  Link Protection
                </h4>
                <p className="text-sm text-gray-400">Control link sharing</p>
              </div>
              <button
                onClick={() =>
                  handleChange('linkProtection', !settings.linkProtection)
                }
                className={`
                  relative inline-flex h-6 w-11 items-center rounded-full
                  ${settings.linkProtection ? 'bg-purple-500' : 'bg-gray-700'}
                `}
              >
                <span
                  className={`
                    inline-block h-4 w-4 transform rounded-full bg-white transition
                    ${
                      settings.linkProtection
                        ? 'translate-x-6'
                        : 'translate-x-1'
                    }
                  `}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-300">
                  Caps Protection
                </h4>
                <p className="text-sm text-gray-400">
                  Limit excessive caps usage
                </p>
              </div>
              <button
                onClick={() =>
                  handleChange('capsProtection', !settings.capsProtection)
                }
                className={`
                  relative inline-flex h-6 w-11 items-center rounded-full
                  ${settings.capsProtection ? 'bg-purple-500' : 'bg-gray-700'}
                `}
              >
                <span
                  className={`
                    inline-block h-4 w-4 transform rounded-full bg-white transition
                    ${
                      settings.capsProtection
                        ? 'translate-x-6'
                        : 'translate-x-1'
                    }
                  `}
                />
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button className="flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg px-4 py-2 font-medium transition-colors">
            <Save className="h-5 w-5" />
            <span>Save Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
}
