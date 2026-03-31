export interface User {
  id: string;
  email: string;
  emailVerified: boolean;
  createdAt: string;
}

export interface Session {
  id: string;
  userId: string;
  ipAddress: string | null;
  userAgent: string | null;
  loginMethod: 'email' | 'oauth_twitch' | 'oauth_kick' | 'oauth_youtube';
  expiresAt: string;
  revokedAt: string | null;
  createdAt: string;
  updatedAt: string;
  current?: boolean;
}

export type Profile = {
  id: string;
  userId: string;
  displayName: string;
  createdAt: string;
  updatedAt: string;
};

export type Integration = {
  id: string;
  userId: string;
  provider: 'twitch' | 'kick' | 'youtube';
  displayName: string | null;
  providerUsername: string;
  providerUserId: string;
  providerAvatarUrl: string | null;
  tokenExpiresAt: string | null;
  allowOauthLogin: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AuthResponse = {
  success: boolean;
  accessToken: string;
  refreshToken: string;
  user: User;
};

export type BasicResponse = {
  success: boolean;
  message: string;
};

export type OAuthInitiateResponse = {
  url: string;
  state: string;
};

export type Widget = {
  id: string;
  app_id: string;
  display_name: string;
  settings: Record<string, unknown>;
  integrations: string[];
  enabled: boolean;
  token: string;
  created_at: string;
  updated_at: string;
};

export type AppSettingType =
  | 'text'
  | 'number'
  | 'boolean'
  | 'select'
  | 'color'
  | 'object'
  | 'map'
  | 'list'
  | 'media:image'
  | 'media:video'
  | 'media:audio'
  | 'channel-reward'
  | 'group';

export type AppSettingField = {
  id: string;
  type: AppSettingType;
  label?: string;
  description?: string;
  default?: unknown;
  render_as?: 'checkbox' | 'switch' | 'slider' | 'select' | 'picker' | string;

  // For number
  num_type?: 'integer' | 'float';
  num_min?: number;
  num_max?: number;
  slider_step?: number;

  // For select
  options?: Array<{ value: string; label?: string }>;

  // For object/group
  fields?: AppSettingField[];
  children?: AppSettingField[]; // group can have children too.

  // For list
  item_type?: AppSettingType;
  item_schema?: AppSettingField;

  // For map
  key_label?: string;
  value_label?: string;
  value_schema?: AppSettingField;

  // For validation?
  min?: number;
  max?: number;
};

export type AppJson = {
  name: string;
  version: string;
  description?: string;
  settings?: AppSettingField[];
  properties?: {
    integrations?: Array<{
      provider: string;
      allow_multiple?: boolean;
      is_required?: boolean;
    }>;
  };
};
