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
