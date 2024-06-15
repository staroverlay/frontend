import Topic from "@/lib/Topics";

export type SettingsScope =
  | 'twitch:ban'
  | 'twitch:channel_update'
  | 'twitch:charity'
  | 'twitch:cheer'
  | 'twitch:follow'
  | 'twitch:goal'
  | 'twitch:hype_train'
  | 'twitch:mod'
  | 'twitch:poll'
  | 'twitch:prediction'
  | 'twitch:raid'
  | 'twitch:channel_points'
  | 'twitch:shield'
  | 'twitch:shoutout'
  | 'twitch:subscription';

export type SettingsScopeData = {
  id: SettingsScope;
  name: string;
  debuggable?: boolean;
  topic?: Topic[];
};

// TODO: Implement missing topics.
export const SettingsScopes: SettingsScopeData[] = [
  { id: 'twitch:ban', name: 'Ban', debuggable: true, topic: ["twitch:ban", "twitch:unban"]},
  { id: 'twitch:channel_update', name: 'Channel Update', debuggable: true },
  { id: 'twitch:charity', name: 'Charity', debuggable: true },
  { id: 'twitch:cheer', name: 'Cheer', debuggable: true },
  { id: 'twitch:follow', name: 'Follow', debuggable: true },
  { id: 'twitch:goal', name: 'Goal', debuggable: true },
  { id: 'twitch:hype_train', name: 'Hype Train', debuggable: true },
  { id: 'twitch:mod', name: 'Mod', debuggable: true },
  { id: 'twitch:poll', name: 'Poll', debuggable: true },
  { id: 'twitch:prediction', name: 'Prediction', debuggable: true },
  { id: 'twitch:raid', name: 'Raid', debuggable: true, topic: ["twitch:raid", "twitch:raid_to"]},
  { id: 'twitch:channel_points', name: 'Channel Points', debuggable: true, topic: ["twitch:redemption"]},
  { id: 'twitch:shield', name: 'Shield', debuggable: true },
  { id: 'twitch:shoutout', name: 'Shoutout', debuggable: true },
  { id: 'twitch:subscription', name: 'Subscription', debuggable: true },
];

export default SettingsScope;
