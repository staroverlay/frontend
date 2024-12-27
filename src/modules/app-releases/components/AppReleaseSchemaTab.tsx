import { Plus, X } from 'lucide-react';
import { useState } from 'react';

import { Switch } from '@/shared/components/Switch';

type FieldType = 'string' | 'number' | 'boolean' | 'array' | 'map' | 'enum';

interface Field {
  id: string;
  name: string;
  type: FieldType;
  description: string;
  required: boolean;
  category: string;
  config: {
    // String
    minLength?: number;
    maxLength?: number;
    // Number
    min?: number;
    max?: number;
    step?: number;
    isSlider?: boolean;
    // Boolean
    isSwitch?: boolean;
    // Array/Map
    itemType?: FieldType;
    // Enum
    options?: string[];
    // Default value
    default?: any;
  };
}

interface Category {
  id: string;
  title: string;
  description: string;
}

interface AppReleaseSchemaTabProps {
  onChange: () => void;
}

export default function AppReleaseSchemaTab({
  onChange,
}: AppReleaseSchemaTabProps) {
  const [categories, setCategories] = useState<Category[]>([
    { id: 'general', title: 'General', description: 'Basic settings' },
  ]);
  const [fields, setFields] = useState<Field[]>([]);
  const [activeCategory, setActiveCategory] = useState('general');
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({
    title: '',
    description: '',
  });

  const handleAddField = () => {
    const newField: Field = {
      id: `field-${Date.now()}`,
      name: 'New Field',
      type: 'string',
      description: '',
      required: false,
      category: activeCategory,
      config: {},
    };
    setFields([...fields, newField]);
    onChange();
  };

  const handleUpdateField = (id: string, updates: Partial<Field>) => {
    setFields(
      fields.map((field) =>
        field.id === id ? { ...field, ...updates } : field,
      ),
    );
    onChange();
  };

  const handleRemoveField = (id: string) => {
    setFields(fields.filter((field) => field.id !== id));
    onChange();
  };

  const handleAddCategory = () => {
    if (newCategory.title) {
      const id = newCategory.title.toLowerCase().replace(/\s+/g, '-');
      setCategories([...categories, { ...newCategory, id }]);
      setNewCategory({ title: '', description: '' });
      setShowNewCategory(false);
      setActiveCategory(id);
      onChange();
    }
  };

  const renderFieldConfig = (field: Field) => {
    switch (field.type) {
      case 'string':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400">Min Length</label>
              <input
                type="number"
                value={field.config.minLength || ''}
                onChange={(e) =>
                  handleUpdateField(field.id, {
                    config: {
                      ...field.config,
                      minLength: parseInt(e.target.value),
                    },
                  })
                }
                className="w-full bg-white/5 border border-white/10 rounded-lg py-1 px-3 text-sm"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400">Max Length</label>
              <input
                type="number"
                value={field.config.maxLength || ''}
                onChange={(e) =>
                  handleUpdateField(field.id, {
                    config: {
                      ...field.config,
                      maxLength: parseInt(e.target.value),
                    },
                  })
                }
                className="w-full bg-white/5 border border-white/10 rounded-lg py-1 px-3 text-sm"
              />
            </div>
          </div>
        );

      case 'number':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-gray-400">Min</label>
                <input
                  type="number"
                  value={field.config.min || ''}
                  onChange={(e) =>
                    handleUpdateField(field.id, {
                      config: {
                        ...field.config,
                        min: parseInt(e.target.value),
                      },
                    })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-1 px-3 text-sm"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400">Max</label>
                <input
                  type="number"
                  value={field.config.max || ''}
                  onChange={(e) =>
                    handleUpdateField(field.id, {
                      config: {
                        ...field.config,
                        max: parseInt(e.target.value),
                      },
                    })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-1 px-3 text-sm"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400">Step</label>
                <input
                  type="number"
                  value={field.config.step || ''}
                  onChange={(e) =>
                    handleUpdateField(field.id, {
                      config: {
                        ...field.config,
                        step: parseInt(e.target.value),
                      },
                    })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-1 px-3 text-sm"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={field.config.isSlider || false}
                onChange={(checked) =>
                  handleUpdateField(field.id, {
                    config: { ...field.config, isSlider: checked },
                  })
                }
              />
              <span className="text-sm text-gray-400">Render as slider</span>
            </div>
          </div>
        );

      case 'boolean':
        return (
          <div className="flex items-center space-x-2">
            <Switch
              checked={field.config.isSwitch || false}
              onChange={(checked) =>
                handleUpdateField(field.id, {
                  config: { ...field.config, isSwitch: checked },
                })
              }
            />
            <span className="text-sm text-gray-400">
              Render as switch (instead of checkbox)
            </span>
          </div>
        );

      case 'enum':
        return (
          <div>
            <label className="text-sm text-gray-400">
              Options (one per line)
            </label>
            <textarea
              value={field.config.options?.join('\n') || ''}
              onChange={(e) =>
                handleUpdateField(field.id, {
                  config: {
                    ...field.config,
                    options: e.target.value.split('\n').filter(Boolean),
                  },
                })
              }
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-sm h-24"
            />
          </div>
        );

      case 'array':
      case 'map':
        return (
          <div>
            <label className="text-sm text-gray-400">Item Type</label>
            <select
              value={field.config.itemType || 'string'}
              onChange={(e) =>
                handleUpdateField(field.id, {
                  config: {
                    ...field.config,
                    itemType: e.target.value as FieldType,
                  },
                })
              }
              className="w-full bg-white/5 border border-white/10 rounded-lg py-1 px-3 text-sm"
            >
              <option value="string">String</option>
              <option value="number">Number</option>
              <option value="boolean">Boolean</option>
            </select>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Categories */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-200">Categories</h2>
          <button
            onClick={() => setShowNewCategory(true)}
            className="flex items-center space-x-2 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Category</span>
          </button>
        </div>

        <div className="flex space-x-2 mb-6">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${
                  activeCategory === category.id
                    ? 'bg-purple-500 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }
              `}
            >
              {category.title}
            </button>
          ))}
        </div>

        {showNewCategory && (
          <div className="mb-6 p-4 bg-white/5 rounded-lg space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category Title
              </label>
              <input
                type="text"
                value={newCategory.title}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, title: e.target.value })
                }
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-4 text-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <input
                type="text"
                value={newCategory.description}
                onChange={(e) =>
                  setNewCategory({
                    ...newCategory,
                    description: e.target.value,
                  })
                }
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-4 text-gray-100"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowNewCategory(false)}
                className="px-4 py-2 text-sm text-gray-400 hover:text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCategory}
                className="bg-purple-500 hover:bg-purple-600 text-white rounded-lg px-4 py-2 text-sm font-medium"
              >
                Add Category
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Fields */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-200">Fields</h2>
          <button
            onClick={handleAddField}
            className="flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Field</span>
          </button>
        </div>

        <div className="space-y-4">
          {fields
            .filter((field) => field.category === activeCategory)
            .map((field) => (
              <div
                key={field.id}
                className="bg-white/5 rounded-lg p-4 space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Field Name
                      </label>
                      <input
                        type="text"
                        value={field.name}
                        onChange={(e) =>
                          handleUpdateField(field.id, { name: e.target.value })
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-4 text-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Field Type
                      </label>
                      <select
                        value={field.type}
                        onChange={(e) =>
                          handleUpdateField(field.id, {
                            type: e.target.value as FieldType,
                            config: {}, // Reset config when type changes
                          })
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-4 text-gray-100"
                      >
                        <option value="string">String</option>
                        <option value="number">Number</option>
                        <option value="boolean">Boolean</option>
                        <option value="array">Array</option>
                        <option value="map">Map</option>
                        <option value="enum">Enum</option>
                      </select>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveField(field.id)}
                    className="ml-4 p-2 hover:bg-white/10 rounded-lg text-red-400"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <input
                    type="text"
                    value={field.description}
                    onChange={(e) =>
                      handleUpdateField(field.id, {
                        description: e.target.value,
                      })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-4 text-gray-100"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={field.required}
                        onChange={(checked) =>
                          handleUpdateField(field.id, { required: checked })
                        }
                      />
                      <span className="text-sm text-gray-400">Required</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Default Value
                  </label>
                  <input
                    type="text"
                    value={field.config.default || ''}
                    onChange={(e) =>
                      handleUpdateField(field.id, {
                        config: { ...field.config, default: e.target.value },
                      })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-4 text-gray-100"
                  />
                </div>

                <div className="pt-4 border-t border-white/10">
                  {renderFieldConfig(field)}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
