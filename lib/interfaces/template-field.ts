export type TemplateFieldType =
  | "string"
  | "number"
  | "boolean"
  | "map"
  | "array"
  | "enum"
  | "platform:media"
  | "platform:media.audio"
  | "platform:media.image"
  | "platform:media.video"
  | "twitch:reward";

export type FieldStringSettings = {
  minLength?: number;
  maxLength?: number;
  validate?: "email" | "number" | "non-spaces";
};

export type FieldNumberSettings = {
  min?: number;
  max?: number;
  rangeSteps?: number;
  display?: "input" | "range";
  type?: "float" | "integer";
};

export type FieldBooleanSettings = {
  display?: "checkbox" | "slider";
};

export type FieldMapSettings = {
  minItems?: number;
  maxItems?: number;
  key: TemplateFieldType;
  value: TemplateFieldType;
  display?: "list" | "table";
};

export type FieldArraySettings = {
  minItems?: number;
  maxItems?: number;
  display?: "list" | "table";
  type: TemplateFieldType;
};

export type FieldEnumSettingsItem = {
  value: string;
  label?: string;
};

export type FieldEnumSettings = {
  options: FieldEnumSettingsItem[];
  display?: "select" | "radio";
};

export default interface ITemplateField {
  id: string;
  label?: string;
  description?: string;
  category?: string;
  type: TemplateFieldType;
  required?: boolean;
  default?: object;
  string?: FieldStringSettings;
  number?: FieldNumberSettings;
  boolean?: FieldBooleanSettings;
  map?: FieldMapSettings;
  array?: FieldArraySettings;
  enum?: FieldEnumSettings;
}