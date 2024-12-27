import { Pencil, Plus, Save, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface Command {
  id: string;
  name: string;
  response: string;
  cooldown: number;
  userLevel: 'everyone' | 'subscriber' | 'moderator' | 'broadcaster';
}

export default function BotCustomCommands() {
  const [commands, setCommands] = useState<Command[]>([
    {
      id: '1',
      name: '!discord',
      response: 'Join our Discord community: https://discord.gg/example',
      cooldown: 30,
      userLevel: 'everyone',
    },
  ]);

  const [editing, setEditing] = useState<string | null>(null);
  const [newCommand, setNewCommand] = useState(false);

  const [formData, setFormData] = useState<Command>({
    id: '',
    name: '',
    response: '',
    cooldown: 30,
    userLevel: 'everyone',
  });

  const handleSave = () => {
    if (editing) {
      setCommands(
        commands.map((cmd) =>
          cmd.id === editing ? { ...formData, id: editing } : cmd,
        ),
      );
      setEditing(null);
    } else if (newCommand) {
      setCommands([...commands, { ...formData, id: Date.now().toString() }]);
      setNewCommand(false);
    }
    setFormData({
      id: '',
      name: '',
      response: '',
      cooldown: 30,
      userLevel: 'everyone',
    });
  };

  const handleEdit = (command: Command) => {
    setFormData(command);
    setEditing(command.id);
    setNewCommand(false);
  };

  const handleDelete = (id: string) => {
    setCommands(commands.filter((cmd) => cmd.id !== id));
  };

  const handleNew = () => {
    setNewCommand(true);
    setEditing(null);
    setFormData({
      id: '',
      name: '',
      response: '',
      cooldown: 30,
      userLevel: 'everyone',
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-200">Custom Commands</h2>
        <button
          onClick={handleNew}
          className="flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Command</span>
        </button>
      </div>

      {(editing || newCommand) && (
        <div className="mb-6 bg-white/5 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Command Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-gray-100"
                placeholder="!commandname"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                User Level
              </label>
              <select
                value={formData.userLevel}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    userLevel: e.target.value as Command['userLevel'],
                  })
                }
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-gray-100"
              >
                <option value="everyone">Everyone</option>
                <option value="subscriber">Subscribers</option>
                <option value="moderator">Moderators</option>
                <option value="broadcaster">Broadcaster</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Response
            </label>
            <textarea
              value={formData.response}
              onChange={(e) =>
                setFormData({ ...formData, response: e.target.value })
              }
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-gray-100 h-24"
              placeholder="Enter command response..."
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Cooldown (seconds)
            </label>
            <input
              type="number"
              value={formData.cooldown}
              onChange={(e) =>
                setFormData({ ...formData, cooldown: parseInt(e.target.value) })
              }
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-gray-100"
              min="0"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              onClick={() => {
                setEditing(null);
                setNewCommand(false);
              }}
              className="px-4 py-2 text-sm text-gray-400 hover:text-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>Save Command</span>
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {commands.map((command) => (
          <div
            key={command.id}
            className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
          >
            <div>
              <h3 className="font-medium text-gray-200">{command.name}</h3>
              <p className="text-sm text-gray-400 mt-1">{command.response}</p>
              <div className="flex items-center space-x-4 mt-2">
                <span className="text-xs text-purple-400">
                  {command.userLevel}
                </span>
                <span className="text-xs text-gray-500">
                  {command.cooldown}s cooldown
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleEdit(command)}
                className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-purple-400 transition-colors"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDelete(command.id)}
                className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-red-400 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
