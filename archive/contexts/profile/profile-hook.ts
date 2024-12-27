import { Profile } from '@staroverlay/sdk';

export interface ProfileHook {
  profile: Profile | null;
  setProfile: (profile: Profile) => unknown;
}
