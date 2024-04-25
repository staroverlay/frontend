export type SettingsScope =
  | 'platform:storage'
  | 'twitch:ban'
  | 'twitch:chat'
  | 'twitch:unban'
  | 'twitch:charity'
  | 'twitch:cheer'
  | 'twitch:follow'
  | 'twitch:goal'
  | 'twitch:hype_train'
  | 'twitch:moderator'
  | 'twitch:poll'
  | 'twitch:prediction'
  | 'twitch:raid'
  | 'twitch:raid_to'
  | 'twitch:redemption'
  | 'twitch:reward'
  | 'twitch:shield_mode'
  | 'twitch:shoutout'
  | 'twitch:shoutout_receive'
  | 'twitch:subscription'
  | 'twitch:update'
  | 'twitch:stream-up'
  | 'twitch:stream-off';

export type SettingsScopeData = {
  id: SettingsScope;
  name: string;
  debuggable?: boolean;
};

export const SettingsScopes: SettingsScopeData[] = [
  {
    id: 'platform:storage',
    name: 'Extension Storage',
  },

  {
    id: 'twitch:ban',
    name: 'Ban',
    debuggable: true,
  },

  {
    id: 'twitch:chat',
    name: 'Chat',
    debuggable: true,
  },

  {
    id: 'twitch:unban',
    name: 'Unban',
    debuggable: true,
  },

  {
    id: 'twitch:charity',
    name: 'Charity',
    debuggable: true,
  },

  {
    id: 'twitch:cheer',
    name: 'Cheer',
    debuggable: true,
  },

  {
    id: 'twitch:follow',
    name: 'Follow',
    debuggable: true,
  },

  {
    id: 'twitch:goal',
    name: 'Goal',
    debuggable: true,
  },

  {
    id: 'twitch:hype_train',
    name: 'Hype Train',
    debuggable: true,
  },

  {
    id: 'twitch:moderator',
    name: 'Moderator',
    debuggable: true,
  },

  {
    id: 'twitch:poll',
    name: 'Poll',
    debuggable: true,
  },

  {
    id: 'twitch:prediction',
    name: 'Prediction',
    debuggable: true,
  },

  {
    id: 'twitch:raid',
    name: 'Raid',
    debuggable: true,
  },

  {
    id: 'twitch:raid_to',
    name: 'Raid To',
    debuggable: true,
  },

  {
    id: 'twitch:redemption',
    name: 'Redemption',
    debuggable: true,
  },

  {
    id: 'twitch:reward',
    name: 'Reward',
    debuggable: true,
  },

  {
    id: 'twitch:shield_mode',
    name: 'Shield Mode',
    debuggable: true,
  },

  {
    id: 'twitch:shoutout',
    name: 'Shoutout',
    debuggable: true,
  },

  {
    id: 'twitch:shoutout_receive',
    name: 'Shoutout Receive',
    debuggable: true,
  },

  {
    id: 'twitch:subscription',
    name: 'Subscription',
    debuggable: true,
  },

  {
    id: 'twitch:update',
    name: 'Update',
    debuggable: true,
  },

  {
    id: 'twitch:stream-up',
    name: 'Stream Up',
    debuggable: true,
  },

  {
    id: 'twitch:stream-off',
    name: 'Stream Off',
    debuggable: true,
  },
];

export default SettingsScope;
