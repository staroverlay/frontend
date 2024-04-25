import Profile from '@/services/profile/profile';

export interface ProfileHook {
  profile: Profile | null;
  setProfile: (profile: Profile) => unknown;
}
