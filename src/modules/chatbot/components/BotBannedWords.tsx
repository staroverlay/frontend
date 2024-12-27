import { AlertTriangle, Plus, Save, X } from 'lucide-react';
import { useState } from 'react';

interface WordList {
  id: string;
  name: string;
  words: string[];
  action: 'delete' | 'timeout' | 'ban';
  timeoutDuration?: number;
}

export default function BotBannedWords() {
  const [lists, setLists] = useState<WordList[]>([
    {
      id: '1',
      name: 'Offensive Language',
      words: ['badword1', 'badword2'],
      action: 'delete',
    },
    {
      id: '2',
      name: 'Spam Protection',
      words: ['spam1', 'spam2'],
      action: 'timeout',
      timeoutDuration: 300,
    },
  ]);

  const [editing, setEditing] = useState<string | null>(null);
  const [newList, setNewList] = useState(false);
  const [formData, setFormData] = useState<WordList>({
    id: '',
    name: '',
    words: [],
    action: 'delete',
  });

  const handleSave = () => {
    if (editing) {
      setLists(
        lists.map((list) =>
          list.id === editing ? { ...formData, id: editing } : list,
        ),
      );
      setEditing(null);
    } else if (newList) {
      setLists([...lists, { ...formData, id: Date.now().toString() }]);
      setNewList(false);
    }
    setFormData({ id: '', name: '', words: [], action: 'delete' });
  };

  const handleDelete = (id: string) => {
    setLists(lists.filter((list) => list.id !== id));
  };

  const handleAddWord = (word: string) => {
    if (word && !formData.words.includes(word)) {
      setFormData({ ...formData, words: [...formData.words, word] });
    }
  };

  const handleRemoveWord = (word: string) => {
    setFormData({
      ...formData,
      words: formData.words.filter((w) => w !== word),
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-200">Banned Words</h2>
        <button
          onClick={() => {
            setNewList(true);
            setEditing(null);
            setFormData({ id: '', name: '', words: [], action: 'delete' });
          }}
          className="flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add List</span>
        </button>
      </div>

      {(editing || newList) && (
        <div className="mb-6 bg-white/5 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                List Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-gray-100"
                placeholder="Enter list name..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Action
              </label>
              <select
                value={formData.action}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    action: e.target.value as WordList['action'],
                  })
                }
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-gray-100"
              >
                <option value="delete">Delete Message</option>
                <option value="timeout">Timeout User</option>
                <option value="ban">Ban User</option>
              </select>
            </div>
          </div>

          {formData.action === 'timeout' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Timeout Duration (seconds)
              </label>
              <input
                type="number"
                value={formData.timeoutDuration || 300}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    timeoutDuration: parseInt(e.target.value),
                  })
                }
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-gray-100"
                min="1"
              />
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Add Words
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Enter word and press Enter"
                className="flex-1 bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-gray-100"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddWord(e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {formData.words.map((word) => (
              <span
                key={word}
                className="inline-flex items-center bg-purple-500/20 text-purple-300 rounded-full px-3 py-1 text-sm"
              >
                {word}
                <button
                  onClick={() => handleRemoveWord(word)}
                  className="ml-2 text-purple-400 hover:text-purple-300"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex justify-end space-x-2">
            <button
              onClick={() => {
                setEditing(null);
                setNewList(false);
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
              <span>Save List</span>
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {lists.map((list) => (
          <div key={list.id} className="p-4 bg-white/5 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="bg-red-500/20 p-2 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-200">{list.name}</h3>
                  <p className="text-sm text-gray-400">
                    Action:{' '}
                    {list.action.charAt(0).toUpperCase() + list.action.slice(1)}
                    {list.action === 'timeout' && ` (${list.timeoutDuration}s)`}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setFormData(list);
                    setEditing(list.id);
                    setNewList(false);
                  }}
                  className="text-sm text-purple-400 hover:text-purple-300"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(list.id)}
                  className="text-sm text-red-400 hover:text-red-300"
                >
                  Delete
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {list.words.map((word) => (
                <span
                  key={word}
                  className="bg-white/5 text-gray-300 rounded-full px-3 py-1 text-sm"
                >
                  {word}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
