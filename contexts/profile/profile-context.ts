import React from 'react';

import { ProfileHook } from './profile-hook';

export const ProfileContext = React.createContext<ProfileHook>({
  profile: null,
  setProfile: () => {
    throw new Error('ProfileContext not implemented');
  },
});
