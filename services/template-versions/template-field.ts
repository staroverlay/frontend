export const TemplateFieldTypes = [
  {
    id: 'string',
    label: 'Text (String)',
  },

  {
    id: 'number',
    label: 'Number',
  },

  {
    id: 'boolean',
    label: 'Toggle (Boolean)',
  },

  {
    id: 'map',
    label: 'Dictionary (Map)',
  },

  {
    id: 'array',
    label: 'List (Array)',
  },

  {
    id: 'enum',
    label: 'Select (Enum)',
  },

  {
    id: 'platform:media',
    label: 'Media',
  },

  {
    id: 'platform:media.audio',
    label: 'Media (Only audio)',
  },

  {
    id: 'platform:media.image',
    label: 'Media (Only image)',
  },

  {
    id: 'platform:media.video',
    label: 'Media (Only video)',
  },

  {
    id: 'twitch:reward',
    label: 'Twitch Reward',
  },
];

export type TemplateFieldType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'map'
  | 'array'
  | 'enum'
  | 'platform:media'
  | 'platform:media.audio'
  | 'platform:media.image'
  | 'platform:media.video'
  | 'twitch:reward';

export type FieldStringSettings = {
  minLength?: number;
  maxLength?: number;
  default?: string;
};

export type FieldNumberSettings = {
  min?: number;
  max?: number;
  rangeSteps?: number;
  display?: 'input' | 'range';
  type?: 'float' | 'integer';
  default?: number;
};

export type FieldBooleanSettings = {
  display?: 'checkbox' | 'slider';
  default?: boolean;
};

export type FieldMapSettings = {
  minItems?: number;
  maxItems?: number;
  key: TemplateFieldType;
  value: TemplateFieldType;
};

export type FieldArraySettings = {
  minItems?: number;
  maxItems?: number;
  type: TemplateFieldType;
};

export type FieldEnumSettingsItem = {
  value: string;
  label?: string;
};

export type FieldEnumSettings = {
  options: FieldEnumSettingsItem[];
  display?: 'select' | 'radio';
  default?: string;
};

export interface ITemplateAdvancedField {
  string?: FieldStringSettings;
  number?: FieldNumberSettings;
  boolean?: FieldBooleanSettings;
  map?: FieldMapSettings;
  array?: FieldArraySettings;
  enum?: FieldEnumSettings;
}

export default interface ITemplateField extends ITemplateAdvancedField {
  _internalId: string;
  id: string;
  label?: string;
  description?: string;
  type: TemplateFieldType;
  required?: boolean;
}
